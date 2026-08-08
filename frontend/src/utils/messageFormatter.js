// ========================================
// GLOBAL: window.analyzePatient
// ========================================

window.handleAnalyzeClick = function(patientName) {
  console.log('🔍 handleAnalyzeClick called for:', patientName);
  if (window.analyzePatient) {
    window.analyzePatient(patientName);
  } else {
    console.error('❌ window.analyzePatient is not defined');
  }
};

// ========================================
// PREMIUM MEDICAL MESSAGE FORMATTER
// Complete rewrite with Lucide icons & structured content
// ========================================

export const formatMedicalMessage = (text, isUser = false) => {


// ✅ STEP 0: Handle objects (clinical analysis JSON)
if (!isUser && typeof text === 'object' && text !== null) {
  if (text.type === 'clinical_analysis' && text.data) {
    console.log('📊 CLINICAL ANALYSIS JSON DETECTED in formatMedicalMessage');
    return formatClinicalAnalysisFromJSON(text.data);
  }
  return JSON.stringify(text);
}
  // ✅ STEP 1: User messages
  if (isUser) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  // ✅ STEP 2: If already HTML, return as-is
  if (text.includes('<br/>') || text.includes('<strong>') || text.includes('<div')) {
    return text;
  }
  
  // ✅ STEP 3: TRY JSON FIRST (NEW - NO REGEX!)
  try {
    // Check if text looks like JSON
    const trimmed = text.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      const data = JSON.parse(trimmed);
      
      // Check if it's an imaging report
      if (data.type === 'imaging_report' || data.findings || data.impression) {
        console.log('✅ Using JSON data for imaging report');
        return formatStructuredImagingReport(data);
      }
      
      // Check if it's patient data
if (data.type === 'patient_selected' && data.patient) {
  console.log('✅ Using JSON data for patient selection - DIRECT OBJECT');
  console.log('📊 Patient data with counts:', data.patient);
  
  // ✅ Ensure counts are passed correctly
  const patientWithCounts = {
    ...data.patient,
    rx_count: data.patient.rx_count || 0,
    analysis_count: data.patient.analysis_count || data.patient.total_analyses || 0,
    soap_count: data.patient.soap_count || 0,
    apt_count: data.patient.apt_count || 0
  };
  
  return formatPatientSelected(patientWithCounts);
}
      
      // Check if it's a SOAP note
      if (data.type === 'soap_note' || data.subjective) {
        console.log('✅ Using JSON data for SOAP note');
        // Convert JSON to format your existing function expects
        const textFormat = `SOAP Notes for ${data.patientName || 'Patient'}\n📅 ${data.date || 'Unknown Date'}\n---\nSUBJECTIVE:\n${data.subjective || 'Not documented'}\n\nOBJECTIVE:\n${data.objective || 'Not documented'}\n\nASSESSMENT:\n${data.assessment || 'Not documented'}\n\nPLAN:\n${data.plan || 'Not documented'}`;
        return formatSOAPNote(textFormat);
      }
      
      // Check if it's a prescription
      if (data.type === 'prescription' || data.medication) {
        console.log('✅ Using JSON data for prescription');
        // Convert JSON to format your existing function expects
        const textFormat = `Prescription generated for ${data.patientName || 'Patient'}\nMedication: ${data.medication || 'Unknown'}\nDosage: ${data.dosage || 'N/A'}\nFrequency: ${data.frequency || 'N/A'}\nDuration: ${data.duration || 'N/A'}\nRoute: ${data.route || 'Oral'}\nInstructions: ${data.instructions || ''}`;
        return formatPrescription(textFormat);
      }
    }
  } catch (e) {
    // Not JSON, continue to regex fallback
    console.log('📝 Not JSON, using regex fallback');
  }

// ===== STEP 3.5: CLINICAL ANALYSIS JSON =====
  try {
    const data = JSON.parse(text);
    if (data.type === 'clinical_analysis' && data.data) {
      console.log('📊 CLINICAL ANALYSIS JSON DETECTED');
      return formatClinicalAnalysisFromJSON(data.data);
    }
  } catch (e) {
    // Not JSON, continue
  }



  // ===== STEP 4: FALLBACK - Original regex parsing (for backward compatibility) =====
  // 🩻🩻🩻 IMAGING CHECK (only if not JSON)
  if (text.includes('Imaging Reports for') || text.includes('🩻 Imaging Reports for') || text.includes('🩻 Imaging Report -')) {
    console.log('🩻 IMAGING DETECTED - using regex formatter');
    try {
      const data = extractImagingData(text);
      if (data) {
        return formatStructuredImagingReport(data);
      }
    } catch (e) {
      console.log("⚠️ Could not parse as structured data");
    }
    return formatStructuredImagingReport({ patientName: 'Unknown', imageType: 'Unknown', date: '', findings: 'No findings documented', impression: 'Not documented', recommendations: 'No recommendations provided', doctorNotes: 'No doctor notes added', confidence: '' });
  }
  
  let formatted = text;
  
  // ===== STEP 5: DETECT CONTENT TYPE =====
  const isPatientList = formatted.includes('Found') && formatted.includes('patients in your clinic');
  const isPatientSelected = formatted.includes('Patient Selected:') || formatted.includes('✓ Patient Selected') || formatted.includes('Patient Summary:');
  const isSOAPNote = formatted.includes('SUBJECTIVE:') || formatted.includes('SUBJECTIVE') || formatted.includes('Objective:') || formatted.includes('SOAPNote') || formatted.includes('SOAP Notes for');
  const isPrescription = formatted.includes('Prescription generated') || 
                         (formatted.includes('Medication:') && formatted.includes('Dosage:'));
  const isAppointment = formatted.includes('Appointment') && formatted.includes('scheduled');
  const isMedicalAdvice = formatted.includes('Diagnosis') || formatted.includes('Treatment') || formatted.includes('Red Flags');
  const isSectionView = formatted.includes('Imaging Reports for') ||
                        formatted.includes('Active Medications for') || 
                        formatted.includes('Active Prescriptions for') ||
                        formatted.includes('All Prescriptions for') ||
                        formatted.includes('Upcoming Appointments for') ||
                        formatted.includes('No active medications') ||
                        formatted.includes('No active prescriptions') ||
                        formatted.includes('No imaging reports found') ||
                        formatted.includes('No upcoming appointments');
  
  // ===== STEP 6: PATIENT LIST =====
  if (isPatientList) {
    return formatPatientList(formatted);
  }
  
  // ===== STEP 7: PRESCRIPTION =====
  if (isPrescription) {
    return formatPrescription(formatted);
  }
  
  // ===== STEP 8: SECTION VIEW =====
  if (isSectionView) {
    console.log('🔍 SECTION VIEW DETECTED:', formatted.substring(0, 50));
    return formatSectionView(formatted);
  }
  
  // ===== STEP 9: PATIENT SELECTED =====
  if (isPatientSelected) {
    return formatPatientSelected(text);
  }
  
  // ===== STEP 10: SOAP NOTE =====
  if (isSOAPNote) {
    return formatSOAPNote(formatted);
  }
  
  // ===== STEP 11: APPOINTMENT =====
  if (isAppointment) {
    return formatAppointment(formatted);
  }
  
  // ===== STEP 12: MEDICAL ADVICE =====
  if (isMedicalAdvice) {
    return formatMedicalAdvice(formatted);
  }
  
  // ===== STEP 13: DEFAULT =====
  return formatDefault(formatted);
};

// ========================================
// Helper function to extract data from structured imaging report
// ========================================

function extractImagingData(text) {
  try {
    console.log('🔍 Extracting imaging data from report...');
    
    // Extract patient name
    const nameMatch = text.match(/🩻 Imaging Report - ([^\n<]+)/);
    const patientName = nameMatch ? nameMatch[1].trim() : '';
    
    // Extract image type
    const typeMatch = text.match(/<div style="font-size:10px;color:#64748B;">([^•]+)/);
    const imageType = typeMatch ? typeMatch[1].trim().replace(/•/g, '').trim() : '';
    
    // Extract date
    const dateMatches = text.match(/\d{4}-\d{2}-\d{2}/g);
    const date = dateMatches ? dateMatches[0] : '';
    
    // Extract confidence
    const confMatch = text.match(/✅ (\d+)%/);
    const confidence = confMatch ? confMatch[1] : '';
    
    // Extract each section individually
    const extractSection = (sectionTitle, icon) => {
      // Find the section header with the icon
      const headerPattern = new RegExp(`${icon}\\s*${sectionTitle}`, 'i');
      const headerMatch = text.match(headerPattern);
      if (!headerMatch) {
        return '';
      }
      
      const startPos = headerMatch.index + headerMatch[0].length;
      
      // Find the next section header
      const nextIcons = ['🔍', '💡', '📋', '📝'];
      let endPos = text.length;
      for (const nextIcon of nextIcons) {
        const nextPos = text.indexOf(nextIcon, startPos);
        if (nextPos !== -1 && nextPos < endPos && nextPos > startPos) {
          endPos = nextPos;
        }
      }
      
      // Extract content between start and end
      let content = text.substring(startPos, endPos)
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/•/g, '')
        .replace(/✎ Edit/g, '')
        .trim();
      
      // Remove the section title if it appears
      content = content.replace(new RegExp(`^${sectionTitle}`, 'i'), '').trim();
      content = content.replace(new RegExp(`^${icon}\\s*${sectionTitle}`, 'i'), '').trim();
      
      // If content is placeholder, return empty
      if (content.includes('No findings documented') ||
          content.includes('Not documented') ||
          content.includes('No recommendations provided') ||
          content.includes('No doctor notes added')) {
        return '';
      }
      
      return content;
    };
    
    // Extract each section with the correct icon
    const findings = extractSection('Findings', '🔍');
    const impression = extractSection('Impression', '💡');
    const recommendations = extractSection('Recommendations', '📋');
    const doctorNotes = extractSection('Doctor Notes', '📝');
    
    console.log('✅ Extracted - Findings:', !!findings);
    console.log('✅ Extracted - Impression:', !!impression);
    console.log('✅ Extracted - Recommendations:', !!recommendations);
    console.log('✅ Extracted - Doctor Notes:', !!doctorNotes);
    
    return {
      patientName: patientName || 'Unknown',
      imageType: imageType || 'Unknown',
      date: date || '',
      findings: findings || 'No findings documented',
      impression: impression || 'Not documented',
      recommendations: recommendations || 'No recommendations provided',
      doctorNotes: doctorNotes || 'No doctor notes added',
      confidence: confidence || '',
      imageId: 'unknown'
    };
  } catch (e) {
    console.error('Error extracting imaging data:', e);
    return null;
  }
}

