import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B2540]">
      <LoadingSpinner size="lg" label="Loading..." />
    </div>
  );
}
