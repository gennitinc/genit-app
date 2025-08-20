"use client";

// import { LandingPage } from "../components/landing/landing-page";
import { useUserContext } from "@/context/AuthenticatedContext";
import { useRouter } from "next/navigation";

function Page() {
  const user = useUserContext().user;
  const router = useRouter();

  if (user) {
    router.push("/chat");
  }
  // return <LandingPage />;
  return router.push("/chat");
}

export default Page;