// ========================================
// ICON HELPERS
// ========================================

const icons = {
  calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  stethoscope: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2.7a.3.3 0 0 0-.2-.4"/><path d="M10.6 9.4a.3.3 0 0 0-.3.3v1.5"/><path d="M17.4 12.6a.3.3 0 0 0 .3-.3v-1.5"/><path d="M14 5h4"/><path d="M4 5h4"/><path d="M12 3v1"/><path d="M12 12v7"/><path d="M5 19h14"/><path d="M10 9.4a3 3 0 0 0-4 0"/><path d="M14 9.4a3 3 0 0 1 4 0"/><path d="M8 12c-1.5 0-3-1.5-3-3V6"/><path d="M16 12c1.5 0 3-1.5 3-3V6"/><path d="M12 18c-1 0-2-.5-2-1.5V12"/><path d="M12 18c1 0 2-.5 2-1.5V12"/></svg>`,
  
  user: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  
  fileText: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  
  pill: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.5 20.5 3.5 13.5a4.95 4.95 0 0 1 0-7l2-2a4.95 4.95 0 0 1 7 0l7 7a4.95 4.95 0 0 1 0 7l-2 2a4.95 4.95 0 0 1-7 0Z"/><path d="m8.5 8.5 7 7"/></svg>`,
  
  scan: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="7" y1="12"x2="17" y2="12"/></svg>`,
  
  braincircuit: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-brain-circuit-icon lucide-brain-circuit"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M9 13a4.5 4.5 0 0 0 3-4"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M12 13h4"/><path d="M12 18h6a2 2 0 0 1 2 2v1"/><path d="M12 8h8"/><path d="M16 8V5a2 2 0 0 1 2-2"/><circle cx="16" cy="13" r=".5"/><circle cx="18" cy="3" r=".5"/><circle cx="20" cy="21" r=".5"/><circle cx="20" cy="8" r=".5"/></svg>`,
  hospital: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M2 12h20"/><path d="M6 6h12"/><path d="M6 18h12"/></svg>`,
  layoutDashboard: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>`,
  triangleAlert: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
  flaskConical: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v6.5L4.5 18.5A2 2 0 0 0 6 22h12a2 2 0 0 0 1.5-3.5L14 8.5V2"/><path d="M14 2v6.5"/><path d="M8.5 14h7"/></svg>`,
  shieldAlert: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>`,
  badgeCheck: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>`,
  clipboardCheck: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>`,
  activity: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  info: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,

  
  search: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,

  alertTriangle: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>`,
  
  heartPulse: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5H21"/></svg>`,
  
  pill: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.5 20.5 3.5 13.5a4.95 4.95 0 0 1 0-7l2-2a4.95 4.95 0 0 1 7 0l7 7a4.95 4.95 0 0 1 0 7l-2 2a4.95 4.95 0 0 1-7 0Z"/><path d="m8.5 8.5 7 7"/></svg>`,
  
  fileText: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  
  notebookPen: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4"/><path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><path d="M18.4 2.6a2 2 0 0 1 2.8 2.8l-9 9-4.2 1.4 1.4-4.2Z"/></svg>`,
  
  scanLine: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="7" y1="12"x2="17" y2="12"/></svg>`,
  
  calendarDays: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>`,
  
  brain: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4a4 4 0 0 1 3.5 6A4 4 0 0 1 12 20a4 4 0 0 1-3.5-6A4 4 0 0 1 12 4Z"/><path d="M12 10v4"/><path d="M10 12h4"/></svg>`,
  
  checkCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  
  chevronRight: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
};

// ========================================
// PATIENT SELECTED - NEW CARD DESIGN
// ========================================


