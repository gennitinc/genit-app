"use client";

import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LocalizedText } from "@/components/localized-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { apiResponseFileUpload } from "@/utils/apiResponseFileUpload";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Cpu,
  FileText,
  Layers,
  Paperclip,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { SnackbarProvider, closeSnackbar, enqueueSnackbar } from "notistack";
import { ChangeEvent, FormEvent, useState } from "react";

export default function SuggestPage() {
  // Support form state
  const [supportName, setSupportName] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [supportSubject, setSupportSubject] = useState("");
  const [supportDescription, setSupportDescription] = useState("");
  const [supportTicketType, setSupportTicketType] = useState("");
  const [supportFile, setSupportFile] = useState<File | null>(null);

  // Suggestion form state
  const [suggestionName, setSuggestionName] = useState("");
  const [suggestionEmail, setSuggestionEmail] = useState("");
  const [suggestionSubject, setSuggestionSubject] = useState("");
  const [suggestionDescription, setSuggestionDescription] = useState("");

  const [supportSubmitted, setSupportSubmitted] = useState(false);
  const [suggestionSubmitted, setSuggestionSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSupportChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    switch (name) {
      case "name":
        setSupportName(value);
        break;
      case "email":
        setSupportEmail(value);
        break;
      case "subject":
        setSupportSubject(value);
        break;
      case "description":
        setSupportDescription(value);
        break;
    }
  };

  const handleSuggestionChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    switch (name) {
      case "name":
        setSuggestionName(value);
        break;
      case "email":
        setSuggestionEmail(value);
        break;
      case "subject":
        setSuggestionSubject(value);
        break;
      case "description":
        setSuggestionDescription(value);
        break;
    }
  };

  const handleSupportFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setSupportFile(file);
  };

  const handleSupportTicketTypeChange = (value: string) => {
    setSupportTicketType(value);
  };

  const onSupportSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("name", supportName);
      formData.append("email", supportEmail);
      formData.append("subject", supportSubject);
      formData.append("description", supportDescription);
      formData.append("ticketType", supportTicketType);
      formData.append("status", "pending");

      if (supportFile) {
        formData.append("support-file", supportFile);
      }

      const response = await apiResponseFileUpload.post(
        "customer/support",
        formData,
        {
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        enqueueSnackbar("Support ticket submitted successfully", {
          variant: "success",
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          action: (key) => (
            <button
              onClick={() => closeSnackbar(key)}
              className='text-white hover:opacity-80'
            >
              ✕
            </button>
          ),
        });

        setSupportSubmitted(true);
        setSupportName("");
        setSupportEmail("");
        setSupportSubject("");
        setSupportDescription("");
        setSupportTicketType("");
        setSupportFile(null);
      }
    } catch (err) {
      console.error("Error submitting support ticket", err);
      enqueueSnackbar("Error processing support ticket", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        action: (key) => (
          <button
            onClick={() => closeSnackbar(key)}
            className='text-white hover:opacity-80'
          >
            ✕
          </button>
        ),
      });
      setError("Failed to submit support ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSuggestionSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const newData = {
        name: suggestionName,
        email: suggestionEmail,
        title: suggestionSubject,
        description: suggestionDescription,
        status: "pending",
      };

      const response = await apiResponseFileUpload.post(
        "customer/suggest",
        newData,
        {
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        enqueueSnackbar("Thank you! Your suggestion has been recorded.", {
          variant: "success",
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          action: (key) => (
            <button
              onClick={() => closeSnackbar(key)}
              className='text-white hover:opacity-80'
            >
              ✕
            </button>
          ),
        });

        setSuggestionSubmitted(true);
        setSuggestionName("");
        setSuggestionEmail("");
        setSuggestionSubject("");
        setSuggestionDescription("");
      }
    } catch (err) {
      console.error("Error submitting suggestion", err);
      enqueueSnackbar("Error processing suggestion", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        action: (key) => (
          <button
            onClick={() => closeSnackbar(key)}
            className='text-white hover:opacity-80'
          >
            ✕
          </button>
        ),
      });
      setError("Failed to submit suggestion. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen bg-white text-neutral-900 dark:bg-black dark:text-neutral-100'>
      <SnackbarProvider
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
      <LandingNavbar />

      <main className='mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24'>
        {/* Header Section */}
        <div className='max-w-3xl'>
          <div className='flex items-center gap-2 font-mono text-xs tracking-widest text-neutral-500 uppercase'>
            <Link
              href='/'
              className='transition-colors hover:text-neutral-900 dark:hover:text-white'
            >
              Home
            </Link>
            <span className='text-neutral-300 dark:text-neutral-700'>/</span>
            <span>Support &amp; Feedback</span>
          </div>

          <h1 className='mt-6 text-3xl font-bold tracking-tight text-neutral-950 sm:text-5xl dark:text-white'>
            Help shape the future of Genit.
          </h1>
          <p className='mt-5 text-pretty text-base leading-7 text-neutral-600 sm:text-lg dark:text-neutral-400'>
            Have an idea for a new marketing agent capability, want a tool
            integration added, or need technical assistance with your workspace?
            Our product and engineering teams review every submission.
          </p>
        </div>

        {/* Hero Figure 01: Product Collaboration */}
        <figure className='mt-12 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900'>
          <img
            className='h-auto max-h-[500px] w-full object-cover'
            src='https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'
            alt='Product design, wireframing, and user feedback in Genit'
          />
          <figcaption className='flex flex-wrap items-center justify-between gap-2 border-t border-neutral-200 px-5 py-3 font-mono text-xs text-neutral-500 dark:border-neutral-800'>
            <span>Figure 01: Product architecture evolving through user feedback &amp; continuous iteration</span>
            <span>Genit Engineering &amp; Design</span>
          </figcaption>
        </figure>

        {/* 3 Architectural Pillars */}
        <div className='mt-16 grid grid-cols-1 gap-6 border-y border-neutral-200 py-10 sm:grid-cols-3 dark:border-neutral-800'>
          <div className='border-l border-neutral-300 ps-4 dark:border-neutral-700'>
            <div className='flex items-center gap-2 text-xs font-mono text-neutral-400 dark:text-neutral-500 uppercase'>
              <Cpu className='size-3.5' />
              <span>01 // Agents &amp; Skills</span>
            </div>
            <h3 className='mt-2 font-semibold text-neutral-950 dark:text-white'>
              <LocalizedText text={"Agent Capabilities"} />
            </h3>
            <p className='mt-1 text-sm leading-6 text-neutral-600 dark:text-neutral-400 text-pretty'>
              <LocalizedText
                text={
                  "Suggest new workflows, creative formats, or autonomous execution skills for Genit agents."
                }
              />
            </p>
          </div>

          <div className='border-l border-neutral-300 ps-4 dark:border-neutral-700'>
            <div className='flex items-center gap-2 text-xs font-mono text-neutral-400 dark:text-neutral-500 uppercase'>
              <Layers className='size-3.5' />
              <span>02 // Integrations</span>
            </div>
            <h3 className='mt-2 font-semibold text-neutral-950 dark:text-white'>
              <LocalizedText text={"Connected Tools"} />
            </h3>
            <p className='mt-1 text-sm leading-6 text-neutral-600 dark:text-neutral-400 text-pretty'>
              <LocalizedText
                text={
                  "Request connections for ad networks, CRM software, ecommerce stores, or niche social channels."
                }
              />
            </p>
          </div>

          <div className='border-l border-neutral-300 ps-4 dark:border-neutral-700'>
            <div className='flex items-center gap-2 text-xs font-mono text-neutral-400 dark:text-neutral-500 uppercase'>
              <Sparkles className='size-3.5' />
              <span>03 // Support</span>
            </div>
            <h3 className='mt-2 font-semibold text-neutral-950 dark:text-white'>
              <LocalizedText text={"Direct Assistance"} />
            </h3>
            <p className='mt-1 text-sm leading-6 text-neutral-600 dark:text-neutral-400 text-pretty'>
              <LocalizedText
                text={
                  "Open an engineering ticket for debugging, billing questions, or personalized workspace setup."
                }
              />
            </p>
          </div>
        </div>

        {/* Tabbed Interactive Section */}
        <section className='mt-16 flex flex-col items-center justify-center'>
          <Tabs
            defaultValue='support'
            className='flex w-full flex-col items-center justify-center max-w-2xl'
          >
            <div className='my-6 flex w-full justify-center'>
              <TabsList className='flex rounded-full border border-neutral-200 bg-neutral-100 p-1 dark:border-neutral-800 dark:bg-neutral-900'>
                <TabsTrigger
                  value='support'
                  className='rounded-full px-6 py-2 text-xs font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-neutral-950 data-[state=active]:shadow-xs dark:data-[state=active]:bg-neutral-800 dark:data-[state=active]:text-white'
                >
                  <LocalizedText text={"Support Ticket"} />
                </TabsTrigger>
                <TabsTrigger
                  value='suggestion'
                  className='rounded-full px-6 py-2 text-xs font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-neutral-950 data-[state=active]:shadow-xs dark:data-[state=active]:bg-neutral-800 dark:data-[state=active]:text-white'
                >
                  <LocalizedText text={"Feature Suggestion"} />
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Support Form Tab */}
            <TabsContent value='support' className='w-full'>
              <div className='rounded-2xl border border-neutral-200 bg-neutral-50/50 p-6 sm:p-9 dark:border-neutral-800 dark:bg-neutral-950/60'>
                <div className='mb-6 space-y-1.5'>
                  <h2 className='text-xl font-semibold tracking-tight text-neutral-950 dark:text-white'>
                    <LocalizedText text={"Submit a Support Ticket"} />
                  </h2>
                  <p className='text-sm text-neutral-600 dark:text-neutral-400'>
                    <LocalizedText
                      text={
                        "Encountering an issue? Describe what happened and our engineering team will assist."
                      }
                    />
                  </p>
                </div>

                <form onSubmit={onSupportSubmit} className='space-y-5'>
                  <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
                    <div className='space-y-2'>
                      <Label
                        htmlFor='support-name'
                        className='text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400'
                      >
                        <LocalizedText text={"Name"} /> *
                      </Label>
                      <Input
                        id='support-name'
                        name='name'
                        value={supportName}
                        onChange={handleSupportChange}
                        placeholder='Alex Morgan'
                        required
                        className='h-11 rounded-lg border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 focus-visible:ring-1 focus-visible:ring-neutral-950 dark:focus-visible:ring-white'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label
                        htmlFor='support-email'
                        className='text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400'
                      >
                        <LocalizedText text={"Email"} /> *
                      </Label>
                      <Input
                        id='support-email'
                        name='email'
                        type='email'
                        value={supportEmail}
                        onChange={handleSupportChange}
                        placeholder='alex@company.com'
                        required
                        className='h-11 rounded-lg border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 focus-visible:ring-1 focus-visible:ring-neutral-950 dark:focus-visible:ring-white'
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
                    <div className='space-y-2'>
                      <Label
                        htmlFor='support-subject'
                        className='text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400'
                      >
                        <LocalizedText text={"Subject"} /> *
                      </Label>
                      <Input
                        id='support-subject'
                        name='subject'
                        value={supportSubject}
                        onChange={handleSupportChange}
                        placeholder='Integration auth error'
                        required
                        className='h-11 rounded-lg border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 focus-visible:ring-1 focus-visible:ring-neutral-950 dark:focus-visible:ring-white'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label
                        htmlFor='support-ticket-type'
                        className='text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400'
                      >
                        <LocalizedText text={"Ticket Type"} /> *
                      </Label>
                      <Select
                        value={supportTicketType}
                        onValueChange={handleSupportTicketTypeChange}
                        required
                      >
                        <SelectTrigger
                          id='support-ticket-type'
                          className='h-11 w-full rounded-lg border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 focus:ring-1 focus:ring-neutral-950 dark:focus:ring-white'
                        >
                          <SelectValue placeholder='Select category' />
                        </SelectTrigger>
                        <SelectContent className='border-neutral-200 dark:border-neutral-800'>
                          <SelectItem value='bug'>
                            <LocalizedText text={"Bug Report"} />
                          </SelectItem>
                          <SelectItem value='billing'>
                            <LocalizedText text={"Billing & Subscription"} />
                          </SelectItem>
                          <SelectItem value='account'>
                            <LocalizedText text={"Account Access"} />
                          </SelectItem>
                          <SelectItem value='integration'>
                            <LocalizedText text={"Tool Integration"} />
                          </SelectItem>
                          <SelectItem value='other'>
                            <LocalizedText text={"Other Technical Support"} />
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label
                      htmlFor='support-description'
                      className='text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400'
                    >
                      <LocalizedText text={"Description"} /> *
                    </Label>
                    <Textarea
                      id='support-description'
                      name='description'
                      value={supportDescription}
                      onChange={handleSupportChange}
                      placeholder='Please describe the issue in detail, including steps to reproduce...'
                      required
                      className='min-h-[120px] resize-none rounded-lg border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 focus-visible:ring-1 focus-visible:ring-neutral-950 dark:focus-visible:ring-white'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label
                      htmlFor='support-file'
                      className='text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400'
                    >
                      <LocalizedText text={"Attachment (Optional)"} />
                    </Label>
                    <div className='flex flex-col gap-2'>
                      <div
                        className={cn(
                          "group relative flex h-28 w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed transition-colors",
                          supportFile
                            ? "border-neutral-900 bg-neutral-100/80 dark:border-neutral-100 dark:bg-neutral-900/80"
                            : "border-neutral-300 bg-white hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-600"
                        )}
                        onClick={() =>
                          document.getElementById("support-file")?.click()
                        }
                      >
                        <input
                          id='support-file'
                          type='file'
                          className='hidden'
                          onChange={handleSupportFileChange}
                        />

                        {supportFile ? (
                          <div className='flex flex-col items-center px-4'>
                            <div className='flex items-center gap-2'>
                              <FileText className='size-5 text-neutral-900 dark:text-white' />
                              <span className='max-w-[260px] truncate text-sm font-semibold text-neutral-900 dark:text-white'>
                                {supportFile.name}
                              </span>
                            </div>
                            <span className='mt-1 font-mono text-[11px] text-neutral-500'>
                              {(supportFile.size / (1024 * 1024)).toFixed(2)} MB
                            </span>
                          </div>
                        ) : (
                          <div className='flex flex-col items-center gap-1.5 text-neutral-500 dark:text-neutral-400'>
                            <Paperclip className='size-5' />
                            <span className='text-xs font-medium'>
                              <LocalizedText text={"Click to attach brief, log, or screenshot"} />
                            </span>
                            <span className='text-[10px] text-neutral-400 dark:text-neutral-500'>
                              PDF, DOCX, PNG, JPG, LOG (Max 10MB)
                            </span>
                          </div>
                        )}

                        {supportFile && (
                          <button
                            type='button'
                            onClick={(e) => {
                              e.stopPropagation();
                              setSupportFile(null);
                              const input = document.getElementById(
                                "support-file"
                              ) as HTMLInputElement;
                              if (input) input.value = "";
                            }}
                            className='absolute top-3 right-3 rounded-full border border-neutral-200 bg-white p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
                            title='Remove file'
                          >
                            <X className='size-3.5' />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    type='submit'
                    disabled={isSubmitting}
                    className='mt-4 h-12 w-full rounded-full bg-neutral-950 font-medium text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-neutral-950'
                  >
                    {isSubmitting ? (
                      <LocalizedText text={"Submitting ticket..."} />
                    ) : (
                      <div className='flex items-center justify-center gap-2'>
                        <LocalizedText text={"Submit Support Ticket"} />
                        <ArrowRight className='size-4' />
                      </div>
                    )}
                  </Button>
                </form>
              </div>
            </TabsContent>

            {/* Feature Suggestion Tab */}
            <TabsContent value='suggestion' className='w-full'>
              <div className='rounded-2xl border border-neutral-200 bg-neutral-50/50 p-6 sm:p-9 dark:border-neutral-800 dark:bg-neutral-950/60'>
                <div className='mb-6 space-y-1.5'>
                  <h2 className='text-xl font-semibold tracking-tight text-neutral-950 dark:text-white'>
                    <LocalizedText text={"Submit a Feature Suggestion"} />
                  </h2>
                  <p className='text-sm text-neutral-600 dark:text-neutral-400'>
                    <LocalizedText
                      text={
                        "Tell us what capability or tool integration would make Genit more powerful for your team."
                      }
                    />
                  </p>
                </div>

                <form onSubmit={onSuggestionSubmit} className='space-y-5'>
                  <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
                    <div className='space-y-2'>
                      <Label
                        htmlFor='suggestion-name'
                        className='text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400'
                      >
                        <LocalizedText text={"Name"} /> *
                      </Label>
                      <Input
                        id='suggestion-name'
                        name='name'
                        value={suggestionName}
                        onChange={handleSuggestionChange}
                        placeholder='Alex Morgan'
                        required
                        className='h-11 rounded-lg border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 focus-visible:ring-1 focus-visible:ring-neutral-950 dark:focus-visible:ring-white'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label
                        htmlFor='suggestion-email'
                        className='text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400'
                      >
                        <LocalizedText text={"Email"} /> *
                      </Label>
                      <Input
                        id='suggestion-email'
                        name='email'
                        type='email'
                        value={suggestionEmail}
                        onChange={handleSuggestionChange}
                        placeholder='alex@company.com'
                        required
                        className='h-11 rounded-lg border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 focus-visible:ring-1 focus-visible:ring-neutral-950 dark:focus-visible:ring-white'
                      />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label
                      htmlFor='suggestion-subject'
                      className='text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400'
                    >
                      <LocalizedText text={"Feature Title"} /> *
                    </Label>
                    <Input
                      id='suggestion-subject'
                      name='subject'
                      value={suggestionSubject}
                      onChange={handleSuggestionChange}
                      placeholder='e.g. Automated Pinterest carousel publishing'
                      required
                      className='h-11 rounded-lg border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 focus-visible:ring-1 focus-visible:ring-neutral-950 dark:focus-visible:ring-white'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label
                      htmlFor='suggestion-description'
                      className='text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400'
                    >
                      <LocalizedText text={"Feature Details & Use Case"} /> *
                    </Label>
                    <Textarea
                      id='suggestion-description'
                      name='description'
                      value={suggestionDescription}
                      onChange={handleSuggestionChange}
                      placeholder='Describe how this feature would work and the impact it would have on your marketing workflow...'
                      required
                      className='min-h-[140px] resize-none rounded-lg border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 focus-visible:ring-1 focus-visible:ring-neutral-950 dark:focus-visible:ring-white'
                    />
                  </div>

                  <Button
                    type='submit'
                    disabled={isSubmitting}
                    className='mt-4 h-12 w-full rounded-full bg-neutral-950 font-medium text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-neutral-950'
                  >
                    {isSubmitting ? (
                      <LocalizedText text={"Submitting suggestion..."} />
                    ) : (
                      <div className='flex items-center justify-center gap-2'>
                        <LocalizedText text={"Submit Feature Suggestion"} />
                        <ArrowRight className='size-4' />
                      </div>
                    )}
                  </Button>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Supporting Figure 02: Collaborative Engineering Triage */}
        
      </main>

      <LandingFooter />
    </div>
  );
}
