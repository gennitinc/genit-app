"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Check,
  ArrowRight,
  Star,
  Calendar,
  Mail,
  Building2,
  Paperclip,
  FileText,
  X,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Textarea } from "@/components/ui/textarea";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import emailjs from "@emailjs/browser";
import Link from "next/link";
import { apiResponse } from "@/utils/apiResponse";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
        Gennit Inc • ${new Date().toLocaleString()}
      </p>
    </div>
  </div>`;

    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("subject", "Gennit contact request");
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
      console.log("✅ Email sent:");
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
      <section className="relative py-24 md:py-32 px-2 md:px-12 lg:px-20 xl:px-24">
        {/* <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-background"></div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,hsl(var(--primary)/20%),transparent_80%)]"></div> */}
        <div className="grid w-full grid-cols-1 gap-x-32 overflow-hidden lg:grid-cols-2 px-4 md:px-8 lg:px-16">
          <div className="w-full pb-10 md:space-y-10 md:pb-0">
            <div className="space-y-6 md:max-w-[40rem]">
              <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-7xl xl:text-8xl">
                Ready. Set.{" "}
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient-x">
                  Design
                </span>
              </h1>

              <div className="text-muted-foreground text-sm lg:leading-relaxed max-w-2xl">
                Gennit is your AI-powered media designer. Create stunning
                flyers, logos, posters, and social media graphics in seconds —
                no design skills required. Just describe what you want and let
                AI do the work.
              </div>
            </div>

            <div className="hidden md:block">
              <div className="space-y-16 pb-20 lg:pb-0">
                <div className="space-y-8">
                  <div className="mt-12 flex flex-col space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex -space-x-3 overflow-hidden">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="inline-block size-10 rounded-full border-2 border-background bg-muted"
                          >
                            <img
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`}
                              alt="Avatar"
                              className="size-full rounded-full"
                            />
                          </div>
                        ))}
                        <div className="flex size-10 items-center justify-center rounded-full border-2 border-background bg-primary text-[10px] font-bold text-primary-foreground">
                          50k+
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        <span className="text-primary font-bold">5000+</span>{" "}
                        creators trust us
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="size-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                        <span className="ml-2 text-sm font-semibold italic text-foreground/80">
                          "Absolutely life-changing for my small business"
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Average 4.9/5 rating across all platforms
                      </p>
                    </div>
                    <div className="space-y-6">
                      <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
                        Why creators choose Gennit
                      </p>

                      <div className="grid gap-6">
                        {[
                          "Create flyers, logos & social media designs in seconds",
                          "Thousands of design inspirations built-in",
                          "No design skills or experience needed",
                          "Perfect for businesses, creators & marketers",
                        ].map((benefit, idx) => (
                          <div
                            key={idx}
                            className="group flex items-start space-x-4"
                          >
                            <div className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                              <Check className="size-4 text-primary" />
                            </div>
                            <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                              {benefit}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>{" "}
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Optional future logos / partners section */}
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full justify-center lg:mt-2.5">
            <Card className="relative flex w-full min-w-80 max-w-[32rem] flex-col items-center overflow-visible border-white/10 bg-background/40 dark:bg-neutral-900 shadow-2xl backdrop-blur-xl h-fit ring-1 ring-white/10">
              <CardContent className="w-full px-4 py-8 lg:px-10">
                <div className="mb-8 space-y-2">
                  <h3 className="text-2xl font-bold">Contact Us</h3>
                  <p className="text-sm text-muted-foreground">
                    We usually respond within a few hours.
                  </p>
                </div>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full space-y-6"
                  >
                    <div className="grid gap-5">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 w-full">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="you@xyz.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone number</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="+1 (555) 000-0000"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 w-full">
                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select your country" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="us">
                                    United States
                                  </SelectItem>
                                  <SelectItem value="uk">
                                    United Kingdom
                                  </SelectItem>
                                  <SelectItem value="ca">Canada</SelectItem>
                                  <SelectItem value="au">Australia</SelectItem>
                                  <SelectItem value="ie">Ireland</SelectItem>
                                  <SelectItem value="de">Germany</SelectItem>
                                  <SelectItem value="fr">France</SelectItem>
                                  <SelectItem value="jp">Japan</SelectItem>
                                  <SelectItem value="ng">Nigeria</SelectItem>
                                  <SelectItem value="gh">Ghana</SelectItem>
                                  <SelectItem value="ke">Kenya</SelectItem>
                                  <SelectItem value="za">
                                    South Africa
                                  </SelectItem>
                                  <SelectItem value="ug">Uganda</SelectItem>
                                  <SelectItem value="rw">Rwanda</SelectItem>

                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="referral"
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
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select source" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="w-full">
                                  <SelectItem value="search">
                                    Search Engine
                                  </SelectItem>
                                  <SelectItem value="social">
                                    Social Media
                                  </SelectItem>
                                  <SelectItem value="friend">
                                    Friend/Colleague
                                  </SelectItem>
                                  <SelectItem value="conference">
                                    Conference/Event
                                  </SelectItem>
                                  <SelectItem value="advertisement">
                                    Advertisement
                                  </SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              What are you looking to achieve?{" "}
                              <span className="text-muted-foreground">
                                (Optional)
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us about your goals and challenges..."
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="attachment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
                              Attachment (Optional)
                            </FormLabel>
                            <FormControl>
                              <div className="flex flex-col gap-2">
                                <div
                                  className={cn(
                                    "relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-500 overflow-hidden group/upload",
                                    selectedFile
                                      ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(var(--primary),0.1)]"
                                      : "border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5",
                                  )}
                                  onClick={() =>
                                    document
                                      .getElementById("file-upload")
                                      ?.click()
                                  }
                                >
                                  <input
                                    id="file-upload"
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        field.onChange(file);
                                      }
                                    }}
                                  />

                                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover/upload:opacity-100 transition-opacity duration-500" />

                                  <div className="relative z-10 flex flex-col items-center gap-3">
                                    {selectedFile ? (
                                      <div className="flex flex-col items-center animate-in zoom-in duration-300">
                                        <div className="bg-primary/10 p-3 rounded-full mb-2">
                                          <FileText className="size-8 text-primary" />
                                        </div>
                                        <span className="text-sm font-semibold text-primary max-w-[240px] truncate px-4">
                                          {(selectedFile as File).name}
                                        </span>
                                        <span className="text-[10px] text-primary/60 mt-1">
                                          {(
                                            (selectedFile as File).size /
                                            (1024 * 1024)
                                          ).toFixed(2)}{" "}
                                          MB
                                        </span>
                                      </div>
                                    ) : (
                                      <div className="flex flex-col items-center group-hover/upload:scale-110 transition-transform duration-500">
                                        <div className="bg-muted p-3 rounded-full mb-2 group-hover/upload:bg-primary/10 transition-colors">
                                          <Paperclip className="size-8 text-muted-foreground group-hover/upload:text-primary transition-colors" />
                                        </div>
                                        <span className="text-sm font-medium text-foreground/70 group-hover/upload:text-primary">
                                          Click to attach a file
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  {selectedFile && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        field.onChange(undefined);
                                        const input = document.getElementById(
                                          "file-upload",
                                        ) as HTMLInputElement;
                                        if (input) input.value = "";
                                      }}
                                      className="absolute top-4 right-4 p-1.5 bg-background border border-border hover:bg-red-50 hover:text-red-500 hover:border-red-200 text-muted-foreground rounded-full shadow-md transition-all duration-300 z-20 group/remove"
                                      title="Remove file"
                                    >
                                      <X className="size-4 group-hover/remove:rotate-90 transition-transform duration-300" />
                                    </button>
                                  )}
                                </div>
                                <div className="flex justify-between items-center px-1">
                                  <span className="text-[10px] font-medium text-muted-foreground/60">
                                    PDF, DOCX, PNG, JPG (Max 5MB)
                                  </span>
                                  {selectedFile && (
                                    <span className="text-[10px] font-bold text-primary animate-pulse">
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

                    <CardFooter className="flex w-full flex-col justify-end space-y-3 p-0 pt-0">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all"
                      >
                        {loading ? (
                          <div className="flex items-center justify-center text-sm">
                            <div className="size-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-3" />
                            Sending Inquiry...
                          </div>
                        ) : (
                          <div className="flex flex-row gap-2 items-center text-sm">
                            {" "}
                            Send Message
                            <ArrowRight className="size-5 transition-all group-hover:translate-x-2" />
                          </div>
                        )}
                      </Button>

                      <div className="text-center text-xs text-muted-foreground">
                        By continuing, you agree to our{" "}
                        <Link
                          href="/legal/terms-of-service"
                          target="_blank"
                          className="text-primary hover:underline"
                        >
                          Terms
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/legal/privacy-policy"
                          target="_blank"
                          className="text-primary hover:underline"
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
