// "use client";
// export default function ProfileHeader() {
//   return (
//     <div className="flex items-center justify-between bg-white p-6 rounded-lg shadow-sm flex-wrap gap-4">
//       <div className="flex items-center gap-4">
//         <img src="/avatar.png" alt="User Avatar" className="w-16 h-16 rounded-full" />
//         <div>
//           <h2 className="font-bold text-xl">John Doe</h2>
//           <p className="text-gray-500 text-sm">john.doe@example.com</p>
//         </div>
//       </div>
//       <button className="btn btn-outline">Change Avatar</button>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function ProfileHeader() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) return console.error(userError);

      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, email, avatar_url")
        .eq("id", user.id)
        .single();

      if (error) console.error("Profile fetch error:", error.message);
      else setProfile({ ...data, id: user.id });
    };

    fetchProfile();
  }, []);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile?.id) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64DataUri = reader.result as string; // e.g., data:image/png;base64,...
      setLoading(true);

      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: base64DataUri })
        .eq("id", profile.id);

      if (error) {
        console.error("Failed to update avatar:", error.message);
      } else {
        setProfile((prev: any) => ({ ...prev, avatar_url: base64DataUri }));
      }

      setLoading(false);
    };

    reader.readAsDataURL(file); // ✅ Read as Base64 URI
  };

  if (!profile) return <div className="text-center text-gray-500">Loading...</div>;

  return (
    <div className="flex items-center justify-between bg-white p-6 rounded-lg shadow-sm flex-wrap gap-4">
      <div className="flex items-center gap-4">
        <img
          src={profile.avatar_url || "/avatar.png"}
          alt="User Avatar"
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h2 className="font-bold text-xl">{profile.display_name}</h2>
          <p className="text-gray-500 text-sm">{profile.email}</p>
        </div>
      </div>

      <label className="btn btn-outline cursor-pointer">
        {loading ? "Uploading..." : "Change Avatar"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />
      </label>
    </div>
  );
}
