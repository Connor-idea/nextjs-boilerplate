import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SupplierReconciliation from '../modules/SupplierReconciliation';
import { sanitizeSupplierBillsForTransport } from '../lib/crmAdapters';
import { setSupplierBillsLocal } from '../store/crmSlice';
import { syncSupplierBills } from '../store/thunks';

export default function SupplierRoutePage() {
  const dispatch = useDispatch();
  const supplierBills = useSelector((state) => state.crm.supplierBills);

  const handleBillsChange = useCallback((nextBills) => {
    const sanitizedBills = sanitizeSupplierBillsForTransport(nextBills);
    dispatch(setSupplierBillsLocal(sanitizedBills));
    dispatch(syncSupplierBills(sanitizedBills));
  }, [dispatch]);

  return <SupplierReconciliation initialBillsData={supplierBills} onBillsChange={handleBillsChange} />;
}