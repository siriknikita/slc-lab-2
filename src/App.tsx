import "./App.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function App() {
  return (
    <main className="min-h-screen p-6 flex flex-col items-center justify-center gap-4">
      <h1 className="text-xl font-semibold">Jira Discord Release</h1>
      <p className="text-muted-foreground text-sm">Enter Jira ticket keys (e.g. PROJ-1, PROJ-2)</p>
      <div className="flex gap-2 w-full max-w-md">
        <Input placeholder="PROJ-1, PROJ-2, ..." className="flex-1" />
        <Button>Fetch</Button>
      </div>
    </main>
  );
}

export default App;
