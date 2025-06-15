
'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import JournalTitleInput from "@/components/journal/JournalTitleInput";
import JournalBodyEditor from "@/components/journal/JournalBodyEditor";
import JournalEntrySidebar from "@/components/journal/JournalEntrySidebar";
import ImagePreview from "@/components/journal/ImagePreview";
import EntryActions from "@/components/journal/EntryActions";

export default function NewJournalEntry() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [imageURL, setImageURL] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
  
    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content: body,
          tags,
          date,
          media_base64: imageURL,
        }),
      });
  
      const contentType = res.headers.get("Content-Type");
  
      if (!res.ok) {
        let errorText = "Unknown error";
        if (contentType && contentType.includes("application/json")) {
          const result = await res.json();
          errorText = result?.error || JSON.stringify(result);
        } else {
          const text = await res.text();
          errorText = text || errorText;
        }
  
        console.error("❌ Save failed", errorText);
        alert("Save failed: " + errorText);
        return;
      }
  
      alert("✅ Entry saved!");
      router.push("/journal");
    } catch (err) {
      console.error("❌ Unexpected save error", err);
      alert("Unexpected error: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setSaving(false);
    }
  };
  
  const handleDelete = () => {
    setTitle("");
    setBody("");
    setTags("");
    setImageURL("");
    alert("Entry cleared");
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-4">
      <div className="text-sm text-gray-600 mb-2">
        <button onClick={() => router.back()} className="text-gray-500 hover:underline">
          &larr; Back to Journal
        </button>
      </div>

      <JournalTitleInput title={title} onChange={setTitle} />
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <JournalBodyEditor body={body} onChange={setBody} />
          <ImagePreview src={imageURL} onChange={setImageURL} />
        </div>
        <JournalEntrySidebar
          tags={tags}
          onTagsChange={setTags}
          date={date}
          onDateChange={setDate}
        />
      </div>

      <EntryActions onSave={handleSave} onDelete={handleDelete} saving={saving} />
    </div>
  );
}
