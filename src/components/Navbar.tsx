// "use client";

// import React, { useState } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import { createClient } from "@/utils/supabase/client";

// export default function Navbar() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const router = useRouter();
//   const pathname = usePathname();

//   const handleLogout = async () => {
//     const supabase = createClient();
//     await supabase.auth.signOut();
//     router.push("/auth");
//   };

//   const isActive = (href: string) => pathname === href;

//   return (
//     <nav className="bg-white border border-gray-200 rounded-lg mx-6 my-4 shadow-sm">
//       <div className="flex items-center justify-between px-4 py-2">
//         <div className="flex items-center gap-2 min-w-0">
//           <span className="font-bold text-lg md:text-xl truncate">Team Journal</span>
//         </div>

//         <div className="hidden md:flex items-center gap-6 ml-8 flex-1">
//           <a
//             href="/"
//             className={`${
//               isActive("/") ? "text-blue-700 font-bold" : "text-gray-700 hover:text-blue-700"
//             }`}
//           >
//             Dashboard
//           </a>
//           <a
//             href="/profile"
//             className={`${
//               isActive("/profile") ? "text-blue-700 font-bold" : "text-gray-700 hover:text-blue-700"
//             }`}
//           >
//             Profile
//           </a>
//           <a
//             href="/journal"
//             className={`${
//               isActive("/journal") ? "text-blue-700 font-bold" : "text-gray-700 hover:text-blue-700"
//             }`}
//           >
//             Journal Entries
//           </a>
//         </div>

//         <div className="flex items-center gap-4">
//           <button
//             className="hidden md:inline"
//             onClick={handleLogout}
//             aria-label="Logout"
//             title="Logout"
//           >
//             LogOut
//           </button>

//           <button
//             className="md:hidden ml-2"
//             onClick={() => setMenuOpen(!menuOpen)}
//             aria-label="Open menu"
//           >
//             <svg
//               className="w-7 h-7 text-gray-700"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth={2}
//               viewBox="0 0 24 24"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
//             </svg>
//           </button>
//         </div>
//       </div>

//       {menuOpen && (
//         <div className="md:hidden flex flex-col px-4 pb-4 gap-2">
//           <a
//             href="/"
//             className={`${
//               isActive("/") ? "text-blue-700 font-bold" : "text-gray-700 hover:text-blue-700"
//             }`}
//           >
//             Dashboard
//           </a>
//           <a
//             href="/profile"
//             className={`${
//               isActive("/profile") ? "text-blue-700 font-bold" : "text-gray-700 hover:text-blue-700"
//             }`}
//           >
//             Profile
//           </a>
//           <a
//             href="/journal"
//             className={`${
//               isActive("/journal") ? "text-blue-700 font-bold" : "text-gray-700 hover:text-blue-700"
//             }`}
//           >
//             Journal Entries
//           </a>
//           <div className="flex gap-4 mt-2">
//             <button onClick={handleLogout} aria-label="Logout">
//               LogOut
//             </button>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }


"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth");
  };

  const isActive = (href: string) => pathname === href;

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setAuthenticated(!!user);
    };
    checkAuth();
  }, []);

  if (!authenticated) return null;

  return (
    <nav className="bg-white border border-gray-200 rounded-lg mx-6 my-4 shadow-sm">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-bold text-lg md:text-xl truncate">Team Journal</span>
        </div>

        <div className="hidden md:flex items-center gap-6 ml-8 flex-1">
          <a
            href="/"
            className={`$${
              isActive("/") ? "text-blue-700 font-bold" : "text-gray-700 hover:text-blue-700"
            }`}
          >
            Dashboard
          </a>
          <a
            href="/profile"
            className={`$${
              isActive("/profile") ? "text-blue-700 font-bold" : "text-gray-700 hover:text-blue-700"
            }`}
          >
            Profile
          </a>
          <a
            href="/journal"
            className={`$${
              isActive("/journal") ? "text-blue-700 font-bold" : "text-gray-700 hover:text-blue-700"
            }`}
          >
            Journal Entries
          </a>
        </div>

        <div className="flex items-center gap-4">
          <button
            className="hidden md:inline text-gray-700 hover:text-blue-700 transition-colors"
            onClick={handleLogout}
            aria-label="Logout"
            title="Logout"
          >
            LogOut
          </button>

          <button
            className="md:hidden ml-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open menu"
          >
            <svg
              className="w-7 h-7 text-gray-700"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden flex flex-col px-4 pb-4 gap-2">
          <a
            href="/"
            className={`$${
              isActive("/") ? "text-blue-700 font-bold" : "text-gray-700 hover:text-blue-700"
            }`}
          >
            Dashboard
          </a>
          <a
            href="/profile"
            className={`$${
              isActive("/profile") ? "text-blue-700 font-bold" : "text-gray-700 hover:text-blue-700"
            }`}
          >
            Profile
          </a>
          <a
            href="/journal"
            className={`$${
              isActive("/journal") ? "text-blue-700 font-bold" : "text-gray-700 hover:text-blue-700"
            }`}
          >
            Journal Entries
          </a>
          <div className="flex gap-4 mt-2">
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-blue-700 transition-colors"
              aria-label="Logout"
            >
              LogOut
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}