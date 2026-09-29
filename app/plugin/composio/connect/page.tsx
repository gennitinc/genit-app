import { Loader2 } from "lucide-react";

export default function ComposioConnectPage() {
  return (
    <main className='flex min-h-screen items-center justify-center bg-white text-zinc-700 dark:bg-zinc-950 dark:text-zinc-200'>
      <div className='flex items-center gap-3 text-sm'>
        <Loader2 className='h-5 w-5 animate-spin' />
        Opening secure connection…
      </div>
    </main>
  );
}
