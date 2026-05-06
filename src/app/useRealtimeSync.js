import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { applyRealtimeState } from '../store/crmSlice';
import { addNotification, setConnectionStatus, setNotifications } from '../store/uiSlice';
import { closeCrmSocket, getCrmSocket } from '../services/socketClient';

export function useRealtimeSync() {
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = getCrmSocket();

    const handleConnect = () => {
      dispatch(setConnectionStatus('connected'));
    };

    const handleDisconnect = () => {
      dispatch(setConnectionStatus('disconnected'));
    };

    const handleStateUpdated = (payload) => {
      dispatch(applyRealtimeState(payload));
      if (payload.notifications) {
        dispatch(setNotifications(payload.notifications));
      }
    };

    const handleNotificationCreated = (payload) => {
      dispatch(addNotification(payload));
    };

    dispatch(setConnectionStatus(socket.connected ? 'connected' : 'connecting'));
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('crm.state.updated', handleStateUpdated);
    socket.on('crm.notification.created', handleNotificationCreated);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('crm.state.updated', handleStateUpdated);
      socket.off('crm.notification.created', handleNotificationCreated);
      closeCrmSocket();
    };
  }, [dispatch]);
}