export default function Loading() {
  return (
    <div
      className='flex min-h-[100dvh] items-center justify-center bg-white dark:bg-black'
      role='status'
      aria-live='polite'
    >
      <div className='h-7 w-7 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent' />
      <span className='sr-only'>Loading page</span>
    </div>
  );
}
