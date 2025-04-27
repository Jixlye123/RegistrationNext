"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";

export default function AdminPanelPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login"); // Redirect if not logged in
    }
  }, [user, loading, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-red-800 via-black to-black">
      <div className="w-full max-w-5xl p-8 border shadow-lg bg-white/10 backdrop-blur-md border-white/20 rounded-2xl">
        <h1 className="mb-8 text-4xl font-bold text-center text-white">🚓 Admin Panel</h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 text-white transition duration-300 bg-white/20 rounded-xl hover:bg-white/30">
            <h2 className="text-2xl font-semibold">Total Fines</h2>
            <p className="mt-2 text-3xl">120</p>
          </div>
          <div className="p-6 text-white transition duration-300 bg-white/20 rounded-xl hover:bg-white/30">
            <h2 className="text-2xl font-semibold">Paid Fines</h2>
            <p className="mt-2 text-3xl">90</p>
          </div>
          <div className="p-6 text-white transition duration-300 bg-white/20 rounded-xl hover:bg-white/30">
            <h2 className="text-2xl font-semibold">Dispute Requests</h2>
            <p className="mt-2 text-3xl">5</p>
          </div>
        </div>
      </div>
    </div>
  );
}