function formatPatientSelected(input) {
  let patientName = 'Patient';
  let mrn = 'N/A', age = 'N/A', gender = 'N/A';
  let allergies = 'None', conditions = 'None';
  let medications = [];
  let rxCount = 0, soapCount = 0, imgCount = 0, aptCount = 0;

  // ===== CHECK IF INPUT IS PATIENT OBJECT (FROM JSON) =====
  if (typeof input === 'object' && input !== null && input.rx_count !== undefined) {
    const p = input;
    patientName = p.name || 'Patient';
    mrn = p.mrn || 'N/A';
    age = p.age || 'N/A';
    gender = p.gender || 'N/A';
    allergies = p.allergies || [];
    conditions = p.conditions || [];
    medications = p.medications || [];
    
    // ✅ USE DATABASE COUNTS DIRECTLY!
    rxCount = p.rx_count || 0;
    soapCount = p.soap_count || 0;
    imgCount = p.analysis_count || 0;
    aptCount = p.apt_count || 0;
  } else {
    // ===== FALLBACK: Parse from text using string methods (NO REGEX) =====
    const text = input;
    
    // Extract patient name
    let nameIndex = text.indexOf('Patient Selected:');
    if (nameIndex === -1) nameIndex = text.indexOf('Patient Summary:');
    if (nameIndex !== -1) {
      const keyword = text.indexOf('Patient Selected:') !== -1 ? 'Patient Selected:' : 'Patient Summary:';
      const start = nameIndex + keyword.length;
      const end = text.indexOf('\n', start);
      patientName = text.substring(start, end !== -1 ? end : text.length).trim();
      // Remove ** markers
      while (patientName.indexOf('**') !== -1) {
        patientName = patientName.replace('**', '');
      }
    }
    
    // Extract demographics
    const demoIndex = text.indexOf('Demographics:');
    if (demoIndex !== -1) {
      const start = demoIndex + 'Demographics:'.length;
      const end = text.indexOf('\n', start);
      const demoText = text.substring(start, end !== -1 ? end : text.length);
      const parts = demoText.split('|').map(s => s.trim());
      parts.forEach(part => {
        if (part.indexOf('MRN:') !== -1) mrn = part.replace('MRN:', '').trim();
        if (part.indexOf('Age:') !== -1) age = part.replace('Age:', '').trim();
        if (part.indexOf('Gender:') !== -1) gender = part.replace('Gender:', '').trim();
      });
    }
    
    // Extract medical history
    const historyIndex = text.indexOf('Medical History:');
    if (historyIndex !== -1) {
      const start = historyIndex + 'Medical History:'.length;
      const end = text.indexOf('\n', start);
      const historyText = text.substring(start, end !== -1 ? end : text.length);
      const allergyIdx = historyText.indexOf('Allergies:');
      const conditionIdx = historyText.indexOf('Conditions:');
      if (allergyIdx !== -1) {
        const aStart = allergyIdx + 'Allergies:'.length;
        const aEnd = historyText.indexOf('|', aStart);
        allergies = historyText.substring(aStart, aEnd !== -1 ? aEnd : historyText.length).trim();
        if (allergies === '') allergies = 'None';
      }
      if (conditionIdx !== -1) {
        const cStart = conditionIdx + 'Conditions:'.length;
        const cEnd = historyText.indexOf('|', cStart);
        conditions = historyText.substring(cStart, cEnd !== -1 ? cEnd : historyText.length).trim();
        if (conditions === '') conditions = 'None';
      }
    }
    
    // Extract medications
    const medsIndex = text.indexOf('Current Medications:');
    if (medsIndex !== -1) {
      const start = medsIndex + 'Current Medications:'.length;
      const end = text.indexOf('\n', start);
      const medsText = text.substring(start, end !== -1 ? end : text.length).trim();
      if (medsText !== 'None' && medsText !== '') {
        const medsList = medsText.split(',');
        for (let i = 0; i < medsList.length; i++) {
          let med = medsList[i].trim();
          while (med.indexOf('**') !== -1) {
            med = med.replace('**', '');
          }
          if (med !== 'None' && med !== '') {
            medications.push(med);
          }
        }
      }
    }
    
    // ===== COUNT BULLET POINTS (NO REGEX) =====
    function countBulletPointsInSection(text, sectionMarker) {
      const sectionIndex = text.indexOf(sectionMarker);
      if (sectionIndex === -1) return 0;
      let startIndex = sectionIndex + sectionMarker.length;
      let endIndex = text.length;
      const nextMarkers = ['💊', '🩻', '📅', '✅', '📝'];
      for (let i = 0; i < nextMarkers.length; i++) {
        const pos = text.indexOf(nextMarkers[i], startIndex);
        if (pos !== -1 && pos < endIndex) {
          endIndex = pos;
        }
      }
      const sectionContent = text.substring(startIndex, endIndex);
      const lines = sectionContent.split('\n');
      let count = 0;
      for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim();
        if (trimmed.indexOf('•') === 0) {
          count++;
        }
      }
      return count;
    }
    
    function sectionHasContent(text, sectionMarker, emptyIndicator) {
      const idx = text.indexOf(sectionMarker);
      if (idx === -1) return false;
      let start = idx + sectionMarker.length;
      let end = text.length;
      const markers = ['💊', '🩻', '📅', '✅'];
      for (let i = 0; i < markers.length; i++) {
        const pos = text.indexOf(markers[i], start);
        if (pos !== -1 && pos < end) {
          end = pos;
        }
      }
      const content = text.substring(start, end);
      return content.indexOf(emptyIndicator) === -1;
    }
    
    rxCount = countBulletPointsInSection(text, '💊 Prescriptions:');
    imgCount = countBulletPointsInSection(text, '🩻 Image Analyses:');
    if (sectionHasContent(text, '📝 Latest SOAP Note:', 'No SOAP notes')) {
      soapCount = 1;
    }
    aptCount = countBulletPointsInSection(text, '📅 Appointments:');
  }

  // ===== BUILD THE CARD (SAME FOR BOTH CASES) =====
  let allergyList = [];
  let conditionList = [];
  
  if (Array.isArray(allergies)) {
    allergyList = allergies;
    conditionList = conditions;
  } else {
    if (allergies !== 'None' && allergies !== '') {
      allergyList = allergies.split(',').map(a => a.trim()).filter(a => a !== '');
    }
    if (conditions !== 'None' && conditions !== '') {
      conditionList = conditions.split(',').map(c => c.trim()).filter(c => c !== '');
    }
  }
  
  const displayMeds = medications.slice(0, 3);
  const medMore = medications.length > 3 ? medications.length - 3 : 0;

  let result = `
    <div class="premium-snapshot-card">
      <div class="snapshot-intro">
        I've loaded the patient context. Here's the clinical snapshot for ${patientName}.
      </div>
      
      <div class="snapshot-inner-card">
        
        <div class="snapshot-status">
          <span class="status-check">${icons.checkCircle}</span>
          <span class="status-text">Patient Selected</span>
        </div>
        
        <div class="snapshot-identity">
          <div class="identity-avatar">
            <span class="avatar-initial">${patientName.charAt(0)}</span>
          </div>
          <div class="identity-info">
            <div class="identity-name">${patientName}</div>
            <div class="identity-meta">${mrn} • ${gender} • ${age} Years</div>
            <div class="identity-since">Patient Since ${new Date().getFullYear() - 1}</div>
          </div>
        </div>
        
        <!-- Allergies & Conditions -->
        <div class="snapshot-alerts-row">
          <div class="alert-card alert-allergy">
            <div class="alert-icon-wrapper alert-icon-red">
              <span class="alert-icon">${icons.alertTriangle}</span>
            </div>
            <div class="alert-content">
              <div class="alert-label">Allergies</div>
              <div class="alert-value">${allergyList.length > 0 ? allergyList.join(', ') : 'None'}</div>
            </div>
            <span class="alert-chevron">${icons.chevronRight}</span>
          </div>
          <div class="alert-card alert-condition">
            <div class="alert-icon-wrapper alert-icon-purple">
              <span class="alert-icon">${icons.heartPulse}</span>
            </div>
            <div class="alert-content">
              <div class="alert-label">Active Conditions</div>
              <div class="alert-value">${conditionList.length > 0 ? conditionList.join(', ') : 'None'}</div>
            </div>
            <span class="alert-chevron">${icons.chevronRight}</span>
          </div>
        </div>
        
        <!-- Active Medications -->
        <div class="snapshot-section" onclick="window.viewSection('medications', '${patientName}')">
          <div class="snapshot-section-header">
            <div class="snapshot-section-left">
              <span class="snapshot-section-icon">${icons.pill}</span>
              <span class="snapshot-section-title">Active Medications</span>
              <span class="snapshot-section-count">${medications.length}</span>
            </div>
            <div class="snapshot-section-action">
              ${medications.length > 3 ? `+${medMore} Medications` : ''}
              <span class="action-chevron">${icons.chevronRight}</span>
            </div>
          </div>
          <div class="snapshot-section-items">
            ${displayMeds.length > 0 ? displayMeds.map(m => `<div class="snapshot-section-item">• ${m}</div>`).join('') : `<div class="snapshot-section-empty">No active medications</div>`}
          </div>
        </div>
        
        <!-- Active Prescriptions -->
        <div class="snapshot-section" onclick="window.viewSection('prescriptions', '${patientName}')">
          <div class="snapshot-section-header">
            <div class="snapshot-section-left">
              <span class="snapshot-section-icon">${icons.fileText}</span>
              <span class="snapshot-section-title">Active Prescriptions</span>
              <span class="snapshot-section-count">${rxCount}</span>
            </div>
            <div class="snapshot-section-action">
              ${rxCount > 3 ? `+${rxCount - 3} Prescriptions` : ''}
              <span class="action-chevron">${icons.chevronRight}</span>
            </div>
          </div>
          <div class="snapshot-section-items">
            ${rxCount > 0 ? `<div class="snapshot-section-item">• ${rxCount} active prescription(s)</div>` : `<div class="snapshot-section-empty">No active prescriptions</div>`}
          </div>
        </div>
        
        <!-- SOAP Notes -->
        <div class="snapshot-section" onclick="window.viewSection('soap', '${patientName}')">
          <div class="snapshot-section-header">
            <div class="snapshot-section-left">
              <span class="snapshot-section-icon">${icons.notebookPen}</span>
              <span class="snapshot-section-title">SOAP Notes</span>
              <span class="snapshot-section-count">${soapCount}</span>
            </div>
            <div class="snapshot-section-action">
              ${soapCount > 0 ? 'View SOAP Notes' : ''}
              <span class="action-chevron">${icons.chevronRight}</span>
            </div>
          </div>
          <div class="snapshot-section-items">
            ${soapCount > 0 ? `<div class="snapshot-section-item">• ${soapCount} SOAP note(s) available</div>` : `<div class="snapshot-section-empty">No SOAP notes available</div>`}
          </div>
        </div>
        
        <!-- Imaging Reports -->
        <div class="snapshot-section" onclick="window.viewSection('imaging', '${patientName}')">
          <div class="snapshot-section-header">
            <div class="snapshot-section-left">
              <span class="snapshot-section-icon">${icons.scanLine}</span>
              <span class="snapshot-section-title">Imaging Reports</span>
              <span class="snapshot-section-count">${imgCount}</span>
            </div>
            <div class="snapshot-section-action">
              ${imgCount > 3 ? `+${imgCount - 3} Reports` : ''}
              <span class="action-chevron">${icons.chevronRight}</span>
            </div>
          </div>
          <div class="snapshot-section-items">
            ${imgCount > 0 ? `<div class="snapshot-section-item">• ${imgCount} report(s) available</div>` : `<div class="snapshot-section-empty">No imaging reports available</div>`}
          </div>
        </div>
        
        <!-- Upcoming Appointments -->
        <div class="snapshot-section" onclick="window.viewSection('appointments', '${patientName}')">
          <div class="snapshot-section-header">
            <div class="snapshot-section-left">
              <span class="snapshot-section-icon">${icons.calendarDays}</span>
              <span class="snapshot-section-title">Upcoming Appointments</span>
              <span class="snapshot-section-count">${aptCount}</span>
            </div>
            <div class="snapshot-section-action">
              ${aptCount > 3 ? `+${aptCount - 3} Appointments` : ''}
              <span class="action-chevron">${icons.chevronRight}</span>
            </div>
          </div>
          <div class="snapshot-section-items">
            ${aptCount > 0 ? `<div class="snapshot-section-item">• ${aptCount} upcoming appointment(s)</div>` : `<div class="snapshot-section-empty">No upcoming appointments</div>`}
          </div>
        </div>
        
        <!-- Analyze & Recommend CTA -->
        <div class="snapshot-cta">
          <div class="cta-content">
            <div class="cta-icon">${icons.brain}</div>
            <div class="cta-info">
              <div class="cta-title">Analyze &amp; Recommend</div>
              <div class="cta-desc">Get clinical insights, risk assessment, recommendations, and follow-up guidance.</div>
            </div>
          </div>
          <button class="cta-btn" data-patient="${patientName}" id="analyze-btn-${patientName.replace(/\s/g, '')}">Analyze Patient</button>
        </div>
        
        <div class="snapshot-footer">
          ℹ Clinical snapshot based on the latest available data.
        </div>
        
      </div>
    </div>
  `;
  
  return result;
}

// ========================================
// SECTION VIEW HANDLER (to be attached to window)
// ========================================

// This will be called when a section is clicked
window.viewSection = function(section, patientName) {
  // This function will be overridden in App.jsx
  // We'll handle the actual logic there
  console.log(`📊 Viewing ${section} for ${patientName}`);
  
  // Trigger a custom event that App.jsx can listen to
  const event = new CustomEvent('viewSection', { 
    detail: { section, patientName } 
  });
  window.dispatchEvent(event);
};


// ========================================
// FALLBACK: Format imaging report from raw text
// ========================================

function formatImagingReportFromText(text) {
  console.log('🔄 Parsing imaging report from raw text');
  
  // Extract patient name
  let patientName = 'Unknown';
  let imageType = 'Unknown';
  let date = '';
  let findings = '';
  let impression = '';
  let recommendations = '';
  let doctorNotes = '';
  let confidence = '';
  
  const lines = text.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed.includes('Imaging Reports for')) {
      patientName = trimmed.replace('🩻 Imaging Reports for', '').trim();
    } else if (trimmed.includes('📅')) {
      date = trimmed.replace('📅', '').trim();
    } else if (trimmed.includes('🖼️')) {
      imageType = trimmed.replace('🖼️', '').trim();
    } else if (trimmed.startsWith('Findings:')) {
      findings = trimmed.replace('Findings:', '').trim();
    } else if (trimmed.startsWith('Impression:')) {
      impression = trimmed.replace('Impression:', '').trim();
    } else if (trimmed.startsWith('Recommendations:')) {
      recommendations = trimmed.replace('Recommendations:', '').trim();
    } else if (trimmed.startsWith('Confidence:')) {
      confidence = trimmed.replace('Confidence:', '').trim().replace('%', '');
    } else if (trimmed.startsWith('Doctor Notes:') || trimmed.startsWith('Notes:')) {
      doctorNotes = trimmed.replace('Doctor Notes:', '').replace('Notes:', '').trim();
    }
  }
  
  // If we found ANY data, format it
  if (findings || impression || recommendations || doctorNotes) {
    console.log('✅ Extracted from raw text - Findings:', !!findings);
    console.log('✅ Extracted from raw text - Impression:', !!impression);
    console.log('✅ Extracted from raw text - Recommendations:', !!recommendations);
    
    return formatStructuredImagingReport({
      patientName: patientName || 'Unknown',
      imageType: imageType || 'Unknown',
      date: date || '',
      findings: findings || 'No findings documented',
      impression: impression || 'Not documented',
      recommendations: recommendations || 'No recommendations provided',
      doctorNotes: doctorNotes || 'No doctor notes added',
      confidence: confidence || ''
    });
  }
  
  // If still no data, return the fallback
  console.log('❌ No data found in raw text, using fallback');
  return formatStructuredImagingReport({
    patientName: 'Unknown',
    imageType: 'Unknown',
    date: '',
    findings: 'No findings documented',
    impression: 'Not documented',
    recommendations: 'No recommendations provided',
    doctorNotes: 'No doctor notes added',
    confidence: ''
  });
}
// ========================================
// OTHER FORMATTERS (unchanged)
// ========================================

