import React, { useState, useEffect } from 'react';
import {
  Users,
  Inbox,
  Briefcase,
  Award,
  TrendingUp,
  RefreshCw,
  Loader2,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { authFetch } from '../utils/authFetch';

interface PortalDashboardTabProps {
  onViewSubmissions: () => void;
}

export const PortalDashboardTab: React.FC<PortalDashboardTabProps> = ({
  onViewSubmissions,
}) => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<{
    totalSubmissions: number;
    recentSubmissions: any[];
    interestCounts: Record<string, number>;
  } | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await authFetch('/api/admin/dashboard');
      if (res.ok) {
        const data = await res.json();
        setDashboardData(data);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading && !dashboardData) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-[#b91c1c] mb-3" />
        <span className="text-xs uppercase tracking-wider font-semibold">
          Loading Dashboard Data...
        </span>
      </div>
    );
  }

  const total = dashboardData?.totalSubmissions ?? 0;
  const counts = dashboardData?.interestCounts || {};

  return (
    <div className="p-6 sm:p-8 lg:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#b91c1c] block mb-1">
            Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Admin Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold px-4 py-2 inline-flex items-center gap-2 transition-colors cursor-pointer rounded"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Inquiries */}
        <div className="border border-gray-200 bg-white p-6 rounded shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Total Form Submissions
              </span>
              <div className="w-8 h-8 bg-red-50 text-[#b91c1c] flex items-center justify-center rounded">
                <Inbox className="w-4 h-4" />
              </div>
            </div>
            <div className="mb-2">
              <span className="text-4xl font-black text-gray-900 tracking-tight">
                {total}
              </span>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-100">
            <button
              onClick={onViewSubmissions}
              className="text-xs font-bold text-[#b91c1c] hover:text-[#991b1b] inline-flex items-center gap-1.5 uppercase tracking-wider cursor-pointer"
            >
              <span>View All Submissions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Job Inquiries */}
        <div className="border border-gray-200 bg-white p-6 rounded shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Finding a Job
              </span>
              <div className="w-8 h-8 bg-gray-100 text-gray-700 flex items-center justify-center rounded">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <div className="mb-2">
              <span className="text-4xl font-black text-gray-900 tracking-tight">
                {counts['Finding a Job'] || 0}
              </span>
            </div>
          </div>
          <div className="pt-4 mt-4 border-t border-gray-100 text-xs text-gray-400">
            Candidate applications
          </div>
        </div>

        {/* Hiring Inquiries */}
        <div className="border border-gray-200 bg-white p-6 rounded shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Hiring Talent
              </span>
              <div className="w-8 h-8 bg-gray-100 text-gray-700 flex items-center justify-center rounded">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mb-2">
              <span className="text-4xl font-black text-gray-900 tracking-tight">
                {counts['Hiring Talent'] || 0}
              </span>
            </div>
          </div>
          <div className="pt-4 mt-4 border-t border-gray-100 text-xs text-gray-400">
            Employer staffing requests
          </div>
        </div>

        {/* Veteran Inquiries */}
        <div className="border border-gray-200 bg-white p-6 rounded shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Veteran Opportunities
              </span>
              <div className="w-8 h-8 bg-red-50 text-[#b91c1c] flex items-center justify-center rounded">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="mb-2">
              <span className="text-4xl font-black text-gray-900 tracking-tight">
                {counts['Veteran Opportunities'] || 0}
              </span>
            </div>
          </div>
          <div className="pt-4 mt-4 border-t border-gray-100 text-xs text-gray-400">
            Military transition inquiries
          </div>
        </div>
      </div>

      {/* Breakdown by Interest Details */}
      <div className="border border-gray-200 bg-white p-6 rounded">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-5">
          Submissions by Category
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 border border-gray-200 rounded flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                Finding a Job
              </span>
              <span className="text-2xl font-black text-gray-900">
                {counts['Finding a Job'] || 0}
              </span>
            </div>
            <Briefcase className="w-5 h-5 text-gray-400" />
          </div>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                Hiring Talent
              </span>
              <span className="text-2xl font-black text-gray-900">
                {counts['Hiring Talent'] || 0}
              </span>
            </div>
            <Users className="w-5 h-5 text-gray-400" />
          </div>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                Veteran Opportunities
              </span>
              <span className="text-2xl font-black text-gray-900">
                {counts['Veteran Opportunities'] || 0}
              </span>
            </div>
            <Award className="w-5 h-5 text-[#b91c1c]" />
          </div>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                Staffing Solutions
              </span>
              <span className="text-2xl font-black text-gray-900">
                {counts['Staffing Solutions'] || 0}
              </span>
            </div>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Recent Submissions Snippet */}
      <div className="border border-gray-200 bg-white rounded overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
            Recent Submissions
          </h3>
          <button
            onClick={onViewSubmissions}
            className="text-xs font-bold text-[#b91c1c] hover:underline cursor-pointer"
          >
            View All Submissions →
          </button>
        </div>

        {dashboardData?.recentSubmissions &&
        dashboardData.recentSubmissions.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {dashboardData.recentSubmissions.map((sub: any) => (
              <div
                key={sub._id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/80 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-bold text-gray-900">
                      {sub.fullName}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                      {sub.interest}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 flex flex-wrap items-center gap-3">
                    <span>{sub.email}</span>
                    {sub.phone && <span>• {sub.phone}</span>}
                    {sub.company && <span>• {sub.company}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {new Date(sub.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-400 text-xs">
            No submissions recorded yet.
          </div>
        )}
      </div>
    </div>
  );
};
