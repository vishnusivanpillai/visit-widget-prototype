import { VisitDashboard } from "./components/VisitDashboard";
import { Toaster } from "sonner";

export default function App() {
  return (
    <div className="size-full">
      <VisitDashboard />
      <Toaster position="top-right" richColors />
    </div>
  );
}