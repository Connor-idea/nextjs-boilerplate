import { createSlice } from '@reduxjs/toolkit';
import { confirmAssignments, fetchBootstrapData, markNotificationsRead, syncLeadSnapshot, syncSupplierBills } from './thunks';
import { DEFAULT_USER_ROLE } from '../constants/roles';

const initialState = {
  userRole: DEFAULT_USER_ROLE,
  sidebarOpen: false,
  connectionStatus: 'connecting',
  notifications: [],
  toast: {
    message: '',
    type: 'success',
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setUserRole(state, action) {
      state.userRole = action.payload;
    },
    openSidebar(state) {
      state.sidebarOpen = true;
    },
    closeSidebar(state) {
      state.sidebarOpen = false;
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    showToast(state, action) {
      state.toast = {
        message: action.payload.message,
        type: action.payload.type || 'success',
      };
    },
    clearToast(state) {
      state.toast = {
        message: '',
        type: 'success',
      };
    },
    setNotifications(state, action) {
      state.notifications = action.payload || [];
    },
    addNotification(state, action) {
      state.notifications = [action.payload, ...state.notifications].slice(0, 100);
    },
    setConnectionStatus(state, action) {
      state.connectionStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    const syncFulfilled = (state, action) => {
      if (action.payload.notifications) {
        state.notifications = action.payload.notifications;
      }
    };

    builder
      .addCase(fetchBootstrapData.fulfilled, syncFulfilled)
      .addCase(syncLeadSnapshot.fulfilled, syncFulfilled)
      .addCase(confirmAssignments.fulfilled, syncFulfilled)
      .addCase(syncSupplierBills.fulfilled, syncFulfilled)
      .addCase(markNotificationsRead.fulfilled, syncFulfilled);
  },
});

export const {
  addNotification,
  clearToast,
  closeSidebar,
  openSidebar,
  setConnectionStatus,
  setNotifications,
  setUserRole,
  showToast,
  toggleSidebar,
} = uiSlice.actions;

export default uiSlice.reducer;