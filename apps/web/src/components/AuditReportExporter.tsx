import React, { useState } from 'react';
import { useEventOpsStore } from '../store/useEventOpsStore';
import { FileText, Download, Check, ShieldCheck, Printer } from 'lucide-react';

export const AuditReportExporter: React.FC = () => {
  const { incidents, eventName, crowdCount } = useEventOpsStore();
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExportCSV = () => {
    const headers = ["ID", "Title", "Department", "Priority", "Stage", "Location", "AssignedWorker", "WaitingSeconds"];
    const rows = incidents.map(i => [
      i.id,
      `"${i.title.replace(/"/g, '""')}"`,
      i.department,
      i.priority,
      i.stage,
      `"${i.location}"`,
      i.assignedWorkers.map(w => w.name).join('; '),
      i.waitingSeconds
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `EventOS_Audit_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  return (
    <div className="attio-card p-4 rounded-2xl border border-white/10 bg-[#111115] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm text-xs">
      <div className="flex items-center space-x-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <div>
          <span className="font-bold text-zinc-100 uppercase tracking-wider block font-mono">
            Government Compliance & Incident Audit Export
          </span>
          <span className="text-[10px] text-zinc-400">Generate Official PDF / CSV Incident Lifecycle Report</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={handleExportCSV}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3.5 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
        >
          {downloadSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
          <span>{downloadSuccess ? 'Report Downloaded!' : 'Export Incident CSV Report'}</span>
        </button>
      </div>
    </div>
  );
};
