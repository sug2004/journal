// export default function ImagePreview({ src }: { src: string }) {
//     if (!src) return null;
  
//     return (
//       <div className="mt-6">
//         <p className="text-sm text-gray-500 mb-2">Attached Media</p>
//         <img src={src} alt="Preview" className="w-full max-h-[400px] object-cover rounded-md border" />
//       </div>
//     );
//   }
  

"use client";

import { useRef } from "react";

export default function ImagePreview({
  src,
  onChange,
}: {
  src: string;
  onChange: (base64: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 500 * 1024; // 500KB

    if (file.size > MAX_SIZE) {
      alert("❌ Image size exceeds 500KB. Please choose a smaller image.");
      e.target.value = ""; // reset the input
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      onChange(base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      {src && (
        <img
          src={src}
          alt="Preview"
          className="w-full max-h-64 object-cover rounded-md border"
        />
      )}
      <input
        type="file"
        accept="image/*"
        ref={fileRef}
        onChange={handleUpload}
        className="block"
      />
    </div>
  );
}
