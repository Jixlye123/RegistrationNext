import { Loader2 } from "lucide-react"; // spinner icon
import { cn } from "@/lib/utils"; // optional className merge util

export function Loader({ className }: { className?: string }) {
  return (
    <div className="flex items-center justify-center p-10">
      <Loader2 className={cn("h-8 w-8 animate-spin text-blue-500", className)} />
    </div>
  );
}
