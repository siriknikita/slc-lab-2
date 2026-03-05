import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PreferencesDialog } from "@/components/PreferencesDialog";
import { useLocale } from "@/contexts/LocaleContext";
import { translations } from "@/i18n";
import type { JiraTicket } from "@/types";

function buildReleaseMessage(tickets: JiraTicket[], version = "v0.1.0"): string {
  const lines = [
    `## Release ${version}`,
    "",
    "**Included in this release:**",
    "",
    ...tickets.map((t) => `- **${t.key}** — ${t.summary}`),
    "",
  ];
  return lines.join("\n");
}

function App() {
  const { locale } = useLocale();
  const t = translations[locale];
  const [ticketInput, setTicketInput] = useState("");
  const [tickets, setTickets] = useState<JiraTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);

  async function handleFetch() {
    const keys = ticketInput
      .split(/[\s,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    setLoading(true);
    try {
      const result = await invoke<JiraTicket[]>("fetch_tickets", { keys });
      setTickets(result);
    } finally {
      setLoading(false);
    }
  }

  const releaseMessage = tickets.length > 0 ? buildReleaseMessage(tickets) : "";

  async function handleCopy() {
    if (!releaseMessage) return;
    try {
      await navigator.clipboard.writeText(releaseMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <main className="min-h-screen p-6 flex flex-col items-center gap-6">
      <div className="w-full max-w-md flex justify-end">
        <Button variant="ghost" size="sm" onClick={() => setPrefsOpen(true)}>
          {t.preferences}
        </Button>
      </div>
      <PreferencesDialog open={prefsOpen} onClose={() => setPrefsOpen(false)} />
      <h1 className="text-xl font-semibold">{t.title}</h1>
      <p className="text-muted-foreground text-sm">{t.subtitle}</p>
      <div className="flex gap-2 w-full max-w-md">
        <Input
          placeholder={t.placeholder}
          className="flex-1"
          value={ticketInput}
          onChange={(e) => setTicketInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleFetch()}
        />
        <Button onClick={handleFetch} disabled={loading}>
          {loading ? t.loading : t.fetch}
        </Button>
      </div>
      {tickets.length > 0 && (
        <ul className="w-full max-w-md text-left list-disc list-inside space-y-1 text-sm">
          {tickets.map((ticket) => (
            <li key={ticket.key}>
              <span className="font-medium">{ticket.key}</span>: {ticket.summary} ({ticket.status})
            </li>
          ))}
        </ul>
      )}
      {releaseMessage && (
        <div className="w-full max-w-md flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t.releaseMessageLabel}</span>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? t.copied : t.copy}
            </Button>
          </div>
          <pre className="p-3 rounded-md bg-muted text-sm overflow-auto max-h-48 whitespace-pre-wrap">
            {releaseMessage}
          </pre>
        </div>
      )}
    </main>
  );
}

export default App;
