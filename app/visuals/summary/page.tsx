"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  BrandReport, createBrandReport, deleteBrandReport, listBrandReports,
  refreshBrandReport, updateBrandReport,
} from "@/lib/brand-reports-api";
import { ArrowUpRight, BarChart3, CalendarDays, FileClock, ImageIcon, Layers3, Loader2, Pencil, Plus, RefreshCw, Sparkles, Trash2 } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

function errorMessage(error: any) {
  return error?.response?.data?.message || error?.message || "Something went wrong";
}

export default function SummaryPage() {
  const { toast } = useToast();
  const [reports, setReports] = useState<BrandReport[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({ title: "", notes: "", periodStart: "", periodEnd: "" });

  const selected = useMemo(() => reports.find((report) => report._id === selectedId) || reports[0], [reports, selectedId]);

  useEffect(() => {
    listBrandReports().then((items) => {
      setReports(items);
      if (items[0]) setSelectedId(items[0]._id);
    }).catch((error) => toast({ title: "Could not load reports", description: errorMessage(error), variant: "destructive" })).finally(() => setLoading(false));
  }, [toast]);

  const replace = (report: BrandReport) => {
    setReports((items) => [report, ...items.filter((item) => item._id !== report._id)]);
    setSelectedId(report._id);
  };

  async function createReport() {
    setBusy(true);
    try {
      const report = await createBrandReport(form);
      replace(report); setCreateOpen(false);
      toast({ title: "Brand report created", description: `${report.work.length} pieces of work were captured in this snapshot.` });
    } catch (error) { toast({ title: "Could not create report", description: errorMessage(error), variant: "destructive" }); }
    finally { setBusy(false); }
  }

  async function saveReport() {
    if (!selected) return;
    setBusy(true);
    try {
      replace(await updateBrandReport(selected._id, { title: form.title, notes: form.notes }));
      setEditOpen(false); toast({ title: "Report updated" });
    } catch (error) { toast({ title: "Could not update report", description: errorMessage(error), variant: "destructive" }); }
    finally { setBusy(false); }
  }

  async function refresh() {
    if (!selected) return;
    setBusy(true);
    try { replace(await refreshBrandReport(selected._id)); toast({ title: "Snapshot refreshed", description: "Work and recommendations now reflect the report period." }); }
    catch (error) { toast({ title: "Could not refresh report", description: errorMessage(error), variant: "destructive" }); }
    finally { setBusy(false); }
  }

  async function remove() {
    if (!selected || !window.confirm(`Delete “${selected.title}”? This report history cannot be restored.`)) return;
    setBusy(true);
    try {
      await deleteBrandReport(selected._id);
      const next = reports.filter((report) => report._id !== selected._id);
      setReports(next); setSelectedId(next[0]?._id || ""); toast({ title: "Report deleted" });
    } catch (error) { toast({ title: "Could not delete report", description: errorMessage(error), variant: "destructive" }); }
    finally { setBusy(false); }
  }

  const openCreate = () => {
    const end = new Date(); const start = new Date(end.getTime() - 30 * 86400000);
    setForm({ title: "", notes: "", periodStart: start.toISOString().slice(0, 10), periodEnd: end.toISOString().slice(0, 10) }); setCreateOpen(true);
  };

  if (loading) return <div className="flex min-h-[500px] items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-violet-500" /></div>;

  return (
    <div className="flex w-full flex-col gap-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.18em] text-violet-600"><BarChart3 className="h-4 w-4" />Brand intelligence</div><h1 className="text-3xl font-bold tracking-tight">Summary & reports</h1><p className="mt-1 max-w-2xl text-sm text-muted-foreground">Understand what your creative work means for the brand—not just how much was produced.</p></div>
        <Button onClick={openCreate} className="rounded-full bg-violet-600 hover:bg-violet-700"><Plus className="h-4 w-4" />Create report</Button>
      </div>

      {!selected ? (
        <div className="rounded-3xl border border-dashed p-12 text-center"><div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10"><FileClock className="h-7 w-7 text-violet-600" /></div><h2 className="text-lg font-semibold">Create your first brand snapshot</h2><p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">It will collect every recorded work item in the period, explain its brand impact, and preserve the result in report history.</p><Button onClick={openCreate} className="mt-5 rounded-full">Create report</Button></div>
      ) : (
        <>
          <div className="grid gap-3 lg:grid-cols-[1fr_310px]">
            <section className="overflow-hidden rounded-3xl border bg-gradient-to-br from-violet-950 via-slate-950 to-black p-6 text-white md:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div><Badge className="border-white/10 bg-white/10 text-white">Brand score {selected.score}/100</Badge><h2 className="mt-4 text-2xl font-semibold">{selected.title}</h2><p className="mt-2 text-sm text-white/55">{formatDate(selected.periodStart)} — {formatDate(selected.periodEnd)}</p></div><div className="flex gap-2"><Button size="sm" variant="outline" disabled={busy} onClick={refresh} className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"><RefreshCw className={busy ? "h-4 w-4 animate-spin" : "h-4 w-4"} />Refresh</Button><Button size="icon" variant="outline" onClick={() => { setForm({ title: selected.title, notes: selected.notes || "", periodStart: "", periodEnd: "" }); setEditOpen(true); }} className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"><Pencil className="h-4 w-4" /></Button><Button size="icon" variant="outline" onClick={remove} className="rounded-full border-white/15 bg-white/5 text-rose-300 hover:bg-rose-500/10 hover:text-rose-200"><Trash2 className="h-4 w-4" /></Button></div></div>
              <div className="mt-8 grid gap-4 md:grid-cols-2"><div className="rounded-2xl border border-white/10 bg-white/[.06] p-5"><p className="text-xs font-semibold uppercase tracking-wider text-violet-300">What happened</p><p className="mt-3 text-sm leading-6 text-white/75">{selected.executiveSummary}</p></div><div className="rounded-2xl border border-white/10 bg-white/[.06] p-5"><p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">What it means for your brand</p><p className="mt-3 text-sm leading-6 text-white/75">{selected.brandMeaning}</p></div></div>
            </section>
            <aside className="rounded-3xl border bg-card p-5"><div className="mb-4 flex items-center gap-2"><FileClock className="h-4 w-4 text-violet-600" /><h3 className="font-semibold">Report history</h3></div><div className="space-y-2">{reports.map((report) => <button key={report._id} onClick={() => setSelectedId(report._id)} className={`w-full rounded-2xl border p-3 text-left transition ${report._id === selected._id ? "border-violet-500 bg-violet-500/5" : "hover:bg-muted/50"}`}><div className="flex items-center justify-between gap-2"><span className="truncate text-sm font-medium">{report.title}</span><span className="text-xs font-semibold text-violet-600">{report.score}</span></div><p className="mt-1 text-xs text-muted-foreground">{formatDate(report.createdAt)} · {report.metrics.totalWork} works</p></button>)}</div></aside>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[{ label: "Work captured", value: selected.metrics.totalWork, icon: Layers3 }, { label: "Published", value: selected.metrics.published, icon: ArrowUpRight }, { label: "Engagement", value: selected.metrics.engagement?.toLocaleString() || "0", icon: Sparkles }, { label: "Brand consistency", value: `${selected.metrics.consistency}%`, icon: BarChart3 }].map(({ label, value, icon: Icon }) => <div key={label} className="rounded-2xl border bg-card p-4"><Icon className="mb-4 h-5 w-5 text-violet-600" /><p className="text-2xl font-bold">{value}</p><p className="mt-1 text-xs text-muted-foreground">{label}</p></div>)}
          </div>

          <section className="rounded-3xl border bg-card p-5 md:p-6"><div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="font-semibold">Every work in this report</h3><p className="text-xs text-muted-foreground">A preserved record of the work used to calculate this snapshot.</p></div><div className="flex flex-wrap gap-2">{Object.entries(selected.metrics.typeCounts || {}).map(([type, count]) => <Badge key={type} variant="secondary">{type.replace("_", " ")} · {count}</Badge>)}</div></div>
            {selected.work.length ? <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{selected.work.map((work) => <article key={`${work.source}:${work.sourceId}`} className="group flex min-h-28 overflow-hidden rounded-2xl border bg-background"><div className="flex h-auto w-28 shrink-0 items-center justify-center overflow-hidden bg-muted">{work.thumbnail ? <img src={work.thumbnail} alt="" className="h-full w-full object-cover transition group-hover:scale-105" /> : <ImageIcon className="h-6 w-6 text-muted-foreground" />}</div><div className="min-w-0 flex-1 p-4"><div className="flex items-center gap-2"><Badge variant="outline" className="text-[10px]">{work.type.replace("_", " ")}</Badge>{work.platform && <span className="text-[10px] capitalize text-muted-foreground">{work.platform}</span>}</div><h4 className="mt-2 line-clamp-2 text-sm font-semibold">{work.title}</h4><div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground"><span>{formatDate(work.createdAt)}</span><span className="capitalize">{work.status}</span></div></div></article>)}</div> : <div className="rounded-2xl bg-muted/40 p-10 text-center text-sm text-muted-foreground">No work was recorded inside this period.</div>}
          </section>
        </>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}><DialogContent><DialogHeader><DialogTitle>Create brand report</DialogTitle><DialogDescription>Create a fixed snapshot of all work and its meaning for your brand.</DialogDescription></DialogHeader><div className="space-y-4"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Report title (optional)" /><div className="grid grid-cols-2 gap-3"><label className="text-xs text-muted-foreground">From<Input className="mt-1" type="date" value={form.periodStart} onChange={(e) => setForm({ ...form, periodStart: e.target.value })} /></label><label className="text-xs text-muted-foreground">To<Input className="mt-1" type="date" value={form.periodEnd} onChange={(e) => setForm({ ...form, periodEnd: e.target.value })} /></label></div><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Internal notes (optional)" /></div><DialogFooter><Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button><Button disabled={busy} onClick={createReport}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}Create snapshot</Button></DialogFooter></DialogContent></Dialog>
      <Dialog open={editOpen} onOpenChange={setEditOpen}><DialogContent><DialogHeader><DialogTitle>Edit report</DialogTitle><DialogDescription>Rename the snapshot or keep context for your team.</DialogDescription></DialogHeader><div className="space-y-4"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Report title" /><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Internal notes" /></div><DialogFooter><Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button><Button disabled={busy || !form.title.trim()} onClick={saveReport}>Save changes</Button></DialogFooter></DialogContent></Dialog>
    </div>
  );
}
