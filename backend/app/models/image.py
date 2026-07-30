from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime

from ..db.database import Base

class Image(Base):
    __tablename__ = "images"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    image_type = Column(String(50), nullable=False)
    filename = Column(String(255), nullable=False)
    image_data = Column(Text, nullable=True)
    analysis = Column(Text, nullable=True)
    findings = Column(Text, nullable=True)        
    impression = Column(Text, nullable=True)      
    doctor_notes = Column(Text, nullable=True) 
    confidence = Column(Float, nullable=True)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    patient = relationship("Patient", back_populates="images", foreign_keys=[patient_id])

    def to_dict(self) -> dict:
        return {
            "id": str(self.id),
            "patient_id": str(self.patient_id),
            "image_type": self.image_type,
            "filename": self.filename,
            "analysis": self.analysis,
            "confidence": self.confidence,
            "uploaded_at": self.uploaded_at.strftime("%Y-%m-%d %H:%M") if self.uploaded_at else None
        }

    def to_dict_with_patient(self, patient_name: str = None) -> dict:
        data = self.to_dict()
        if patient_name:
            data["patient_name"] = patient_name
        return data

    def __repr__(self):
        return f"<Image {self.filename} ({self.image_type})>"
