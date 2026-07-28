from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, Form, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from ...db.database import get_db
from ...api.dependencies.auth import get_current_user
from ...services.b2_storage import b2_storage
from ...services.vision_service import vision_service
from ...models.patient import Patient
from ...models.image import Image
from ...tools.xray_tools import (
    analyze_medical_image,
    save_image_analysis,
    update_image_analysis,
    get_patient_images,
    get_images_by_type,
    get_image_by_id,
    delete_image,
    get_image_types,
    get_image_type_display_names
)
import io
import json
import base64

router = APIRouter()

# ========== IMAGE UPLOAD ==========

@router.post("/upload/{patient_id}")
async def upload_image(
    patient_id: str,
    file: UploadFile = File(...),
    analyze: bool = Form(False),
    image_type: str = Form("chest_xray"),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload medical image - saves to B2, images table, and analysis_history"""
    
    print(f"🔵 Upload started for patient: {patient_id}")
    
    # Validate image type
    valid_types = get_image_types()
    if image_type not in valid_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid image type. Must be one of: {', '.join(valid_types)}"
        )
    
    allowed_types = ["image/jpeg", "image/png", "image/jpg"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail=f"File type {file.content_type} not allowed")
    
    # Get patient
    patient = db.query(Patient).filter(Patient.id == UUID(patient_id)).first()
    if not patient:
        print(f"❌ Patient not found: {patient_id}")
        raise HTTPException(status_code=404, detail="Patient not found")
    
    print(f"✅ Patient found: {patient.name}")
    
    file_data = await file.read()
    print(f"📁 File read: {file.filename} ({len(file_data)} bytes)")
    
    # 1. Upload to B2
    result = b2_storage.upload_image(
        file_data=file_data,
        file_name=file.filename,
        patient_id=patient_id,
        content_type=file.content_type
    )
    
    if not result["success"]:
        print(f"❌ B2 upload failed: {result['error']}")
        raise HTTPException(status_code=500, detail=result["error"])
    
    print(f"✅ B2 upload successful: {result['file_key']}")
    print(f"✅ Signed URL generated")
    
    # 2. Save to images table
    try:
        print("💾 Saving to images table...")
        new_image = Image(
            patient_id=patient_id,
            image_type=image_type,
            filename=file.filename,
            image_data="",
            analysis="Awaiting AI analysis...",
            confidence=0.0,
            uploaded_at=datetime.now()
        )
        db.add(new_image)
        db.flush()
        print(f"✅ Image saved to images table with ID: {new_image.id}")
    except Exception as e:
        print(f"❌ Failed to save to images table: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to save image: {str(e)}")
    
    # 3. Save to analysis_history with signed_url
    try:
        print("💾 Saving to analysis_history...")
        analysis_entry = {
            "id": str(new_image.id),
            "image_type": image_type,
            "image_url": result["public_url"],
            "signed_url": result["signed_url"],  # ← SAVING SIGNED URL
            "b2_key": result["file_key"],
            "findings": "Awaiting AI analysis...",
            "confidence": 0.0,
            "analyzed_at": datetime.now().isoformat(),
            "file_name": file.filename,
            "image_id": str(new_image.id)
        }
        
        current_history = patient.analysis_history or []
        current_history.append(analysis_entry)
        patient.analysis_history = current_history
        print(f"✅ Analysis history updated with signed_url")
    except Exception as e:
        print(f"❌ Failed to save to analysis_history: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to save analysis history: {str(e)}")
    
    # 4. Commit everything
    try:
        db.commit()
        print(f"✅ Database commit successful")
    except Exception as e:
        print(f"❌ Database commit failed: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database commit failed: {str(e)}")
    
    db.refresh(new_image)
    
    return {
        "message": "Image uploaded successfully",
        "file_key": result["file_key"],
        "public_url": result["public_url"],
        "signed_url": result["signed_url"],
        "patient_id": patient_id,
        "image_type": image_type,
        "image_id": str(new_image.id),
        "image_data": {
            "id": str(new_image.id),
            "image_type": image_type,
            "filename": file.filename
        }
    }

# ========== GET IMAGES ==========

@router.get("/analysis/{patient_id}")
async def get_patient_analysis(
    patient_id: str,
    image_type: Optional[str] = Query(None, description="Filter by image type"),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all image analysis results for a patient"""
    
    patient = db.query(Patient).filter(Patient.id == UUID(patient_id)).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Get from new Image model
    images = get_patient_images(patient_id, image_type, db)
    
    # Also get from analysis_history (backward compatibility)
    history_analyses = patient.analysis_history or []
    
    # Combine and deduplicate (prefer new Image model)
    image_ids = {img.get("id") for img in images}
    combined = list(images)
    
    for hist in history_analyses:
        if hist.get("image_id") not in image_ids and hist.get("id") not in image_ids:
            combined.append(hist)
    
    return {
        "patient_id": patient_id,
        "patient_name": patient.name,
        "analyses": combined,
        "count": len(combined),
        "image_types": get_image_type_display_names()
    }

@router.get("/search")
async def search_images_by_type_endpoint(
    image_type: str = Query(..., description="Image type to search for"),
    patient_name: Optional[str] = Query(None, description="Filter by patient name"),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Search images by type (X-Ray, CT, MRI, ECG, Retinal)"""
    
    # Validate image type
    valid_types = get_image_types()
    if image_type not in valid_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid image type. Must be one of: {', '.join(valid_types)}"
        )
    
    images = get_images_by_type(image_type, db, patient_name)
    
    display_name = get_image_type_display_names().get(image_type, image_type)
    
    return {
        "success": True,
        "image_type": image_type,
        "display_name": display_name,
        "count": len(images),
        "images": images
    }

@router.get("/patient/{patient_id}/types")
async def get_patient_image_types(
    patient_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all image types for a patient with counts"""
    
    patient = db.query(Patient).filter(Patient.id == UUID(patient_id)).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Get from new Image model
    images = db.query(Image).filter(Image.patient_id == patient_id).all()
    
    # Count by type
    type_counts = {}
    for img in images:
        display_name = get_image_type_display_names().get(img.image_type, img.image_type)
        if display_name not in type_counts:
            type_counts[display_name] = 0
        type_counts[display_name] += 1
    
    # Also check analysis_history
    history_types = {}
    for hist in (patient.analysis_history or []):
        img_type = hist.get("image_type", "unknown")
        display_name = get_image_type_display_names().get(img_type, img_type)
        if display_name not in history_types:
            history_types[display_name] = 0
        history_types[display_name] += 1
    
    # Combine counts
    combined_types = {}
    for key in set(type_counts.keys()) | set(history_types.keys()):
        combined_types[key] = type_counts.get(key, 0) + history_types.get(key, 0)
    
    return {
        "success": True,
        "patient_id": patient_id,
        "patient_name": patient.name,
        "types": combined_types,
        "total": sum(combined_types.values()),
        "image_types": get_image_type_display_names()
    }

# ========== GET IMAGE BY ID ==========

@router.get("/{image_id}")
async def get_image_by_id_endpoint(
    image_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get image by ID"""
    try:
        image = get_image_by_id(image_id, db)
        if not image:
            raise HTTPException(status_code=404, detail="Image not found")
        return {"success": True, "image": image}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ========== DELETE IMAGE ==========

@router.delete("/{image_id}")
async def delete_image_endpoint(
    image_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete an image"""
    
    result = delete_image(image_id, db)
    
    if not result.get("success"):
        raise HTTPException(status_code=404, detail=result.get("error", "Image not found"))
    
    return result

# ========== ANALYZE WITHOUT STORING ==========

@router.post("/analyze")
async def analyze_uploaded_image(
    file: UploadFile = File(...),
    image_type: str = Form("chest_xray"),
    current_user: dict = Depends(get_current_user)
):
    """Analyze an image without storing (temporary)"""
    
    # Validate image type
    valid_types = get_image_types()
    if image_type not in valid_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid image type. Must be one of: {', '.join(valid_types)}"
        )
    
    file_data = await file.read()
    image_base64 = base64.b64encode(file_data).decode('utf-8')
    
    result = analyze_medical_image(image_base64, image_type)
    
    if result.get("success"):
        display_name = get_image_type_display_names().get(image_type, image_type)
        return {
            "success": True,
            "image_type": image_type,
            "display_name": display_name,
            "analysis": result,
            "summary": f"🔍 {display_name} Analysis: {result['findings']}\n\n📊 Confidence: {result['confidence']*100:.1f}%\n\n💡 Recommendation: {result['recommendation']}"
        }
    else:
        raise HTTPException(status_code=500, detail=result.get("error", "Analysis failed"))

# ========== ANALYZE EXISTING IMAGE ==========

@router.post("/analyze-json")
async def analyze_image_json(
    request: dict,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Analyze an existing image from database by UUID"""
    try:
        study_id = request.get("study_id")
        image_type = request.get("image_type", "chest_xray")
        
        if not study_id:
            raise HTTPException(status_code=400, detail="study_id required")
        
        # Validate image type
        valid_types = get_image_types()
        if image_type not in valid_types:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid image type. Must be one of: {', '.join(valid_types)}"
            )
        
        # Get the image from database using UUID
        image = db.query(Image).filter(Image.id == UUID(study_id)).first()
        if not image:
            raise HTTPException(status_code=404, detail="Image not found")
        
        # Get image data from multiple sources
        image_base64 = None
        b2_key = None
        
        # 1. Try to get from image.image_data
        if image.image_data:
            image_base64 = image.image_data
            print(f"📸 Found image data in images table")
        
        # 2. Try to get b2_key from analysis_history
        if not image_base64:
            patient = db.query(Patient).filter(Patient.id == image.patient_id).first()
            if patient and patient.analysis_history:
                for entry in patient.analysis_history:
                    if entry.get("image_id") == str(image.id):
                        b2_key = entry.get("b2_key")
                        if b2_key:
                            print(f"📸 Found b2_key in analysis_history: {b2_key}")
                            break
        
        # 3. If b2_key found, get from B2
        if b2_key and not image_base64:
            try:
                image_data = b2_storage.get_image(b2_key)
                image_base64 = base64.b64encode(image_data).decode('utf-8')
                print(f"📸 Retrieved image from B2 storage")
            except Exception as e:
                print(f"⚠️ Failed to get image from B2: {e}")
        
        if not image_base64:
            raise HTTPException(status_code=404, detail="No image data found")
        
        # Analyze using Gemini
        result = analyze_medical_image(image_base64, image_type)
        
        if result.get("success"):
            # Update the image record
            image.analysis = result.get("findings", "")
            image.confidence = result.get("confidence", 0.0)
            db.commit()
            
            # Also update analysis_history
            patient = db.query(Patient).filter(Patient.id == image.patient_id).first()
            if patient and patient.analysis_history:
                for entry in patient.analysis_history:
                    if entry.get("image_id") == str(image.id):
                        entry["findings"] = result.get("findings", "")
                        entry["confidence"] = result.get("confidence", 0.0)
                        entry["impression"] = result.get("impression", "")
                        entry["recommendation"] = result.get("recommendation", "")
                        db.commit()
                        break
            
            return {
                "success": True,
                "findings": result.get("findings", ""),
                "impression": result.get("impression", ""),
                "recommendation": result.get("recommendation", ""),
                "confidence": result.get("confidence", 0),
                "urgency": result.get("urgency", "Low"),
                "image_id": str(image.id)
            }
        else:
            raise HTTPException(status_code=500, detail=result.get("error", "Analysis failed"))
            
    except Exception as e:
        print(f"❌ Analyze error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ========== SAVE REPORT ==========

@router.post("/save-report")
async def save_imaging_report(
    request: dict,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Save the imaging report with doctor's notes and final analysis"""
    try:
        image_id = request.get("studyId") or request.get("image_id")
        findings = request.get("findings", "")
        impression = request.get("impression", "")
        doctor_notes = request.get("doctorNotes", "")
        
        if not image_id:
            raise HTTPException(status_code=400, detail="image_id required")
        
        # Update the image record
        image = db.query(Image).filter(Image.id == UUID(image_id)).first()
        if not image:
            raise HTTPException(status_code=404, detail="Image not found")
        
        # Combine all analysis data
        full_analysis = f"FINDINGS:\n{findings}\n\nIMPRESSION:\n{impression}\n\nDOCTOR NOTES:\n{doctor_notes}"
        image.analysis = full_analysis
        db.commit()
        
        # Also update analysis_history
        patient = db.query(Patient).filter(Patient.id == image.patient_id).first()
        if patient and patient.analysis_history:
            for entry in patient.analysis_history:
                if entry.get("image_id") == str(image.id):
                    entry["findings"] = findings
                    entry["impression"] = impression
                    entry["doctor_notes"] = doctor_notes
                    db.commit()
                    break
        
        return {
            "success": True,
            "message": "Report saved successfully",
            "image_id": str(image.id)
        }
            
    except Exception as e:
        print(f"❌ Save report error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ========== GET SIGNED URLS FOR PATIENT IMAGES ==========

@router.get("/signed/{patient_id}")
async def get_patient_images_signed(
    patient_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get signed URLs for all images of a patient.
    Requires authentication. Signed URLs expire in 1 hour.
    """
    try:
        # Verify patient exists
        patient = db.query(Patient).filter(Patient.id == UUID(patient_id)).first()
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")
        
        # Get images from database
        images = db.query(Image).filter(Image.patient_id == patient_id).all()
        
        if not images:
            return {
                "success": True,
                "patient_id": patient_id,
                "patient_name": patient.name,
                "images": [],
                "count": 0
            }
        
        # Generate signed URLs for each image
        image_data = []
        for img in images:
            # Try to get b2_key and signed_url from analysis_history
            b2_key = None
            signed_url = None
            
            if patient.analysis_history:
                for entry in patient.analysis_history:
                    if entry.get("image_id") == str(img.id):
                        b2_key = entry.get("b2_key")
                        signed_url = entry.get("signed_url")
                        break
            
            # If no signed_url but b2_key exists, generate one now
            if b2_key and not signed_url:
                try:
                    signed_url = b2_storage.get_signed_url(b2_key, expires_in=3600)
                    print(f"✅ Generated signed URL for {b2_key}")
                    # Update the analysis_history with the new signed_url
                    if patient.analysis_history:
                        for entry in patient.analysis_history:
                            if entry.get("image_id") == str(img.id):
                                entry["signed_url"] = signed_url
                                db.commit()
                                break
                except Exception as e:
                    print(f"⚠️ Failed to generate signed URL: {e}")
            
            image_data.append({
                "id": str(img.id),
                "image_type": img.image_type,
                "filename": img.filename,
                "signed_url": signed_url,
                "analysis": img.analysis,
                "confidence": img.confidence,
                "uploaded_at": img.uploaded_at.isoformat() if img.uploaded_at else None
            })
        
        return {
            "success": True,
            "patient_id": patient_id,
            "patient_name": patient.name,
            "images": image_data,
            "count": len(image_data)
        }
        
    except Exception as e:
        print(f"❌ Error in signed endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ========== LIST FILES FROM B2 ==========

@router.get("/list/{patient_id}")
async def list_images_b2(
    patient_id: str,
    current_user: dict = Depends(get_current_user)
):
    """List images from B2 storage (without analysis)"""
    
    images = b2_storage.list_patient_images(patient_id)
    return {"images": images, "count": len(images)}

# ========== VIEW IMAGE ==========

@router.get("/view/{file_key:path}")
async def view_image(
    file_key: str,
    current_user: dict = Depends(get_current_user)
):
    """View an image from B2 storage"""
    
    try:
        image_data = b2_storage.get_image(file_key)
        return StreamingResponse(io.BytesIO(image_data), media_type="image/jpeg")
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

# ========== IMAGE TYPES ==========

@router.get("/types")
async def get_supported_image_types(
    current_user: dict = Depends(get_current_user)
):
    """Get all supported image types"""
    
    types = get_image_types()
    display_names = get_image_type_display_names()
    
    return {
        "success": True,
        "types": [
            {
                "key": key,
                "display_name": display_names.get(key, key)
            }
            for key in types
        ]
    }

# ========== BULK UPLOAD ==========

@router.post("/upload-bulk/{patient_id}")
async def upload_bulk_images(
    patient_id: str,
    files: List[UploadFile] = File(...),
    image_type: str = Form("chest_xray"),
    analyze: bool = Form(False),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload and analyze multiple images at once"""
    
    # Validate patient
    patient = db.query(Patient).filter(Patient.id == UUID(patient_id)).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Validate image type
    valid_types = get_image_types()
    if image_type not in valid_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid image type. Must be one of: {', '.join(valid_types)}"
        )
    
    results = []
    errors = []
    
    for file in files:
        try:
            file_data = await file.read()
            
            # Upload to B2
            upload_result = b2_storage.upload_image(
                file_data=file_data,
                file_name=file.filename,
                patient_id=patient_id,
                content_type=file.content_type
            )
            
            if not upload_result["success"]:
                errors.append({
                    "filename": file.filename,
                    "error": upload_result.get("error", "Upload failed")
                })
                continue
            
            # Save to images table
            new_image = Image(
                patient_id=patient_id,
                image_type=image_type,
                filename=file.filename,
                image_data="",
                analysis="Awaiting AI analysis...",
                confidence=0.0,
                uploaded_at=datetime.now()
            )
            db.add(new_image)
            db.flush()
            
            # Save to analysis_history with signed_url
            analysis_entry = {
                "id": str(new_image.id),
                "image_type": image_type,
                "image_url": upload_result["public_url"],
                "signed_url": upload_result["signed_url"],
                "b2_key": upload_result["file_key"],
                "findings": "Awaiting AI analysis...",
                "confidence": 0.0,
                "analyzed_at": datetime.now().isoformat(),
                "file_name": file.filename,
                "image_id": str(new_image.id)
            }
            
            current_history = patient.analysis_history or []
            current_history.append(analysis_entry)
            patient.analysis_history = current_history
            db.commit()
            db.refresh(new_image)
            
            results.append({
                "filename": file.filename,
                "file_key": upload_result["file_key"],
                "public_url": upload_result["public_url"],
                "signed_url": upload_result["signed_url"],
                "image_id": str(new_image.id)
            })
            
        except Exception as e:
            errors.append({
                "filename": file.filename,
                "error": str(e)
            })
    
    return {
        "success": True,
        "patient_id": patient_id,
        "patient_name": patient.name,
        "image_type": image_type,
        "processed": len(results),
        "errors": len(errors),
        "results": results,
        "errors_list": errors
    }