"use client";

// import type { Metadata } from "next";
import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { SnackbarProvider, enqueueSnackbar, closeSnackbar } from "notistack";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, CheckCircle2, Upload } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { apiResponseFileUpload } from "@/utils/apiResponseFileUpload";

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
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                className=""
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 21l-9-9m0 0L3 3m9 9l9-9m-9 9l-9 9"
                  stroke="#fff"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
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
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              className=""
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 21l-9-9m0 0L3 3m9 9l9-9m-9 9l-9 9"
                stroke="#fff"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
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
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                className=""
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 21l-9-9m0 0L3 3m9 9l9-9m-9 9l-9 9"
                  stroke="#fff"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
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
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              className=""
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 21l-9-9m0 0L3 3m9 9l9-9m-9 9l-9 9"
                stroke="#fff"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
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
    <div className="bg-white dark:bg-black h-full">
      <SnackbarProvider
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
      <div className="sticky top-0 z-40">
        <LandingNavbar />
      </div>
      <div className="hidden lg:block">
        {/* <h1 className="text-3xl font-semibold text-center mx-auto">
          Powerful Features
        </h1>
        <p className="text-sm text-slate-500 text-center mt-2 max-w-md mx-auto">
          Everything you need to manage, track, and grow your finances, securely
          and efficiently.
        </p> */}
        <div className="flex flex-wrap items-center justify-center gap-10 mt-16">
          <div className="max-w-80 hover:-translate-y-0.5 transition duration-300">
            <img
              className="rounded-xl"
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/image-1.png"
              alt=""
            />
            <h3 className="text-base font-semibold text-neutral-300 mt-4">
              Feedback analyser
            </h3>
            <p className="text-sm text-neutral-400 mt-1">
              Get instant insights into your finances with live dashboards.
            </p>
          </div>
          <div className="max-w-80 hover:-translate-y-0.5 transition duration-300">
            <img
              className="rounded-xl"
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/image-2.png"
              alt=""
            />
            <h3 className="text-base font-semibold text-neutral-300 mt-4">
              User management
            </h3>
            <p className="text-sm text-neutral-400 mt-1">
              Get instant insights into your finances with live dashboards.
            </p>
          </div>
          <div className="max-w-80 hover:-translate-y-0.5 transition duration-300">
            <img
              className="rounded-xl"
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/image-3.png"
              alt=""
            />
            <h3 className="text-base font-semibold text-neutral-300 mt-4">
              Better invoicing
            </h3>
            <p className="text-sm text-neutral-400 mt-1">
              Get instant insights into your finances with live dashboards.
            </p>
          </div>
        </div>
      </div>

      <section className="flex flex-col md:flex-row items-center justify-center gap-10 max-md:px-4 mt-10 mb-20">
        <div className="text-sm text-neutral-400 lg:max-w-[60%]">
          <div className="flex items-center justify-center">
            <Tabs
              defaultValue="support"
              className="w-full lg:max-w-5xl lg:px-16 flex flex-col items-center justify-center"
            >
              <div className="flex my-4 mt-2 sticky top-16 lg:top-14 py-2 z-10 bg-BackgroundDark dark:bg-BackgroundDark w-full items-center justify-center">
                <TabsList className="bg-card p-1 mt-1 rounded-md bg-BackgroundDark dark:bg-BackgroundDark dark:border-neutral-900 w-fit sm:w-start sm:max-w-screen-lg lg:overscroll-none overflow-x-auto overflow-y-hidden flex gap-2 justify-start border border-neutral-900">
                  <TabsTrigger
                    value="support"
                    className="data-[state=active]:bg-Primary data-[state=active]:text-TextDark1 dark:data-[state=active]:text-TextDark1 dark:data-[state=active]:bg-Primary px-4 py-2 text-TextDark1 dark:text-TextDark1 w-fit"
                  >
                    Support
                  </TabsTrigger>
                  <TabsTrigger
                    value="suggestion"
                    className="data-[state=active]:bg-Primary data-[state=active]:text-TextDark1 dark:data-[state=active]:text-TextDark1 dark:data-[state=active]:bg-Primary px-4 py-2 text-TextDark1 dark:text-TextDark1 w-fit"
                  >
                    Suggestion
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="support">
                <Card className="bg-BackgroundDark dark:bg-BackgroundDark border dark:border-neutral-900 border-neutral-900 w-full max-w-2xl">
                  <CardHeader>
                    {/* <CardTitle>Submit a Support Ticket</CardTitle> */}
                    <CardDescription className="text-neutral-400">
                      Need help? Submit a support ticket and we{`'`}ll get back
                      to you as soon as possible.
                    </CardDescription>
                  </CardHeader>
                  <form
                    onSubmit={onSupportSubmit}
                    encType="multipart/form-data"
                  >
                    <CardContent className="space-y-4">
                      <div className="space-y-2 w-full">
                        <Label
                          className="text-neutral-400"
                          htmlFor="support-name"
                        >
                          Name
                        </Label>
                        <Input
                          className="bg-BackgroundDark2 dark:bg-BackgroundDark2 border text-TextDark2 dark:text-TextDark2 dark:border-neutral-900 border-neutral-900 w-full"
                          id="support-name"
                          name="name"
                          placeholder="Your name"
                          value={supportName}
                          onChange={handleSupportChange}
                          required
                        />
                      </div>
                      <div className="space-y-2 w-full">
                        <Label
                          className="text-neutral-400"
                          htmlFor="support-email"
                        >
                          Email
                        </Label>
                        <Input
                          className="bg-BackgroundDark2 dark:bg-BackgroundDark2 border text-TextDark2 dark:text-TextDark2 dark:border-neutral-900 border-neutral-900 w-full"
                          id="support-email"
                          name="email"
                          type="email"
                          placeholder="Your email"
                          value={supportEmail}
                          onChange={handleSupportChange}
                          required
                        />
                      </div>
                      <div className="space-y-2 w-full">
                        <Label
                          className="text-neutral-400"
                          htmlFor="support-type"
                        >
                          Ticket Type
                        </Label>
                        <Select
                          onValueChange={handleSupportTicketTypeChange}
                          value={supportTicketType}
                        >
                          <SelectTrigger
                            id="support-type"
                            className="bg-BackgroundDark2 dark:bg-BackgroundDark2 border text-TextDark2 dark:text-TextDark2 dark:border-neutral-900 border-neutral-900 w-full"
                          >
                            <SelectValue placeholder="Select ticket type" />
                          </SelectTrigger>
                          <SelectContent className="bg-BackgroundDark2 dark:bg-BackgroundDark2 border text-TextDark2 dark:text-TextDark2 dark:border-neutral-900 border-neutral-900">
                            <SelectItem value="technical">
                              Technical Issue
                            </SelectItem>
                            <SelectItem value="billing">
                              Billing Question
                            </SelectItem>
                            <SelectItem value="feature">
                              Feature Request
                            </SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 w-full">
                        <Label
                          className="text-neutral-400"
                          htmlFor="support-subject"
                        >
                          Subject
                        </Label>
                        <Input
                          className="bg-BackgroundDark2 dark:bg-BackgroundDark2 border text-TextDark2 dark:text-TextDark2 dark:border-neutral-900 border-neutral-900 w-full"
                          id="support-subject"
                          name="subject"
                          placeholder="Brief description of the issue"
                          value={supportSubject}
                          onChange={handleSupportChange}
                          required
                        />
                      </div>
                      <div className="space-y-2 w-full">
                        <Label
                          className="text-neutral-400"
                          htmlFor="support-description"
                        >
                          Description
                        </Label>
                        <Textarea
                          id="support-description"
                          name="description"
                          placeholder="Please provide details about your issue"
                          value={supportDescription}
                          className="bg-BackgroundDark2 dark:bg-BackgroundDark2 border text-TextDark2 dark:text-TextDark2 dark:border-neutral-900 border-neutral-900 w-full"
                          onChange={handleSupportChange}
                          required
                        />
                      </div>
                      <div className="space-y-2 w-full">
                        <Label
                          className="text-neutral-400"
                          htmlFor="support-file"
                        >
                          Attach File (optional)
                        </Label>
                        <div className="flex items-center space-x-2 w-full">
                          <Input
                            id="support-file"
                            name="support-file"
                            type="file"
                            onChange={handleSupportFileChange}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document.getElementById("support-file")?.click()
                            }
                            className="flex-shrink-0"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Choose File
                          </Button>
                          <span className="text-sm text-gray-500 flex-1">
                            {supportFile ? supportFile.name : "No file chosen"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        type="submit"
                        className="w-full bg-BackgroundLight2 text-black dark:bg-BackgroundLight2 dark:text-black hover:bg-BackgroundLight2 hover:dark:bg-BackgroundLight2 hover:text-black dark:hover:text-black"
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
              <TabsContent value="suggestion">
                <Card className="bg-BackgroundDark dark:bg-BackgroundDark border dark:border-neutral-900 border-neutral-900 w-full max-w-2xl">
                  <CardHeader>
                    {/* <CardTitle>Submit a Suggestion</CardTitle> */}
                    <CardDescription className="text-neutral-400">
                      Have an idea to improve our service? We{`'`}d love to hear
                      it!
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={onSuggestionSubmit}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 w-full">
                        <Label
                          className="text-neutral-400"
                          htmlFor="suggestion-name"
                        >
                          Name
                        </Label>
                        <Input
                          className="bg-BackgroundDark2 dark:bg-BackgroundDark2 border text-TextDark2 dark:text-TextDark2 dark:border-neutral-900 border-neutral-900 w-full"
                          id="suggestion-name"
                          name="name"
                          placeholder="Your name"
                          value={suggestionName}
                          onChange={handleSuggestionChange}
                          required
                        />
                      </div>
                      <div className="space-y-2 w-full">
                        <Label
                          className="text-neutral-400"
                          htmlFor="suggestion-email"
                        >
                          Email
                        </Label>
                        <Input
                          className="bg-BackgroundDark2 dark:bg-BackgroundDark2 border text-TextDark2 dark:text-TextDark2 dark:border-neutral-900 border-neutral-900 w-full"
                          id="suggestion-email"
                          name="email"
                          type="email"
                          placeholder="Your email"
                          value={suggestionEmail}
                          onChange={handleSuggestionChange}
                          required
                        />
                      </div>
                      <div className="space-y-2 w-full">
                        <Label
                          className="text-neutral-400"
                          htmlFor="suggestion-subject"
                        >
                          Suggestion Title
                        </Label>
                        <Input
                          className="bg-BackgroundDark2 dark:bg-BackgroundDark2 border text-TextDark2 dark:text-TextDark2 dark:border-neutral-900 border-neutral-900 w-full"
                          id="suggestion-subject"
                          name="subject"
                          placeholder="Brief title for your suggestion"
                          value={suggestionSubject}
                          onChange={handleSuggestionChange}
                          required
                        />
                      </div>
                      <div className="space-y-2 w-full">
                        <Label
                          className="text-neutral-400"
                          htmlFor="suggestion-description"
                        >
                          Description
                        </Label>
                        <Textarea
                          id="suggestion-description"
                          name="description"
                          className="bg-BackgroundDark2 dark:bg-BackgroundDark2 border text-TextDark2 dark:text-TextDark2 dark:border-neutral-900 border-neutral-900 resize-none w-full"
                          placeholder="Please provide details about your suggestion"
                          value={suggestionDescription}
                          onChange={handleSuggestionChange}
                          required
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        type="submit"
                        className="w-full bg-BackgroundLight2 text-black dark:bg-BackgroundLight2 dark:text-black hover:bg-BackgroundLight2 hover:dark:bg-BackgroundLight2 hover:text-black dark:hover:text-black"
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

