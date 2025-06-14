  
// import Link from 'next/link';

// interface Entry {
//   id: string;
//   title: string;
//   date: string;
//   content: string;
//   media_base64?: string;
// }

// export default function RecentEntries({ entries }: { entries: Entry[] }) {
//   return (
//     <div>
//       <h3 className="text-lg font-semibold mb-4">Your Recent Entries</h3>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {entries.map((entry) => (
//           <div key={entry.id} className="bg-white shadow rounded overflow-hidden">
//             {entry.media_base64 && (
//               <img
//                 src={entry.media_base64}
//                 alt="Cover"
//                 className="w-full h-32 object-cover"
//               />
//             )}
//             <div className="p-4">
//               <h4 className="font-semibold text-sm truncate">{entry.title}</h4>
//               <p className="text-xs text-gray-500">
//                 {new Date(entry.date).toLocaleDateString()}
//               </p>
//               <p className="text-sm text-gray-700 mt-1 line-clamp-2">
//                 {entry.content}
//               </p>
//               <Link
//                 href={`/journal/${entry.id}`}
//                 className="text-sm text-blue-500 mt-2 inline-block hover:underline"
//               >
//                 Read Entry →
//               </Link>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


export default function RecentEntries({ entries }: { entries: any[] }) {
  if (!entries.length) {
    return <p className="text-gray-500">No recent entries found.</p>;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Your Recent Entries</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {entries.map((entry, idx) => (
          <div key={idx} className="bg-white shadow rounded overflow-hidden">
            <img src={entry.media_base64} alt="" className="w-full h-32 object-cover" />
            <div className="p-4">
              <h4 className="font-semibold text-sm">{entry.title}</h4>
              <p className="text-xs text-gray-500">{entry.date}</p>
              <p className="text-sm text-gray-700 mt-1 line-clamp-2">{entry.content}</p>
              <a href={`/journal/${entry.id}`} className="text-sm text-blue-500 mt-2 hover:underline">Read Entry</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
