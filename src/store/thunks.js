import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../services/apiClient';

export const fetchBootstrapData = createAsyncThunk('crm/fetchBootstrap', async () => {
  return apiClient.getBootstrap();
});

export const syncLeadSnapshot = createAsyncThunk('crm/syncLeadSnapshot', async (payload) => {
  return apiClient.syncLeadSnapshot(payload);
});

export const confirmAssignments = createAsyncThunk('crm/confirmAssignments', async (assignments) => {
  return apiClient.confirmAssignments({ assignments });
});

export const syncSupplierBills = createAsyncThunk('crm/syncSupplierBills', async (bills) => {
  return apiClient.syncSupplierBills({ bills });
});

export const markNotificationsRead = createAsyncThunk('ui/markNotificationsRead', async () => {
  return apiClient.markNotificationsRead();
});