function formatSectionView(text) {
  // Check if this is a prescriptions response
  const isPrescriptions = text.includes('All Prescriptions for') || text.includes('Active Prescriptions for');
  // Check if this is an imaging response
  const isImaging = text.includes('Imaging Reports for') || text.includes('🩻 Imaging Reports for') || text.includes('🩻 Imaging Report -');
  
  console.log('🔍 formatSectionView called');
  console.log('🔍 isPrescriptions:', isPrescriptions);
  console.log('🔍 isImaging:', isImaging);
  console.log('🔍 text starts with:', text.substring(0, 50));
  
  if (isPrescriptions) {
    console.log('🔍 Calling formatPrescriptionsGrouped');
    return formatPrescriptionsGrouped(text);
  }
  
  if (isImaging) {
    console.log('🔍 Calling formatStructuredImagingReport');
    try {
      // ✅ Try to extract the data from the text
      const data = extractImagingData(text);
      if (data && data.findings && data.findings !== 'No findings documented') {
        console.log('✅ Data extracted successfully');
        return formatStructuredImagingReport(data);
      }
    } catch (e) {
      console.log("⚠️ Could not parse as structured data:", e);
    }
    
    // ✅ Fallback: Try to parse the text directly
    console.log('🔄 Using fallback: extracting from raw text');
    return formatImagingReportFromText(text);
  }
  
  // Default formatting for other section views
  let formatted = text.replace(/\*\*/g, '');
  formatted = formatted.replace(/\n/g, '<br/>');
  const lines = text.split('\n');
  let result = '';
  
  for (const line of lines) {
    if (line.trim() === '') continue;
    if (line.includes('Active Medications') || line.includes('SOAP Notes') || 
        line.includes('Imaging Reports') || line.includes('Upcoming Appointments') ||
        line.includes('No active') || line.includes('No SOAP') || line.includes('No imaging')) {
      result += `<div class="section-view-header">${line.replace(/\*\*/g, '')}</div>`;
    } else if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
      result += `<div class="section-view-item">${line}</div>`;
    } else if (line.includes('Medication:') || line.includes('Dosage:') || 
               line.includes('Frequency:') || line.includes('Duration:') || 
               line.includes('Prescribed:') || line.includes('Assessment:') ||
               line.includes('Findings:') || line.includes('Reason:') || line.includes('---')) {
      result += `<div class="section-view-detail">${line.replace(/\*\*/g, '')}</div>`;
    } else if (line.includes('✅')) {
      result += `<div class="section-view-success">${line}</div>`;
    } else {
      result += `<div class="section-view-content">${line}</div>`;
    }
  }
  
  return `<div class="section-view-container">${result}</div>`;
}

// New function: Format prescriptions grouped by date
function formatPrescriptionsGrouped(text) {
  console.log("formatPrescriptionsGrouped called");
  const lines = text.split("\n").filter(line => line.trim());
  let prescriptions = [];
  
  const headerMatch = text.match(/(📄 All Prescriptions for [^\n]+)/);
  const patientName = headerMatch ? headerMatch[1].replace("📄 All Prescriptions for ", "") : "";
  
  let currentPrescription = {};
  
  for (const line of lines) {
    if (line.includes("All Prescriptions for") || line.includes("Active Prescriptions for")) continue;
    if (line.includes("📌 Showing")) continue;
    if (line.includes("---")) continue;
    
    const medMatch = line.match(/^[✅⏹️]\s*(.+)$/);
    if (medMatch) {
      if (Object.keys(currentPrescription).length > 0 && currentPrescription.name) {
        prescriptions.push({ ...currentPrescription });
        currentPrescription = {};
      }
      currentPrescription = { 
        name: medMatch[1].trim(),
        status: line.includes("✅") ? "active" : "inactive"
      };
      continue;
    }
    
    const trimmedLine = line.trim();
    if (trimmedLine.includes("Dosage:")) {
      currentPrescription.dosage = trimmedLine.replace("Dosage:", "").trim();
    } else if (trimmedLine.includes("Frequency:")) {
      currentPrescription.frequency = trimmedLine.replace("Frequency:", "").trim();
    } else if (trimmedLine.includes("Duration:")) {
      currentPrescription.duration = trimmedLine.replace("Duration:", "").trim();
    } else if (trimmedLine.includes("Route:")) {
      currentPrescription.route = trimmedLine.replace("Route:", "").trim();
    } else if (trimmedLine.includes("Prescribed:")) {
      currentPrescription.prescribed = trimmedLine.replace("Prescribed:", "").trim();
      const dateMatch = trimmedLine.match(/(\d{4}-\d{2}-\d{2})/);
      if (dateMatch) currentPrescription.date = dateMatch[1];
    } else if (trimmedLine.includes("Instructions:") || trimmedLine.includes("instructions:")) {
      currentPrescription.instructions = trimmedLine.replace(/Instructions:|instructions:/i, "").trim();
    }
  }
  
  if (Object.keys(currentPrescription).length > 0 && currentPrescription.name) {
    prescriptions.push({ ...currentPrescription });
  }
  
  const grouped = {};
  for (const rx of prescriptions) {
    const date = rx.date || rx.prescribed || "Unknown";
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(rx);
  }
  
  const sortedDates = Object.keys(grouped).filter(d => d !== "Unknown").sort((a, b) => new Date(b) - new Date(a));
  const unknownDate = grouped["Unknown"] || [];
  
  if (sortedDates.length === 0 && unknownDate.length === 0) {
    let fallback = text.replace(/\*\*/g, "");
    fallback = fallback.replace(/\n/g, "<br/>");
    return "<div class=\"section-view-container\">" + fallback + "</div>";
  }
  
  let display = "";
  
  // Header with 14px font
  display += "<div class=\"prescriptions-premium-header\" style=\"font-size:14px;\">" +
    "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#2563EB\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z\"/><polyline points=\"14 2 14 8 20 8\"/><line x1=\"16\" y1=\"13\" x2=\"8\" y2=\"13\"/><line x1=\"16\" y1=\"17\" x2=\"8\" y2=\"17\"/><polyline points=\"10 9 9 9 8 9\"/></svg>" +
    "<span>All Prescriptions for " + patientName + "</span>" +
  "</div>";
  
  for (const date of sortedDates) {
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "short", 
      day: "numeric" 
    });
    
    display += "<div class=\"prescriptions-premium-date-group\">" +
      "<div class=\"prescriptions-premium-date-header\">" +
        "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#64748B\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\"/><line x1=\"16\" y1=\"2\" x2=\"16\" y2=\"6\"/><line x1=\"8\" y1=\"2\" x2=\"8\" y2=\"6\"/><line x1=\"3\" y1=\"10\" x2=\"21\" y2=\"10\"/></svg>" +
        "<span class=\"prescriptions-premium-date-text\">" + formattedDate + "</span>" +
      "</div>" +
      "<div class=\"prescriptions-premium-divider\"></div>";
    
    for (const rx of grouped[date]) {
      // Lucide Pill icon with proper styling
      display += "<div class=\"prescription-premium-card-compact\">" +
        "<div class=\"prescription-premium-row\">" +
          "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#2563EB\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M10.5 20.5 3.5 13.5a4.95 4.95 0 0 1 0-7l2-2a4.95 4.95 0 0 1 7 0l7 7a4.95 4.95 0 0 1 0 7l-2 2a4.95 4.95 0 0 1-7 0Z\"/><path d=\"m8.5 8.5 7 7\"/></svg>" +
          "<span class=\"prescription-premium-name\">" + rx.name + "</span>" +
        "</div>" +
        "<div class=\"prescription-premium-details\">" +
          "<div class=\"prescription-premium-detail\">" +
            "<span class=\"prescription-premium-label\">Dosage</span>" +
            "<span class=\"prescription-premium-value\">" + (rx.dosage || "N/A") + "</span>" +
          "</div>" +
          "<div class=\"prescription-premium-detail\">" +
            "<span class=\"prescription-premium-label\">Route</span>" +
            "<span class=\"prescription-premium-value\">" + (rx.route || "Oral") + "</span>" +
          "</div>" +
          "<div class=\"prescription-premium-detail\">" +
            "<span class=\"prescription-premium-label\">Frequency</span>" +
            "<span class=\"prescription-premium-value\">" + (rx.frequency || "N/A") + "</span>" +
          "</div>" +
          "<div class=\"prescription-premium-detail\">" +
            "<span class=\"prescription-premium-label\">Duration</span>" +
            "<span class=\"prescription-premium-value\">" + (rx.duration || "N/A") + "</span>" +
          "</div>";
      // Special Instructions - check both instructions and special_instructions
      const instructionsText = rx.instructions || rx.special_instructions || "";
      if (instructionsText) {
        display += "<div class=\"prescription-premium-detail instructions-premium\">" +
            "<span class=\"prescription-premium-label\">Special Instructions</span>" +
            "<span class=\"prescription-premium-value\">" + instructionsText + "</span>" +
          "</div>";
      }
      display += "</div></div>";
    }
    
    display += "</div>";
  }
  
  if (unknownDate.length > 0) {
    display += "<div class=\"prescriptions-premium-date-group\">" +
      "<div class=\"prescriptions-premium-date-header\">" +
        "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#64748B\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\"/><line x1=\"16\" y1=\"2\" x2=\"16\" y2=\"6\"/><line x1=\"8\" y1=\"2\" x2=\"8\" y2=\"6\"/><line x1=\"3\" y1=\"10\" x2=\"21\" y2=\"10\"/></svg>" +
        "<span class=\"prescriptions-premium-date-text\">Unknown Date</span>" +
      "</div>" +
      "<div class=\"prescriptions-premium-divider\"></div>";
    for (const rx of unknownDate) {
      display += "<div class=\"prescription-premium-card-compact\">" +
        "<div class=\"prescription-premium-row\">" +
          "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#2563EB\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M10.5 20.5 3.5 13.5a4.95 4.95 0 0 1 0-7l2-2a4.95 4.95 0 0 1 7 0l7 7a4.95 4.95 0 0 1 0 7l-2 2a4.95 4.95 0 0 1-7 0Z\"/><path d=\"m8.5 8.5 7 7\"/></svg>" +
          "<span class=\"prescription-premium-name\">" + rx.name + "</span>" +
        "</div>" +
        "<div class=\"prescription-premium-details\">" +
          "<div class=\"prescription-premium-detail\">" +
            "<span class=\"prescription-premium-label\">Dosage</span>" +
            "<span class=\"prescription-premium-value\">" + (rx.dosage || "N/A") + "</span>" +
          "</div>" +
          "<div class=\"prescription-premium-detail\">" +
            "<span class=\"prescription-premium-label\">Route</span>" +
            "<span class=\"prescription-premium-value\">" + (rx.route || "Oral") + "</span>" +
          "</div>" +
          "<div class=\"prescription-premium-detail\">" +
            "<span class=\"prescription-premium-label\">Frequency</span>" +
            "<span class=\"prescription-premium-value\">" + (rx.frequency || "N/A") + "</span>" +
          "</div>" +
          "<div class=\"prescription-premium-detail\">" +
            "<span class=\"prescription-premium-label\">Duration</span>" +
            "<span class=\"prescription-premium-value\">" + (rx.duration || "N/A") + "</span>" +
          "</div>" +
        "</div></div>";
    }
    display += "</div>";
  }
  
  const countMatch = text.match(/📌 Showing (\d+) prescription/);
  if (countMatch) {
    display += "<div class=\"prescriptions-premium-footer\">📌 Showing " + countMatch[1] + " prescription(s).</div>";
  }
  
  return "<div class=\"prescriptions-premium-container\">" + display + "</div>";
}


