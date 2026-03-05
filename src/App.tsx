import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [ticketInput, setTicketInput] = useState("");
  const [tickets, setTickets] = useState<JiraTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

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
      <h1 className="text-xl font-semibold">Jira Discord Release</h1>
      <p className="text-muted-foreground text-sm">Enter Jira ticket keys (e.g. PROJ-1, PROJ-2)</p>
      <div className="flex gap-2 w-full max-w-md">
        <Input
          placeholder="PROJ-1, PROJ-2, ..."
          className="flex-1"
          value={ticketInput}
          onChange={(e) => setTicketInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleFetch()}
        />
        <Button onClick={handleFetch} disabled={loading}>
          {loading ? "..." : "Fetch"}
        </Button>
      </div>
      {tickets.length > 0 && (
        <ul className="w-full max-w-md text-left list-disc list-inside space-y-1 text-sm">
          {tickets.map((t) => (
            <li key={t.key}>
              <span className="font-medium">{t.key}</span>: {t.summary} ({t.status})
            </li>
          ))}
        </ul>
      )}
      {releaseMessage && (
        <div className="w-full max-w-md flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Release message for Discord</span>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? "Copied!" : "Copy"}
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
