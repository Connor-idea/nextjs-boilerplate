import React from 'react';
import { useSelector } from 'react-redux';
import ProfileModule from '../modules/ProfileModule';

export default function ProfileInsightsPage() {
  const userRole = useSelector((state) => state.ui.userRole);

  return <ProfileModule userRole={userRole} />;
}