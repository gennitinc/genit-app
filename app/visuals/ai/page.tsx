"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  BrandRecommendation, BrandReport, createRecommendation, deleteRecommendation,
  listBrandReports, RecommendationInput, RecommendationStatus, updateRecommendation,
} from "@/lib/brand-reports-api";
import { ArrowRight, Check, CircleDot, Clock3, Lightbulb, Loader2, Pencil, Plus, Sparkles, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";

const statusLabels: Record<RecommendationStatus, string> = { open: "Open", in_progress: "In progress", done: "Done", dismissed: "Dismissed" };
const emptyForm: RecommendationInput = { title: "", rationale: "", action: "", category: "brand", priority: "medium", status: "open" };

function errorMessage(error: any) { return error?.response?.data?.message || error?.message || "Something went wrong"; }

export default function AIPage() {
  const { toast } = useToast();
  const [reports, setReports] = useState<BrandReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [filter, setFilter] = useState<RecommendationStatus | "all">("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<{ reportId: string; item: BrandRecommendation } | null>(null);
  const [reportId, setReportId] = useState("");
  const [form, setForm] = useState<RecommendationInput>(emptyForm);

  useEffect(() => {
    listBrandReports().then((items) => { setReports(items); setReportId(items[0]?._id || ""); })
      .catch((error) => toast({ title: "Could not load recommendations", description: errorMessage(error), variant: "destructive" }))
      .finally(() => setLoading(false));
  }, [toast]);

  const all = useMemo(() => reports.flatMap((report) => report.recommendations.map((item) => ({ report, item }))), [reports]);
  const visible = filter === "all" ? all : all.filter(({ item }) => item.status === filter);
  const counts = useMemo(() => all.reduce((acc, { item }) => ({ ...acc, [item.status]: (acc[item.status] || 0) + 1 }), {} as Record<string, number>), [all]);
  const replaceReport = (report: BrandReport) => setReports((items) => items.map((item) => item._id === report._id ? report : item));

  function openCreate() { setEditing(null); setForm(emptyForm); setReportId(reports[0]?._id || ""); setDialogOpen(true); }
  function openEdit(reportIdValue: string, item: BrandRecommendation) {
    setEditing({ reportId: reportIdValue, item }); setReportId(reportIdValue);
    setForm({ title: item.title, rationale: item.rationale, action: item.action, category: item.category, priority: item.priority, status: item.status }); setDialogOpen(true);
  }

  async function save() {
    if (!reportId) return;
    setBusyId("save");
    try {
      const report = editing ? await updateRecommendation(editing.reportId, editing.item._id, form) : await createRecommendation(reportId, form);
      replaceReport(report); setDialogOpen(false); toast({ title: editing ? "Recommendation updated" : "Recommendation added" });
    } catch (error) { toast({ title: "Could not save recommendation", description: errorMessage(error), variant: "destructive" }); }
    finally { setBusyId(""); }
  }

  async function changeStatus(reportIdValue: string, item: BrandRecommendation, status: RecommendationStatus) {
    setBusyId(item._id);
    try { replaceReport(await updateRecommendation(reportIdValue, item._id, { status })); toast({ title: status === "done" ? "Recommendation completed" : "Status updated" }); }
    catch (error) { toast({ title: "Could not update status", description: errorMessage(error), variant: "destructive" }); }
    finally { setBusyId(""); }
  }

  async function remove(reportIdValue: string, item: BrandRecommendation) {
    if (!window.confirm(`Delete “${item.title}”?`)) return;
    setBusyId(item._id);
    try { replaceReport(await deleteRecommendation(reportIdValue, item._id)); toast({ title: "Recommendation deleted" }); }
    catch (error) { toast({ title: "Could not delete recommendation", description: errorMessage(error), variant: "destructive" }); }
    finally { setBusyId(""); }
  }

  if (loading) return <div className="flex min-h-[500px] items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-violet-500" /></div>;

  return (
    <div className="flex w-full flex-col gap-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.18em] text-amber-600"><Sparkles className="h-4 w-4" />Next best actions</div><h1 className="text-3xl font-bold tracking-tight">AI recommendations</h1><p className="mt-1 max-w-2xl text-sm text-muted-foreground">Turn report findings into owned, trackable actions for your brand.</p></div>{reports.length > 0 && <Button onClick={openCreate} className="rounded-full bg-violet-600 hover:bg-violet-700"><Plus className="h-4 w-4" />Add recommendation</Button>}</div>

      {!reports.length ? <div className="rounded-3xl border border-dashed p-12 text-center"><div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10"><Lightbulb className="h-7 w-7 text-amber-600" /></div><h2 className="text-lg font-semibold">Recommendations begin with a report</h2><p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">Create a brand report first. Genit will inspect every work item and turn the findings into practical next steps.</p><Button asChild className="mt-5 rounded-full"><Link href="/visuals/summary">Create a brand report <ArrowRight className="h-4 w-4" /></Link></Button></div> : <>
        <div className="grid gap-3 sm:grid-cols-3"><div className="rounded-2xl border bg-card p-4"><CircleDot className="mb-3 h-5 w-5 text-violet-600" /><p className="text-2xl font-bold">{(counts.open || 0) + (counts.in_progress || 0)}</p><p className="text-xs text-muted-foreground">Active actions</p></div><div className="rounded-2xl border bg-card p-4"><Check className="mb-3 h-5 w-5 text-emerald-600" /><p className="text-2xl font-bold">{counts.done || 0}</p><p className="text-xs text-muted-foreground">Completed</p></div><div className="rounded-2xl border bg-card p-4"><Clock3 className="mb-3 h-5 w-5 text-amber-600" /><p className="text-2xl font-bold">{reports.length}</p><p className="text-xs text-muted-foreground">Reports in history</p></div></div>
        <div className="flex gap-2 overflow-x-auto pb-1">{(["all", "open", "in_progress", "done", "dismissed"] as const).map((status) => <Button key={status} size="sm" variant={filter === status ? "default" : "outline"} className="rounded-full" onClick={() => setFilter(status)}>{status === "all" ? "All" : statusLabels[status]}{status !== "all" && <span className="opacity-60">{counts[status] || 0}</span>}</Button>)}</div>
        <div className="space-y-3">{visible.map(({ report, item }) => <article key={`${report._id}:${item._id}`} className={`rounded-3xl border bg-card p-5 transition ${item.status === "done" ? "opacity-70" : ""}`}><div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between"><div className="max-w-3xl"><div className="flex flex-wrap items-center gap-2"><Badge className={item.priority === "high" ? "bg-rose-500/10 text-rose-700 hover:bg-rose-500/10 dark:text-rose-300" : item.priority === "medium" ? "bg-amber-500/10 text-amber-700 hover:bg-amber-500/10 dark:text-amber-300" : "bg-sky-500/10 text-sky-700 hover:bg-sky-500/10 dark:text-sky-300"}>{item.priority} priority</Badge><Badge variant="outline" className="capitalize">{item.category}</Badge><span className="text-xs text-muted-foreground">From {report.title}</span></div><h2 className={`mt-3 text-lg font-semibold ${item.status === "done" ? "line-through" : ""}`}>{item.title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.rationale}</p><div className="mt-4 rounded-2xl bg-muted/50 p-4"><p className="text-[11px] font-semibold uppercase tracking-wider text-violet-600">Recommended action</p><p className="mt-1 text-sm">{item.action}</p></div></div><div className="flex shrink-0 flex-wrap items-center gap-2"><Select value={item.status} onValueChange={(value) => changeStatus(report._id, item, value as RecommendationStatus)} disabled={busyId === item._id}><SelectTrigger className="w-[145px] rounded-full"><SelectValue /></SelectTrigger><SelectContent>{Object.entries(statusLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select><Button size="icon" variant="outline" className="rounded-full" onClick={() => openEdit(report._id, item)}><Pencil className="h-4 w-4" /></Button><Button size="icon" variant="outline" className="rounded-full text-rose-600" disabled={busyId === item._id} onClick={() => remove(report._id, item)}>{busyId === item._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}</Button></div></div></article>)}{!visible.length && <div className="rounded-3xl border border-dashed p-10 text-center text-sm text-muted-foreground">No recommendations match this status.</div>}</div>
      </>}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}><DialogContent className="max-w-xl"><DialogHeader><DialogTitle>{editing ? "Edit recommendation" : "Add recommendation"}</DialogTitle><DialogDescription>Keep the reasoning and the next action specific enough for your team to execute.</DialogDescription></DialogHeader><div className="space-y-4"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Recommendation title" /><Textarea value={form.rationale} onChange={(e) => setForm({ ...form, rationale: e.target.value })} placeholder="Why this matters for the brand" /><Textarea value={form.action} onChange={(e) => setForm({ ...form, action: e.target.value })} placeholder="The concrete next action" /><div className="grid gap-3 sm:grid-cols-2"><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" /><Select value={form.priority} onValueChange={(value) => setForm({ ...form, priority: value as any })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="high">High priority</SelectItem><SelectItem value="medium">Medium priority</SelectItem><SelectItem value="low">Low priority</SelectItem></SelectContent></Select></div>{!editing && reports.length > 1 && <Select value={reportId} onValueChange={setReportId}><SelectTrigger><SelectValue placeholder="Attach to report" /></SelectTrigger><SelectContent>{reports.map((report) => <SelectItem key={report._id} value={report._id}>{report.title}</SelectItem>)}</SelectContent></Select>}</div><DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button disabled={busyId === "save" || !form.title.trim() || !form.rationale.trim() || !form.action.trim()} onClick={save}>{busyId === "save" && <Loader2 className="h-4 w-4 animate-spin" />}Save recommendation</Button></DialogFooter></DialogContent></Dialog>
    </div>
  );
}
