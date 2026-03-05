import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { JiraTicket } from "@/types";

function App() {
  const [ticketInput, setTicketInput] = useState("");
  const [tickets, setTickets] = useState<JiraTicket[]>([]);
  const [loading, setLoading] = useState(false);

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
    </main>
  );
}

export default App;
