
// 'use client';

// import { createClient } from '@/utils/supabase/client';
// import { useEffect, useState } from 'react';

// export default function GeneralInfoForm() {
//   const supabase = createClient();

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [profile, setProfile] = useState({
//     display_name: '',
//     bio: '',
//   });

//   useEffect(() => {
//     const fetchProfile = async () => {
//       setLoading(true);

//       const {
//         data: { user },
//         error: userError,
//       } = await supabase.auth.getUser();

//       if (userError || !user) {
//         console.error('User fetch error:', userError);
//         return;
//       }

//       const { data, error } = await supabase
//         .from('profiles')
//         .select('display_name, bio')
//         .eq('id', user.id)
//         .single();

//       if (error) {
//         console.error('Profile fetch error:', error.message);
//       } else {
//         setProfile({
//           display_name: data.display_name || '',
//           bio: data.bio || '',
//         });
//       }

//       setLoading(false);
//     };

//     fetchProfile();
//   }, []);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setProfile((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSaving(true);
//     setSuccess(false);

//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     const { error } = await supabase
//       .from('profiles')
//       .update(profile)
//       .eq('id', user.id);

//     setSaving(false);
//     if (!error) {
//       setSuccess(true);
//       setTimeout(() => setSuccess(false), 3000);
//     } else {
//       console.error('Update error:', error.message);
//     }
//   };

//   if (loading) {
//     return <div className="text-gray-600 text-sm">Loading profile...</div>;
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       {/* Display Name */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Display Name <span className="text-red-500">*</span>
//         </label>
//         <input
//           type="text"
//           name="display_name"
//           value={profile.display_name}
//           onChange={handleChange}
//           className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//           required
//         />
//       </div>

//       {/* Bio */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Bio
//         </label>
//         <textarea
//           name="bio"
//           value={profile.bio}
//           onChange={handleChange}
//           className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//           rows={4}
//         />
//       </div>

//       {/* Submit Button */}
//       <div className="flex items-center justify-between">
//         <button
//           type="submit"
//           className={`btn bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-md ${
//             saving ? 'opacity-50 cursor-not-allowed' : ''
//           }`}
//           disabled={saving}
//         >
//           {saving ? 'Saving...' : 'Save Changes'}
//         </button>

//         {success && (
//           <span className="text-green-600 text-sm ml-4">Profile updated!</span>
//         )}
//       </div>
//     </form>
//   );
// }


'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

export default function GeneralInfoForm() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [profile, setProfile] = useState({
    display_name: '',
    phone: '',
    dob: '',
    location: '',
    bio: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('User fetch error:', userError);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('display_name, phone, dob, location, bio')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Profile fetch error:', error.message);
      } else {
        setProfile({
          display_name: data.display_name || '',
          phone: data.phone || '',
          dob: data.dob || '',
          location: data.location || '',
          bio: data.bio || '',
        });
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', user?.id || '');

    setSaving(false);

    if (!error) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      console.error('Update error:', error.message);
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-500">Loading profile...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Display Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Display Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="display_name"
          value={profile.display_name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone
        </label>
        <input
          type="tel"
          name="phone"
          value={profile.phone}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        />
      </div>

      {/* DOB */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date of Birth
        </label>
        <input
          type="date"
          name="dob"
          value={profile.dob}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          type="text"
          name="location"
          value={profile.location}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        />
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bio
        </label>
        <textarea
          name="bio"
          value={profile.bio}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        />
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          className={`btn bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md ${
            saving ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        {success && (
          <span className="text-green-600 text-sm">Profile updated!</span>
        )}
      </div>
    </form>
  );
}
