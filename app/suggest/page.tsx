"use client";

// import type { Metadata } from "next";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import axios from "axios";
import { AlertCircle, CheckCircle2, Upload } from "lucide-react";
import { SnackbarProvider, closeSnackbar, enqueueSnackbar } from "notistack";
import { ChangeEvent, FormEvent, useState } from "react";

// export const metadata: Metadata = {
//   title: "Support & Suggestions – Gennit AI",
//   description:
//     "Submit support tickets or feature suggestions to the Gennit AI team. We value your feedback and are here to help.",
//   keywords: [
//     "support",
//     "suggestions",
//     "feedback",
//     "bug report",
//     "feature request",
//     "help",
//   ],
//   openGraph: {
//     title: "Support & Suggestions – Gennit AI",
//     description: "Submit support tickets and feature suggestions to Gennit AI",
//     url: "https://www.gennit.online/suggest",
//     images: [
//       {
//         url: "https://www.gennit.online/opengraph-image.png",
//         width: 1200,
//         height: 630,
//         alt: "Gennit AI Support",
//       },
//     ],
//   },
// };

function Page() {
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

      console.log("data", formData);

      if (supportFile) {
        formData.append("support-file", supportFile);
      }

      const response = await apiResponseFileUpload.post(
        "customer/support",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        enqueueSnackbar("Support submitted successfully", {
          variant: "success",
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },

          action: (key) => (
            <button onClick={() => closeSnackbar(key)}>
              {" "}
              <svg
                width='1em'
                height='1em'
                viewBox='0 0 24 24'
                className=''
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M21 21l-9-9m0 0L3 3m9 9l9-9m-9 9l-9 9'
                  stroke='#fff'
                  strokeWidth={2}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </button>
          ),
        });
        console.log("Support ticket submitted", response.data);
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
      enqueueSnackbar("error processing request", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },

        action: (key) => (
          <button onClick={() => closeSnackbar(key)}>
            {" "}
            <svg
              width='1em'
              height='1em'
              viewBox='0 0 24 24'
              className=''
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M21 21l-9-9m0 0L3 3m9 9l9-9m-9 9l-9 9'
                stroke='#fff'
                strokeWidth={2}
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
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
      let newData = {
        name: suggestionName,
        email: suggestionEmail,
        title: suggestionSubject,
        description: suggestionDescription,
        status: "pending",
      };

      console.log("data", newData);

      const response = await apiResponseFileUpload.post(
        "customer/suggest",
        newData,
        {
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        enqueueSnackbar("Congratulation 🎉, your business is live", {
          variant: "success",
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },

          action: (key) => (
            <button onClick={() => closeSnackbar(key)}>
              {" "}
              <svg
                width='1em'
                height='1em'
                viewBox='0 0 24 24'
                className=''
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M21 21l-9-9m0 0L3 3m9 9l9-9m-9 9l-9 9'
                  stroke='#fff'
                  strokeWidth={2}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </button>
          ),
        });

        console.log("Suggestion submitted", response.data);
        setSuggestionSubmitted(true);
        setSuggestionName("");
        setSuggestionEmail("");
        setSuggestionSubject("");
        setSuggestionDescription("");
      }
    } catch (error) {
      console.error("Error submitting suggestion", error);

      enqueueSnackbar("error processing request", {
        variant: "error",
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },

        action: (key) => (
          <button onClick={() => closeSnackbar(key)}>
            {" "}
            <svg
              width='1em'
              height='1em'
              viewBox='0 0 24 24'
              className=''
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M21 21l-9-9m0 0L3 3m9 9l9-9m-9 9l-9 9'
                stroke='#fff'
                strokeWidth={2}
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </button>
        ),
      });
      setError("Failed to submit suggestion. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='h-full bg-white dark:bg-black'>
      <SnackbarProvider
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
      <div className='sticky top-0 z-40'>
        <LandingNavbar />
      </div>
      <div className='hidden lg:block'>
        {/* <h1 className="text-3xl font-semibold text-center mx-auto">
          Powerful Features
        </h1>
        <p className="text-sm text-slate-500 text-center mt-2 max-w-md mx-auto">
          Everything you need to manage, track, and grow your finances, securely
          and efficiently.
        </p> */}
        <div className='mt-16 flex flex-wrap items-center justify-center gap-10'>
          <div className='max-w-80 transition duration-300 hover:-translate-y-0.5'>
            <img
              className='rounded-xl'
              src='https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/image-1.png'
              alt=''
            />
            <h3 className='mt-4 text-base font-semibold text-neutral-300'>
              Feedback analyser
            </h3>
            <p className='mt-1 text-sm text-neutral-400'>
              Get instant insights into your finances with live dashboards.
            </p>
          </div>
          <div className='max-w-80 transition duration-300 hover:-translate-y-0.5'>
            <img
              className='rounded-xl'
              src='https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/image-2.png'
              alt=''
            />
            <h3 className='mt-4 text-base font-semibold text-neutral-300'>
              User management
            </h3>
            <p className='mt-1 text-sm text-neutral-400'>
              Get instant insights into your finances with live dashboards.
            </p>
          </div>
          <div className='max-w-80 transition duration-300 hover:-translate-y-0.5'>
            <img
              className='rounded-xl'
              src='https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/image-3.png'
              alt=''
            />
            <h3 className='mt-4 text-base font-semibold text-neutral-300'>
              Better invoicing
            </h3>
            <p className='mt-1 text-sm text-neutral-400'>
              Get instant insights into your finances with live dashboards.
            </p>
          </div>
        </div>
      </div>

      <section className='mt-10 mb-20 flex flex-col items-center justify-center gap-10 max-md:px-4 md:flex-row'>
        <div className='text-sm text-neutral-400 lg:max-w-[60%]'>
          <div className='flex items-center justify-center'>
            <Tabs
              defaultValue='support'
              className='flex w-full flex-col items-center justify-center lg:max-w-5xl lg:px-16'
            >
              <div className='bg-BackgroundDark dark:bg-BackgroundDark sticky top-16 z-10 my-4 mt-2 flex w-full items-center justify-center py-2 lg:top-14'>
                <TabsList className='bg-card bg-BackgroundDark dark:bg-BackgroundDark sm:w-start mt-1 flex w-fit justify-start gap-2 overflow-x-auto overflow-y-hidden rounded-md border border-neutral-900 p-1 sm:max-w-screen-lg lg:overscroll-none dark:border-neutral-900'>
                  <TabsTrigger
                    value='support'
                    className='data-[state=active]:bg-Primary data-[state=active]:text-TextDark1 dark:data-[state=active]:text-TextDark1 dark:data-[state=active]:bg-Primary text-TextDark1 dark:text-TextDark1 w-fit px-4 py-2'
                  >
                    Support
                  </TabsTrigger>
                  <TabsTrigger
                    value='suggestion'
                    className='data-[state=active]:bg-Primary data-[state=active]:text-TextDark1 dark:data-[state=active]:text-TextDark1 dark:data-[state=active]:bg-Primary text-TextDark1 dark:text-TextDark1 w-fit px-4 py-2'
                  >
                    Suggestion
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value='support'>
                <Card className='bg-BackgroundDark dark:bg-BackgroundDark w-full max-w-2xl border border-neutral-900 dark:border-neutral-900'>
                  <CardHeader>
                    {/* <CardTitle>Submit a Support Ticket</CardTitle> */}
                    <CardDescription className='text-neutral-400'>
                      Need help? Submit a support ticket and we{`'`}ll get back
                      to you as soon as possible.
                    </CardDescription>
                  </CardHeader>
                  <form
                    onSubmit={onSupportSubmit}
                    encType='multipart/form-data'
                  >
                    <CardContent className='space-y-4'>
                      <div className='w-full space-y-2'>
                        <Label
                          className='text-neutral-400'
                          htmlFor='support-name'
                        >
                          Name
                        </Label>
                        <Input
                          className='bg-BackgroundDark2 dark:bg-BackgroundDark2 text-TextDark2 dark:text-TextDark2 w-full border border-neutral-900 dark:border-neutral-900'
                          id='support-name'
                          name='name'
                          placeholder='Your name'
                          value={supportName}
                          onChange={handleSupportChange}
                          required
                        />
                      </div>
                      <div className='w-full space-y-2'>
                        <Label
                          className='text-neutral-400'
                          htmlFor='support-email'
                        >
                          Email
                        </Label>
                        <Input
                          className='bg-BackgroundDark2 dark:bg-BackgroundDark2 text-TextDark2 dark:text-TextDark2 w-full border border-neutral-900 dark:border-neutral-900'
                          id='support-email'
                          name='email'
                          type='email'
                          placeholder='Your email'
                          value={supportEmail}
                          onChange={handleSupportChange}
                          required
                        />
                      </div>
                      <div className='w-full space-y-2'>
                        <Label
                          className='text-neutral-400'
                          htmlFor='support-type'
                        >
                          Ticket Type
                        </Label>
                        <Select
                          onValueChange={handleSupportTicketTypeChange}
                          value={supportTicketType}
                        >
                          <SelectTrigger
                            id='support-type'
                            className='bg-BackgroundDark2 dark:bg-BackgroundDark2 text-TextDark2 dark:text-TextDark2 w-full border border-neutral-900 dark:border-neutral-900'
                          >
                            <SelectValue placeholder='Select ticket type' />
                          </SelectTrigger>
                          <SelectContent className='bg-BackgroundDark2 dark:bg-BackgroundDark2 text-TextDark2 dark:text-TextDark2 border border-neutral-900 dark:border-neutral-900'>
                            <SelectItem value='technical'>
                              Technical Issue
                            </SelectItem>
                            <SelectItem value='billing'>
                              Billing Question
                            </SelectItem>
                            <SelectItem value='feature'>
                              Feature Request
                            </SelectItem>
                            <SelectItem value='other'>Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className='w-full space-y-2'>
                        <Label
                          className='text-neutral-400'
                          htmlFor='support-subject'
                        >
                          Subject
                        </Label>
                        <Input
                          className='bg-BackgroundDark2 dark:bg-BackgroundDark2 text-TextDark2 dark:text-TextDark2 w-full border border-neutral-900 dark:border-neutral-900'
                          id='support-subject'
                          name='subject'
                          placeholder='Brief description of the issue'
                          value={supportSubject}
                          onChange={handleSupportChange}
                          required
                        />
                      </div>
                      <div className='w-full space-y-2'>
                        <Label
                          className='text-neutral-400'
                          htmlFor='support-description'
                        >
                          Description
                        </Label>
                        <Textarea
                          id='support-description'
                          name='description'
                          placeholder='Please provide details about your issue'
                          value={supportDescription}
                          className='bg-BackgroundDark2 dark:bg-BackgroundDark2 text-TextDark2 dark:text-TextDark2 w-full border border-neutral-900 dark:border-neutral-900'
                          onChange={handleSupportChange}
                          required
                        />
                      </div>
                      <div className='w-full space-y-2'>
                        <Label
                          className='text-neutral-400'
                          htmlFor='support-file'
                        >
                          Attach File (optional)
                        </Label>
                        <div className='flex w-full items-center space-x-2'>
                          <Input
                            id='support-file'
                            name='support-file'
                            type='file'
                            onChange={handleSupportFileChange}
                            className='hidden'
                          />
                          <Button
                            type='button'
                            variant='outline'
                            onClick={() =>
                              document.getElementById("support-file")?.click()
                            }
                            className='flex-shrink-0'
                          >
                            <Upload className='mr-2 h-4 w-4' />
                            Choose File
                          </Button>
                          <span className='flex-1 text-sm text-gray-500'>
                            {supportFile ? supportFile.name : "No file chosen"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        type='submit'
                        className='bg-BackgroundLight2 dark:bg-BackgroundLight2 hover:bg-BackgroundLight2 hover:dark:bg-BackgroundLight2 w-full text-black hover:text-black dark:text-black dark:hover:text-black'
                        disabled={isSubmitting}
                      >
                        {isSubmitting
                          ? "Submitting..."
                          : "Submit Support Ticket"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
              <TabsContent value='suggestion'>
                <Card className='bg-BackgroundDark dark:bg-BackgroundDark w-full max-w-2xl border border-neutral-900 dark:border-neutral-900'>
                  <CardHeader>
                    {/* <CardTitle>Submit a Suggestion</CardTitle> */}
                    <CardDescription className='text-neutral-400'>
                      Have an idea to improve our service? We{`'`}d love to hear
                      it!
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={onSuggestionSubmit}>
                    <CardContent className='space-y-4'>
                      <div className='w-full space-y-2'>
                        <Label
                          className='text-neutral-400'
                          htmlFor='suggestion-name'
                        >
                          Name
                        </Label>
                        <Input
                          className='bg-BackgroundDark2 dark:bg-BackgroundDark2 text-TextDark2 dark:text-TextDark2 w-full border border-neutral-900 dark:border-neutral-900'
                          id='suggestion-name'
                          name='name'
                          placeholder='Your name'
                          value={suggestionName}
                          onChange={handleSuggestionChange}
                          required
                        />
                      </div>
                      <div className='w-full space-y-2'>
                        <Label
                          className='text-neutral-400'
                          htmlFor='suggestion-email'
                        >
                          Email
                        </Label>
                        <Input
                          className='bg-BackgroundDark2 dark:bg-BackgroundDark2 text-TextDark2 dark:text-TextDark2 w-full border border-neutral-900 dark:border-neutral-900'
                          id='suggestion-email'
                          name='email'
                          type='email'
                          placeholder='Your email'
                          value={suggestionEmail}
                          onChange={handleSuggestionChange}
                          required
                        />
                      </div>
                      <div className='w-full space-y-2'>
                        <Label
                          className='text-neutral-400'
                          htmlFor='suggestion-subject'
                        >
                          Suggestion Title
                        </Label>
                        <Input
                          className='bg-BackgroundDark2 dark:bg-BackgroundDark2 text-TextDark2 dark:text-TextDark2 w-full border border-neutral-900 dark:border-neutral-900'
                          id='suggestion-subject'
                          name='subject'
                          placeholder='Brief title for your suggestion'
                          value={suggestionSubject}
                          onChange={handleSuggestionChange}
                          required
                        />
                      </div>
                      <div className='w-full space-y-2'>
                        <Label
                          className='text-neutral-400'
                          htmlFor='suggestion-description'
                        >
                          Description
                        </Label>
                        <Textarea
                          id='suggestion-description'
                          name='description'
                          className='bg-BackgroundDark2 dark:bg-BackgroundDark2 text-TextDark2 dark:text-TextDark2 w-full resize-none border border-neutral-900 dark:border-neutral-900'
                          placeholder='Please provide details about your suggestion'
                          value={suggestionDescription}
                          onChange={handleSuggestionChange}
                          required
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        type='submit'
                        className='bg-BackgroundLight2 dark:bg-BackgroundLight2 hover:bg-BackgroundLight2 hover:dark:bg-BackgroundLight2 w-full text-black hover:text-black dark:text-black dark:hover:text-black'
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Suggestion"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}

export default Page;