function formatSOAPNote(text) {
  // ===== HELPER: Remove ** markers without regex =====
  const removeAsterisks = (str) => {
    if (!str) return str;
    let result = str;
    while (result.indexOf('**') !== -1) {
      result = result.replace('**', '');
    }
    return result;
  };
  
  // ===== HELPER: Format plan with bullet points - NO REGEX =====
  const formatPlanWithBullets = (text) => {
    if (!text || text === 'Not documented') return text;
    
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length === 1) return text;
    
    let hasBullets = false;
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
        hasBullets = true;
        break;
      }
    }
    
    if (hasBullets) {
      return lines.map(line => {
        let clean = line.trim();
        if (clean.startsWith('•') || clean.startsWith('-')) {
          clean = clean.substring(1).trim();
        }
        return `<div class="soap-plan-item" style="padding:2px 0;font-size:13px;color:#475569;">• ${clean}</div>`;
      }).join('');
    }
    
    return lines.map(line => 
      `<div class="soap-plan-item" style="padding:2px 0;font-size:13px;color:#475569;">• ${line.trim()}</div>`
    ).join('');
  };
  
  // ===== EXTRACT ALL SOAP NOTES =====
  const noteBlocks = text.split('---\n').filter(block => block.trim());
  
  let patientName = '';
  let allNotes = [];
  
  // Extract patient name using string methods (no regex)
  const nameIndex = text.indexOf('SOAP Notes for ');
  if (nameIndex !== -1) {
    const start = nameIndex + 'SOAP Notes for '.length;
    const end = text.indexOf('\n', start);
    patientName = text.substring(start, end !== -1 ? end : text.length).trim();
    patientName = removeAsterisks(patientName);
  }
  
  // ===== PARSE ALL NOTES =====
  const parseNote = (block) => {
    // Extract date
    const dateIndex = block.indexOf('📅 ');
    let dateStr = 'Unknown Date';
    let rawDateStr = '';
    
    if (dateIndex !== -1) {
      const start = dateIndex + '📅 '.length;
      const end = block.indexOf('\n', start);
      rawDateStr = block.substring(start, end !== -1 ? end : block.length).trim();
      rawDateStr = removeAsterisks(rawDateStr);
      
      try {
        const date = new Date(rawDateStr);
        if (!isNaN(date.getTime())) {
          dateStr = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          });
        } else {
          dateStr = rawDateStr;
        }
      } catch {
        dateStr = rawDateStr;
      }
    }
    
    // Helper: Extract section content
    const extractSection = (block, sectionName, alternateName, nextMarkers) => {
      let startIndex = block.indexOf(sectionName);
      if (startIndex === -1 && alternateName) {
        startIndex = block.indexOf(alternateName);
      }
      if (startIndex === -1) return 'Not documented';
      
      const contentStart = startIndex + (block.indexOf(sectionName, startIndex) !== -1 ? sectionName : alternateName).length;
      let contentEnd = block.length;
      
      for (const marker of nextMarkers) {
        const pos = block.indexOf(marker, contentStart);
        if (pos !== -1 && pos < contentEnd) {
          contentEnd = pos;
        }
      }
      
      const content = block.substring(contentStart, contentEnd).trim();
      return removeAsterisks(content) || 'Not documented';
    };
    
    const subjective = extractSection(block, 'SUBJECTIVE:', 'Subjective:', ['OBJECTIVE:', 'Objective:', 'ASSESSMENT:', 'Assessment:', 'PLAN:', 'Plan:']);
    const objective = extractSection(block, 'OBJECTIVE:', 'Objective:', ['ASSESSMENT:', 'Assessment:', 'PLAN:', 'Plan:']);
    const assessment = extractSection(block, 'ASSESSMENT:', 'Assessment:', ['PLAN:', 'Plan:']);
    
    // Extract PLAN separately (handles --- separator)
    let plan = 'Not documented';
    const planStart = block.indexOf('PLAN:');
    if (planStart === -1) {
      const lowerStart = block.indexOf('Plan:');
      if (lowerStart !== -1) {
        const contentStart = lowerStart + 'Plan:'.length;
        let contentEnd = block.length;
        const sepPos = block.indexOf('---', contentStart);
        if (sepPos !== -1 && sepPos < contentEnd) {
          contentEnd = sepPos;
        }
        plan = block.substring(contentStart, contentEnd).trim();
        plan = removeAsterisks(plan) || 'Not documented';
      }
    } else {
      const contentStart = planStart + 'PLAN:'.length;
      let contentEnd = block.length;
      const sepPos = block.indexOf('---', contentStart);
      if (sepPos !== -1 && sepPos < contentEnd) {
        contentEnd = sepPos;
      }
      plan = block.substring(contentStart, contentEnd).trim();
      plan = removeAsterisks(plan) || 'Not documented';
    }
    
    return {
      date: dateStr,
      rawDate: rawDateStr,
      subjective: subjective || 'Not documented',
      objective: objective || 'Not documented',
      assessment: assessment || 'Not documented',
      plan: plan || 'Not documented'
    };
  };
  
  // Parse all notes
  if (noteBlocks.length > 0) {
    noteBlocks.forEach(block => {
      if (block.trim()) {
        allNotes.push(parseNote(block));
      }
    });
  }
  
  // ===== FALLBACK: If no notes found, try single note format =====
  if (allNotes.length === 0) {
    const extractSectionFallback = (text, sectionName, alternateName, nextMarkers) => {
      let startIndex = text.indexOf(sectionName);
      if (startIndex === -1 && alternateName) {
        startIndex = text.indexOf(alternateName);
      }
      if (startIndex === -1) return 'Not documented';
      
      const contentStart = startIndex + (text.indexOf(sectionName, startIndex) !== -1 ? sectionName : alternateName).length;
      let contentEnd = text.length;
      
      for (const marker of nextMarkers) {
        const pos = text.indexOf(marker, contentStart);
        if (pos !== -1 && pos < contentEnd) {
          contentEnd = pos;
        }
      }
      
      const content = text.substring(contentStart, contentEnd).trim();
      return removeAsterisks(content) || 'Not documented';
    };
    
    const subjective = extractSectionFallback(text, 'SUBJECTIVE:', 'Subjective:', ['OBJECTIVE:', 'Objective:', 'ASSESSMENT:', 'Assessment:', 'PLAN:', 'Plan:']);
    const objective = extractSectionFallback(text, 'OBJECTIVE:', 'Objective:', ['ASSESSMENT:', 'Assessment:', 'PLAN:', 'Plan:']);
    const assessment = extractSectionFallback(text, 'ASSESSMENT:', 'Assessment:', ['PLAN:', 'Plan:']);
    
    let plan = 'Not documented';
    const planStart = text.indexOf('PLAN:');
    if (planStart === -1) {
      const lowerStart = text.indexOf('Plan:');
      if (lowerStart !== -1) {
        const contentStart = lowerStart + 'Plan:'.length;
        let contentEnd = text.length;
        const sepPos = text.indexOf('---', contentStart);
        if (sepPos !== -1 && sepPos < contentEnd) {
          contentEnd = sepPos;
        }
        plan = text.substring(contentStart, contentEnd).trim();
        plan = removeAsterisks(plan) || 'Not documented';
      }
    } else {
      const contentStart = planStart + 'PLAN:'.length;
      let contentEnd = text.length;
      const sepPos = text.indexOf('---', contentStart);
      if (sepPos !== -1 && sepPos < contentEnd) {
        contentEnd = sepPos;
      }
      plan = text.substring(contentStart, contentEnd).trim();
      plan = removeAsterisks(plan) || 'Not documented';
    }
    
    // Extract date
    const dateIndex = text.indexOf('📅 ');
    let dateStr = 'Unknown Date';
    if (dateIndex !== -1) {
      const start = dateIndex + '📅 '.length;
      const end = text.indexOf('\n', start);
      const rawDate = text.substring(start, end !== -1 ? end : text.length).trim();
      const cleanDate = removeAsterisks(rawDate);
      try {
        const date = new Date(cleanDate);
        if (!isNaN(date.getTime())) {
          dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } else {
          dateStr = cleanDate;
        }
      } catch {
        dateStr = cleanDate;
      }
    }
    
    allNotes.push({
      date: dateStr,
      rawDate: dateStr,
      subjective: subjective || 'Not documented',
      objective: objective || 'Not documented',
      assessment: assessment || 'Not documented',
      plan: plan || 'Not documented'
    });
  }
  
  // ===== GROUP NOTES BY DATE =====
  const groupedNotes = {};
  allNotes.forEach(note => {
    const key = note.date;
    if (!groupedNotes[key]) {
      groupedNotes[key] = [];
    }
    groupedNotes[key].push(note);
  });
  
  const dates = Object.keys(groupedNotes);
  
  // ===== BUILD HTML - EACH DATE AS SEPARATE CARD =====
let cardsHtml = '';

