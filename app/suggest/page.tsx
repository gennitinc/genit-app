import { permanentRedirect } from "next/navigation";

export default function SuggestRedirect() {
  permanentRedirect("/feedback");
}
