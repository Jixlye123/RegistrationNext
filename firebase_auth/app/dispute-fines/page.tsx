'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { cn } from "@/lib/utils"

interface DisputedFine {
  _id: string;
  licenseNumber: string;
  amount: number;
  issuedDate: string;
  disputeReason: string;
  disputeResolutionDate?: string;
  status: 'disputed' | 'cancelled'; 
  fineId: string;
}

const UserDisputedFinesPage = () => {
  const [licenseNumber, setLicenseNumber] = useState('');
  const [disputedFines, setDisputedFines] = useState<DisputedFine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDisputedFines = async () => {
    if (!licenseNumber) {
      setError('Please enter your license number.');
      setDisputedFines([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/fines/disputed/user?licenseNumber=${licenseNumber}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch disputed fines: ${response.status}`);
      }
      const data: DisputedFine[] = await response.json();
      setDisputedFines(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching disputed fines.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-8 text-white bg-gradient-to-br from-black via-zinc-900 to-orange-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="flex items-center gap-2 mb-8 text-3xl font-bold text-orange-400">
          <AlertTriangle className="w-6 h-6 text-yellow-500" /> Your Disputed Fines
        </h1>

        <div className="p-6 mb-6 border border-orange-500 rounded-lg shadow-lg bg-zinc-800">
          <label htmlFor="licenseNumber" className="block mb-2 text-sm font-bold text-orange-300">
            Enter Your License Number:
          </label>
          <div className="flex items-end gap-4">
            <Input
              type="text"
              id="licenseNumber"
              className="w-full px-4 py-2 text-white border rounded bg-zinc-700 border-zinc-600 focus:outline-none focus:border-orange-400"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              placeholder="e.g. ABC1234"
            />
            <Button
              onClick={fetchDisputedFines}
              disabled={loading}
              className="px-6 py-2 font-semibold text-white transition duration-300 bg-orange-600 rounded hover:bg-orange-500 disabled:bg-orange-300"
            >
              {loading ? 'Fetching...' : 'Fetch Fines'}
            </Button>
          </div>
          {error && <p className="mt-2 text-red-400">{error}</p>}
        </div>

        {loading && <p className="text-orange-300">Loading disputed fines...</p>}

        {!loading && !error && (
          <>
            {disputedFines.length > 0 ? (
              <div className="overflow-x-auto border border-orange-400 rounded-lg shadow bg-zinc-900">
                <Table>
                  <TableHeader>
                    <TableRow className="text-white bg-orange-800">
                      <TableHead className="px-4 py-2 border-r border-orange-700">License Number</TableHead>
                      <TableHead className="px-4 py-2 border-r border-orange-700">Amount (Rs)</TableHead>
                      <TableHead className="px-4 py-2 border-r border-orange-700">Issued Date</TableHead>
                      <TableHead className="px-4 py-2 border-r border-orange-700">Dispute Reason</TableHead>
                      <TableHead className="px-4 py-2 border-r border-orange-700">Status</TableHead>
                      <TableHead className="px-4 py-2">Fine ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {disputedFines.map((fine) => (
                      <TableRow key={fine._id} className="transition hover:bg-orange-950">
                        <TableCell className="px-4 py-2 text-white border-t border-orange-700">{fine.licenseNumber}</TableCell>
                        <TableCell className="px-4 py-2 text-white border-t border-orange-700">Rs. {fine.amount.toFixed(2)}</TableCell>
                        <TableCell className="px-4 py-2 text-white border-t border-orange-700">
                          {fine.issuedDate ? new Date(fine.issuedDate).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell className="px-4 py-2 text-white border-t border-orange-700">{fine.disputeReason}</TableCell>
                        <TableCell className="px-4 py-2 border-t border-orange-700">
                          {fine.status === 'disputed' ? (
                            <span className="flex items-center gap-1 text-yellow-300">
                              <AlertTriangle className="w-4 h-4" /> Disputed
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-red-400">
                              <XCircle className="w-4 h-4" /> Cancelled
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="px-4 py-2 text-white border-t border-orange-700">{fine.fineId}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="p-4 border border-orange-500 rounded-lg bg-zinc-800">
                <p className="text-orange-300">No disputed fines found for the provided license number.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserDisputedFinesPage;
