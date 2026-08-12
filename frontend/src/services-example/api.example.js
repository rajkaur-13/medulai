// ============================================
// Example API Interface
// This shows the API structure without implementation
// ============================================

/**
 * ⚠️ NOTE: This is an EXAMPLE interface.
 * The actual implementation is in the private repository.
 */

export const api = {
  // ===== AUTHENTICATION =====
  login: async (email, password) => {
    // Returns: { token, user }
    return { token: "demo-token", user: { name: "Demo User" } };
  },

  // ===== PATIENTS =====
  getPatients: async () => {
    // Returns: { patients: [] }
    return { patients: [] };
  },

  getPatient: async (patientId) => {
    // Returns: { patient: { id, name, mrn, age, gender, ... } }
    return { patient: { id: patientId, name: "Demo Patient" } };
  },

  // ===== CHAT =====
  sendMessage: async (message, patientId) => {
    // Returns: { reply, patient, tool_calls }
    return { reply: "Demo response from clinical assistant." };
  },

  // ===== SOAP NOTES =====
  getSoapNotes: async (patientId) => {
    // Returns: { notes: [{ subjective, objective, assessment, plan }] }
    return { notes: [] };
  },

  createSoapNote: async (patientId, data) => {
    // Returns: { success, id }
    return { success: true, id: "demo-id" };
  },

  // ===== PRESCRIPTIONS =====
  getPrescriptions: async (patientId) => {
    // Returns: { prescriptions: [{ medication, dosage, frequency }] }
    return { prescriptions: [] };
  },

  createPrescription: async (patientId, data) => {
    // Returns: { success, id }
    return { success: true, id: "demo-id" };
  },

  // ===== IMAGING =====
  analyzeImage: async (patientId, image) => {
    // Returns: { findings, impression, confidence, urgency }
    return { findings: "Demo findings", confidence: 0.95 };
  },

  // ===== APPOINTMENTS =====
  getAppointments: async (patientId) => {
    // Returns: { appointments: [{ date, time, reason }] }
    return { appointments: [] };
  },

  createAppointment: async (patientId, data) => {
    // Returns: { success, id }
    return { success: true, id: "demo-id" };
  }
};

export default api;
