"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Loader2,
  FileText,
  ExternalLink,
  X,
  User,
  Mail,
  Phone,
  Link2,
  Globe,
  Calendar,
  StickyNote,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate, getInitials } from "@/lib/utils";

type ApplicationStatus = "PENDING" | "REVIEWING" | "SHORTLISTED" | "REJECTED" | "HIRED";

interface JobApplication {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  linkedIn?: string | null;
  portfolio?: string | null;
  jobTitle: string;
  jobTeam: string;
  coverLetter?: string | null;
  cvUrl: string;
  cvFileName: string;
  status: ApplicationStatus;
  adminNotes?: string | null;
  createdAt: string;
  user?: { id: string; name: string; email: string; avatar?: string | null } | null;
}

const statusOptions: ApplicationStatus[] = ["PENDING", "REVIEWING", "SHORTLISTED", "REJECTED", "HIRED"];

const statusStyles: Record<ApplicationStatus, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  REVIEWING: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  SHORTLISTED: "bg-[#FDF5AA]/10 text-[#FDF5AA] border-[#FDF5AA]/20",
  REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
  HIRED: "bg-green-500/10 text-green-400 border-green-500/20",
};

const teams = ["Engineering", "Design", "Operations", "Support", "Marketing"];

export default function AdminCareersPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "ALL">("ALL");
  const [teamFilter, setTeamFilter] = useState<string>("ALL");
  const [selected, setSelected] = useState<JobApplication | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, page: 1 });

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter !== "ALL") params.set("status", statusFilter);
    if (teamFilter !== "ALL") params.set("team", teamFilter);
    if (search) params.set("search", search);
    params.set("limit", "50");

    const res = await fetch(`/api/careers?${params.toString()}`);
    const data = await res.json();
    if (data.success) {
      setApplications(data.data);
      setPagination(data.pagination);
    }
    setLoading(false);
  }, [statusFilter, teamFilter, search]);

  useEffect(() => {
    const t = setTimeout(fetchApplications, 300);
    return () => clearTimeout(t);
  }, [fetchApplications]);

  const handleStatusChange = async (id: string, status: ApplicationStatus) => {
    setUpdatingId(id);
    try {
      await fetch(`/api/careers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
      if (selected?.id === id) setSelected((s) => s ? { ...s, status } : s);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveNotes = async () => {
    if (!selected) return;
    setSavingNotes(true);
    try {
      await fetch(`/api/careers/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes }),
      });
      setSelected((s) => s ? { ...s, adminNotes } : s);
      setApplications((prev) =>
        prev.map((a) => (a.id === selected.id ? { ...a, adminNotes } : a))
      );
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this application? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/careers/${id}`, { method: "DELETE" });
      setApplications((prev) => prev.filter((a) => a.id !== id));
      if (selected?.id === id) setSelected(null);
    } finally {
      setDeletingId(null);
    }
  };

  const openDetail = (app: JobApplication) => {
    setSelected(app);
    setAdminNotes(app.adminNotes ?? "");
  };

  // Stats
  const stats = statusOptions.map((s) => ({
    status: s,
    count: applications.filter((a) => a.status === s).length,
  }));

  return (
    <div className="flex h-full">
      {/* ── Left: List ── */}
      <div className={`flex flex-col ${selected ? "hidden lg:flex lg:w-1/2 xl:w-3/5" : "w-full"} border-r border-[#34699A]/20`}>
        {/* Header */}
        <div className="border-b border-[#34699A]/20 p-6">
          <h1 className="font-display text-3xl font-black uppercase text-white">
            Candidates
          </h1>
          <p className="mt-1 text-sm text-slate-400">{pagination.total} total applications</p>

          {/* Status stats */}
          <div className="mt-4 flex flex-wrap gap-2">
            {stats.map(({ status, count }) => (
              <button
                key={status}
                onClick={() => setStatusFilter(statusFilter === status ? "ALL" : status)}
                className={`rounded-lg border px-3 py-1 text-xs font-medium transition-all ${
                  statusFilter === status
                    ? statusStyles[status]
                    : "border-white/10 text-slate-500 hover:text-white"
                }`}
              >
                {status} · {count}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 border-b border-[#34699A]/20 p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, role..."
              className="pl-9 border-[#34699A]/30 bg-[#113F67]/40 text-white placeholder-slate-500 text-sm"
            />
          </div>
          <select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            className="rounded-lg border border-[#34699A]/30 bg-[#113F67]/40 px-3 py-2 text-sm text-white outline-none"
          >
            <option value="ALL" className="bg-[#0E2D4A]">All Teams</option>
            {teams.map((t) => (
              <option key={t} value={t} className="bg-[#0E2D4A]">{t}</option>
            ))}
          </select>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[#FDF5AA]" />
            </div>
          ) : applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
              <FileText className="h-10 w-10 text-slate-600" />
              <p className="text-slate-500">No applications found</p>
            </div>
          ) : (
            <div className="divide-y divide-[#34699A]/10">
              {applications.map((app, i) => (
                <motion.button
                  key={app.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => openDetail(app)}
                  className={`w-full p-4 text-left transition-colors hover:bg-[#113F67]/40 ${
                    selected?.id === app.id ? "bg-[#113F67]/60 border-l-2 border-[#FDF5AA]" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-9 w-9 shrink-0 mt-0.5">
                      <AvatarFallback className="bg-[#34699A] text-white text-xs font-bold">
                        {getInitials(app.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-white truncate">{app.fullName}</p>
                        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${statusStyles[app.status]}`}>
                          {app.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 truncate">{app.jobTitle}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{app.email}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-slate-600">{formatDate(app.createdAt)}</p>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Right: Detail Panel ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col w-full lg:w-1/2 xl:w-2/5 overflow-y-auto"
          >
            {/* Detail header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#34699A]/20 bg-[#0B2540] p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-[#34699A] text-white font-bold">
                    {getInitials(selected.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-white">{selected.fullName}</p>
                  <p className="text-xs text-slate-400">{selected.jobTitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDelete(selected.id)}
                  disabled={deletingId === selected.id}
                  className="rounded-lg p-2 text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                  aria-label="Delete application"
                >
                  {deletingId === selected.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="rounded-lg p-2 text-slate-500 hover:bg-white/5 hover:text-white transition-colors lg:hidden"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Status changer */}
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Application Status
                </p>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(selected.id, s)}
                      disabled={updatingId === selected.id}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                        selected.status === s
                          ? statusStyles[s]
                          : "border-white/10 text-slate-500 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {updatingId === selected.id && selected.status !== s ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        s
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact info */}
              <div className="rounded-xl border border-[#34699A]/20 bg-[#113F67]/30 p-4 space-y-3">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Contact
                </p>
                <div className="space-y-2">
                  <a href={`mailto:${selected.email}`} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors">
                    <Mail className="h-4 w-4 text-[#58A0C8] shrink-0" />
                    {selected.email}
                  </a>
                  {selected.phone && (
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <Phone className="h-4 w-4 text-[#58A0C8] shrink-0" />
                      {selected.phone}
                    </div>
                  )}
                  {selected.linkedIn && (
                    <a href={selected.linkedIn} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors">
                      <Link2 className="h-4 w-4 text-[#58A0C8] shrink-0" />
                      LinkedIn Profile
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {selected.portfolio && (
                    <a href={selected.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors">
                      <Globe className="h-4 w-4 text-[#58A0C8] shrink-0" />
                      Portfolio
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Role & date */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[#34699A]/20 bg-[#113F67]/30 p-3">
                  <p className="text-xs text-slate-500">Role</p>
                  <p className="mt-1 text-sm font-medium text-white">{selected.jobTitle}</p>
                  <p className="text-xs text-slate-400">{selected.jobTeam}</p>
                </div>
                <div className="rounded-xl border border-[#34699A]/20 bg-[#113F67]/30 p-3">
                  <p className="text-xs text-slate-500">Applied</p>
                  <p className="mt-1 text-sm font-medium text-white">{formatDate(selected.createdAt)}</p>
                </div>
              </div>

              {/* CV Download */}
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                  CV / Resume
                </p>
                <a
                  href={selected.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-[#34699A]/30 bg-[#113F67]/40 px-4 py-3 transition-colors hover:border-[#FDF5AA]/30 hover:bg-[#FDF5AA]/5"
                >
                  <FileText className="h-5 w-5 text-[#FDF5AA] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{selected.cvFileName}</p>
                    <p className="text-xs text-slate-500">Click to open</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-slate-500 shrink-0" />
                </a>
              </div>

              {/* Cover Letter */}
              {selected.coverLetter && (
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                    Cover Letter
                  </p>
                  <div className="rounded-xl border border-[#34699A]/20 bg-[#113F67]/30 p-4">
                    <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">
                      {selected.coverLetter}
                    </p>
                  </div>
                </div>
              )}

              {/* Admin Notes */}
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <StickyNote className="h-3.5 w-3.5" />
                  Internal Notes
                </p>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                  placeholder="Add private notes about this candidate..."
                  className="w-full rounded-xl border border-[#34699A]/30 bg-[#113F67]/40 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-[#FDF5AA]/30 resize-none"
                />
                <Button
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  size="sm"
                  className="mt-2 bg-[#FDF5AA] text-[#0B2540] font-bold hover:bg-[#e8e090]"
                >
                  {savingNotes ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save Notes"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state when nothing selected on desktop */}
      {!selected && !loading && (
        <div className="hidden lg:flex flex-1 items-center justify-center text-center">
          <div>
            <User className="h-12 w-12 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500">Select a candidate to view their application</p>
          </div>
        </div>
      )}
    </div>
  );
}