dates.forEach((date, dateIndex) => {
  const notes = groupedNotes[date];
  
  cardsHtml += `
    <div style="background:#FFFFFF;border:1px solid #E5E7EB;border-radius:12px;padding:16px 18px;margin-bottom:${dateIndex < dates.length - 1 ? '16px' : '0'};box-shadow:0 1px 3px rgba(0,0,0,0.04);">
      
      <!-- Date Header -->
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;padding-bottom:8px;border-bottom:2px solid #F1F5F9;">
        <span style="color:#2563EB;">${icons.calendarDays}</span>
        <span style="font-size:14px;font-weight:600;color:#0F172A;">${date}</span>
      </div>
      
      ${notes.map((note, noteIndex) => `
        <!-- Subjective -->
        <div style="margin-bottom:${noteIndex < notes.length - 1 ? '16px' : '0'};">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
            <div style="width:28px;height:28px;border-radius:50%;background:#DBEAFE;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <span style="color:#2563EB;font-weight:700;font-size:13px;">S</span>
            </div>
            <span style="font-weight:700;font-size:13px;color:#0F172A;">Subjective</span>
          </div>
          <div style="height:1px;background:#E5E7EB;margin:0 0 6px 0;"></div>
          <div style="font-size:13px;color:#475569;line-height:1.6;padding-left:4px;">${note.subjective}</div>
        </div>
        
        <!-- Objective -->
        <div style="margin-top:12px;margin-bottom:${noteIndex < notes.length - 1 ? '16px' : '0'};">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
            <div style="width:28px;height:28px;border-radius:50%;background:#EDE9FE;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <span style="color:#7C3AED;font-weight:700;font-size:13px;">O</span>
            </div>
            <span style="font-weight:700;font-size:13px;color:#0F172A;">Objective</span>
          </div>
          <div style="height:1px;background:#E5E7EB;margin:0 0 6px 0;"></div>
          <div style="font-size:13px;color:#475569;line-height:1.6;padding-left:4px;">${note.objective}</div>
        </div>
        
        <!-- Assessment -->
        <div style="margin-top:12px;margin-bottom:${noteIndex < notes.length - 1 ? '16px' : '0'};">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
            <div style="width:28px;height:28px;border-radius:50%;background:#FEF3C7;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <span style="color:#D97706;font-weight:700;font-size:13px;">A</span>
            </div>
            <span style="font-weight:700;font-size:13px;color:#0F172A;">Assessment</span>
          </div>
          <div style="height:1px;background:#E5E7EB;margin:0 0 6px 0;"></div>
          <div style="font-size:13px;color:#475569;line-height:1.6;padding-left:4px;">${note.assessment}</div>
        </div>
        
        <!-- Plan -->
        <div style="margin-top:12px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
            <div style="width:28px;height:28px;border-radius:50%;background:#D1FAE5;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <span style="color:#059669;font-weight:700;font-size:13px;">P</span>
            </div>
            <span style="font-weight:700;font-size:13px;color:#0F172A;">Plan</span>
          </div>
          <div style="height:1px;background:#E5E7EB;margin:0 0 6px 0;"></div>
          <div style="font-size:13px;color:#475569;line-height:1.6;padding-left:4px;">${formatPlanWithBullets(note.plan)}</div>
        </div>
      `).join('')}
      
    </div>
  `;
});
  // ===== WRAP EVERYTHING =====
  return `
    <div style="background:#FFFFFF;border-radius:16px;border:1px solid #E5E7EB;padding:16px 20px;margin:4px 0;box-shadow:0 1px 3px rgba(0,0,0,0.04);">
      <!-- Main Header -->
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;padding-bottom:10px;border-bottom:2px solid #F1F5F9;">
        <span style="color:#2563EB;">${icons.notebookPen}</span>
        <span style="font-size:16px;font-weight:700;color:#0F172A;">SOAP Notes${patientName ? ' for ' + patientName : ''}</span>
        <span style="margin-left:auto;font-size:11px;color:#94A3B8;background:#F1F5F9;padding:2px 10px;border-radius:10px;">${dates.length} note${dates.length > 1 ? 's' : ''}</span>
      </div>
      
      ${cardsHtml}
    </div>
  `;
}

function formatPrescription(text) {
  // Extract patient name
  const patientMatch = text.match(/Prescription generated for ([^\n]+)/);
  const patientName = patientMatch ? patientMatch[1].trim() : 'Patient';
  
  // Extract prescription details
  const medMatch = text.match(/Medication:\s*([^\n]+)/);
  const dosageMatch = text.match(/Dosage:\s*([^\n]+)/);
  const frequencyMatch = text.match(/Frequency:\s*([^\n]+)/);
  const durationMatch = text.match(/Duration:\s*([^\n]+)/);
  const routeMatch = text.match(/Route:\s*([^\n]+)/);
  const instructionsMatch = text.match(/Instructions:\s*([^\n]+)/);
  
  // Lucide Icons as SVG (compact)
  const icons = {
    fileRx: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
    pill: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.5 20.5 3.5 13.5a4.95 4.95 0 0 1 0-7l2-2a4.95 4.95 0 0 1 7 0l7 7a4.95 4.95 0 0 1 0 7l-2 2a4.95 4.95 0 0 1-7 0Z"/><path d="m8.5 8.5 7 7"/></svg>`,
    ruler: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2.5 2.5 21.5"/><path d="M15 8.5 8.5 15"/><path d="M19 12.5 12.5 19"/><path d="M10 6.5 6.5 10"/><path d="M16 4.5 4.5 16"/></svg>`,
    clock: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    check: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`,
    route: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4h18"/><path d="M7 4v16"/><path d="M17 4v16"/><path d="M3 20h18"/><line x1="12" y1="9" x2="12" y2="15"/></svg>`
  };
  
  // Build compact rows
  let rows = '';
  
  const rowData = [
    { match: medMatch, label: 'Medication', icon: icons.pill, iconClass: 'blue', value: medMatch ? medMatch[1].trim().replace(/\\*\\*/g, '').replace(/\\*/g, '').trim() : '' },
    { match: dosageMatch, label: 'Dosage', icon: icons.ruler, iconClass: 'purple', value: dosageMatch ? dosageMatch[1].trim().replace(/\\*\\*/g, '').replace(/\\*/g, '').trim() : '' },
    { match: frequencyMatch, label: 'Frequency', icon: icons.clock, iconClass: 'teal', value: frequencyMatch ? frequencyMatch[1].trim().replace(/\\*\\*/g, '').replace(/\\*/g, '').trim() : '' },
    { match: durationMatch, label: 'Duration', icon: icons.calendar, iconClass: 'green', value: durationMatch ? durationMatch[1].trim().replace(/\\*\\*/g, '').replace(/\\*/g, '').trim() : '' },
    { match: routeMatch, label: 'Route', icon: icons.route, iconClass: 'orange', value: routeMatch ? routeMatch[1].trim().replace(/\\*\\*/g, '').replace(/\\*/g, '').trim() : '' }
  ];
  
  rowData.forEach(row => {
    if (row.match) {
      rows += `
        <div class="prescription-row-compact">
          <div class="prescription-row-left-compact">
            <div class="prescription-row-icon-compact ${row.iconClass}">
              ${row.icon}
            </div>
            <div class="prescription-row-content-compact">
              <div class="prescription-row-label-compact">${row.label}</div>
              <div class="prescription-row-value-compact">${row.value}</div>
            </div>
          </div>
        </div>
      `;
    }
  });
  
  // Add instructions if present
  if (instructionsMatch) {
    rows += `
      <div class="prescription-row-compact instructions-row-compact">
        <div class="prescription-row-left-compact">
          <div class="prescription-row-icon-compact gray">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
          </div>
          <div class="prescription-row-content-compact">
            <div class="prescription-row-label-compact">Instructions</div>
            <div class="prescription-row-value-compact instructions-value-compact">${instructionsMatch[1].trim()}</div>
          </div>
        </div>
      </div>
    `;
  }
  
  // Build the full compact card
  return `
    <div class="prescription-card-compact">
      <div class="prescription-header-compact">
        <div class="prescription-header-left-compact">
          <div class="prescription-header-icon-compact">${icons.fileRx}</div>
          <div>
            <div class="prescription-header-title-compact">Prescription Details</div>
            <div class="prescription-header-subtitle-compact">Added to ${patientName}'s record</div>
          </div>
        </div>
      </div>
      
      <div class="prescription-divider-compact"></div>
      
      <div class="prescription-rows-compact">
        ${rows}
      </div>
      
      <div class="prescription-success-compact">
        <span class="prescription-success-icon-compact">${icons.check}</span>
        <span>Saved to ${patientName}'s record</span>
      </div>
    </div>
  `;
}

function formatAppointment(text) {
  const lines = text.split('\n');
  const appointmentLines = lines.filter(line => line.includes('•') || line.includes('scheduled'));
  
  let result = `
    <div class="message-section appointment-section">
      <div class="section-header">
        <span class="section-icon">📅</span>
        <span class="section-title">Appointments</span>
        <span class="appointment-count">${appointmentLines.length}</span>
      </div>
      <div class="appointment-timeline">
  `;
  
  appointmentLines.forEach(line => {
    const dateMatch = line.match(/(\d{4}-\d{2}-\d{2})/);
    const timeMatch = line.match(/(\d{1,2}:\d{2}\s*(?:AM|PM))/);
    const reasonMatch = line.match(/-\s*([^-]+)$/);
    
    const date = dateMatch ? dateMatch[1] : 'Unknown';
    const time = timeMatch ? timeMatch[1] : 'Unknown';
    const reason = reasonMatch ? reasonMatch[1].trim() : 'Appointment';
    
    result += `
      <div class="appointment-item">
        <div class="appointment-date-badge">
          <span class="appointment-day">${new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
          <span class="appointment-date">${date}</span>
        </div>
        <div class="appointment-details">
          <div class="appointment-time">${time}</div>
          <div class="appointment-reason">${reason}</div>
        </div>
      </div>
    `;
  });
  
  result += `
      </div>
    </div>
  `;
  
  return result;
}

