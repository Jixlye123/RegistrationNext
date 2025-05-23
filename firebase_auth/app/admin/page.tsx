'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";
import Link from "next/link";

export default function AdminPanelPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [totalFines, setTotalFines] = useState(0);
  const [paidFines, setPaidFines] = useState(0);
  const [disputedFinesCount, setDisputedFinesCount] = useState(0);
  const [dataLoading, setDataLoading] = useState(true); 

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login"); 
    }
  }, [user, loading, router]);

  const fetchData = async () => {
    setDataLoading(true);
    try {
      // Fetch total fines
      const totalFinesResponse = await fetch('/api/admin/fines');
      if (!totalFinesResponse.ok) {
        throw new Error('Failed to fetch total fines');
      }
      const totalFinesData = await totalFinesResponse.json();
      setTotalFines(totalFinesData.length);

      // Fetch paid fines
      const paidFinesResponse = await fetch('/api/fines/paid?status=paid');
      if (!paidFinesResponse.ok) {
        throw new Error('Failed to fetch paid fines');
      }
      const paidFinesData = await paidFinesResponse.json();
      setPaidFines(paidFinesData.length);

      // Fetch disputed fines count
        const disputedFinesResponse = await fetch('/api/fines/disputed');
        if (!disputedFinesResponse.ok) {
            throw new Error('Failed to fetch disputed fines count');
        }
        const disputedFinesData = await disputedFinesResponse.json();
        setDisputedFinesCount(disputedFinesData.length);


    } catch (error: any) {
      console.error("Failed to fetch data:", error.message);
      
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && user) {
      fetchData();
    }
  }, [loading, user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-white bg-gradient-to-br from-black to-orange-900">

      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-transparent bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text drop-shadow-md">
          DigiFines Sri Lanka
        </h1>
        <p className="mt-2 text-sm text-gray-300">Admin Dashboard</p>
      </header>

      {/* Overview Cards */}
      <div className="grid w-full max-w-5xl grid-cols-1 gap-6 mb-12 md:grid-cols-3">
        <div className="p-6 text-center transition duration-300 bg-white/20 rounded-xl hover:bg-white/30">
          <h2 className="text-2xl font-semibold text-orange-200">Total Fines</h2>
          <p className="mt-2 text-3xl font-bold text-white">
            {dataLoading ? 'Loading...' : totalFines}
          </p>
        </div>
        <div className="p-6 text-center transition duration-300 bg-white/20 rounded-xl hover:bg-white/30">
          <h2 className="text-2xl font-semibold text-orange-200">Paid Fines</h2>
          <p className="mt-2 text-3xl font-bold text-white">
            {dataLoading ? 'Loading...' : paidFines}
          </p>
        </div>
        <div className="p-6 text-center transition duration-300 bg-white/20 rounded-xl hover:bg-white/30">
          <h2 className="text-2xl font-semibold text-orange-200">Dispute Requests</h2>
          <p className="mt-2 text-3xl font-bold text-white">
            {dataLoading ? 'Loading...' : disputedFinesCount}
          </p>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
        <Link href="/admin/fines">
          <div className="p-6 text-center transition duration-200 border border-orange-500 rounded-lg shadow-lg cursor-pointer bg-black/30 hover:bg-orange-700">
            <h2 className="mb-2 text-xl font-semibold text-orange-300">View All Fines</h2>
            <p className="text-sm text-gray-200">Browse and manage all recorded traffic fines.</p>
          </div>
        </Link>

        <Link href="/admin/payments">
          <div className="p-6 text-center transition duration-200 border border-orange-500 rounded-lg shadow-lg cursor-pointer bg-black/30 hover:bg-orange-700">
            <h2 className="mb-2 text-xl font-semibold text-orange-300">Payments</h2>
            <p className="text-sm text-gray-200">Check and verify paid fines and receipts.</p>
          </div>
        </Link>

        <Link href="/admin/disputed">
          <div className="p-6 text-center transition duration-200 border border-orange-500 rounded-lg shadow-lg cursor-pointer bg-black/30 hover:bg-orange-700">
            <h2 className="mb-2 text-xl font-semibold text-orange-300">Disputed Fines</h2>
            <p className="text-sm text-gray-200">Review and resolve disputed fine requests.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
