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
});

// Define the type for the form data
type FormData = z.infer<typeof formSchema>;

export default function LandingContact() {
  const [loading, setLoading] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      country: "",
      message: "",
      referral: "",
    },
  });

  // const client = new SMTPClient({
  //   user: "user",
  //   password: "password",
  //   host: "smtp.your-email.com",
  //   ssl: true,
  // });

  // Apply the FormData type to the onSubmit function

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    console.log("clicked", data);

    try {
      const response = await apiResponse.post(
        "/user/contact",
        {
          email: data.email,
          subject: "Gennit contact request",
          message: `
  <div style="font-family: Arial, sans-serif; padding: 20px; background: #f7f7f7;">
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
  </div>`,
        },
        { withCredentials: true }
      );

      if(response.status == 200){
        toast.success("Form submitted successfully");
      }
      console.log("✅ Email sent:");
      setLoading(false);
      form.reset();
    } catch (error) {
      console.error("❌ Email failed:", error);
      setLoading(false);
    }
  };

  return (
    <div>
      <LandingNavbar />
      <section className="relative py-24 md:py-32 px-2 md:px-12 lg:px-20 xl:px-24">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-background"></div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,hsl(var(--primary)/20%),transparent_80%)]"></div>
        <div className="grid w-full grid-cols-1 gap-x-32 overflow-hidden lg:grid-cols-2 px-4 md:px-8 lg:px-16">
          <div className="w-full pb-10 md:space-y-10 md:pb-0">
            <div className="space-y-6 md:max-w-[40rem]">
              <h1 className="text-2xl font-bold tracking-tight md:text-4xl lg:text-6xl">
                Ready. Set.{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Design
                </span>
              </h1>

              <div className="text-muted-foreground md:text-base lg:leading-7">
                Gennit is your AI-powered media designer. Create stunning
                flyers, logos, posters, and social media graphics in seconds —
                no design skills or complicated software required. Just describe
                what you want and let AI do the work.
              </div>
            </div>

            <div className="hidden md:block">
              <div className="space-y-16 pb-20 lg:pb-0">
                <div className="space-y-8">
                  <div className="mt-16 flex flex-col space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Star className="size-5" />
                      </div>
                      <div className="text-lg font-semibold">
                        Loved by creators & businesses
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="size-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Trusted by early users worldwide
                    </p>
                  </div>

                  <div className="space-y-4">
                    <p className="text-lg font-semibold">
                      Why creators choose Gennit
                    </p>

                    <div className="grid gap-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex size-6 items-center justify-center rounded-full bg-primary/10">
                          <Check className="size-3.5 text-primary" />
                        </div>
                        <p className="text-sm">
                          Create flyers, logos & social media designs in seconds
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="flex size-6 items-center justify-center rounded-full bg-primary/10">
                          <Check className="size-3.5 text-primary" />
                        </div>
                        <p className="text-sm">
                          Thousands of design inspirations built-in
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="flex size-6 items-center justify-center rounded-full bg-primary/10">
                          <Check className="size-3.5 text-primary" />
                        </div>
                        <p className="text-sm">
                          No design skills or experience needed
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="flex size-6 items-center justify-center rounded-full bg-primary/10">
                          <Check className="size-3.5 text-primary" />
                        </div>
                        <p className="text-sm">
                          Perfect for businesses, creators & marketers
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Optional future logos / partners section */}
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full justify-center lg:mt-2.5">
            <Card className="relative flex w-full min-w-80 max-w-[32rem] flex-col items-center overflow-visible border-primary/10 bg-background/80 shadow-lg backdrop-blur-sm h-fit">
              <CardContent className="w-full px-4 py-6 lg:px-8">
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
                                  <SelectTrigger>
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
                                  <SelectItem value="de">Germany</SelectItem>
                                  <SelectItem value="fr">France</SelectItem>
                                  <SelectItem value="jp">Japan</SelectItem>
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
                    </div>

                    <CardFooter className="flex w-full flex-col justify-end space-y-3 p-0 pt-4">
                      <Button
                        type="submit"
                        className="w-full group flex items-center justify-center gap-2 transition-all duration-300 text-white bg-gradient-to-r from-primary to-accent hover:opacity-90 focus:ring-4 focus:outline-none font-semibold rounded-lg px-5 py-3 text-center"
                        size="lg"
                      >
                        {loading ? (
                          <div className="flex items-center justify-center">
                            <svg
                              className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Sending...
                          </div>
                        ) : (
                          <div className="flex flex-row gap-2 items-center">
                            {" "}
                            Lets Talk
                            <ArrowRight className="size-4 transition-all group-hover:translate-x-1" />
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
