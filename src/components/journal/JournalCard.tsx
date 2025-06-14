"use client";

import Link from "next/link";

interface JournalCardProps {
  id: string;
  title: string;
  date: string;
  content: string;
  media_base64?: string;
}

export default function JournalCard({
  id,
  title,
  date,
  content,
  media_base64,
}: JournalCardProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md border">
      {media_base64 && (
        <img
          src={media_base64}
          alt={title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm text-gray-500 mb-2">{formattedDate}</p>
        <p className="text-sm text-gray-700 line-clamp-3">{content}</p>

        <Link
          href={`/journal/${id}`}
          className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2 w-full border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Read Entry
        </Link>
      </div>
    </div>
  );
}
