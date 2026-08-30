"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { ProductImage } from "@prisma/client";

export default function ImageManager({
  productId,
  images,
}: {
  productId: string;
  images: ProductImage[];
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFilesSelected(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("productId", productId);
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Upload failed.");
      }
    }
    setUploading(false);
    router.refresh();
  }

  async function setMain(imageId: string) {
    await fetch(`/api/admin/products/${productId}/images`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageId, action: "setMain" }),
    });
    router.refresh();
  }

  async function remove(imageId: string) {
    await fetch(`/api/admin/products/${productId}/images`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageId, action: "delete" }),
    });
    router.refresh();
  }

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
        {images.map((img) => (
          <div key={img.id} className="relative aspect-square bg-navy border border-white/10 group">
            <Image src={img.url} alt={img.alt ?? ""} fill sizes="150px" className="object-cover" />
            {img.isMain && (
              <span className="absolute top-1 left-1 bg-electric text-ink text-[9px] font-bold px-1.5 py-0.5 uppercase">
                Main
              </span>
            )}
            <div className="absolute inset-0 bg-ink/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              {!img.isMain && (
                <button onClick={() => setMain(img.id)} className="text-[10px] text-cream underline">
                  Set Main
                </button>
              )}
              <button onClick={() => remove(img.id)} className="text-[10px] text-maroon underline">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        className="hidden"
        onChange={(e) => onFilesSelected(e.target.files)}
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="px-4 py-2 border border-white/15 text-cream text-xs tracking-widest2 uppercase hover:border-electric transition-colors disabled:opacity-60"
      >
        {uploading ? "Uploading…" : "+ Upload Images"}
      </button>
      {error && <p className="text-sm text-maroon mt-2">{error}</p>}
    </div>
  );
}
