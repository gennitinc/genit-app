"use client";

import { LocalizedText } from "@/components/localized-text";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Organization } from "@/context/AuthenticatedContext";
import { useToast } from "@/hooks/use-toast";
import {
  AgentSkill,
  AgentSkillLimits,
  createAgentSkill,
  deleteAgentSkill,
  fetchAgentSkills,
  updateAgentSkill,
} from "@/lib/agent-skills-api";
import { ChevronDown, Plus, Save, Trash2, Upload, Wand2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const emptyDraft = { name: "", description: "", instructions: "" };
const NEW = "new";

const errorText = (error: any) =>
  error?.response?.data?.message || error?.message || "Something went wrong";

export function AgentSkillsSettings({
  organization,
  readOnly,
}: {
  organization: Organization | null;
  readOnly: boolean;
}) {
  const { toast } = useToast();
  const orgId = organization?._id;
  const [skills, setSkills] = useState<AgentSkill[]>([]);
  const [limits, setLimits] = useState<AgentSkillLimits | null>(null);
  const [canEdit, setCanEdit] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const editable = canEdit && !readOnly;
  const atLimit = !!limits && skills.length >= limits.perOrg;

  const load = async () => {
    if (!orgId) return;
    setLoading(true);
    try {
      const data = await fetchAgentSkills(orgId);
      setSkills(data.skills);
      setCanEdit(data.canEdit);
      setLimits(data.limits);
    } catch (error) {
      toast({
        title: "Could not load skills",
        description: errorText(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  const open = (id: string | null) => {
    if (id === openId) return setOpenId(null);
    const skill = skills.find((s) => s._id === id);
    setDraft(
      skill
        ? {
            name: skill.name,
            description: skill.description,
            instructions: skill.instructions,
          }
        : emptyDraft
    );
    setOpenId(id);
  };

  const run = async (action: () => Promise<void>, failTitle: string) => {
    setBusy(true);
    try {
      await action();
    } catch (error) {
      toast({
        title: failTitle,
        description: errorText(error),
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  const save = () =>
    run(async () => {
      if (!orgId) return;
      if (openId === NEW) {
        const skill = await createAgentSkill(orgId, draft);
        setSkills((prev) =>
          [...prev, skill].sort((a, b) => a.name.localeCompare(b.name))
        );
        setOpenId(skill._id);
        setDraft({
          name: skill.name,
          description: skill.description,
          instructions: skill.instructions,
        });
      } else if (openId) {
        const skill = await updateAgentSkill(orgId, openId, draft);
        setSkills((prev) => prev.map((s) => (s._id === skill._id ? skill : s)));
        setDraft({
          name: skill.name,
          description: skill.description,
          instructions: skill.instructions,
        });
      }
      toast({ title: "Skill saved" });
    }, "Could not save skill");

  const toggle = (skill: AgentSkill, enabled: boolean) =>
    run(async () => {
      if (!orgId) return;
      const updated = await updateAgentSkill(orgId, skill._id, { enabled });
      setSkills((prev) => prev.map((s) => (s._id === skill._id ? updated : s)));
    }, "Could not update skill");

  const remove = (skill: AgentSkill) =>
    run(async () => {
      if (!orgId) return;
      if (!window.confirm(`Delete the "${skill.name}" skill?`)) return;
      await deleteAgentSkill(orgId, skill._id);
      setSkills((prev) => prev.filter((s) => s._id !== skill._id));
      setOpenId(null);
      toast({ title: "Skill deleted" });
    }, "Could not delete skill");

  const importFiles = (files: FileList | null) =>
    run(async () => {
      if (!orgId || !files?.length) return;
      const created: AgentSkill[] = [];
      for (const file of Array.from(files)) {
        const markdown = await file.text();
        // A file with no `name:` field or heading is named after the file.
        const hasName =
          /^---[\s\S]*?\nname:/.test(markdown) || /^#\s+/m.test(markdown);
        created.push(
          await createAgentSkill(orgId, {
            markdown,
            name: hasName
              ? undefined
              : file.name.replace(/\.(md|markdown|txt)$/i, ""),
          })
        );
      }
      setSkills((prev) =>
        [...prev, ...created].sort((a, b) => a.name.localeCompare(b.name))
      );
      toast({
        title: `Imported ${created.length} skill${created.length === 1 ? "" : "s"}`,
      });
    }, "Could not import skill").finally(() => {
      if (fileInput.current) fileInput.current.value = "";
    });

  const renderEditor = (skill: AgentSkill | null) => (
    <fieldset disabled={!editable || busy} className='space-y-3'>
      <div className='space-y-2'>
        <Label>
          <LocalizedText text={"Name"} />
        </Label>
        <Input
          value={draft.name}
          maxLength={limits?.name}
          onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
          placeholder='refund-requests'
        />
      </div>
      <div className='space-y-2'>
        <Label>
          <LocalizedText text={"When should the agent use it?"} />
        </Label>
        <Textarea
          value={draft.description}
          maxLength={limits?.description}
          rows={2}
          onChange={(e) =>
            setDraft((d) => ({ ...d, description: e.target.value }))
          }
          placeholder='Use when a customer asks for a refund or to cancel an order.'
        />
      </div>
      <div className='space-y-2'>
        <Label>
          <LocalizedText text={"Instructions"} />
        </Label>
        <Textarea
          value={draft.instructions}
          maxLength={limits?.instructions}
          rows={10}
          className='font-mono text-xs'
          onChange={(e) =>
            setDraft((d) => ({ ...d, instructions: e.target.value }))
          }
          placeholder={
            "1. Look up the order and confirm it was placed in the last 30 days.\n2. Offer store credit first.\n3. ..."
          }
        />
      </div>
      <div className='flex flex-wrap justify-end gap-2'>
        {skill && (
          <Button type='button' variant='outline' onClick={() => remove(skill)}>
            <Trash2 className='mr-2 h-4 w-4' />
            <LocalizedText text={"Delete"} />
          </Button>
        )}
        <Button
          type='button'
          onClick={save}
          disabled={
            !draft.name.trim() ||
            !draft.description.trim() ||
            !draft.instructions.trim()
          }
        >
          <Save className='mr-2 h-4 w-4' />
          <LocalizedText text={"Save skill"} />
        </Button>
      </div>
    </fieldset>
  );

  return (
    <Card className='overflow-hidden rounded-lg border-zinc-200 shadow-sm dark:border-white/10 dark:bg-white/[0.035] dark:shadow-none'>
      <CardHeader className='border-b border-zinc-200 p-5 dark:border-white/10'>
        <div className='flex flex-col gap-3 md:flex-row md:items-start md:justify-between'>
          <div>
            <CardTitle className='flex items-center gap-2 text-base'>
              <Wand2 className='h-4 w-4' />
              <LocalizedText text={"Agent skills"} />
            </CardTitle>
            <CardDescription>
              <LocalizedText
                text={
                  "Teach your AI agent how your business does things. The agent picks the right skill on its own when a task matches."
                }
              />
            </CardDescription>
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            <input
              ref={fileInput}
              type='file'
              accept='.md,.markdown,.txt'
              multiple
              className='hidden'
              onChange={(e) => importFiles(e.target.files)}
            />
            <Button
              type='button'
              variant='outline'
              size='sm'
              disabled={!editable || busy || atLimit}
              onClick={() => fileInput.current?.click()}
            >
              <Upload className='mr-2 h-4 w-4' />
              <LocalizedText text={"Import SKILL.md"} />
            </Button>
            <Button
              type='button'
              size='sm'
              disabled={!editable || busy || atLimit}
              onClick={() => open(NEW)}
            >
              <Plus className='mr-2 h-4 w-4' />
              <LocalizedText text={"New skill"} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className='p-5'>
        <div className='border-border divide-border divide-y overflow-hidden rounded-lg border'>
          {openId === NEW && (
            <div className='bg-muted/20 px-3 py-3'>{renderEditor(null)}</div>
          )}
          {loading ? (
            <div className='text-muted-foreground px-3 py-3 text-sm'>
              <LocalizedText text={"Loading skills..."} />
            </div>
          ) : skills.length === 0 && openId !== NEW ? (
            <div className='text-muted-foreground px-3 py-3 text-sm'>
              <LocalizedText
                text={
                  "No skills yet. Add one for a task your team repeats, like handling refunds or qualifying leads."
                }
              />
            </div>
          ) : (
            skills.map((skill) => (
              <div key={skill._id} className='divide-border divide-y'>
                <div className='hover:bg-muted/50 flex items-center gap-3 px-3 py-3 transition-colors'>
                  <button
                    type='button'
                    onClick={() => open(skill._id)}
                    className='flex min-w-0 flex-1 items-center justify-between gap-3 text-left'
                  >
                    <div className='min-w-0'>
                      <p
                        className={`truncate font-mono text-sm font-medium ${
                          skill.enabled ? "" : "text-muted-foreground"
                        }`}
                      >
                        {skill.name}
                      </p>
                      <p className='text-muted-foreground mt-1 line-clamp-1 text-xs'>
                        {skill.description}
                      </p>
                    </div>
                    <ChevronDown
                      className={`text-muted-foreground h-4 w-4 shrink-0 transition-transform ${
                        openId === skill._id ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <Switch
                    checked={skill.enabled}
                    disabled={!editable || busy}
                    onCheckedChange={(checked) => toggle(skill, checked)}
                    aria-label={`${skill.enabled ? "Turn off" : "Turn on"} ${skill.name}`}
                  />
                </div>
                {openId === skill._id && (
                  <div className='bg-muted/20 px-3 py-3'>
                    {renderEditor(skill)}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        {limits && (
          <p className='text-muted-foreground mt-2 text-xs'>
            {skills.length} / {limits.perOrg} <LocalizedText text={"skills"} />
            {!editable && (
              <>
                {" · "}
                <LocalizedText
                  text={"Only owners and admins can edit skills"}
                />
              </>
            )}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
