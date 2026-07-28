from sqlalchemy import Column, String, Text, Boolean, Date, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from ..db.database import Base

class SOAPNote(Base):
    __tablename__ = "soap_notes"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id"), nullable=False)
    doctor_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # SOAP Sections - Individual columns for better querying and display
    subjective = Column(Text, nullable=True)      # Patient's complaints, symptoms, history
    objective = Column(Text, nullable=True)       # Exam findings, vitals, test results
    assessment = Column(Text, nullable=True)      # Diagnosis, differential, clinical impression
    plan = Column(Text, nullable=True)            # Treatment plan, medications, follow-up
    
    # Summary/Conclusion
    summary = Column(Text, nullable=True)         # Overall conclusion, key takeaways
    
    # Metadata
    visit_date = Column(Date, nullable=False, server_default=func.current_date())
    is_finalized = Column(Boolean, default=False)  # Changed from String to Boolean
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Tracking
    version = Column(Integer, default=1)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)