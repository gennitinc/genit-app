import Loading from "@/utils/Loading";

export default function RouteLoading() {
  return (
    <main
      aria-live='polite'
      className='flex min-h-[100dvh] w-full items-center justify-center bg-white text-neutral-700 dark:bg-black dark:text-neutral-200'
    >
      <div className='flex items-center gap-3'>
        <Loading size={20} />
        <span className='text-sm font-medium'>Loading...</span>
      </div>
    </main>
  );
}
