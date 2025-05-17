'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AlertTriangle, CreditCard, Flag } from 'lucide-react';
import { cn } from "@/lib/utils"

// Assuming your Fine type is consistent across client and server
type Fine = {
  _id: string;
  fineId: string;
  firebaseUid?: string;
  email: string;
  licenseNumber: string;
  violationType: string;
  amount: number;
  status: 'pending' | 'paid' | 'disputed' | 'cancelled';
  issuedDate: string;
  disputeReason?: string;
  disputeResolutionDate?: string;
};

export default function MyFinesPage() {
  const [fines, setFines] = useState<Fine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [licenseNumberInput, setLicenseNumberInput] = useState('');
  const router = useRouter();

  const fetchMyFines = async () => {
    if (!licenseNumberInput) {
      setError('Please enter your license number.');
      setFines([]);
      return;
    }

    setError('');
    setLoading(true);
    try {
      const res = await fetch(`/api/fines/user?licenseNumber=${licenseNumberInput}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.details || 'Failed to fetch your fines.');
      }
      const data = await res.json();
      setFines(data);
    } catch (err: any) {
      console.error('Error fetching user fines:', err);
      setError(err.message || 'Failed to load your fines.');
      setFines([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePayFine = async (fineId: string, amount: number) => {
    console.log(`Redirecting to payment for fine ID: ${fineId}, Amount: ${amount}`);
    router.push(`/pay?fineId=${fineId}&amount=${amount}`);
  };

  const handleDisputeFine = async (fineId: string) => {
    const reason = prompt('Please enter the reason for disputing this fine:');
    if (reason) {
      try {
        const response = await fetch('/api/fines/dispute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fineId, disputeReason: reason }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to submit dispute.');
        }

        setFines((currentFines) =>
          currentFines.map((fine) =>
            fine._id === fineId ? { ...fine, status: 'disputed' } : fine
          )
        );
        alert('Fine has been marked as disputed.');
      } catch (err: any) {
        console.error('Error disputing fine:', err);
        alert(`Failed to dispute fine: ${err.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen px-6 py-8 text-white bg-gradient-to-br from-black via-zinc-900 to-orange-900">
      <div className="max-w-3xl mx-auto">
        <h1 className="mb-8 text-3xl font-bold text-orange-400">My Fines</h1>

        <div className="p-6 mb-6 border border-orange-500 rounded-lg shadow-lg bg-zinc-800">
          <label htmlFor="licenseNumber" className="block mb-2 text-sm font-bold text-orange-300">
            Enter License Number:
          </label>
          <div className="flex items-end gap-4">
            <input
              type="text"
              id="licenseNumber"
              className="w-full px-4 py-2 text-white border rounded bg-zinc-700 border-zinc-600 focus:outline-none focus:border-orange-400"
              value={licenseNumberInput}
              onChange={(e) => setLicenseNumberInput(e.target.value)}
              placeholder="e.g. ABC1234"
            />
            <Button
              onClick={fetchMyFines}
              disabled={loading}
              className="px-6 py-2 font-semibold text-white transition duration-300 bg-orange-600 rounded hover:bg-orange-500 disabled:bg-orange-300"
            >
              {loading ? 'Fetching...' : 'Fetch Fines'}
            </Button>
          </div>
          {error && <p className="mt-2 text-red-400">{error}</p>}
        </div>

        {fines.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-6 text-2xl font-semibold text-orange-300">Your Fines</h2>
            <div className="overflow-x-auto border border-orange-400 rounded-lg shadow bg-zinc-900">
              <Table>
                <TableHeader>
                  <TableRow className="text-white bg-orange-800">
                    <TableHead className="px-4 py-2 border-r border-orange-700">Fine ID</TableHead>
                    <TableHead className="px-4 py-2 border-r border-orange-700">Violation</TableHead>
                    <TableHead className="px-4 py-2 border-r border-orange-700">Amount (Rs.)</TableHead>
                    <TableHead className="px-4 py-2 border-r border-orange-700">Status</TableHead>
                    <TableHead className="px-4 py-2 border-r border-orange-700">Issued Date</TableHead>
                    <TableHead className="px-4 py-2">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fines.map((fine) => (
                    <TableRow key={fine._id} className="transition hover:bg-orange-950">
                      <TableCell className="px-4 py-2 text-white border-t border-orange-700">{fine.fineId}</TableCell>
                      <TableCell className="px-4 py-2 text-white border-t border-orange-700">{fine.violationType}</TableCell>
                      <TableCell className="px-4 py-2 text-white border-t border-orange-700">Rs. {fine.amount.toFixed(2)}</TableCell>
                      <TableCell className="px-4 py-2 border-t border-orange-700">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            fine.status === 'pending' ? 'bg-yellow-800 text-yellow-200' :
                            fine.status === 'paid' ? 'bg-green-800 text-green-200' :
                            fine.status === 'disputed' ? 'bg-blue-800 text-blue-200' :
                            'bg-red-800 text-red-200'
                          }`}
                        >
                          {fine.status.toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-2 text-white border-t border-orange-700">{new Date(fine.issuedDate).toLocaleDateString()}</TableCell>
                      <TableCell className="px-4 py-2 space-x-2 border-t border-orange-700">
                        {fine.status === 'pending' && (
                          <>
                            <Button
                              onClick={() => handlePayFine(fine._id, fine.amount)}
                              className="flex items-center gap-1 px-3 py-1 text-sm font-semibold text-white bg-green-600 rounded hover:bg-green-500 focus:outline-none focus:shadow-outline"
                            >
                              <CreditCard className="w-4 h-4" />  Pay
                            </Button>
                            <Button
                              onClick={() => handleDisputeFine(fine._id)}
                              className="flex items-center gap-1 px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded hover:bg-blue-500 focus:outline-none focus:shadow-outline"
                            >
                              <Flag className="w-4 h-4" /> Dispute
                            </Button>
                          </>
                        )}
                        {fine.status === 'disputed' && (
                          <span className="flex items-center gap-1 text-sm text-yellow-300">
                            <AlertTriangle className="w-4 h-4" /> Disputed
                          </span>
                        )}
                        {fine.status === 'paid' && (
                          <span className="text-sm text-green-300">Paid</span>
                        )}
                         {fine.status === 'cancelled' && (
                          <span className="text-sm text-red-300">Cancelled</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
         {loading && <p className="text-orange-300">Loading fines...</p>}
      </div>
    </div>
  );
}
