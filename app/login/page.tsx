export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <main className="min-h-screen grid place-items-center bg-app px-4">
      <form
        action="/api/login"
        method="post"
        className="w-full max-w-sm rounded-[var(--radius-card)] bg-surface p-8 shadow-[var(--shadow-card)] border border-line"
      >
        <h1 className="text-2xl font-semibold text-ink">English Board</h1>
        <p className="mt-1 text-sm text-muted">Enter your password to continue.</p>
        <input
          type="password"
          name="password"
          autoFocus
          placeholder="Password"
          className="mt-6 w-full rounded-[var(--radius-pill)] border border-line bg-app px-4 py-3 text-ink outline-none focus:border-accent"
        />
        {error && <p className="mt-2 text-sm text-red-500">Wrong password. Try again.</p>}
        <button
          type="submit"
          className="mt-4 w-full rounded-[var(--radius-pill)] bg-accent px-4 py-3 font-medium text-accent-fg"
        >
          Enter
        </button>
      </form>
    </main>
  );
}
