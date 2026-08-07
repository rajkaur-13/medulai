import React, { useState, useEffect, useRef, useCallback } from "react";
import './App.css';
import "../styles/patients.css";
import "../styles/tools.css";

// Hooks
import { useAuth } from '../features/auth/hooks/useAuth';
import { useChat } from '../features/chat/hooks/useChat';
import { usePatients } from '../features/patients/hooks/usePatients';
import { useSoap } from '../features/soap/hooks/useSoap';
import { usePrescription } from '../features/prescriptions/hooks/usePrescription';
import { useAppointments } from '../features/appointments/hooks/useAppointments';


// Components
import ChatPanel from "../features/chat/components/ChatPanel";
import PatientPanel from "../features/patients/components/PatientPanel";
import Login from "../features/auth/components/Login";
import ClinicalPanel from "../features/clinical/components/ClinicalPanel";

import { api } from '../services/api';
import { formatStructuredImagingReport } from '../utils/messageFormatter';

//Icons
import { icons } from '../utils/messageFormatter';



function App() {
  const { token, isAuthenticated, handleLogin, handleLogout, recentAppointments, setRecentAppointments } = useAuth();

  const welcomeMessage = `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 0; max-width: 720px;">
    
    <!-- HEADER -->
    <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
      <span style="font-size: 18px; font-weight: 700; color: #111827;">
        👋 Welcome to 
        <span style="background: linear-gradient(135deg, #2563EB, #7C3AED); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
          MediAgent!
        </span>
      </span>
    </div>
    
    <!-- SUBTITLE -->
    <div style="font-size: 14px; color: #64748B; margin-bottom: 16px; line-height: 1.5;">
      I'm your AI-powered clinical assistant. I can help you with:
    </div>
    
    <!-- CAPABILITY LIST -->
    <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 18px;">
      
      <!-- Generic Medical Questions -->
      <div style="display: flex; align-items: flex-start; gap: 12px; padding: 6px 10px; border-radius: 10px; transition: background 0.15s; cursor: default;">
        <div style="width: 38px; height: 38px; border-radius: 8px; background: #EEF2FF; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">
          <span style="color: #4F46E5;">${icons.stethoscope}</span>
        </div>
        <div style="flex: 1; min-width: 0;">
          <div style="font-size: 13px; font-weight: 600; color: #0F172A;">Generic Medical Questions</div>
          <div style="font-size: 12px; color: #64748B; line-height: 1.4; text-align: justify;">Ask about symptoms, diseases, treatments, medications, clinical guidelines, and medical concepts.</div>
        </div>
      </div>
      
      <!-- Patient Search & Context -->
      <div style="display: flex; align-items: flex-start; gap: 12px; padding: 6px 10px; border-radius: 10px; transition: background 0.15s; cursor: default;">
        <div style="width: 38px; height: 38px; border-radius: 8px; background: #F0FDF4; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">
          <span style="color: #16A34A;">${icons.user}</span>
        </div>
        <div style="flex: 1; min-width: 0;">
          <div style="font-size: 13px; font-weight: 600; color: #0F172A;">Patient Search & Context</div>
          <div style="font-size: 12px; color: #64748B; line-height: 1.4; text-align: justify;">Find patients and view comprehensive clinical context instantly.</div>
        </div>
      </div>
      
      <!-- SOAP Note Generation -->
      <div style="display: flex; align-items: flex-start; gap: 12px; padding: 6px 10px; border-radius: 10px; transition: background 0.15s; cursor: default;">
        <div style="width: 38px; height: 38px; border-radius: 8px; background: #FEF3C7; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">
          <span style="color: #D97706;">${icons.fileText}</span>
        </div>
        <div style="flex: 1; min-width: 0;">
          <div style="font-size: 13px; font-weight: 600; color: #0F172A;">SOAP Note Generation</div>
          <div style="font-size: 12px; color: #64748B; line-height: 1.4; text-align: justify;">Generate structured SOAP notes with AI assistance.</div>
        </div>
      </div>
      
      <!-- Prescription Management -->
      <div style="display: flex; align-items: flex-start; gap: 12px; padding: 6px 10px; border-radius: 10px; transition: background 0.15s; cursor: default;">
        <div style="width: 38px; height: 38px; border-radius: 8px; background: #FCE4EC; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">
          <span style="color: #E11D48;">${icons.pill}</span>
        </div>
        <div style="flex: 1; min-width: 0;">
          <div style="font-size: 13px; font-weight: 600; color: #0F172A;">Prescription Management</div>
          <div style="font-size: 12px; color: #64748B; line-height: 1.4; text-align: justify;">Create and optimize patient prescriptions.</div>
        </div>
      </div>
      
      <!-- Medical Imaging Analysis -->
      <div style="display: flex; align-items: flex-start; gap: 12px; padding: 6px 10px; border-radius: 10px; transition: background 0.15s; cursor: default;">
        <div style="width: 38px; height: 38px; border-radius: 8px; background: #F3E8FF; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">
          <span style="color: #7C3AED;">${icons.scan}</span>
        </div>
        <div style="flex: 1; min-width: 0;">
          <div style="font-size: 13px; font-weight: 600; color: #0F172A;">Medical Image Analysis</div>
          <div style="font-size: 12px; color: #64748B; line-height: 1.4; text-align: justify;">Analyze X-rays, CT scans, MRI, ultrasound, and other medical images with AI-generated findings and impressions.</div>
        </div>
      </div>
      
      <!-- Appointment Scheduling -->
      <div style="display: flex; align-items: flex-start; gap: 12px; padding: 6px 10px; border-radius: 10px; transition: background 0.15s; cursor: default;">
        <div style="width: 38px; height: 38px; border-radius: 8px; background: #E0F2FE; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">
          <span style="color: #0284C7;">${icons.calendar}</span>
        </div>
        <div style="flex: 1; min-width: 0;">
          <div style="font-size: 13px; font-weight: 600; color: #0F172A;">Appointment Scheduling</div>
          <div style="font-size: 12px; color: #64748B; line-height: 1.4; text-align: justify;">Schedule and manage patient appointments efficiently.</div>
        </div>
      </div>
      
    </div>
    
    <!-- DIVIDER -->
    <div style="height: 1px; background: #E5E7EB; margin: 0 0 14px 0;"></div>
    
    <!-- HIGHLIGHT SECTION - AI Analysis & Recommendations -->
    <div style="background: #F7FAFF; border-radius: 14px; padding: 14px 16px; margin-bottom: 16px;">
      <div style="display: flex; align-items: flex-start; gap: 12px;">
        <div style="width: 38px; height: 38px; border-radius: 8px; background: #DBEAFE; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">
          <span style="color: #5386f3;">${icons.braincircuit}</span>
        </div>
        <div style="flex: 1; min-width: 0;">
          <div style="font-size: 13px; font-weight: 600; color: #0F172A;">AI Analysis & Recommendations</div>
          <div style="font-size: 12px; color: #475569; line-height: 1.5; margin-top: 2px; text-align: justify;">
            Analyze patient history, allergies, chronic conditions, SOAP notes, prescriptions, laboratory results (if available), medical imaging, appointments, and other clinical data to generate AI-powered insights, identify potential risks, summarize important findings, and provide evidence-based clinical recommendations to support healthcare professionals.
          </div>
        </div>
      </div>
    </div>
    
    <!-- CLOSING -->
    <div style="font-size: 16px; font-weight: 600; color: #0F172A; margin-top: 6px;">
      How can I assist you today?
    </div>
    
    <!-- TIMESTAMP -->
    <div style="margin-top: 12px; font-size: 10px; color: #94A3B8; letter-spacing: 0.3px;">
      ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
    </div>
    
  </div>
`;

  const [messages, setMessages] = useState([
    { id: '1', text: welcomeMessage, isUser: false, timestamp: new Date() }
  ]);

  // ✅ State for editing mode
  const [editingSection, setEditingSection] = useState(null);
  
  // ✅ Store the current report data in state with a unique ID
  const [currentReportData, setCurrentReportData] = useState(null);
  const [currentReportId, setCurrentReportId] = useState(null);

  const {
    input,
    setInput,
    loading,
    sendMessage: sendChatMessage,
    handleKeyPress,
    messagesEndRef
  } = useChat(token, setMessages);

  const {
    patients,
    currentPatient,
    setCurrentPatient,
    patientCache,
    setPatientCache,
    allPatientNames,
    setAllPatientNames,
    showAddPatient,
    setShowAddPatient,
    newPatient,
    setNewPatient,
    handleDirectPatientSelect,
    handlePatientClick,
    handleAddPatient
  } = usePatients(token, setMessages);

  const {
    soapNote,
    setSoapNote,
    handleSaveSoapNote
  } = useSoap(token, currentPatient, setMessages);

  const {
    prescription,
    setPrescription,
    handleGeneratePrescription
  } = usePrescription(token, currentPatient, handleDirectPatientSelect, setMessages);

  const { getRelativeDate, upcomingAppointments } = useAppointments(recentAppointments);

  const [mobileTab, setMobileTab] = useState('chat');

  useEffect(() => {
    window.directSelectPatient = handleDirectPatientSelect;
    window.directSetInput = (text) => {
      setInput(text);
      setTimeout(() => {
        const inputElement = document.querySelector('.chat-input-premium');
        if (inputElement) inputElement.focus();
      }, 50);
    };
    
    window.viewSection = async (section, patientName) => {
      console.log(`📊 Viewing ${section} for ${patientName}`);
      const patient = patients.find(p => p.name === patientName);
      if (!patient) {
        console.error('❌ Patient not found:', patientName);
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          text: `❌ Patient "${patientName}" not found.`, 
          isUser: false, 
          timestamp: new Date() 
        }]);
        return;
      }
      
      // ✅ FOR IMAGING: Fetch saved reports from database
      if (section === 'imaging') {
        try {
          const result = await api.getPatientImagesSigned(token, patient.id);
          
          if (result && result.images && result.images.length > 0) {
            // ✅ Display the saved report
            const img = result.images[0];
            const reportData = {
              patientName: patient.name,
              imageType: img.image_type || 'Imaging',
              date: img.uploaded_at || new Date().toISOString().split('T')[0],
              findings: img.findings || 'No findings',
              impression: img.impression || 'Not documented',
              recommendations: img.recommendations || 'No further imaging required. Clinical correlation as needed.',
              doctorNotes: img.doctor_notes || '',
              confidence: Math.round((img.confidence || 0) * 100),
              urgency: 'Low'
            };
            
            console.log('📸 Displaying saved report:', reportData);
            
            handleAnalysisComplete({
              type: 'imaging_report',
              data: reportData,
              replace: true
            });
            return;
          } else {
            // No images found
            setMessages(prev => [...prev, {
              id: Date.now().toString(),
              text: `❌ No imaging reports found for ${patientName}.`,
              isUser: false,
              timestamp: new Date()
            }]);
            return;
          }
        } catch (error) {
          console.error('❌ Error fetching saved imaging:', error);
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            text: `❌ Error loading imaging reports for ${patientName}.`,
            isUser: false,
            timestamp: new Date()
          }]);
          return;
        }
      }
      
      // ✅ FOR OTHER SECTIONS: Use the AI
      try {
        let message = '';
        switch(section) {
          case 'prescriptions': message = `Show me prescriptions for ${patientName}`; break;
          case 'soap': message = `Show me SOAP notes for ${patientName}`; break;
          case 'appointments': message = `Show me appointments for ${patientName}`; break;
          case 'medications': message = `Show me medications for ${patientName}`; break;
          default: console.warn(`⚠️ Section "${section}" not recognized`); return;
        }
        sendChatMessage(message, token, currentPatient, setCurrentPatient, setPatientCache, setAllPatientNames, allPatientNames);
      } catch (error) {
        console.error(`❌ Error loading ${section}:`, error);
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          text: `❌ Error loading ${section}. Please try again.`, 
          isUser: false, 
          timestamp: new Date() 
        }]);
      }
    };
    
    window.analyzePatient = async (patientName) => {
      console.log(`🔍 Analyzing patient: ${patientName}`);
      const patient = patients.find(p => p.name === patientName);
      if (!patient) {
        console.error('❌ Patient not found:', patientName);
        return;
      }
      try {
        const result = await api.analyzePatient(token, patient.id);
        if (result && result.data) {
          console.log('🔴 SENDING TO CHAT:', JSON.stringify(result)); // ← ADD THIS LINE
          setMessages(prev => [...prev, { 
            id: Date.now().toString(), 
            text: JSON.stringify(result), // ← Send as JSON string
             
            isUser: false, 
            timestamp: new Date() 
          }]);
        } else if (result && result.reply) {
          setMessages(prev => [...prev, { 
            id: Date.now().toString(), 
            text: result.reply, 
            isUser: false, 
            timestamp: new Date() 
          }]);
        } else {
          setMessages(prev => [...prev, { 
            id: Date.now().toString(), 
            text: '✅ Analysis completed for ' + patientName, 
            isUser: false, 
            timestamp: new Date() 
          }]);
        }
      } catch (error) {
        console.error('❌ Analysis failed:', error);
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          text: '❌ Failed to analyze patient: ' + error.message, 
          isUser: false, 
          timestamp: new Date() 
        }]);
      }
    };
  }, [handleDirectPatientSelect, setInput, sendChatMessage, token, currentPatient, setCurrentPatient, setPatientCache, setAllPatientNames, allPatientNames, patients, setMessages, api]);

  useEffect(() => {
    if (currentPatient && token) {
      const lastMessage = messages[messages.length - 1];
      const isPrescription = lastMessage && 
        (lastMessage.text.includes('Prescription generated') || 
         lastMessage.text.includes('Medication:'));
      
      const patientInfoExists = messages.some(msg => 
        msg.text && msg.text.includes(`Patient Selected: ${currentPatient.name}`)
      );

      if (!patientInfoExists && messages.length > 0 && !isPrescription) {
        const fetchFullPatient = async () => {
          try {
            const fullDataMessage = `Show me ${currentPatient.name}`;
            const data = await api.sendChatMessage(token, fullDataMessage);
            setMessages(prev => [...prev, {
              id: Date.now().toString(),
              text: data.reply,
              isUser: false,
              timestamp: new Date()
            }]);
          } catch (error) {
            console.error('Error fetching patient data:', error);
            const fallbackMessage = `✅ Patient Selected: ${currentPatient.name}
📋 Demographics: MRN: ${currentPatient.mrn} | Age: ${currentPatient.age} | Gender: ${currentPatient.gender}

How can I help you with ${currentPatient.name} today?`;
            setMessages(prev => [...prev, {
              id: Date.now().toString(),
              text: fallbackMessage,
              isUser: false,
              timestamp: new Date()
            }]);
          }
        };
        fetchFullPatient();
      }
    }
  }, [currentPatient, token, messages]);

  // ===== HANDLE EDIT BUTTON CLICKS =====
  const handleEditClick = (section, reportId) => {
    console.log(`✏️ Edit clicked for section: ${section} (report: ${reportId})`);
    
    if (reportId !== currentReportId) {
      console.log('⚠️ Report ID mismatch, ignoring click');
      return;
    }
    
    if (editingSection === section) {
      setEditingSection(null);
      if (currentReportData) {
        handleAnalysisComplete({
          type: 'imaging_report',
          data: currentReportData,
          replace: true,
          reportId: currentReportId
        });
      }
    } else {
      setEditingSection(section);
      if (currentReportData) {
        handleAnalysisComplete({
          type: 'imaging_report',
          data: currentReportData,
          replace: true,
          reportId: currentReportId,
          editingSection: section
        });
      }
    }
  };

  // ===== HANDLE SAVE BUTTON CLICKS =====
  const handleSaveClick = async (section, reportId) => {
    console.log(`💾 Saving ${section} (report: ${reportId})`);
    
    const textarea = document.querySelector(`.imaging-edit-textarea[data-section="${section}"]`);
    if (!textarea) {
      console.log('❌ Textarea not found');
      return;
    }
    
    const newContent = textarea.value;
    console.log(`💾 New content for ${section}:`, newContent);
    
    if (!currentReportData) {
      console.log('❌ No report data found');
      return;
    }
    
    if (reportId !== currentReportId) {
      console.log('⚠️ Report ID mismatch, ignoring save');
      return;
    }
    
    const sectionMap = {
      'findings': 'findings',
      'impression': 'impression',
      'recommendations': 'recommendations',
      'doctor_notes': 'doctorNotes'
    };
    
    const propertyKey = sectionMap[section] || section;
    
    const updatedData = {
      ...currentReportData,
      [propertyKey]: newContent
    };
    
    console.log('📊 Updated report data:', updatedData);
    
    setEditingSection(null);
    setCurrentReportData(updatedData);
    
    handleAnalysisComplete({
      type: 'imaging_report',
      data: updatedData,
      replace: true,
      reportId: currentReportId
    });
    
    try {
      const payload = {
        studyId: currentReportId,
        image_id: currentReportId,
        findings: updatedData.findings || '',
        impression: updatedData.impression || '',
        doctorNotes: updatedData.doctorNotes || '',
        recommendations: updatedData.recommendations || ''
      };
      
      console.log('📤 Saving to database:', payload);
      const response = await api.saveImagingReport(token, payload);
      console.log('✅ Saved to database:', response);
    } catch (error) {
      console.error('❌ Failed to save to database:', error);
    }
  };

  // ===== HANDLE CANCEL BUTTON CLICKS =====
  const handleCancelClick = (section, reportId) => {
    console.log(`❌ Cancel editing for ${section} (report: ${reportId})`);
    
    if (!currentReportData) {
      console.log('❌ No report data found');
      return;
    }
    
    if (reportId !== currentReportId) {
      console.log('⚠️ Report ID mismatch, ignoring cancel');
      return;
    }
    
    setEditingSection(null);
    handleAnalysisComplete({
      type: 'imaging_report',
      data: currentReportData,
      replace: true,
      reportId: currentReportId
    });
  };

  // ===== ATTACH EVENT LISTENERS =====
  useEffect(() => {
    const handleClick = (e) => {
      const editBtn = e.target.closest('.imaging-edit-btn');
      if (editBtn) {
        const section = editBtn.dataset.section;
        const reportId = editBtn.dataset.reportid;
        handleEditClick(section, reportId);
        return;
      }
      
      const saveBtn = e.target.closest('.imaging-save-btn');
      if (saveBtn) {
        const section = saveBtn.dataset.section;
        const reportId = saveBtn.dataset.reportid;
        handleSaveClick(section, reportId);
        return;
      }
      
      const cancelBtn = e.target.closest('.imaging-cancel-btn');
      if (cancelBtn) {
        const section = cancelBtn.dataset.section;
        const reportId = cancelBtn.dataset.reportid;
        handleCancelClick(section, reportId);
        return;
      }
    };
    
    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [currentReportData, currentReportId, editingSection]);

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const sendMessage = () => {
    if (!input.trim() || !token) return;
    sendChatMessage(input, token, currentPatient, setCurrentPatient, setPatientCache, setAllPatientNames, allPatientNames);
  };

  const handleAnalysisComplete = (analysis) => {
    // ✅ STEP 1: Check if it's an imaging report with JSON data
    if (analysis?.type === "imaging_report" && analysis?.data) {
      const { data, replace } = analysis;
      
      console.log('📸 Handling imaging report with JSON data');
      
      // ✅ STEP 2: Format the message using your existing formatter
      const formattedMessage = formatStructuredImagingReport(data);
      
      // ✅ STEP 3: Store the data as both HTML and structured JSON
      const messageObject = {
        id: Date.now().toString(),
        text: formattedMessage,  // HTML for display
        isUser: false,
        timestamp: new Date(),
        // ✅ Store structured data for future use (NEW)
        imagingData: data,
        type: 'imaging_report'
      };
      
      // ✅ STEP 4: Update messages
      if (replace) {
        // Replace existing imaging report
        setMessages(prev => {
          const filtered = prev.filter(msg => {
            // Don't remove if it's not an imaging report
            if (msg.type !== 'imaging_report') return true;
            // Remove if it's the same patient
            if (msg.imagingData?.patientName === data.patientName) return false;
            return true;
          });
          return [...filtered, messageObject];
        });
      } else {
        // Add new message
        setMessages(prev => [...prev, messageObject]);
      }
      return;
    }

    // ===== STEP 5: Handle other analysis types =====
    if (analysis?.formatted_response) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: analysis.formatted_response,
        isUser: false,
        timestamp: new Date()
      
      }]);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <span className="logo">🏥</span>
          <span className="title">MediAgent</span>
          <span className="badge">AI Medical Assistant</span>
        </div>
        <div className="header-center">
          <span className="doctor-info">👨‍⚕️ Dr. Sarah Wilson</span>
        </div>
        <div className="header-right">
          <button className="icon-btn">🔔</button>
          <button className="icon-btn">⚙️</button>
          <button className="icon-btn" onClick={handleLogout}>👤</button>
        </div>
      </header>

      <div className="mobile-top-nav">
        <button className={`mobile-top-btn ${mobileTab === 'patients' ? 'active' : ''}`} onClick={() => setMobileTab('patients')}>
          <span className="mobile-top-icon">👤</span>
          <span>Patients</span>
        </button>
        <button className={`mobile-top-btn ${mobileTab === 'chat' ? 'active' : ''}`} onClick={() => setMobileTab('chat')}>
          <span className="mobile-top-icon">💬</span>
          <span>Chat</span>
        </button>
        <button className={`mobile-top-btn ${mobileTab === 'tools' ? 'active' : ''}`} onClick={() => setMobileTab('tools')}>
          <span className="mobile-top-icon">🛠️</span>
          <span>Tools</span>
        </button>
      </div>

      <div className="main-container">
        <PatientPanel
          patients={patients}
          currentPatient={currentPatient}
          setCurrentPatient={setCurrentPatient}
          loading={loading}
          showAddPatient={showAddPatient}
          setShowAddPatient={setShowAddPatient}
          newPatient={newPatient}
          setNewPatient={setNewPatient}
          handleAddPatient={handleAddPatient}
          token={token}
          onAnalysisComplete={handleAnalysisComplete}
          upcomingAppointments={recentAppointments}
          getRelativeDate={getRelativeDate}
          handlePatientClick={handlePatientClick}
        />

        <ChatPanel
          messages={messages}
          loading={loading}
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
          handleKeyPress={handleKeyPress}
          messagesEndRef={messagesEndRef}
        />

        <ClinicalPanel
          currentPatient={currentPatient}
          token={token}
          soapNote={soapNote}
          setSoapNote={setSoapNote}
          handleSaveSoapNote={handleSaveSoapNote}
          prescription={prescription}
          setPrescription={setPrescription}
          handleGeneratePrescription={handleGeneratePrescription}
          onAnalysisComplete={handleAnalysisComplete}
          onScheduleFollowUp={(patient) => {
            if (patient) {
              setInput(`Schedule follow-up for ${patient.name}`);
              setTimeout(() => sendMessage(), 100);
            }
          }}
        />
      </div>
    </div>
  );
}

export default App;