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
  const isMemory = dbStatus?.type === 'memory' || (!dbStatus?.connected && dbStatus !== null);
  const isUnknown = dbStatus === null;

  if (variant === 'banner') {
    return (
      <div className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
        isMongo 
          ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
          : isMemory 
            ? 'bg-amber-50 border-amber-200 text-amber-900' 
            : 'bg-slate-50 border-slate-200 text-slate-800'
      } ${className}`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
            isMongo ? 'bg-emerald-500 animate-pulse' : isMemory ? 'bg-amber-500' : 'bg-slate-400'
          }`} />
          <Database className={`w-4 h-4 ${
            isMongo ? 'text-emerald-600' : isMemory ? 'text-amber-600' : 'text-slate-500'
          }`} />
          <div>
            <span className="font-bold block">
              {isMongo ? 'MongoDB Atlas Connected' : isMemory ? 'Database: Local Memory Mode' : 'Checking Database Status...'}
            </span>
            <span className="text-[11px] opacity-80">
              {dbStatus?.message || (isMongo ? 'Production database is online and active.' : 'Running in local fallback mode.')}
            </span>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-1.5 hover:bg-black/5 rounded-lg transition-colors shrink-0"
          title="Refresh Database Connection Status"
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
            : isMemory
              ? 'bg-amber-950/80 text-amber-300 border-amber-500/40 hover:bg-amber-900'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
        }`}
      >
        <div className={`w-2 h-2 rounded-full shrink-0 ${
          isMongo ? 'bg-emerald-400 animate-pulse' : isMemory ? 'bg-amber-400' : 'bg-slate-400'
        }`} />
        <Database className="w-3 h-3 text-current" />
        <span className="whitespace-nowrap">
          {isMongo ? 'MongoDB Connected' : isMemory ? 'DB: Memory Mode' : 'DB Check...'}
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
                isMongo ? 'text-emerald-600' : 'text-amber-600'
              }`}>
                {isMongo ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5" /> Standby Mode
                  </>
                )}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Engine:</span>
              <span className="font-semibold text-slate-700">
                {isMongo ? 'MongoDB Atlas Cloud' : 'In-Memory Cache Fallback'}
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
