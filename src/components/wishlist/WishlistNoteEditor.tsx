"use client";

import { useState } from "react";
import { StickyNote, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/useWishlist";
import { showToast } from "@/components/shared/Toast";

interface WishlistNoteEditorProps {
  carId: string;
  initialNote: string | null;
}

export function WishlistNoteEditor({ carId, initialNote }: WishlistNoteEditorProps) {
  const { updateWishlistEntry } = useWishlist();
  const [note, setNote] = useState(initialNote ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const ok = await updateWishlistEntry(carId, {
        note: note.trim() || null,
      });
      if (ok) {
        setSaved(true);
        showToast("Note saved", "success");
        setTimeout(() => setSaved(false), 2000);
      } else {
        showToast("Failed to save note", "error");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save note";
      showToast(message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.02] p-3">
      <label className="mb-2 flex items-center gap-1.5 text-xs font-medium text-zinc-400">
        <StickyNote className="h-3.5 w-3.5" />
        Your note
      </label>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="e.g. Miami trip in March, compare with SUV options..."
        rows={2}
        maxLength={300}
        className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-[#FDF5AA]/30 focus:outline-none"
      />
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-zinc-600">{note.length}/300</span>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleSave}
          disabled={saving}
          className="border-white/10 text-xs text-slate-200"
        >
          {saving ? (
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
          ) : saved ? (
            <Check className="mr-1 h-3 w-3 text-green-400" />
          ) : null}
          {saved ? "Saved" : "Save note"}
        </Button>
      </div>
    </div>
  );
}
