"use client";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";
import { FineType } from "@/types/FineType";
import { Loader } from "@/components/Loader";

export default function CheckViolationsPage() {
  const [user, loadingUser] = useAuthState(auth);
  const [fines, setFines] = useState<FineType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchFines = async () => {
      try {
        const res = await fetch(`/api/fines?userId=${user.uid}`);
        const data = await res.json();
        setFines(data.fines || []);
      } catch (err) {
        console.error("Failed to fetch fines", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFines();
  }, [user]);

  if (loadingUser || loading) return <Loader />;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-red-800 via-black to-black">
      <div className="w-full max-w-4xl p-8 border shadow-lg bg-white/10 backdrop-blur-md border-white/20 rounded-2xl">
        <h1 className="mb-8 text-4xl font-bold text-center text-white">🚔 Your Violations</h1>

        <div className="space-y-8">
          <div className="p-6 text-white transition duration-300 bg-white/20 rounded-xl hover:bg-white/30">
            <h2 className="mb-4 text-2xl font-semibold">Pending Fines</h2>
            {fines.filter(f => f.status === "pending").length === 0 ? (
              <p className="text-green-400">No pending fines 🎉</p>
            ) : (
              fines.filter(f => f.status === "pending").map(fine => (
                <div key={fine._id} className="p-4 mb-4 border rounded-lg border-white/30">
                  <p><strong>Violation:</strong> {fine.reason}</p>
                  <p><strong>Amount:</strong> LKR {fine.amount}</p>
                  <p><strong>Date:</strong> {new Date(fine.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>

          <div className="p-6 text-white transition duration-300 bg-white/20 rounded-xl hover:bg-white/30">
            <h2 className="mb-4 text-2xl font-semibold">Violation History</h2>
            {fines.filter(f => f.status === "paid").length === 0 ? (
              <p>No history available.</p>
            ) : (
              fines.filter(f => f.status === "paid").map(fine => (
                <div key={fine._id} className="p-4 mb-4 border rounded-lg border-white/30">
                  <p><strong>Violation:</strong> {fine.reason}</p>
                  <p><strong>Amount:</strong> LKR {fine.amount}</p>
                  <p><strong>Paid On:</strong> {new Date(fine.updatedAt).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
