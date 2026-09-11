"use client";

import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import Loading from "@/utils/Loading";
import { apiResponse } from "@/utils/apiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Clock,
  FileText,
  Globe2,
  Mail,
  Paperclip,
  ShieldCheck,
  X,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const createFormSchema = (t: (text: string) => string) =>
  z.object({
    fullName: z
      .string()
      .min(2, { message: t("Name must be at least 2 characters") }),
    phone: z
      .string()
      .min(6, { message: t("Please enter a valid phone number") }),
    email: z
      .string()
      .email({ message: t("Please enter a valid email address") }),
    country: z.string().min(1, { message: t("Please select your country") }),
    message: z.string().optional(),
    referral: z.string().optional(),
    attachment: z.any().optional(),
  });

type ContactFormData = z.infer<ReturnType<typeof createFormSchema>>;

export default function LandingContact() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(createFormSchema(t)),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      country: "",
      message: "",
      referral: "",
      attachment: undefined,
    },
  });

  const selectedFile = form.watch("attachment");

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);

    const htmlMessage = `
  <div style="font-family: Arial, sans-serif;">
    <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 10px; padding: 20px; box-shadow: 0 3px 10px rgba(0,0,0,0.1);">
      <h2 style="color: #333; margin-bottom: 10px;">New Contact Form Submission</h2>
      <p style="color: #555; font-size: 14px; margin-top: 0;">You have received a new message from your website contact form.</p>

      <div style="margin-top: 20px;">
        <p style="margin: 8px 0;"><strong>Name:</strong> ${data.fullName}</p>
        <p style="margin: 8px 0;"><strong>Phone:</strong> ${data.phone}</p>
        <p style="margin: 8px 0;"><strong>Email:</strong> ${data.email}</p>
        <p style="margin: 8px 0;"><strong>Country:</strong> ${data.country}</p>
        <p style="margin: 8px 0;"><strong>Referral:</strong> ${data.referral}</p>

        <div style="margin-top: 20px; padding: 15px; background: #f1f1f1; border-radius: 8px;">
          <p style="margin: 0;"><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; margin-top: 5px;">${data.message}</p>
        </div>
      </div>

      <p style="margin-top: 30px; font-size: 12px; color: #888; text-align: center;">
        Genit • ${new Date().toLocaleString()}
      </p>
    </div>
  </div>`;

    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("subject", "Genit contact request");
    formData.append("message", htmlMessage);

    if (data.attachment && data.attachment instanceof File) {
      formData.append("attachment", data.attachment);
    }

    try {
      const response = await apiResponse.post("/user/contact", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success(t("Message sent successfully. We'll be in touch soon."));
        form.reset();
      }
      setLoading(false);
    } catch (error) {
      console.error("❌ Email failed:", error);
      toast.error(t("Failed to send message. Please try again later."));
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-white text-neutral-900 dark:bg-black dark:text-neutral-100'>
      <LandingNavbar />

      <main className='mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24'>
    

        <div className='mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16'>
          {/* Left Column: Narrative & Channels */}
          <div className='space-y-8 lg:col-span-5'>
            <div>
              <span className='font-mono text-xs font-semibold tracking-wider text-blue-600 uppercase dark:text-blue-400'>
                {t("Get In Touch")}
              </span>
              <h1 className='mt-3 text-3xl font-bold tracking-tight text-neutral-950 sm:text-5xl dark:text-white'>
                {t("Let’s discuss.")}
              </h1>
              {/* <p className='mt-5 text-pretty text-base leading-7 text-neutral-600 dark:text-neutral-400'>
                {t(
                  "Whether you’re exploring autonomous agents for your team, need custom tool integrations, or have questions about our platform architecture, we’re ready to assist."
                )}
              </p> */}
            </div>

            {/* Direct Communication Channels */}
            <div className='space-y-4 rounded-2xl border border-neutral-200 bg-neutral-50/70 p-6 dark:border-neutral-800 dark:bg-neutral-950/60'>
              <div className='flex items-start gap-3.5'>
                <div className='flex size-8 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900'>
                  <Mail className='size-4 text-neutral-700 dark:text-neutral-300' />
                </div>
                <div>
                  <p className='text-xs font-mono text-neutral-400 dark:text-neutral-500 uppercase'>
                    Direct Inquiries
                  </p>
                  <a
                    href='mailto:support@trygenit.com'
                    className='text-sm font-semibold text-neutral-900 hover:underline dark:text-white'
                  >
                    support@trygenit.com
                  </a>
                </div>
              </div>

              <div className='flex items-start gap-3.5 pt-3 border-t border-neutral-200/80 dark:border-neutral-800/80'>
                <div className='flex size-8 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900'>
                  <Clock className='size-4 text-neutral-700 dark:text-neutral-300' />
                </div>
                <div>
                  <p className='text-xs font-mono text-neutral-400 dark:text-neutral-500 uppercase'>
                    Response Time
                  </p>
                  <p className='text-sm text-neutral-700 dark:text-neutral-300'>
                    Within 4 business hours
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-3.5 pt-3 border-t border-neutral-200/80 dark:border-neutral-800/80'>
                <div className='flex size-8 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900'>
                  <Globe2 className='size-4 text-neutral-700 dark:text-neutral-300' />
                </div>
                <div>
                  <p className='text-xs font-mono text-neutral-400 dark:text-neutral-500 uppercase'>
                    Global Operations
                  </p>
                  <p className='text-sm text-neutral-700 dark:text-neutral-300'>
                    Support available across US, EMEA &amp; APAC time zones
                  </p>
                </div>
              </div>
            </div>

            

            {/* Editorial solutions photo */}
            <figure className='overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900'>
              <img
                className='h-auto max-h-[300px] w-full object-cover'
                src='https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                alt='Dedicated client solutions and onboarding team'
              />
              <figcaption className='border-t border-neutral-200 px-4 py-2.5 font-mono text-xs text-neutral-500 dark:border-neutral-800'>
                Figure 01: Dedicated client solutions &amp; onboarding team
              </figcaption>
            </figure>

            {/* Why Genit - Left Border Editorial Style */}
            <div className='space-y-4 pt-2'>
              <span className='font-mono text-xs tracking-widest text-neutral-500 uppercase'>
                Platform Standards
              </span>

              <ul className='space-y-4 text-sm leading-7 text-neutral-600 dark:text-neutral-400'>
                <li className='border-l border-neutral-300 ps-4 dark:border-neutral-700'>
                  <strong className='font-semibold text-neutral-950 dark:text-white'>
                    End-to-End Autonomy:
                  </strong>{" "}
                  From goal research to cross-channel publishing in one unified system.
                </li>
                <li className='border-l border-neutral-300 ps-4 dark:border-neutral-700'>
                  <strong className='font-semibold text-neutral-950 dark:text-white'>
                    Strict Human Verification:
                  </strong>{" "}
                  Define precise approval checkpoints before consequential actions occur.
                </li>
                <li className='border-l border-neutral-300 ps-4 dark:border-neutral-700'>
                  <strong className='font-semibold text-neutral-950 dark:text-white'>
                    Persistent Brand Memory:
                  </strong>{" "}
                  Never re-prompt tone, constraints, or guidelines across campaigns.
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Architectural Form */}
          <div className='lg:col-span-7'>
            <div className='rounded-2xl border border-neutral-200 bg-neutral-50/50 p-6 sm:p-9 dark:border-neutral-800 dark:bg-neutral-950/60'>
              <div className='mb-8 space-y-1.5'>
                <h2 className='text-xl font-semibold tracking-tight text-neutral-950 dark:text-white'>
                  {t("Send a Message")}
                </h2>
                <p className='text-sm text-neutral-600 dark:text-neutral-400'>
                  {t(
                    "Fill in your details below and our team will get back to you promptly."
                  )}
                </p>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='space-y-6'
                >
                  <FormField
                    control={form.control}
                    name='fullName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400'>
                          {t("Full name")} *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Alex Morgan'
                            className='h-11 rounded-lg border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 focus-visible:ring-1 focus-visible:ring-neutral-950 dark:focus-visible:ring-white'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='email'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400'>
                            {t("Email address")} *
                          </FormLabel>
                          <FormControl>
                            <Input
                              type='email'
                              placeholder='alex@company.com'
                              className='h-11 rounded-lg border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 focus-visible:ring-1 focus-visible:ring-neutral-950 dark:focus-visible:ring-white'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='phone'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400'>
                            {t("Phone number")} *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder='+1 (555) 000-0000'
                              className='h-11 rounded-lg border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 focus-visible:ring-1 focus-visible:ring-neutral-950 dark:focus-visible:ring-white'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='country'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400'>
                            {t("Country")} *
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className='h-11 w-full rounded-lg border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 focus:ring-1 focus:ring-neutral-950 dark:focus:ring-white'>
                                <SelectValue placeholder={t("Select your country")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className='border-neutral-200 dark:border-neutral-800'>
                              <SelectItem value='us'>{t("United States")}</SelectItem>
                              <SelectItem value='uk'>{t("United Kingdom")}</SelectItem>
                              <SelectItem value='ca'>{t("Canada")}</SelectItem>
                              <SelectItem value='au'>{t("Australia")}</SelectItem>
                              <SelectItem value='de'>{t("Germany")}</SelectItem>
                              <SelectItem value='fr'>{t("France")}</SelectItem>
                              <SelectItem value='ie'>{t("Ireland")}</SelectItem>
                              <SelectItem value='jp'>{t("Japan")}</SelectItem>
                              <SelectItem value='ng'>{t("Nigeria")}</SelectItem>
                              <SelectItem value='gh'>{t("Ghana")}</SelectItem>
                              <SelectItem value='ke'>{t("Kenya")}</SelectItem>
                              <SelectItem value='za'>{t("South Africa")}</SelectItem>
                              <SelectItem value='ug'>{t("Uganda")}</SelectItem>
                              <SelectItem value='rw'>{t("Rwanda")}</SelectItem>
                              <SelectItem value='other'>{t("Other")}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='referral'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400'>
                            {t("Discovery Source")}
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className='h-11 w-full rounded-lg border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 focus:ring-1 focus:ring-neutral-950 dark:focus:ring-white'>
                                <SelectValue placeholder={t("How did you find us?")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className='border-neutral-200 dark:border-neutral-800'>
                              <SelectItem value='search'>{t("Search Engine")}</SelectItem>
                              <SelectItem value='social'>{t("Social Media")}</SelectItem>
                              <SelectItem value='friend'>{t("Colleague / Recommendation")}</SelectItem>
                              <SelectItem value='conference'>{t("Event / Conference")}</SelectItem>
                              <SelectItem value='advertisement'>{t("Online Media")}</SelectItem>
                              <SelectItem value='other'>{t("Other")}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name='message'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400'>
                          {t("Project / Inquiry Details")}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t(
                              "Describe your marketing goals, current challenges, or required integrations..."
                            )}
                            className='min-h-[120px] resize-none rounded-lg border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 focus-visible:ring-1 focus-visible:ring-neutral-950 dark:focus-visible:ring-white'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Refined File Attachment Box */}
                  <FormField
                    control={form.control}
                    name='attachment'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400'>
                          {t("Attachment (Optional)")}
                        </FormLabel>
                        <FormControl>
                          <div className='flex flex-col gap-2'>
                            <div
                              className={cn(
                                "group relative flex h-28 w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed transition-colors",
                                selectedFile
                                  ? "border-neutral-900 bg-neutral-100/80 dark:border-neutral-100 dark:bg-neutral-900/80"
                                  : "border-neutral-300 bg-white hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-600"
                              )}
                              onClick={() =>
                                document.getElementById("file-upload")?.click()
                              }
                            >
                              <input
                                id='file-upload'
                                type='file'
                                className='hidden'
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    field.onChange(file);
                                  }
                                }}
                              />

                              {selectedFile ? (
                                <div className='flex flex-col items-center px-4'>
                                  <div className='flex items-center gap-2'>
                                    <FileText className='size-5 text-neutral-900 dark:text-white' />
                                    <span className='max-w-[260px] truncate text-sm font-semibold text-neutral-900 dark:text-white'>
                                      {(selectedFile as File).name}
                                    </span>
                                  </div>
                                  <span className='mt-1 font-mono text-[11px] text-neutral-500'>
                                    {(
                                      (selectedFile as File).size /
                                      (1024 * 1024)
                                    ).toFixed(2)}{" "}
                                    MB
                                  </span>
                                </div>
                              ) : (
                                <div className='flex flex-col items-center gap-1.5 text-neutral-500 dark:text-neutral-400'>
                                  <Paperclip className='size-5' />
                                  <span className='text-xs font-medium'>
                                    {t("Click to attach brief or guideline")}
                                  </span>
                                  <span className='text-[10px] text-neutral-400 dark:text-neutral-500'>
                                    PDF, DOCX, PNG, JPG (Max 5MB)
                                  </span>
                                </div>
                              )}

                              {selectedFile && (
                                <button
                                  type='button'
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    field.onChange(undefined);
                                    const input = document.getElementById(
                                      "file-upload"
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
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submission */}
                  <div className='pt-2 space-y-4'>
                    <Button
                      type='submit'
                      disabled={loading}
                      className='h-12 w-full rounded-full bg-neutral-950 font-medium text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-neutral-950'
                    >
                      {loading ? (
                        <div className='flex items-center justify-center gap-2'>
                          <Loading size={18} />
                          <span>{t("Submitting inquiry...")}</span>
                        </div>
                      ) : (
                        <div className='flex items-center justify-center gap-2'>
                          <span>{t("Send Inquiry")}</span>
                          <ArrowRight className='size-4' />
                        </div>
                      )}
                    </Button>

                    <p className='text-center text-xs text-neutral-500 dark:text-neutral-500'>
                      {t("By continuing, you agree to our")}{" "}
                      <Link
                        href='/legal/terms-of-service'
                        className='text-neutral-900 underline underline-offset-2 dark:text-neutral-300'
                      >
                        {t("Terms")}
                      </Link>{" "}
                      {t("and")}{" "}
                      <Link
                        href='/legal/privacy-policy'
                        className='text-neutral-900 underline underline-offset-2 dark:text-neutral-300'
                      >
                        {t("Privacy Policy")}
                      </Link>
                      .
                    </p>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
