import { createSlice } from '@reduxjs/toolkit';
import { confirmAssignments, fetchBootstrapData, syncLeadSnapshot, syncSupplierBills } from './thunks';

function hydrateState(target, payload = {}) {
  target.leads = payload.leads || target.leads;
  target.assignLogs = payload.assignLogs || target.assignLogs;
  target.profiles = payload.profiles || target.profiles;
  target.supplierBills = payload.supplierBills || target.supplierBills;
  target.syncedAt = payload.syncedAt || new Date().toISOString();
}

const initialState = {
  bootstrapStatus: 'idle',
  syncStatus: 'idle',
  leads: [],
  assignLogs: [],
  aiAssignSelectionIds: [],
  profiles: [],
  supplierBills: [],
  syncedAt: null,
};

const crmSlice = createSlice({
  name: 'crm',
  initialState,
  reducers: {
    setAIAssignSelection(state, action) {
      state.aiAssignSelectionIds = action.payload || [];
    },
    setLeadWorkspace(state, action) {
      state.leads = action.payload.leads || state.leads;
      state.assignLogs = action.payload.assignLogs || state.assignLogs;
    },
    setSupplierBillsLocal(state, action) {
      state.supplierBills = action.payload || [];
    },
    applyRealtimeState(state, action) {
      hydrateState(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBootstrapData.pending, (state) => {
        state.bootstrapStatus = 'loading';
      })
      .addCase(fetchBootstrapData.fulfilled, (state, action) => {
        state.bootstrapStatus = 'succeeded';
        hydrateState(state, action.payload);
      })
      .addCase(fetchBootstrapData.rejected, (state) => {
        state.bootstrapStatus = 'failed';
      })
      .addCase(syncLeadSnapshot.pending, (state) => {
        state.syncStatus = 'syncing';
      })
      .addCase(syncLeadSnapshot.fulfilled, (state, action) => {
        state.syncStatus = 'idle';
        hydrateState(state, action.payload);
      })
      .addCase(syncLeadSnapshot.rejected, (state) => {
        state.syncStatus = 'failed';
      })
      .addCase(confirmAssignments.fulfilled, (state, action) => {
        state.aiAssignSelectionIds = [];
        hydrateState(state, action.payload);
      })
      .addCase(syncSupplierBills.fulfilled, (state, action) => {
        hydrateState(state, action.payload);
      });
  },
});

export const { applyRealtimeState, setAIAssignSelection, setLeadWorkspace, setSupplierBillsLocal } = crmSlice.actions;

export default crmSlice.reducer;