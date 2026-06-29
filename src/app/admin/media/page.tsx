"use client";

import { useEffect, useState } from "react";
import { Image, Upload, Trash2, X, Plus, CheckCircle2, File } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminMediaManager() {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const loadMedia = async () => {
    try {
      const res = await fetch("/api/admin/media");
      if (res.ok) {
        const data = await res.json();
        setMedia(data);
      }
    } catch (e) {
      console.error("Failed to load media:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("altText", selectedFile.name.split(".")[0]);

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setSuccess(true);
        setSelectedFile(null);
        setTimeout(() => setSuccess(false), 3000);
        loadMedia();
      }
    } catch (e) {
      console.error("Error uploading media:", e);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media item?")) return;
    try {
      const res = await fetch(`/api/admin/media?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        loadMedia();
      }
    } catch (e) {
      console.error("Error deleting media item:", e);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-xs font-bold text-slate-500 uppercase tracking-widest">
        <span>Loading Media Library...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
          Media Library <Image className="w-5 h-5 text-yellow-400" />
        </h1>
        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
          Upload and index pictures, covers, and portfolio assets.
        </p>
      </div>

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold animate-pulse"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Media library updated successfully!</span>
        </motion.div>
      )}

      {/* Upload Box */}
      <form onSubmit={handleUpload} className="glassmorphism p-6 rounded-2xl border border-slate-900 flex flex-col md:flex-row items-center gap-4 justify-between max-w-xl">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <label className="px-4 py-2.5 bg-slate-950/60 border border-slate-800 hover:border-slate-700 text-slate-350 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all flex items-center gap-2 shrink-0">
            <Plus className="w-4 h-4" />
            <span>Choose File</span>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              className="hidden" 
            />
          </label>
          <span className="text-xs text-slate-400 font-medium truncate max-w-[200px]">
            {selectedFile ? selectedFile.name : "No file chosen"}
          </span>
        </div>

        <button
          type="submit"
          disabled={!selectedFile || uploading}
          className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 text-slate-950 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all cursor-pointer w-full md:w-auto justify-center"
        >
          <Upload className="w-4 h-4" />
          <span>{uploading ? "Uploading..." : "Upload Asset"}</span>
        </button>
      </form>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {media.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">
            No media files uploaded yet.
          </div>
        ) : (
          media.map((item) => (
            <div 
              key={item.id}
              className="glassmorphism rounded-xl border border-slate-900 overflow-hidden relative group aspect-square shadow-md"
            >
              {/* Image Preview */}
              {item.mimeType.startsWith("image/") ? (
                <img 
                  src={item.url} 
                  alt={item.altText || ""}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950/40 text-slate-500">
                  <File className="w-8 h-8" />
                  <span className="text-[10px] uppercase font-bold mt-2 truncate max-w-[80px]">{item.filename}</span>
                </div>
              )}

              {/* Hover Delete Action */}
              <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center p-3 gap-3">
                <p className="text-[9px] font-mono text-slate-350 truncate w-full text-center">{item.url}</p>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                  title="Delete Image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
