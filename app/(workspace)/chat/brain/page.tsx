import { redirect } from "next/navigation";

export default function BrainRedirectPage() {
  redirect("/user/settings?tab=brand");
}
