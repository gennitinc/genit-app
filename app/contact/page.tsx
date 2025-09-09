"use client";

import React from "react";
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

// Define the schema for form validation
const formSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" }),
  company: z.string().min(1, { message: "Company name is required" }),
  phone: z.string().min(6, { message: "Please enter a valid phone number" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  country: z.string().min(1, { message: "Please select your country" }),
  companySize: z
    .string()
    .min(1, { message: "Please select your company size" }),
  message: z.string().optional(),
  referral: z.string().optional(),
});

// Define the type for the form data
type FormData = z.infer<typeof formSchema>;

export default function Contact1() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      company: "",
      phone: "",
      email: "",
      country: "",
      companySize: "",
      message: "",
      referral: "",
    },
  });

  // Apply the FormData type to the onSubmit function
  const onSubmit = (data: FormData) => {
    console.log(data);
    // Show success message or redirect
  };

  return (
    <div>
      <LandingNavbar />
      <section className="relative py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-background"></div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,hsl(var(--primary)/20%),transparent_80%)]"></div>
        <div className="grid w-full grid-cols-1 gap-x-32 overflow-hidden lg:grid-cols-2 px-4 md:px-8 lg:px-16">
          <div className="w-full pb-10 md:space-y-10 md:pb-0">
            <div className="space-y-6 md:max-w-[40rem]">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                Get in touch
              </div>
              <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                Transform Your Workflow Today
              </h1>
              <div className="text-muted-foreground md:text-base lg:text-lg lg:leading-7">
                Experience a personalized demonstration of our cutting-edge
                platform. Discover how we can streamline your processes, boost
                productivity, and drive innovation in your business.
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
                        4.9/5 Average Rating
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
                      Based on 1000+ customer reviews
                    </p>
                  </div>
                  <div className="space-y-4">
                    <p className="text-lg font-semibold">
                      Why choose our solution?
                    </p>
                    <div className="grid gap-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex size-6 items-center justify-center rounded-full bg-primary/10">
                          <Check className="size-3.5 text-primary" />
                        </div>
                        <p className="text-sm">
                          Boost productivity by up to 40%
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex size-6 items-center justify-center rounded-full bg-primary/10">
                          <Check className="size-3.5 text-primary" />
                        </div>
                        <p className="text-sm">
                          Seamless integration with your existing tools
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex size-6 items-center justify-center rounded-full bg-primary/10">
                          <Check className="size-3.5 text-primary" />
                        </div>
                        <p className="text-sm">
                          24/7 expert support and guidance
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex size-6 items-center justify-center rounded-full bg-primary/10">
                          <Check className="size-3.5 text-primary" />
                        </div>
                        <p className="text-sm">
                          Customizable workflows for your specific needs
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex size-6 items-center justify-center rounded-full bg-primary/10">
                          <Check className="size-3.5 text-primary" />
                        </div>
                        <p className="text-sm">
                          Advanced analytics and reporting capabilities
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex size-6 items-center justify-center rounded-full bg-primary/10">
                          <Check className="size-3.5 text-primary" />
                        </div>
                        <p className="text-sm">
                          Enterprise-grade security and compliance
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-lg font-semibold">
                    Trusted by industry leaders:
                  </p>
                  {/* <div className="grid grid-cols-3 gap-6">
                    <Image
                      src="/placeholder.svg"
                      alt="TechCorp logo"
                      width={120}
                      height={40}
                      className="h-10 opacity-70 transition-opacity hover:opacity-100"
                    />
                    <Image
                      src="/placeholder.svg"
                      alt="InnovateCo logo"
                      width={120}
                      height={40}
                      className="h-10 opacity-70 transition-opacity hover:opacity-100"
                    />
                    <Image
                      src="/placeholder.svg"
                      alt="FutureTech logo"
                      width={120}
                      height={40}
                      className="h-10 opacity-70 transition-opacity hover:opacity-100"
                    />
                  </div> */}
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full justify-center lg:mt-2.5">
            <Card className="relative flex w-full min-w-80 max-w-[30rem] flex-col items-center overflow-visible border-primary/10 bg-background/80 shadow-lg backdrop-blur-sm md:min-w-96">
              <CardHeader className="pb-2 pt-6">
                <div className="flex flex-col items-center space-y-1.5 text-center">
                  <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="size-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold">Schedule Your Demo</h2>
                  <p className="text-sm text-muted-foreground">
                    Fill out the form below and we'll be in touch shortly
                  </p>
                </div>
              </CardHeader>
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

                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="company"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company</FormLabel>
                              <FormControl>
                                <Input placeholder="Your Company" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="companySize"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company size</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select size" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1-10">
                                    1-10 employees
                                  </SelectItem>
                                  <SelectItem value="11-50">
                                    11-50 employees
                                  </SelectItem>
                                  <SelectItem value="51-200">
                                    51-200 employees
                                  </SelectItem>
                                  <SelectItem value="201-500">
                                    201-500 employees
                                  </SelectItem>
                                  <SelectItem value="501-1000">
                                    501-1000 employees
                                  </SelectItem>
                                  <SelectItem value="1000+">
                                    1000+ employees
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business email</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="you@yourcompany.com"
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
                        name="referral"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              How did you hear about us?{" "}
                              <span className="text-muted-foreground">
                                (Optional)
                              </span>
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select source" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
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

                    <CardFooter className="flex w-full flex-col justify-end space-y-3 p-0 pt-2">
                      <Button
                        type="submit"
                        className="w-full group flex items-center transition-all duration-300 hover:pr-4 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2"
                        size="lg"
                      >
                        Let's talk <ArrowRight className="ml-2 size-4" />
                      </Button>
                      <div className="text-xs text-muted-foreground">
                        By submitting this form, you agree to our{" "}
                        <a href="#" className="text-primary hover:underline">
                          terms of service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-primary hover:underline">
                          privacy policy
                        </a>
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
