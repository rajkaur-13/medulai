// ========================================
// PREMIUM MEDICAL MESSAGE FORMATTER
// Complete rewrite with Lucide icons & structured content
// ========================================

/**
 * Format medical messages with structured sections, badges, and premium styling
 * All information is preserved - only presentation changes
 */
export const formatMedicalMessage = (text, isUser = false) => {
  if (isUser) {
    // User messages - just escape and return
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  // ✅ FIX: If message already contains HTML, return it as-is
  if (text.includes('<br/>') || text.includes('<strong>') || text.includes('<div')) {
    return text;
  }
  
  let formatted = text;
  
  // ===== STEP 1: DETECT CONTENT TYPE =====
  const isPatientList = formatted.includes('Found') && formatted.includes('patients in your clinic');
  const isPatientSelected = formatted.includes('Patient Selected:') || formatted.includes('✓ Patient Selected') || formatted.includes('Patient Summary:');
  const isSOAPNote = formatted.includes('SUBJECTIVE:') || formatted.includes('SUBJECTIVE') || formatted.includes('Objective:') || formatted.includes('SOAPNote') || formatted.includes('SOAP Notes for');
  const isPrescription = formatted.includes('Prescription generated') || 
                         (formatted.includes('Medication:') && formatted.includes('Dosage:'));
  const isAppointment = formatted.includes('Appointment') && formatted.includes('scheduled');
  const isMedicalAdvice = formatted.includes('Diagnosis') || formatted.includes('Treatment') || formatted.includes('Red Flags');
  
  // ✅ NEW: Detect section view responses
  const isSectionView = formatted.includes('Active Medications for') || 
                        formatted.includes('Active Prescriptions for') ||
                        formatted.includes('All Prescriptions for') ||
                        formatted.includes('All Prescriptions for') ||
                        formatted.includes('Imaging Reports for') ||
                        formatted.includes('Upcoming Appointments for') ||
                        formatted.includes('No active medications') ||
                        formatted.includes('No active prescriptions') ||
                        formatted.includes('No imaging reports found') ||
                        formatted.includes('No upcoming appointments');
  
  // ===== STEP 2: PATIENT LIST =====
  if (isPatientList) {
    return formatPatientList(formatted);
  }
  
  // ===== STEP 3: PRESCRIPTION =====
  if (isPrescription) {
    return formatPrescription(formatted);
  }
  
  // ===== STEP 4: PATIENT SELECTED =====
  if (isPatientSelected) {
    return formatPatientSelected(text);
  }
  
  // ===== STEP 5: SECTION VIEW (NEW) =====
  if (isSectionView) {
    return formatSectionView(formatted);
  }
  
  // ===== STEP 6: SOAP NOTE =====
  if (isSOAPNote) {
    return formatSOAPNote(formatted);
  }
  
  // ===== STEP 7: APPOINTMENT =====
  if (isAppointment) {
    return formatAppointment(formatted);
  }
  
  // ===== STEP 8: MEDICAL ADVICE =====
  if (isMedicalAdvice) {
    return formatMedicalAdvice(formatted);
  }
  
  // ===== STEP 8: DEFAULT =====
  return formatDefault(formatted);
};

// ========================================
// ICON HELPERS
// ========================================

const icons = {
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

function formatPatientSelected(text) {
  // ===== EXTRACT PATIENT DATA FROM TEXT =====
  // First, try to extract from the text using patterns
  let patientName = 'Patient';
  let mrn = 'N/A', age = 'N/A', gender = 'N/A';
  let allergies = 'None', conditions = 'None';
  let medications = [];
  let soapNotes = [];
  let prescriptions = [];
  let images = [];
  let appointments = [];
  
  // Extract patient name
  let nameMatch = text.match(/Patient Selected:\s*([^\n]+)/);
  if (nameMatch) {
    patientName = nameMatch[1].trim().replace(/\*\*/g, '');
  }
  
  if (!nameMatch) {
    nameMatch = text.match(/Patient Summary:\s*([^\n]+)/);
    if (nameMatch) {
      patientName = nameMatch[1].trim().replace(/\*\*/g, '');
    }
  }
  
  // Extract demographics
  const demoMatch = text.match(/Demographics:\s*([^\n]+)/);
  if (demoMatch) {
    const parts = demoMatch[1].split('|').map(s => s.trim());
    parts.forEach(part => {
      if (part.includes('MRN:')) mrn = part.replace('MRN:', '').trim();
      if (part.includes('Age:')) age = part.replace('Age:', '').trim();
      if (part.includes('Gender:')) gender = part.replace('Gender:', '').trim();
    });
  }
  
  // Extract medical history
  const historyMatch = text.match(/Medical History:\s*([^\n]+)/);
  if (historyMatch) {
    const historyText = historyMatch[1];
    const allergyMatch = historyText.match(/Allergies:\s*([^|]+)/);
    const conditionMatch = historyText.match(/Conditions:\s*([^|]+)/);
    if (allergyMatch) allergies = allergyMatch[1].trim() || 'None';
    if (conditionMatch) conditions = conditionMatch[1].trim() || 'None';
  }
  
  // Extract medications
  const medsMatch = text.match(/Current Medications:\s*([^\n]+)/);
  if (medsMatch) {
    const medsText = medsMatch[1].trim();
    if (medsText !== 'None' && medsText !== '') {
      medications = medsText.split(',').map(m => m.trim().replace(/\*\*/g, '').trim()).filter(m => m !== 'None' && m !== '');
    }
  }
  
  // Extract SOAP notes count
  let soapCount = 0;
  if (text.includes('No SOAP notes') || text.includes('No SOAP notes yet')) {
    soapCount = 0;
  } else {
    const soapSection = text.match(/SOAP Notes?\s*\((\d+)\)/i);
    if (soapSection) {
      soapCount = parseInt(soapSection[1]);
    }
    if (soapCount === 0) {
      const soapContent = text.match(/Latest SOAP Note:\s*\n?\s*([^\n]+)/i);
      if (soapContent && !soapContent[1].includes('No SOAP notes')) {
        soapCount = 1;
      }
    }
  }
  
  // Extract prescriptions count
  let rxCount = 0;
  const noRxMatch = text.match(/No prescriptions yet/i);
  if (!noRxMatch) {
    const rxSection = text.match(/Prescriptions?\s*\((\d+)\)/i);
    if (rxSection) {
      rxCount = parseInt(rxSection[1]);
    }
  }
  
  // Extract appointments count
  let aptCount = 0;
  if (!text.includes('No appointments scheduled') && !text.includes('No upcoming appointments')) {
    const aptSection = text.match(/Appointments?\s*\((\d+)\)/i);
    if (aptSection) {
      aptCount = parseInt(aptSection[1]);
    }
  }
  
  // Extract imaging reports count
  let imgCount = 0;
  const noImgMatch = text.match(/No images analyzed yet/i);
  if (!noImgMatch) {
    const imgSection = text.match(/Imaging Reports?\s*\((\d+)\)/i);
    if (imgSection) {
      imgCount = parseInt(imgSection[1]);
    }
  }
  
  // ===== BUILD THE NEW CARD =====
  const allergyList = allergies !== 'None' ? allergies.split(',').map(a => a.trim()).filter(a => a !== '') : [];
  const conditionList = conditions !== 'None' ? conditions.split(',').map(c => c.trim()).filter(c => c !== '') : [];
  
  // Get first 3 medications
  const displayMeds = medications.slice(0, 3);
  const medMore = medications.length > 3 ? medications.length - 3 : 0;
  
  // Build the card
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
            <div class="identity-name">${patientName.replace(/\*\*/g, '')}</div>
            <div class="identity-meta">${mrn.replace(/\*\*/g, '')} • ${gender.replace(/\*\*/g, '')} • ${age.replace(/\*\*/g, '')} Years</div>
            <div class="identity-since">Patient Since ${new Date().getFullYear() - 1}</div>
          </div>
        </div>
        
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
              <span class="snapshot-section-icon">💊</span>
              <span class="snapshot-section-title">Active Medications</span>
              <span class="snapshot-section-count">${medications.length}</span>
            </div>
            <div class="snapshot-section-action">
              ${medications.length > 3 ? `+${medMore} Medications` : ''}
              <span class="action-chevron">${icons.chevronRight}</span>
            </div>
          </div>
          <div class="snapshot-section-items">
            ${displayMeds.length > 0 ? displayMeds.map(m => `<div class="snapshot-section-item">• ${m.replace(/\*\*/g, '').trim()}</div>`).join('') : `<div class="snapshot-section-empty">No active medications</div>`}
          </div>
        </div>
        
        <!-- Active Prescriptions -->
        <div class="snapshot-section" onclick="window.viewSection('prescriptions', '${patientName}')">
          <div class="snapshot-section-header">
            <div class="snapshot-section-left">
              <span class="snapshot-section-icon">📄</span>
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
              <span class="snapshot-section-icon">📝</span>
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
              <span class="snapshot-section-icon">🩻</span>
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
              <span class="snapshot-section-icon">📅</span>
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
          <button class="cta-btn" onclick="window.analyzePatient('${patientName}')">Analyze Patient</button>
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

window.analyzePatient = function(patientName) {
  console.log(`🔍 Analyzing patient: ${patientName}`);
  const event = new CustomEvent('analyzePatient', { 
    detail: { patientName } 
  });
  window.dispatchEvent(event);
};

// ========================================
// OTHER FORMATTERS (unchanged)
// ========================================

function formatSectionView(text) {
  // Format section view responses
  // Check if this is a prescriptions response
  const isPrescriptions = text.includes('All Prescriptions for') || text.includes('Active Prescriptions for');
  
  console.log('🔍 formatSectionView called');
  console.log('🔍 isPrescriptions:', isPrescriptions);
  console.log('🔍 text starts with:', text.substring(0, 50));
  
  if (isPrescriptions) {
    console.log('🔍 Calling formatPrescriptionsGrouped');
    return formatPrescriptionsGrouped(text);
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

function formatSOAPNote(text) {
  // ===== EXTRACT ALL SOAP NOTES =====
  // Parse the text to extract individual SOAP notes
  const noteBlocks = text.split(/---\n/).filter(block => block.trim());
  
  let result = '';
  let headerExtracted = false;
  let patientName = '';
  
  // Extract patient name from first note
  const nameMatch = text.match(/SOAP Notes for ([^\n]+)/);
  if (nameMatch) {
    patientName = nameMatch[1].trim();
  }
  
  // Process each SOAP note
  noteBlocks.forEach((block, index) => {
    if (!block.trim()) return;
    
    // Extract date
    const dateMatch = block.match(/📅 ([^\n]+)/);
    let dateStr = 'Unknown Date';
    if (dateMatch) {
      const rawDate = dateMatch[1].trim().replace(/\*\*/g, '').trim();
      try {
        const date = new Date(rawDate);
        if (!isNaN(date.getTime())) {
          dateStr = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          });
        } else {
          dateStr = rawDate;
        }
      } catch {
        dateStr = rawDate;
      }
    }
    
    // Extract SOAP sections
    const subjectiveMatch = block.match(/SUBJECTIVE:\s*([\s\S]*?)(?=OBJECTIVE:|Objective:|$)/i);
    const objectiveMatch = block.match(/OBJECTIVE:\s*([\s\S]*?)(?=ASSESSMENT:|Assessment:|$)/i);
    const assessmentMatch = block.match(/ASSESSMENT:\s*([\s\S]*?)(?=PLAN:|Plan:|$)/i);
    const planMatch = block.match(/PLAN:\s*([\s\S]*?)(?=\n---|$)/i);
    
    // Clean ** markers from content
    const subjective = subjectiveMatch ? subjectiveMatch[1].trim().replace(/\*\*/g, '').trim() : 'Not documented';
    const objective = objectiveMatch ? objectiveMatch[1].trim().replace(/\*\*/g, '').trim() : 'Not documented';
    const assessment = assessmentMatch ? assessmentMatch[1].trim().replace(/\*\*/g, '').trim() : 'Not documented';
    const plan = planMatch ? planMatch[1].trim().replace(/\*\*/g, '').trim() : 'Not documented';
    
    // Build the note card
    result += `
      <div class="soap-note-premium">
        <div class="soap-note-date">
          <span class="soap-note-calendar-icon">📅</span>
          <span class="soap-note-date-text">${dateStr}</span>
        </div>
        <div class="soap-note-body">
          <div class="soap-letter-group">
            <div class="soap-letter-header">
              <span class="soap-letter">S</span>
              <span class="soap-letter-content">${subjective}</span>
            </div>
          </div>
          <div class="soap-letter-group">
            <div class="soap-letter-header">
              <span class="soap-letter">O</span>
              <span class="soap-letter-content">${objective}</span>
            </div>
          </div>
          <div class="soap-letter-group">
            <div class="soap-letter-header">
              <span class="soap-letter">A</span>
              <span class="soap-letter-content">${assessment}</span>
            </div>
          </div>
          <div class="soap-letter-group">
            <div class="soap-letter-header">
              <span class="soap-letter">P</span>
              <span class="soap-letter-content">${formatPlanWithBullets(plan)}</span>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Add divider between notes (except after the last one)
    if (index < noteBlocks.length - 1) {
      result += `<div class="soap-note-divider"></div>`;
    }
  });
  
  // If no notes found, try the old format (single SOAP note)
  if (!result) {
    // Fallback to original parsing for single notes
    const subjectiveMatch = text.match(/SUBJECTIVE:\s*([\s\S]*?)(?=OBJECTIVE:|Objective:|$)/i);
    const objectiveMatch = text.match(/OBJECTIVE:\s*([\s\S]*?)(?=ASSESSMENT:|Assessment:|$)/i);
    const assessmentMatch = text.match(/ASSESSMENT:\s*([\s\S]*?)(?=PLAN:|Plan:|$)/i);
    const planMatch = text.match(/PLAN:\s*([\s\S]*?)(?=\n\s*---|$)/i);
    
    const nameMatch = text.match(/SOAP Notes for ([^\n]+)/);
    if (nameMatch) patientName = nameMatch[1].trim();
    
    const dateMatch = text.match(/📅 ([^\n]+)/);
    let dateStr = 'Unknown Date';
    if (dateMatch) {
      const rawDate = dateMatch[1].trim().replace(/\*\*/g, '').trim();
      try {
        const date = new Date(rawDate);
        if (!isNaN(date.getTime())) {
          dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
      } catch {}
    }
    
    const subjective = subjectiveMatch ? subjectiveMatch[1].trim().replace(/\*\*/g, '').trim() : 'Not documented';
    const objective = objectiveMatch ? objectiveMatch[1].trim().replace(/\*\*/g, '').trim() : 'Not documented';
    const assessment = assessmentMatch ? assessmentMatch[1].trim().replace(/\*\*/g, '').trim() : 'Not documented';
    const plan = planMatch ? planMatch[1].trim().replace(/\*\*/g, '').trim() : 'Not documented';
    
    result = `
      <div class="soap-note-premium">
        <div class="soap-note-date">
          <span class="soap-note-calendar-icon">📅</span>
          <span class="soap-note-date-text">${dateStr}</span>
        </div>
        <div class="soap-note-body">
          <div class="soap-letter-group">
            <div class="soap-letter-header">
              <span class="soap-letter">S</span>
              <span class="soap-letter-content">${subjective}</span>
            </div>
          </div>
          <div class="soap-letter-group">
            <div class="soap-letter-header">
              <span class="soap-letter">O</span>
              <span class="soap-letter-content">${objective}</span>
            </div>
          </div>
          <div class="soap-letter-group">
            <div class="soap-letter-header">
              <span class="soap-letter">A</span>
              <span class="soap-letter-content">${assessment}</span>
            </div>
          </div>
          <div class="soap-letter-group">
            <div class="soap-letter-header">
              <span class="soap-letter">P</span>
              <span class="soap-letter-content">${formatPlanWithBullets(plan)}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  // Wrap everything in the container
  return `
    <div class="soap-notes-container">
      <div class="soap-notes-header">
        <span class="soap-notes-header-icon">📝</span>
        <span class="soap-notes-header-title">SOAP Notes${patientName ? ' for ' + patientName : ''}</span>
      </div>
      <div class="soap-notes-divider"></div>
      ${result}
    </div>
  `;
}

// Helper function to format plan with bullet points
function formatPlanWithBullets(text) {
  if (!text || text === 'Not documented') return text;
  
  // Split by newlines and convert to bullet points if multiple items
  const lines = text.split('\n').filter(line => line.trim());
  if (lines.length === 1) return text;
  
  // Check if already has bullet points
  if (lines.some(line => line.trim().startsWith('•') || line.trim().startsWith('-'))) {
    return lines.map(line => {
      const clean = line.replace(/^[•\-]\s*/, '').trim();
      return `<div class="soap-plan-item">• ${clean}</div>`;
    }).join('');
  }
  
  // Convert to bullet points
  return lines.map(line => 
    `<div class="soap-plan-item">• ${line.trim()}</div>`
  ).join('');
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
