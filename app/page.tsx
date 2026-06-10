import { LockIcon } from "@/components/icons";
import { PasswordHelper } from "@/components/password-helper";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <ThemeToggle />

      <div className="w-full max-w-2xl">
        <header className="mb-10 flex flex-col items-center text-center">
          <h1 className="bg-gradient-to-b from-fg to-muted bg-clip-text text-3xl font-semibold tracking-tight text-transparent sm:text-4xl">
            Password Helper
          </h1>
          <p className="mt-3 max-w-lg text-balance text-sm leading-relaxed text-muted">
            Turns your password into a masked-password view with every
            character numbered by position.
          </p>
        </header>

        <PasswordHelper />

        <footer className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted">
          <LockIcon size={13} />
          Nothing is sent or stored - everything runs locally in your browser.
        </footer>
      </div>
    </main>
  );
}
