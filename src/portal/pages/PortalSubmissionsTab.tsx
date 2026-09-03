import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  RefreshCw,
  Loader2,
  Calendar,
  Mail,
  Phone,
  Building2,
  Eye,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Clock,
} from 'lucide-react';
import { authFetch } from '../utils/authFetch';

export const PortalSubmissionsTab: React.FC = () => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [search, setSearch] = useState('');
  const [interestFilter, setInterestFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSubmissions = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (search.trim()) params.append('search', search.trim());
      if (interestFilter !== 'ALL') params.append('interest', interestFilter);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);

      const res = await authFetch(`/api/form-submissions?${params.toString()}`);
      if (!res.ok) {
        throw new Error('Failed to load submissions from database.');
      }
      const data = await res.json();
      setSubmissions(data.submissions || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalSubmissions(data.pagination?.total || 0);
    } catch (err: any) {
      setError(err.message || 'Error loading submissions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [page, interestFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchSubmissions();
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setActionLoading(true);
    try {
      const res = await authFetch(`/api/form-submissions/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setSubmissions((prev) =>
          prev.map((s) => (s._id === id ? { ...s, status: newStatus } : s))
        );
        if (selectedSubmission && selectedSubmission._id === id) {
          setSelectedSubmission((prev: any) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this form submission from MongoDB?')) {
      return;
    }
    setActionLoading(true);
    try {
      const res = await authFetch(`/api/form-submissions/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSelectedSubmission(null);
        fetchSubmissions();
      }
    } catch (err) {
      console.error('Failed to delete', err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 lg:p-10 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#b91c1c] block mb-1">
            Inquiry Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Form Submissions
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 font-semibold">
            Total Records: <strong className="text-gray-900">{totalSubmissions}</strong>
          </span>
          <button
            onClick={fetchSubmissions}
            disabled={loading}
            className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold px-4 py-2 inline-flex items-center gap-2 transition-colors cursor-pointer rounded"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-gray-200 p-4 flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by candidate/employer name, email, company..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-gray-900 bg-white"
            />
          </div>
          <button
            type="submit"
            className="bg-gray-900 text-white text-xs font-semibold px-4 py-2 hover:bg-black transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase text-gray-500">Interest:</span>
            <select
              value={interestFilter}
              onChange={(e) => {
                setInterestFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1.5 border border-gray-200 text-xs text-gray-900 bg-white focus:outline-none focus:border-gray-900 cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="Finding a Job">Finding a Job</option>
              <option value="Hiring Talent">Hiring Talent</option>
              <option value="Veteran Opportunities">Veteran Opportunities</option>
              <option value="Staffing Solutions">Staffing Solutions</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase text-gray-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1.5 border border-gray-200 text-xs text-gray-900 bg-white focus:outline-none focus:border-gray-900 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">New</option>
              <option value="REVIEWED">Reviewed</option>
              <option value="CONTACTED">Contacted</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="border border-gray-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Full Name & Contact</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4 hidden md:table-cell">Company</th>
                <th className="py-3.5 px-4 hidden sm:table-cell">Date Submitted</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-gray-500">
                    <Loader2 className="w-6 h-6 animate-spin text-[#b91c1c] mx-auto mb-2" />
                    <span>Loading submissions from MongoDB...</span>
                  </td>
                </tr>
              ) : submissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-gray-500">
                    No form submissions matching the criteria found.
                  </td>
                </tr>
              ) : (
                submissions.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="font-bold text-gray-900 text-sm">
                        {item.fullName}
                      </div>
                      <div className="text-gray-500 font-mono text-[11px]">
                        {item.email}
                      </div>
                      {item.phone && (
                        <div className="text-gray-400 text-[11px]">
                          Tel: {item.phone}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-800 border border-gray-200">
                        {item.interest}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 hidden md:table-cell text-gray-700">
                      {item.company || <span className="text-gray-400 italic">—</span>}
                    </td>

                    <td className="py-3.5 px-4 hidden sm:table-cell text-gray-500 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                          item.status === 'NEW'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : item.status === 'REVIEWED'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : item.status === 'CONTACTED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedSubmission(item)}
                        className="border border-gray-300 bg-white hover:bg-gray-900 hover:text-white text-gray-800 text-[11px] font-bold px-3 py-1.5 transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <div>
            Showing Page <strong className="text-gray-900">{page}</strong> of{' '}
            <strong className="text-gray-900">{totalPages}</strong> (Total {totalSubmissions} submissions)
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="border border-gray-300 bg-white px-3 py-1.5 font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              className="border border-gray-300 bg-white px-3 py-1.5 font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Submission Detail Modal (Requirement 20) */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl border border-gray-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-[#091124] text-white p-6 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#b91c1c] block mb-1">
                  Submission Details
                </span>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {selectedSubmission.fullName}
                </h2>
                <span className="text-xs text-gray-400 font-mono">
                  ID: {selectedSubmission._id}
                </span>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-gray-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
              {/* Core Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 border border-gray-200">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                    EMAIL ADDRESS
                  </span>
                  <a
                    href={`mailto:${selectedSubmission.email}`}
                    className="font-semibold text-gray-900 hover:text-[#b91c1c] flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5 text-gray-500" />
                    <span>{selectedSubmission.email}</span>
                  </a>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                    PHONE NUMBER
                  </span>
                  {selectedSubmission.phone ? (
                    <a
                      href={`tel:${selectedSubmission.phone}`}
                      className="font-semibold text-gray-900 hover:text-[#b91c1c] flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-gray-500" />
                      <span>{selectedSubmission.phone}</span>
                    </a>
                  ) : (
                    <span className="text-gray-400 italic">Not provided</span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                    COMPANY / ORGANIZATION
                  </span>
                  <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-gray-500" />
                    <span>{selectedSubmission.company || 'Not provided'}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                    INTEREST CATEGORY
                  </span>
                  <span className="font-bold text-[#b91c1c] uppercase">
                    {selectedSubmission.interest}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                    SUBMISSION DATE
                  </span>
                  <div className="text-gray-700 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>
                      {new Date(selectedSubmission.createdAt).toLocaleString(undefined, {
                        dateStyle: 'full',
                        timeStyle: 'medium',
                      })}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                    CURRENT STATUS
                  </span>
                  <select
                    value={selectedSubmission.status}
                    onChange={(e) =>
                      handleStatusChange(selectedSubmission._id, e.target.value)
                    }
                    disabled={actionLoading}
                    className="border border-gray-300 text-xs px-2.5 py-1 font-bold bg-white cursor-pointer"
                  >
                    <option value="NEW">NEW</option>
                    <option value="REVIEWED">REVIEWED</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
              </div>

              {/* Message Payload */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700 block mb-2 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-gray-500" />
                  <span>Full Inquired Message / Request:</span>
                </span>
                <div className="bg-gray-50 border border-gray-200 p-4 text-gray-800 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap rounded-xs font-sans">
                  {selectedSubmission.message ? (
                    selectedSubmission.message
                  ) : (
                    <span className="text-gray-400 italic">No specific message provided.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={() => handleDelete(selectedSubmission._id)}
                disabled={actionLoading}
                className="text-red-600 hover:text-red-800 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Record</span>
              </button>

              <div className="flex items-center gap-3">
                <a
                  href={`mailto:${selectedSubmission.email}?subject=Re: Inquiry with The Talent Experts of America`}
                  className="bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs font-bold px-4 py-2 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 text-xs font-semibold px-4 py-2 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
