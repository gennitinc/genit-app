export function beginConnectionAttempt(ref: { current: number }) {
  const id = ++ref.current;
  return () => ref.current === id;
}
