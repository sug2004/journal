// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { createClient } from '@/utils/supabase/client';

// export default function UpdatePasswordPage() {
//   const supabase = createClient();
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const [password, setPassword] = useState('');
//   const [confirm, setConfirm] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);

//   useEffect(() => {
//     const error = searchParams.get('error');
//     const desc = searchParams.get('error_description');
//     if (error && desc) {
//       setError(decodeURIComponent(desc));
//     }
//   }, [searchParams]);

//   const handleUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setSuccess(false);

//     if (password.length < 6) {
//       setError('Password must be at least 6 characters long.');
//       return;
//     }

//     if (password !== confirm) {
//       setError("Passwords don't match.");
//       return;
//     }

//     setLoading(true);
//     const { error } = await supabase.auth.updateUser({ password });
//     setLoading(false);

//     if (error) {
//       setError(error.message);
//     } else {
//       setSuccess(true);
//       setTimeout(() => router.push('/'), 2000);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
//       <h1 className="text-xl font-bold mb-4">Update Your Password</h1>
//       {error && <p className="text-red-500 mb-2 text-sm">{error}</p>}
//       {success && <p className="text-green-600 mb-2 text-sm">Password updated successfully!</p>}
//       <form onSubmit={handleUpdate} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium mb-1">New Password</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="input input-bordered w-full"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium mb-1">Confirm Password</label>
//           <input
//             type="password"
//             value={confirm}
//             onChange={(e) => setConfirm(e.target.value)}
//             className="input input-bordered w-full"
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={loading}
//           className="btn w-full bg-indigo-600 text-white"
//         >
//           {loading ? 'Updating...' : 'Update Password'}
//         </button>
//       </form>
//     </div>
//   );
// }


// app/auth/update-password/page.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setStatus('❌ Failed to update password: ' + error.message);
    } else {
      setStatus('✅ Password updated! Redirecting...');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={handleUpdate} className="max-w-md w-full space-y-4 bg-white shadow-md p-6 rounded-lg">
        <h1 className="text-xl font-bold">Update Password</h1>
        <input
          type="password"
          className="w-full px-4 py-2 border rounded"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded">
          Update Password
        </button>
        {status && <p className="text-sm mt-2">{status}</p>}
      </form>
    </div>
  );
}
