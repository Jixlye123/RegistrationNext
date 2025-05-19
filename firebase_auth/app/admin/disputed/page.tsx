'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CalendarIcon, CheckCircle, Trash2, AlertTriangle } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from 'date-fns';
import { cn } from "@/lib/utils"
import { toast } from 'sonner';

interface DisputedFine {
  _id: string;
  licenseNumber: string;
  amount: number;
  issuedDate: string;
  disputeReason: string;
  disputeResolutionDate?: string;
  status: 'disputed';
  fineId: string;
}

const AdminDisputesPage = () => {
  const [disputedFines, setDisputedFines] = useState<DisputedFine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const fetchDisputedFines = async (dateString: string | null) => {
    setLoading(true);
    setError(null);
    try {
      let url = '/api/fines/disputed';
      if (dateString) {
        url += `?date=${dateString}`;
      }
      const response = await fetch(url);
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

  useEffect(() => {
    fetchDisputedFines(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (date) {
      setSelectedDate(format(date, 'yyyy-MM-dd'));
    }
  }, [date]);

  const handleKeepFine = async (fineId: string) => {
    try {
      const response = await fetch('/api/fines/resolve-dispute', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fineId, status: 'disputed' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to keep fine.');
      }

      setDisputedFines(prevFines =>
        prevFines.filter(fine => fine._id !== fineId)
      );
      toast.success('Fine dispute status remains disputed.');
    } catch (err: any) {
      toast.error(`Error keeping fine: ${err.message}`);
    }
  };

  const handleDeleteFine = async (fineId: string) => {
    try {
      const response = await fetch('/api/fines/resolve-dispute', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fineId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete fine.');
      }

      setDisputedFines(prevFines =>
        prevFines.filter(fine => fine._id !== fineId)
      );
      toast.success('Fine deleted successfully.');
    } catch (err: any) {
      toast.error(`Error deleting fine: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen px-6 py-8 text-white bg-gradient-to-br from-black via-zinc-900 to-orange-900">
      <div className="max-w-6xl mx-auto">
        <h1 className="flex items-center gap-2 mb-8 text-3xl font-bold text-orange-400">
          <AlertTriangle className="w-6 h-6 text-yellow-500" /> Disputed Fines
        </h1>

        <div className="mb-6">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal bg-zinc-800 text-white border-zinc-600",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-zinc-800 border-zinc-600" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="border-orange-500"
              />
            </PopoverContent>
          </Popover>
        </div>

        {loading ? (
          <p>Loading disputed fines...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : (
          <>
            <p className="mb-4 text-orange-200">Showing {disputedFines.length} disputed fine records</p>
            <div className="overflow-x-auto border border-orange-400 rounded-lg shadow bg-zinc-900">
              <Table>
                <TableHeader>
                  <TableRow className="text-white bg-orange-800">
                    <TableHead className="px-4 py-2 border-r border-orange-700">License Number</TableHead>
                    <TableHead className="px-4 py-2 border-r border-orange-700">Amount (Rs)</TableHead>
                    <TableHead className="px-4 py-2 border-r border-orange-700">Issued Date</TableHead>
                    <TableHead className="px-4 py-2 border-r border-orange-700">Dispute Reason</TableHead>
                    <TableHead className="px-4 py-2 border-r border-orange-700">Fine ID</TableHead>
                    <TableHead className="px-4 py-2">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {disputedFines.length > 0 ? (
                    disputedFines.map((fine) => (
                      <TableRow key={fine._id} className="transition hover:bg-orange-950">
                        <TableCell className="px-4 py-2 border-t border-orange-700">{fine.licenseNumber}</TableCell>
                        <TableCell className="px-4 py-2 border-t border-orange-700">Rs. {fine.amount.toFixed(2)}</TableCell>
                        <TableCell className="px-4 py-2 border-t border-orange-700">
                          {fine.issuedDate ? new Date(fine.issuedDate).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell className="px-4 py-2 border-t border-orange-700">{fine.disputeReason}</TableCell>
                        <TableCell className="px-4 py-2 border-t border-orange-700">{fine.fineId}</TableCell>
                        <TableCell className="px-4 py-2 space-x-2 border-t border-orange-700">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleKeepFine(fine._id)}
                            className="text-yellow-800 bg-yellow-100 hover:bg-yellow-200"
                            title="Keep Disputed Status"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteFine(fine._id)}
                            className=""
                            title="Delete Fine"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="px-4 py-2 text-center border-t border-orange-700">
                        No disputed fines found for the selected date.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDisputesPage;
