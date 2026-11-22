import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon } from "@hugeicons/core-free-icons";

export default function ComposioConnectPage() {
  return (
    <main className='flex min-h-screen items-center justify-center bg-white text-zinc-700 dark:bg-zinc-950 dark:text-zinc-200'>
      <div className='flex items-center gap-3 text-sm'>
        <HugeiconsIcon icon={Loading03Icon} className='h-5 w-5 animate-spin' />
        Opening secure connection…
      </div>
    </main>
  );
}
