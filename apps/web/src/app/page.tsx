'use client';

import React from 'react';
import { EventOSMajorIncidentWorkspace } from '../components/EventOSMajorIncidentWorkspace';

export default function OperationsDashboard() {
  return (
    <div className="min-h-screen bg-[#040710] text-slate-100 p-4 sm:p-6 font-sans">
      <div className="max-w-[1750px] mx-auto">
        <EventOSMajorIncidentWorkspace />
      </div>
    </div>
  );
}
