"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Organization } from "@/context/AuthenticatedContext";
import { useToast } from "@/hooks/use-toast";
import {
  BrandBrainItem,
  BrandBrainItemType,
  crawlBrandBrainWebsite,
  createBrandBrainItem,
  deleteBrandBrainItem,
  fetchBrandBrain,
  searchBrandBrain,
  syncBrandBrainFromBrand,
  updateBrandBrainItem,
  uploadBrandBrainDocuments,
} from "@/lib/brand-brain-api";
import { LoadingFileLoader } from "@/utils/Loading";
import {
  Brain,
  CheckCircle2,
  ChevronDown,
  FileText,
  Globe,
  type LucideIcon,
  Package,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const typeOptions: Array<{
  value: BrandBrainItemType;
  label: string;
  icon: LucideIcon;
}> = [
  { value: "instruction", label: "Instruction", icon: ShieldCheck },
  { value: "brand_voice", label: "Voice", icon: Sparkles },
  { value: "product", label: "Product", icon: Package },
  { value: "faq", label: "FAQ", icon: Brain },
  { value: "policy", label: "Policy", icon: FileText },
];

const emptyDraft = {
  title: "",
  type: "instruction" as BrandBrainItemType,
  content: "",
  sourceUrl: "",
  tags: "",
};

export function BrandBrainSettings({
  organization,
  readOnly,
}: {
  organization: Organization | null;
  readOnly: boolean;
}) {
  const { toast } = useToast();
  const [items, setItems] = useState<BrandBrainItem[]>([]);
  const [canEdit, setCanEdit] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openSourceIds, setOpenSourceIds] = useState<string[]>([]);
  const [isNewSourceOpen, setIsNewSourceOpen] = useState(false);
  const [draft, setDraft] = useState(emptyDraft);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);

  const selected = useMemo(
    () => items.find((item) => item._id === selectedId) || null,
    [items, selectedId]
  );

  const editable = canEdit && !readOnly;

  const load = async () => {
    if (!organization?._id) return;
    setLoading(true);
    try {
      const data = await fetchBrandBrain(organization._id);
      setItems(data.items);
      setCanEdit(data.stats.canEdit);
      setSelectedId((current) =>
        current && data.items.some((item) => item._id === current)
          ? current
          : data.items[0]?._id || null
      );
      setOpenSourceIds((current) =>
        current.filter((id) => data.items.some((item) => item._id === id))
      );
    } catch (error: any) {
      toast({
        title: "Could not load brand brain",
        description: error?.response?.data?.message || error?.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization?._id]);

  useEffect(() => {
    if (!selected) return;
    setDraft({
      title: selected.title,
      type: selected.type,
      content: selected.content,
      sourceUrl: selected.sourceUrl || "",
      tags: (selected.tags || []).join(", "),
    });
  }, [selected]);

  const resetDraft = () => {
    setSelectedId(null);
    setIsNewSourceOpen(true);
    setDraft(emptyDraft);
  };

  const toggleSource = (itemId: string) => {
    setSelectedId(itemId);
    setIsNewSourceOpen(false);
    setOpenSourceIds((current) =>
      current.includes(itemId)
        ? current.filter((id) => id !== itemId)
        : [...current, itemId]
    );
  };

  const tags = () =>
    draft.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

  const save = async () => {
    if (!organization?._id || !editable) return;
    if (!draft.title.trim() || !draft.content.trim()) {
      toast({
        title: "Title and content are required",
        variant: "destructive",
      });
      return;
    }
    setBusy(true);
    try {
      const item = selected
        ? await updateBrandBrainItem(organization._id, selected._id, {
            title: draft.title,
            type: draft.type,
            content: draft.content,
            sourceUrl: draft.sourceUrl,
            tags: tags(),
          })
        : await createBrandBrainItem(organization._id, {
            title: draft.title,
            type: draft.type,
            content: draft.content,
            sourceUrl: draft.sourceUrl,
            tags: tags(),
          });
      setItems((prev) =>
        selected
          ? prev.map((entry) => (entry._id === item._id ? item : entry))
          : [item, ...prev]
      );
      setSelectedId(item._id);
      setIsNewSourceOpen(false);
      setOpenSourceIds((current) =>
        current.includes(item._id) ? current : [item._id, ...current]
      );
      toast({ title: "Brand brain saved" });
    } catch (error: any) {
      toast({
        title: "Could not save brand brain",
        description: error?.response?.data?.message || error?.message,
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!organization?._id || !selected || !editable) return;
    setBusy(true);
    try {
      await deleteBrandBrainItem(organization._id, selected._id);
      setItems((prev) => prev.filter((item) => item._id !== selected._id));
      setOpenSourceIds((current) =>
        current.filter((id) => id !== selected._id)
      );
      resetDraft();
      toast({ title: "Brain item deleted" });
    } catch (error: any) {
      toast({
        title: "Could not delete item",
        description: error?.response?.data?.message || error?.message,
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  const upload = async () => {
    if (!organization?._id || !editable || files.length === 0) return;
    setBusy(true);
    try {
      const created = await uploadBrandBrainDocuments(organization._id, files);
      setItems((prev) => [...created, ...prev]);
      setSelectedId(created[0]?._id || null);
      setIsNewSourceOpen(false);
      setOpenSourceIds((current) => [
        ...created.map((item) => item._id),
        ...current,
      ]);
      setFiles([]);
      toast({ title: "Documents added" });
    } catch (error: any) {
      toast({
        title: "Could not upload documents",
        description: error?.response?.data?.message || error?.message,
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  const crawl = async () => {
    if (!organization?._id || !editable || !websiteUrl.trim()) return;
    setBusy(true);
    try {
      const item = await crawlBrandBrainWebsite(organization._id, {
        url: websiteUrl.trim(),
      });
      setItems((prev) => [item, ...prev]);
      setSelectedId(item._id);
      setIsNewSourceOpen(false);
      setOpenSourceIds((current) =>
        current.includes(item._id) ? current : [item._id, ...current]
      );
      setWebsiteUrl("");
      toast({ title: "Website learned" });
    } catch (error: any) {
      toast({
        title: "Could not learn website",
        description: error?.response?.data?.message || error?.message,
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  const syncBrand = async () => {
    if (!organization?._id || !editable) return;
    setBusy(true);
    try {
      await syncBrandBrainFromBrand(organization._id);
      await load();
      toast({ title: "Brand synced to brain" });
    } catch (error: any) {
      toast({
        title: "Could not sync brand",
        description: error?.response?.data?.message || error?.message,
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  const runSearch = async () => {
    if (!organization?._id || !query.trim()) return;
    try {
      const data = await searchBrandBrain(organization._id, query);
      setMatches(data.chunks);
    } catch (error: any) {
      toast({
        title: "Search failed",
        description: error?.response?.data?.message || error?.message,
        variant: "destructive",
      });
    }
  };

  const renderSourceEditor = (showDelete: boolean) => (
    <fieldset disabled={!editable || busy} className='space-y-3'>
      <div className='grid gap-3 md:grid-cols-[1fr_180px]'>
        <div className='space-y-2'>
          <Label>Title</Label>
          <Input
            value={draft.title}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder='Product facts, voice rules, FAQs'
          />
        </div>
        <div className='space-y-2'>
          <Label>Type</Label>
          <select
            value={draft.type}
            onChange={(e) =>
              setDraft((prev) => ({
                ...prev,
                type: e.target.value as BrandBrainItemType,
              }))
            }
            className='border-input dark:bg-input/30 h-10 w-full rounded-md border bg-transparent px-3 text-sm focus:ring-2 focus:ring-cyan-400/40 focus:outline-none'
          >
            {typeOptions.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className='space-y-2'>
        <Label>Source URL</Label>
        <Input
          value={draft.sourceUrl}
          onChange={(e) =>
            setDraft((prev) => ({
              ...prev,
              sourceUrl: e.target.value,
            }))
          }
          placeholder='https://example.com'
        />
      </div>
      <div className='space-y-2'>
        <Label>Content</Label>
        <Textarea
          value={draft.content}
          onChange={(e) =>
            setDraft((prev) => ({ ...prev, content: e.target.value }))
          }
          rows={7}
          placeholder='Add approved knowledge for AI agents'
        />
      </div>
      <div className='space-y-2'>
        <Label>Tags</Label>
        <Input
          value={draft.tags}
          onChange={(e) =>
            setDraft((prev) => ({ ...prev, tags: e.target.value }))
          }
          placeholder='brand, product, support'
        />
      </div>
      {draft.tags.trim() && (
        <div className='flex flex-wrap gap-1.5'>
          {tags().map((tag) => (
            <span
              key={tag}
              className='bg-muted text-muted-foreground rounded-full px-2.5 py-1 text-xs'
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className='flex flex-wrap justify-end gap-2'>
        {showDelete && selected && (
          <Button
            type='button'
            variant='outline'
            onClick={remove}
            disabled={!editable || busy}
          >
            <Trash2 className='mr-2 h-4 w-4' />
            Delete
          </Button>
        )}
        <Button type='button' onClick={save} disabled={!editable || busy}>
          <Save className='mr-2 h-4 w-4' />
          Save brain
        </Button>
      </div>
    </fieldset>
  );

  const renderAddSourceTools = () => (
    <div className='grid gap-3 md:grid-cols-2'>
      <div className='border-border rounded-lg border p-3'>
        <Label>Documents</Label>
        <div className='mt-2 flex gap-2'>
          <Input
            type='file'
            multiple
            disabled={!editable}
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
          />
          <Button
            type='button'
            variant='outline'
            onClick={upload}
            disabled={!editable || files.length === 0 || busy}
          >
            <Upload className='h-4 w-4' />
          </Button>
        </div>
      </div>
      <div className='border-border rounded-lg border p-3'>
        <Label>Website</Label>
        <div className='mt-2 flex gap-2'>
          <Input
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder='https://example.com'
            disabled={!editable}
          />
          <Button
            type='button'
            variant='outline'
            onClick={crawl}
            disabled={!editable || !websiteUrl.trim() || busy}
          >
            <Globe className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className='space-y-5'>
      <Card className='overflow-hidden'>
        <CardHeader>
          <div className='flex flex-col gap-3 md:flex-row md:items-start md:justify-between'>
            <div>
              <CardTitle>Advanced brain</CardTitle>
              <CardDescription>Organization details sync</CardDescription>
            </div>
            <div className='flex flex-wrap items-center gap-2'>
              <span className='border-border bg-muted/40 text-muted-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs'>
                <CheckCircle2 className='h-3.5 w-3.5 text-emerald-500' />
                Sync
              </span>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={syncBrand}
                disabled={!editable || busy}
                className='flex items-center gap-2 border-none bg-transparent'
              >
                {busy ? (
                  <LoadingFileLoader size={12} />
                ) : (
                  <RefreshCw className='h-4 w-4' />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-5'>
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Label>Sources</Label>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={resetDraft}
                disabled={!editable}
              >
                New
              </Button>
            </div>
            <div className='border-border divide-border overflow-hidden rounded-lg border'>
              {isNewSourceOpen && (
                <div className='divide-border divide-y'>
                  <button
                    type='button'
                    onClick={() => setIsNewSourceOpen((current) => !current)}
                    className='bg-muted/30 hover:bg-muted/50 flex w-full items-center justify-between gap-3 px-3 py-3 text-left transition-colors'
                  >
                    <div className='min-w-0'>
                      <p className='truncate text-sm font-medium'>New source</p>
                      <p className='text-muted-foreground mt-1 text-xs'>
                        Add approved knowledge for AI agents.
                      </p>
                    </div>
                    <ChevronDown className='text-muted-foreground h-4 w-4 shrink-0 rotate-180 transition-transform' />
                  </button>
                  <div className='bg-muted/20 px-3 py-3'>
                    {renderSourceEditor(false)}
                    <div className='border-border mt-4 border-t pt-4'>
                      {renderAddSourceTools()}
                    </div>
                  </div>
                </div>
              )}
              {loading ? (
                <div className='text-muted-foreground px-3 py-3 text-sm'>
                  Loading sources...
                </div>
              ) : items.length === 0 ? (
                <div className='text-muted-foreground px-3 py-3 text-sm'>
                  No sources yet.
                </div>
              ) : (
                items.map((item) => {
                  const isActive = selectedId === item._id;
                  const isOpen = openSourceIds.includes(item._id);
                  return (
                    <div key={item._id} className='divide-border divide-y'>
                      <button
                        type='button'
                        onClick={() => toggleSource(item._id)}
                        className={`hover:bg-muted/50 flex w-full items-center justify-between gap-3 px-3 py-3 text-left transition-colors ${
                          isActive ? "bg-muted/30" : ""
                        }`}
                      >
                        <div className='min-w-0'>
                          <p className='truncate text-sm font-medium'>
                            {item.title}
                          </p>
                          <p className='text-muted-foreground mt-1 line-clamp-1 text-xs'>
                            {item.summary || item.content}
                          </p>
                        </div>
                        <ChevronDown
                          className={`text-muted-foreground h-4 w-4 shrink-0 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className='bg-muted/20 px-3 py-3'>
                          {isActive ? (
                            renderSourceEditor(true)
                          ) : (
                            <div className='text-muted-foreground text-xs leading-5 whitespace-pre-wrap'>
                              {item.content}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Search brain</CardTitle>
          <CardDescription>
            Test what agents retrieve from the saved sources.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            <div className='flex gap-2'>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") runSearch();
                }}
                placeholder='Check what agents will retrieve'
              />
              <Button type='button' variant='outline' onClick={runSearch}>
                <Search className='h-4 w-4' />
              </Button>
            </div>
            {matches.length > 0 && (
              <div className='space-y-2'>
                {matches.slice(0, 4).map((match) => (
                  <div
                    key={`${match.itemId}-${match.text.slice(0, 16)}`}
                    className='bg-muted/40 rounded-md p-2'
                  >
                    <p className='text-xs font-medium'>{match.title}</p>
                    <p className='text-muted-foreground mt-1 line-clamp-2 text-xs'>
                      {match.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