function formatMedicalAdvice(text) {
  let result = `
    <div class="message-section medical-advice-section">
      <div class="section-header">
        <span class="section-icon">🏥</span>
        <span class="section-title">Medical Analysis</span>
      </div>
  `;
  
  const diagnosisMatch = text.match(/(?:DIAGNOSIS|Diagnosis)[:\s]*([\s\S]*?)(?=RED FLAGS|WARNINGS|TREATMENT|Treatment|$)/i);
  if (diagnosisMatch) {
    result += `
      <div class="medical-section diagnosis-section">
        <div class="medical-section-header">
          <span class="medical-section-icon">🩺</span>
          <span class="medical-section-label">Diagnosis</span>
        </div>
        <div class="medical-section-content">${formatBulletPoints(diagnosisMatch[1].trim())}</div>
      </div>
    `;
  }
  
  const flagsMatch = text.match(/(?:RED FLAGS|WARNINGS)[:\s]*([\s\S]*?)(?=TREATMENT|Treatment|TESTS|Tests|FOLLOW-UP|$)/i);
  if (flagsMatch) {
    result += `
      <div class="medical-section warning-section">
        <div class="medical-section-header">
          <span class="medical-section-icon">⚠️</span>
          <span class="medical-section-label">Red Flags</span>
        </div>
        <div class="medical-section-content">${formatBulletPoints(flagsMatch[1].trim())}</div>
      </div>
    `;
  }
  
  const treatmentMatch = text.match(/(?:TREATMENT|Treatment)[:\s]*([\s\S]*?)(?=TESTS|Tests|FOLLOW-UP|Follow-up|$)/i);
  if (treatmentMatch) {
    result += `
      <div class="medical-section treatment-section">
        <div class="medical-section-header">
          <span class="medical-section-icon">💊</span>
          <span class="medical-section-label">Treatment</span>
        </div>
        <div class="medical-section-content">${formatBulletPoints(treatmentMatch[1].trim())}</div>
      </div>
    `;
  }
  
  const testsMatch = text.match(/(?:TESTS|Tests)[:\s]*([\s\S]*?)(?=FOLLOW-UP|Follow-up|$)/i);
  if (testsMatch) {
    result += `
      <div class="medical-section tests-section">
        <div class="medical-section-header">
          <span class="medical-section-icon">🔬</span>
          <span class="medical-section-label">Recommended Tests</span>
        </div>
        <div class="medical-section-content">${formatBulletPoints(testsMatch[1].trim())}</div>
      </div>
    `;
  }
  
  const followupMatch = text.match(/(?:FOLLOW-UP|Follow-up)[:\s]*([\s\S]*?)$/i);
  if (followupMatch) {
    result += `
      <div class="medical-section followup-section">
        <div class="medical-section-header">
          <span class="medical-section-icon">📋</span>
          <span class="medical-section-label">Follow-up</span>
        </div>
        <div class="medical-section-content">${formatBulletPoints(followupMatch[1].trim())}</div>
      </div>
    `;
  }
  
  result += `</div>`;
  return result;
}

function formatBulletPoints(text) {
  let formatted = text;
  
  formatted = formatted.replace(/[●•]\s*([^●•\n]+)/g, (match, content) => {
    const confidenceMatch = content.match(/(\d+)%/);
    if (confidenceMatch) {
      return `<div class="bullet-item confidence-item">
                <span class="bullet-dot"></span>
                <span class="bullet-text">${content.trim()}</span>
                <span class="confidence-badge">${confidenceMatch[1]}%</span>
              </div>`;
    }
    return `<div class="bullet-item">
              <span class="bullet-dot"></span>
              <span class="bullet-text">${content.trim()}</span>
            </div>`;
  });
  
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  formatted = formatted.replace(/\n/g, '<br/>');
  
  return formatted;
}

function formatDefault(text) {
  let formatted = text;
  
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  formatted = formatted.replace(/[●•]\s*([^●•\n]+)/g, 
    '<div class="bullet-item"><span class="bullet-dot"></span><span class="bullet-text">$1</span></div>'
  );
  formatted = formatted.replace(/\n/g, '<br/>');
  formatted = formatted.replace(/(<br\/>\s*){3,}/g, '<br/><br/>');
  
  return formatted;
}

export const renderMedicalBadge = (type, text) => {
  const badges = {
    diagnosis: { class: 'badge-diagnosis', icon: '🩺' },
    treatment: { class: 'badge-treatment', icon: '💊' },
    warning: { class: 'badge-warning', icon: '⚠️' },
    test: { class: 'badge-test', icon: '🔬' },
    followup: { class: 'badge-followup', icon: '📋' },
    confidence: { class: 'badge-confidence', icon: '📊' },
    patient: { class: 'badge-patient', icon: '👤' },
    appointment: { class: 'badge-appointment', icon: '📅' },
    prescription: { class: 'badge-prescription', icon: '💊' },
  };
  
  const badge = badges[type] || badges.diagnosis;
  return `<span class="medical-badge ${badge.class}">${badge.icon} ${text}</span>`;
};

export const formatPatientCard = (patient) => {
  if (!patient) return '';
  
  return `
    <div class="patient-card">
      <div class="patient-card-header">
        <span class="patient-card-icon">👤</span>
        <span class="patient-card-name">${patient.name || 'Unknown Patient'}</span>
      </div>
      <div class="patient-card-details">
        <div class="patient-detail-row">
          <span class="detail-label">MRN:</span>
          <span class="detail-value">${patient.mrn || 'N/A'}</span>
        </div>
        <div class="patient-detail-row">
          <span class="detail-label">Age:</span>
          <span class="detail-value">${patient.age || 'N/A'}</span>
        </div>
        <div class="patient-detail-row">
          <span class="detail-label">Gender:</span>
          <span class="detail-value">${patient.gender || 'N/A'}</span>
        </div>
        ${patient.conditions && patient.conditions.length > 0 ? `
          <div class="patient-detail-row">
            <span class="detail-label">Conditions:</span>
            <span class="detail-value conditions-list">
              ${patient.conditions.map(c => `<span class="condition-tag">${c}</span>`).join(' ')}
            </span>
          </div>
        ` : ''}
        ${patient.allergies && patient.allergies.length > 0 ? `
          <div class="patient-detail-row">
            <span class="detail-label">Allergies:</span>
            <span class="detail-value">
              ${patient.allergies.map(a => `<span class="allergy-tag">${a}</span>`).join(' ')}
            </span>
          </div>
        ` : ''}
      </div>
    </div>
  `;
};


// ========================================
// HELPER FUNCTIONS FOR IMAGING REPORT
// ========================================

// ✅ Helper: Format image type
function formatImageType(type) {
    if (!type) return 'Unknown';
    const map = {
        'chest_xray': 'Chest X-ray',
        'ct_scan': 'CT Scan',
        'mri': 'MRI Scan',
        'ecg': 'ECG',
        'retinal': 'Retinal Scan',
        'ultrasound': 'Ultrasound',
        'mammogram': 'Mammogram',
        'fluoroscopy': 'Fluoroscopy',
        'pet': 'PET Scan',
        'spect': 'SPECT Scan'
    };
    return map[type] || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// ✅ Helper: Format date
function formatReportDate(dateString) {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        }) + ' • ' + date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    } catch {
        return dateString;
    }
}


// ========================================
// STRUCTURED IMAGING REPORT FORMATTER
// With Lucide Icons (NO EMOJIS!)
// ========================================

// ========================================
// STRUCTURED IMAGING REPORT FORMATTER
// With Lucide Icons (NO EMOJIS!)
// ========================================

