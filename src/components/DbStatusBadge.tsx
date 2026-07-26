import React, { useState } from 'react';
import { Database, RefreshCw, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface DbStatusBadgeProps {
  variant?: 'compact' | 'full' | 'banner';
  className?: string;
}

export const DbStatusBadge: React.FC<DbStatusBadgeProps> = ({ variant = 'compact', className = '' }) => {
  const { dbStatus, checkDbStatus } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleRefresh = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsRefreshing(true);
    await checkDbStatus();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const isMongo = dbStatus?.connected && dbStatus?.type === 'mongodb';
  const isOffline = !isMongo && dbStatus !== null;
  const isUnknown = dbStatus === null;

  if (variant === 'banner') {
    return (
      <div className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
        isMongo 
          ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
          : 'bg-rose-50 border-rose-200 text-rose-900'
      } ${className}`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
            isMongo ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
          }`} />
          <Database className={`w-4 h-4 ${
            isMongo ? 'text-emerald-600' : 'text-rose-600'
          }`} />
          <div>
            <span className="font-bold block">
              {isMongo ? 'MongoDB Atlas Connected' : 'MongoDB Connection Required'}
            </span>
            <span className="text-[11px] opacity-80">
              {dbStatus?.message || (isMongo ? 'Production database is online and active.' : 'Please set MONGODB_URI environment variable in Vercel settings.')}
            </span>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-1.5 hover:bg-black/5 rounded-lg transition-colors shrink-0"
          title="Refresh MongoDB Connection Status"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
    );
  }

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Badge Button */}
      <button
        type="button"
        onClick={() => setShowDetails(!showDetails)}
        title={dbStatus?.message || "Click to view database connection status"}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all shadow-xs ${
          isMongo
            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900'
            : 'bg-rose-950/80 text-rose-300 border-rose-500/40 hover:bg-rose-900'
        }`}
      >
        <div className={`w-2 h-2 rounded-full shrink-0 ${
          isMongo ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
        }`} />
        <Database className="w-3 h-3 text-current" />
        <span className="whitespace-nowrap">
          {isMongo ? 'MongoDB Connected' : 'MongoDB Offline'}
        </span>
      </button>

      {/* Popover Details Modal */}
      {showDetails && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 text-slate-800 z-50 text-xs animate-fadeIn">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Database className="w-4 h-4 text-[#0B1F3A]" />
              <span>Database Connection</span>
            </div>
            <button 
              onClick={() => setShowDetails(false)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5 mb-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Status:</span>
              <span className={`font-bold flex items-center gap-1 ${
                isMongo ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                {isMongo ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5" /> Disconnected
                  </>
                )}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Engine:</span>
              <span className="font-semibold text-slate-700">
                {isMongo ? 'MongoDB Atlas Cloud' : 'MongoDB (Requires MONGODB_URI)'}
              </span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-600 leading-relaxed">
              {dbStatus?.message || 'Database status monitored live.'}
            </div>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-[#0B1F3A] font-bold rounded-xl flex items-center justify-center gap-2 transition-colors border border-slate-200"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Checking MongoDB...' : 'Re-check Connection'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
