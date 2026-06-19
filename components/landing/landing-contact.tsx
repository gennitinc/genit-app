"use client";

import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
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
import { cn } from "@/lib/utils";
import { apiResponse } from "@/utils/apiResponse";
import emailjs from "@emailjs/browser";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Building2,
  Calendar,
  Check,
  FileText,
  Mail,
  Paperclip,
  Star,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import React, { useState } from "react";

// Define the schema for form validation
const formSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" }),
  phone: z.string().min(6, { message: "Please enter a valid phone number" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  country: z.string().min(1, { message: "Please select your country" }),
  message: z.string().optional(),
  referral: z.string().optional(),
  attachment: z.any().optional(),
});

// Define the type for the form data
type ContactFormData = z.infer<typeof formSchema>;

export default function LandingContact() {
  const [loading, setLoading] = useState(false);
  const form = useForm<ContactFormData>({
    resolver: zodResolver(formSchema),
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

  // const client = new SMTPClient({
  //   user: "user",
  //   password: "password",
  //   host: "smtp.your-email.com",
  //   ssl: true,
  // });

  // Apply the ContactFormData type to the onSubmit function
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
        genit Inc • ${new Date().toLocaleString()}
      </p>
    </div>
  </div>`;

    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("subject", "genit contact request");
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
        toast.success("Form submitted successfully");
        form.reset();
      }
      setLoading(false);
    } catch (error) {
      console.error("❌ Email failed:", error);
      toast.error("Failed to send message. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <div>
      <LandingNavbar />
      <section className='relative px-2 py-24 md:px-12 md:py-32 lg:px-20 xl:px-24'>
        {/* <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-background"></div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,hsl(var(--primary)/20%),transparent_80%)]"></div> */}
        <div className='grid w-full grid-cols-1 gap-x-32 overflow-hidden px-4 md:px-8 lg:grid-cols-2 lg:px-16'>
          <div className='w-full pb-10 md:space-y-10 md:pb-0'>
            <div className='space-y-6 md:max-w-[40rem]'>
              <h1 className='text-4xl font-extrabold md:text-xl lg:text-5xl'>
                Ready. Set.{" "}
                <span className='from-primary via-accent to-primary animate-gradient-x bg-gradient-to-r bg-clip-text text-transparent'>
                  Design
                </span>
              </h1>

              <div className='text-muted-foreground max-w-2xl text-sm lg:leading-relaxed'>
                genit is your AI-powered media designer. Create stunning
                flyers, logos, posters, and social media graphics in seconds —
                no design skills required. Just describe what you want and let
                AI do the work.
              </div>
            </div>

            <div className='hidden md:block'>
              <div className='space-y-16 pb-20 lg:pb-0'>
                <div className='space-y-8'>
                  <div className='mt-12 flex flex-col space-y-6'>
                    <div className='flex items-center space-x-4'>
                      <div className='flex -space-x-3 overflow-hidden'>
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className='border-background bg-muted inline-block size-10 rounded-full border-2'
                          >
                            <img
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`}
                              alt='Avatar'
                              className='size-full rounded-full'
                            />
                          </div>
                        ))}
                        <div className='border-background bg-indigo-600 hover:bg-indigo-700 text-primary-foreground flex size-10 items-center justify-center rounded-full border-2 text-[10px] font-bold'>
                          50k+
                        </div>
                      </div>
                      <div className='text-sm font-medium'>
                        <span className='text-primary font-bold'>5000+</span>{" "}
                        creators trust us
                      </div>
                    </div>
                    <div className='flex flex-col space-y-2'>
                      <div className='flex items-center gap-1'>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className='size-4 fill-yellow-400 text-yellow-400'
                          />
                        ))}
                        <span className='text-foreground/80 ml-2 text-sm font-semibold italic'>
                          "Absolutely life-changing for my small business"
                        </span>
                      </div>
                      <p className='text-muted-foreground text-xs'>
                        Average 4.9/5 rating across all platforms
                      </p>
                    </div>
                    <div className='space-y-6'>
                      <p className='from-foreground to-foreground/60 bg-gradient-to-r bg-clip-text text-xl font-bold text-transparent'>
                        Why creators choose genit
                      </p>

                      <div className='grid gap-6'>
                        {[
                          "Create flyers, logos & social media designs in seconds",
                          "Thousands of design inspirations built-in",
                          "No design skills or experience needed",
                          "Perfect for businesses, creators & marketers",
                        ].map((benefit, idx) => (
                          <div
                            key={idx}
                            className='group flex items-start space-x-4'
                          >
                            <div className='bg-indigo-600 hover:bg-indigo-700/10 group-hover:bg-indigo-600 hover:bg-indigo-700/20 flex size-7 shrink-0 items-center justify-center rounded-xl transition-colors'>
                              <Check className='text-primary size-4' />
                            </div>
                            <p className='text-muted-foreground group-hover:text-foreground text-sm font-medium transition-colors'>
                              {benefit}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>{" "}
                  </div>
                </div>

                <div className='space-y-4'>
                  {/* Optional future logos / partners section */}
                </div>
              </div>
            </div>
          </div>
          <div className='flex w-full justify-center lg:mt-2.5'>
            <Card className='bg-background/40 relative flex h-fit w-full max-w-[32rem] min-w-80 flex-col items-center overflow-visible border-white/10 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl dark:bg-neutral-900'>
              <CardContent className='w-full px-4 py-8 lg:px-10'>
                <div className='mb-8 space-y-2'>
                  <h3 className='text-2xl font-bold'>Contact Us</h3>
                  <p className='text-muted-foreground text-sm'>
                    We usually respond within a few hours.
                  </p>
                </div>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='w-full space-y-6'
                  >
                    <div className='grid gap-5'>
                      <FormField
                        control={form.control}
                        name='fullName'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full name</FormLabel>
                            <FormControl>
                              <Input placeholder='John Doe' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2'>
                        <FormField
                          control={form.control}
                          name='email'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  type='email'
                                  placeholder='you@xyz.com'
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
                              <FormLabel>Phone number</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='+1 (555) 000-0000'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2'>
                        <FormField
                          control={form.control}
                          name='country'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className='w-full'>
                                    <SelectValue placeholder='Select your country' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value='us'>
                                    United States
                                  </SelectItem>
                                  <SelectItem value='uk'>
                                    United Kingdom
                                  </SelectItem>
                                  <SelectItem value='ca'>Canada</SelectItem>
                                  <SelectItem value='au'>Australia</SelectItem>
                                  <SelectItem value='ie'>Ireland</SelectItem>
                                  <SelectItem value='de'>Germany</SelectItem>
                                  <SelectItem value='fr'>France</SelectItem>
                                  <SelectItem value='jp'>Japan</SelectItem>
                                  <SelectItem value='ng'>Nigeria</SelectItem>
                                  <SelectItem value='gh'>Ghana</SelectItem>
                                  <SelectItem value='ke'>Kenya</SelectItem>
                                  <SelectItem value='za'>
                                    South Africa
                                  </SelectItem>
                                  <SelectItem value='ug'>Uganda</SelectItem>
                                  <SelectItem value='rw'>Rwanda</SelectItem>

                                  <SelectItem value='other'>Other</SelectItem>
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
                              <FormLabel>
                                How did you hear about us?{" "}
                                {/* <span className="text-muted-foreground">
                                  (Optional)
                                </span> */}
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className='w-full'>
                                    <SelectValue placeholder='Select source' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className='w-full'>
                                  <SelectItem value='search'>
                                    Search Engine
                                  </SelectItem>
                                  <SelectItem value='social'>
                                    Social Media
                                  </SelectItem>
                                  <SelectItem value='friend'>
                                    Friend/Colleague
                                  </SelectItem>
                                  <SelectItem value='conference'>
                                    Conference/Event
                                  </SelectItem>
                                  <SelectItem value='advertisement'>
                                    Advertisement
                                  </SelectItem>
                                  <SelectItem value='other'>Other</SelectItem>
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
                            <FormLabel>
                              What are you looking to achieve?{" "}
                              <span className='text-muted-foreground'>
                                (Optional)
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder='Tell us about your goals and challenges...'
                                className='resize-none'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='attachment'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='text-muted-foreground/80 text-xs font-bold tracking-wider uppercase'>
                              Attachment (Optional)
                            </FormLabel>
                            <FormControl>
                              <div className='flex flex-col gap-2'>
                                <div
                                  className={cn(
                                    "group/upload relative flex h-32 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-500",
                                    selectedFile
                                      ? "border-primary bg-indigo-600 hover:bg-indigo-700/5 shadow-[0_0_20px_rgba(var(--primary),0.1)]"
                                      : "border-muted-foreground/20 hover:border-primary/50 hover:bg-indigo-600 hover:bg-indigo-700/5"
                                  )}
                                  onClick={() =>
                                    document
                                      .getElementById("file-upload")
                                      ?.click()
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

                                  <div className='from-primary/5 absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-500 group-hover/upload:opacity-100' />

                                  <div className='relative z-10 flex flex-col items-center gap-3'>
                                    {selectedFile ? (
                                      <div className='animate-in zoom-in flex flex-col items-center duration-300'>
                                        <div className='bg-indigo-600 hover:bg-indigo-700/10 mb-2 rounded-full p-3'>
                                          <FileText className='text-primary size-8' />
                                        </div>
                                        <span className='text-primary max-w-[240px] truncate px-4 text-sm font-semibold'>
                                          {(selectedFile as File).name}
                                        </span>
                                        <span className='text-primary/60 mt-1 text-[10px]'>
                                          {(
                                            (selectedFile as File).size /
                                            (1024 * 1024)
                                          ).toFixed(2)}{" "}
                                          MB
                                        </span>
                                      </div>
                                    ) : (
                                      <div className='flex flex-col items-center transition-transform duration-500 group-hover/upload:scale-110'>
                                        <div className='bg-muted group-hover/upload:bg-indigo-600 hover:bg-indigo-700/10 mb-2 rounded-full p-3 transition-colors'>
                                          <Paperclip className='text-muted-foreground group-hover/upload:text-primary size-8 transition-colors' />
                                        </div>
                                        <span className='text-foreground/70 group-hover/upload:text-primary text-sm font-medium'>
                                          Click to attach a file
                                        </span>
                                      </div>
                                    )}
                                  </div>

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
                                      className='bg-background border-border text-muted-foreground group/remove absolute top-4 right-4 z-20 rounded-full border p-1.5 shadow-md transition-all duration-300 hover:border-red-200 hover:bg-red-50 hover:text-red-500'
                                      title='Remove file'
                                    >
                                      <X className='size-4 transition-transform duration-300 group-hover/remove:rotate-90' />
                                    </button>
                                  )}
                                </div>
                                <div className='flex items-center justify-between px-1'>
                                  <span className='text-muted-foreground/60 text-[10px] font-medium'>
                                    PDF, DOCX, PNG, JPG (Max 5MB)
                                  </span>
                                  {selectedFile && (
                                    <span className='text-primary animate-pulse text-[10px] font-bold'>
                                      File Ready
                                    </span>
                                  )}
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <CardFooter className='flex w-full flex-col justify-end space-y-3 p-0 pt-0'>
                      <Button
                        type='submit'
                        disabled={loading}
                        className='w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-center text-sm font-medium text-white transition-all hover:bg-indigo-600 hover:bg-indigo-700/90 focus:ring-4 focus:ring-primary/30 focus:outline-none dark:focus:ring-primary/40'
                      >
                        {loading ? (
                          <div className='flex items-center justify-center text-sm'>
                            <div className='mr-3 size-5 animate-spin rounded-full border-2 border-white/20 border-t-white' />
                            Sending Inquiry...
                          </div>
                        ) : (
                          <div className='flex flex-row items-center gap-2 text-sm'>
                            {" "}
                            Send Message
                            <ArrowRight className='size-5 transition-all group-hover:translate-x-2' />
                          </div>
                        )}
                      </Button>

                      <div className='text-muted-foreground text-center text-xs'>
                        By continuing, you agree to our{" "}
                        <Link
                          href='/legal/terms-of-service'
                          target='_blank'
                          className='text-primary hover:underline'
                        >
                          Terms
                        </Link>{" "}
                        and{" "}
                        <Link
                          href='/legal/privacy-policy'
                          target='_blank'
                          className='text-primary hover:underline'
                        >
                          Privacy Policy
                        </Link>
                        .
                      </div>
                    </CardFooter>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <LandingFooter />
    </div>
  );
}