export const formatStructuredImagingReport = (data) => {
  const { patientName, imageType, date, findings, impression, recommendations, doctorNotes, confidence } = data;

  // Lucide Icons
  const iconFileText = icons.fileText;
  const iconSearch = icons.search;
  const iconNotebookPen = icons.notebookPen;
  const iconCheckCircle = icons.checkCircle;
  const iconRefreshCw = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`;

  // ✅ FIXED: toBulletPoints function
  const toBulletPoints = (text) => {
    // If empty or placeholder, return as-is
    if (!text || 
        text === "No findings documented" || 
        text === "Not documented" || 
        text === "No recommendations provided" || 
        text === "No doctor notes added") {
      return text;
    }
    
    // Split by periods that end a sentence (followed by space or newline)
    const sentences = text.split(/(?<=\.)\s+/).filter(s => s.trim());
    
    // If only one sentence or no periods, return as-is
    if (sentences.length <= 1) {
      return text;
    }
    
    // Convert each sentence to a bullet point
    return sentences.map(s => `• ${s.trim()}`).join("\n");
  };

  // ✅ FIXED: renderSection function (properly defined)
  const renderSection = (title, icon, content, color, bgColor, sectionKey) => {
    const bulletContent = toBulletPoints(content);
    const lines = bulletContent.split("\n").filter(line => line.trim());
    const isEmpty = !content || content === "No findings documented" || content === "Not documented" || content === "No recommendations provided" || content === "No doctor notes added";

    return `
      <div style="margin-bottom:12px;border-radius:8px;border:1px solid ${color}40;overflow:hidden;">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:${bgColor};border-bottom:1px solid ${color}40;">
          <div style="display:flex;align-items:center;gap:6px;">
            <span style="font-size:11px;font-weight:600;color:#0F172A;">${icon} ${title}</span>
          </div>
          <button 
            class="imaging-edit-btn" 
            data-section="${sectionKey}" 
            style="font-size:9px;color:${color};background:white;border:1px solid ${color}40;padding:2px 10px;border-radius:4px;cursor:pointer;font-weight:500;"
          >
            ✎ Edit
          </button>
        </div>
        <div style="padding:8px 12px;background:white;">
          ${isEmpty ? `<div style="font-size:10px;color:#94A3B8;padding:4px 0;">${content || "No content added"}</div>` : lines.map(line => `<div style="padding:2px 0;font-size:10px;color:#1E293B;">${line}</div>`).join("")}
        </div>
      </div>
    `;
  };

  return `
    <div class="imaging-report-premium" style="background:#FFFFFF;border-radius:12px;border:1px solid #E5E7EB;box-shadow:0 1px 3px rgba(0,0,0,0.04);overflow:hidden;margin:4px 0;">
      
      <!-- HEADER -->
      <div style="padding:12px 16px;background:#F8FAFC;border-bottom:1px solid #E5E7EB;">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <!-- SINGLE ICON in circle -->
            <div style="width:28px;height:28px;border-radius:50%;background:#EFF6FF;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              ${iconFileText}
            </div>
            <div>
              <!-- NO duplicate icon here -->
              <div style="font-size:13px;font-weight:600;color:#0F172A;">Imaging Report – ${patientName}</div>
              <div style="font-size:10px;color:#64748B;">
                ${formatImageType(imageType)} ${date ? "• " + formatReportDate(date) : ""}
              </div>
            </div>
          </div>
          ${confidence ? `<span style="font-size:9px;padding:2px 8px;border-radius:10px;background:#F0FDF4;color:#22C55E;border:1px solid #BBF7D0;">${iconCheckCircle} ${confidence}%</span>` : ""}
        </div>
      </div>

      <!-- BODY SECTIONS -->
      <div style="padding:12px 16px;">
        ${renderSection("Findings", iconSearch, findings, "#2563EB", "#EFF6FF", "findings")}
        ${renderSection("Impression", iconNotebookPen, impression, "#8B5CF6", "#FAF5FF", "impression")}
        ${renderSection("Recommendations", iconFileText, recommendations, "#F59E0B", "#FFFBEB", "recommendations")}
        ${renderSection("Doctor Notes", iconNotebookPen, doctorNotes, "#64748B", "#F8FAFC", "doctor_notes")}
      </div>

      <!-- FOOTER -->
      <div style="padding:8px 16px;background:#F8FAFC;border-top:1px solid #9CA3AF;display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:9px;color:#64748B;cursor:pointer;">← Previous Report</span>
        <span style="font-size:9px;color:#64748B;cursor:pointer;">Next Report →</span>
      </div>
    </div>
  `;
};

// ========================================
// PATIENT LIST FORMATTER
// ========================================

function formatPatientList(text) {
  const lines = text.split('\n');
  const patientLines = lines.filter(line => line.includes('•') || line.includes('MRN'));
  const count = patientLines.length;
  
  let result = `
    <div class="patient-list-wrapper">
      <div class="patient-list-header">
        <span class="patient-list-icon">👥</span>
        <span class="patient-list-title">Recent Patients</span>
      </div>
      <div class="patient-list-subheader">Here are the latest ${count} patients</div>
      <div class="patient-list-container">
  `;
  
  patientLines.forEach(line => {
    const nameMatch = line.match(/•\s*([^(]+?)\s*\(/);
    const mrnMatch = line.match(/MRN:\s*([^,)]+)/);
    const ageMatch = line.match(/Age:\s*(\d+)/);
    
    const name = nameMatch ? nameMatch[1].trim() : 'Unknown';
    const mrn = mrnMatch ? mrnMatch[1].trim() : 'N/A';
    const age = ageMatch ? ageMatch[1] : 'N/A';
    
    const initials = name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
    
    result += `
      <div class="patient-row" onclick="window.directSelectPatient('${name}')">
        <div class="patient-row-avatar">
          <span class="patient-row-initials">${initials}</span>
        </div>
        <div class="patient-row-info">
          <div class="patient-row-name">${name}</div>
          <div class="patient-row-meta">${mrn} • ${age} Years</div>
        </div>
        <div class="patient-row-chevron">›</div>
      </div>
    `;
  });
  
  result += `
      </div>
      <div class="patient-list-footer">Showing recent patients</div>
      <div class="quick-tip-box">
        <div class="quick-tip-header">💡 Quick Tip</div>
        <div class="quick-tip-content">
          You can find any patient by typing:
          <div class="quick-tip-examples">
            <span class="example-pill" onclick="window.directSetInput('Show me [patient name]')">Show me [patient name]</span>
            <span class="example-pill" onclick="window.directSetInput('Find MRN001')">Find MRN001</span>
            <span class="example-pill" onclick="window.directSetInput('Search phone number')">Search phone number</span>
          </div>
        </div>
      </div>
    </div>
  `;
  
  return result;
}

// ========================================
// CLINICAL ANALYSIS FORMATTER (PREMIUM)
// With Lucide icons, colors, and proper styling
// ========================================

function formatClinicalAnalysisFromJSON(data) {
  // Icon mapping with proper Lucide icons
  const iconMap = {
    'summary': icons.layoutDashboard,
    'critical_issues': icons.triangleAlert,
    'prescription_recommendations': icons.pill,
    'test_recommendations': icons.flaskConical,
    'follow_up_recommendations': icons.calendarDays,
    'warnings': icons.shieldAlert,
    'what_is_good': icons.badgeCheck,
    'action_items': icons.clipboardCheck,
    'overall_status': icons.activity,
    'disclaimer': icons.info,
  };

  const sectionColors = {
    'critical_issues': '#EF4444',
    'prescription_recommendations': '#2563EB',
    'test_recommendations': '#8B5CF6',
    'follow_up_recommendations': '#F59E0B',
    'warnings': '#F59E0B',
    'what_is_good': '#22C55E',
    'action_items': '#2563EB',
  };

  const sectionBgColors = {
    'critical_issues': '#FEF2F2',
    'prescription_recommendations': '#EFF6FF',
    'test_recommendations': '#F5F3FF',
    'follow_up_recommendations': '#FFFBEB',
    'warnings': '#FFFBEB',
    'what_is_good': '#F0FDF4',
    'action_items': '#EFF6FF',
  };

  const sectionTitles = {
    'summary': 'Summary',
    'critical_issues': 'Critical Issues',
    'prescription_recommendations': 'Prescription Recommendations',
    'test_recommendations': 'Test Recommendations',
    'follow_up_recommendations': 'Follow-up Plan',
    'warnings': 'Warnings',
    'what_is_good': 'Positive Findings',
    'action_items': 'Action Items',
    'overall_status': 'Overall Status',
    'disclaimer': 'Disclaimer'
  };

  let html = `
    <div style="background:#FFFFFF;border-radius:16px;border:1px solid #E5E7EB;box-shadow:0 4px 12px rgba(0,0,0,0.05);overflow:hidden;margin:4px 0;padding:0;">
      
      <!-- HEADER -->
      <div style="padding:16px 20px 12px 20px;background:linear-gradient(135deg, #F8FAFC, #F1F5F9);border-bottom:2px solid #E5E7EB;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;background:#2563EB;border-radius:8px;color:white;flex-shrink:0;">
            <span>${icons.layoutDashboard}</span>
          </div>
          <div>
            <div style="font-size:15px;font-weight:700;color:#0F172A;">${data.title || 'COMPREHENSIVE PATIENT ANALYSIS'}</div>
            <div style="font-size:11px;color:#64748B;">AI-generated clinical decision support</div>
          </div>
        </div>
      </div>
      
      <div style="padding:16px 20px;">
  `;

  // SUMMARY
  if (data.summary) {
    html += `
      <div style="margin-bottom:16px;padding:12px 16px;background:#F8FAFC;border-radius:8px;border-left:3px solid #2563EB;">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
          <span style="color:#2563EB;">${icons.layoutDashboard}</span>
          <span style="font-size:11px;font-weight:600;color:#64748B;">Summary</span>
        </div>
        <div style="font-size:13px;color:#1E293B;line-height:1.6;">${data.summary}</div>
      </div>
    `;
  }

  // SECTIONS
  const sectionKeys = ['critical_issues', 'prescription_recommendations', 'test_recommendations', 'follow_up_recommendations', 'warnings', 'what_is_good', 'action_items'];
  
  for (const key of sectionKeys) {
    if (data[key] && data[key].length > 0) {
      const icon = iconMap[key] || '';
      const title = sectionTitles[key] || key;
      const color = sectionColors[key] || '#64748B';
      const bgColor = sectionBgColors[key] || '#F8FAFC';
      const items = data[key].map(item => `
        <div style="display:flex;align-items:flex-start;gap:8px;padding:4px 0;font-size:13px;color:#1E293B;line-height:1.5;">
          <span style="color:${color};font-weight:bold;">•</span>
          <span>${item}</span>
        </div>
      `).join('');
      
      html += `
        <div style="margin-bottom:14px;padding:12px 14px;background:${bgColor};border-radius:8px;border-left:3px solid ${color};">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
            <span style="color:${color};">${icon}</span>
            <span style="font-size:12px;font-weight:600;color:#0F172A;">${title}</span>
          </div>
          <div style="padding-left:4px;">
            ${items}
          </div>
        </div>
      `;
    }
  }

  // OVERALL STATUS
  if (data.overall_status) {
    const statusColors = {
      'critical': { color: '#EF4444', bg: '#FEF2F2', label: 'CRITICAL' },
      'high': { color: '#EF4444', bg: '#FEF2F2', label: 'HIGH RISK' },
      'medium': { color: '#F59E0B', bg: '#FFFBEB', label: 'MEDIUM RISK' },
      'low': { color: '#22C55E', bg: '#F0FDF4', label: 'LOW RISK' },
      'stable': { color: '#22C55E', bg: '#F0FDF4', label: 'STABLE' }
    };
    const status = statusColors[data.overall_status] || statusColors['medium'];
    html += `
      <div style="margin-top:16px;padding:12px 16px;background:${status.bg};border-radius:8px;border:1px solid ${status.color}30;display:flex;align-items:center;justify-content:space-between;">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="color:${status.color};">${icons.activity}</span>
          <span style="font-size:12px;font-weight:600;color:#64748B;">Overall Status:</span>
          <span style="font-size:14px;font-weight:700;color:${status.color};">${status.label}</span>
        </div>
        <div style="width:60px;height:6px;background:#E5E7EB;border-radius:3px;overflow:hidden;">
          <div style="width:${data.overall_status === 'critical' ? '100' : data.overall_status === 'high' ? '75' : data.overall_status === 'medium' ? '50' : data.overall_status === 'low' ? '25' : '10'}%;height:100%;background:${status.color};border-radius:3px;"></div>
        </div>
      </div>
    `;
  }

  // DISCLAIMER
  if (data.disclaimer) {
    html += `
      <div style="margin-top:16px;padding:10px 14px;background:#F8FAFC;border-radius:8px;display:flex;align-items:flex-start;gap:6px;">
        <span style="color:#94A3B8;margin-top:1px;">${icons.info}</span>
        <span style="font-size:10px;color:#94A3B8;line-height:1.4;">${data.disclaimer}</span>
      </div>
    `;
  }

  html += `
      </div>
    </div>
  `;

  return html;
}

// ========================================
// GLOBAL CLICK HANDLER FOR ANALYZE BUTTON
// ========================================



export { icons };