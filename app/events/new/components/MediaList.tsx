"use client";

import InputField from "@/components/InputField";
import MediaCarousel from "@/components/MediaCarousel";
import { Plus, Trash } from "lucide-react";
import { useCallback, useState } from "react";

interface Props {
  media: string[];
  setMedia: React.Dispatch<React.SetStateAction<string[]>>;
  error: string | undefined;
}

export default function MediaList({ media, setMedia, error }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [url, setUrl] = useState("");

  const handleAddImage = () => {
    const trimmedUrl = url.trim();

    if (trimmedUrl === "") return;

    setMedia((prev) => {
      return [...prev, trimmedUrl];
    });
    setUrl("");
  };

  const handleRemoveImage = useCallback(() => {
    setMedia((prev) => {
      const next = prev.filter((_, i) => i !== selectedIndex);
      if (next.length === 0) {
        setSelectedIndex(0);
      } else if (selectedIndex >= next.length) {
        setSelectedIndex(next.length - 1);
      }
      return next;
    });
  }, [selectedIndex, setMedia]);

  return (
    <section className="w-full rounded-2xl border border-violet-100 bg-white/80 p-5 shadow-sm shadow-violet-100/60">
      <p className="text-xs font-bold tracking-[0.22em] text-violet-500 mb-4">
        ΠΟΛΥΜΕΣΑ
      </p>

      {media.length > 0 && (
        <div className="relative mb-6">
          <MediaCarousel
            selectedIndex={selectedIndex}
            onSelectedIndexChange={setSelectedIndex}
            images={media}
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            aria-label="Αφαίρεση τρέχουσας εικόνας"
            className="absolute top-3 right-3 z-20 rounded-full bg-red-500/85 p-1.5 text-white shadow-md hover:bg-red-600 transition"
          >
            <Trash size={16} />
          </button>
        </div>
      )}

      <div className="flex items-end space-x-2">
        <InputField
          id={""}
          label={"Διεύθυνση URL"}
          placeholder={"https://example.com/image"}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddImage();
            }
          }}
        />
        <button
          onClick={handleAddImage}
          type="button"
          className="bg-violet-500 text-white p-2 rounded-xl ring-0 hover:ring-2 ring-violet-500 transition-all active:ring-offset-1 focus:ring-offset-2 outline-0 tracking-wide font-semibold"
        >
          <Plus />
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-700 mt-2 ml-1" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
