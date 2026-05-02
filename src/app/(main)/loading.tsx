import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0A0B]">
      <LoadingSpinner size="lg" label="Loading..." />
    </div>
  );
}
