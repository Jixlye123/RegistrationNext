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
import { CalendarIcon } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from 'date-fns';
import { cn } from "@/lib/utils"

interface PaidFine {
  _id: string;
  licenseNumber: string;
  amount: number;
  issuedDate: string;
  fineId: string;
}

const AdminPaymentsPage = () => {
  const [paidFines, setPaidFines] = useState<PaidFine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const fetchPaidFines = async (dateString: string | null) => {
    setLoading(true);
    setError(null);
    try {
      let url = '/api/fines/paid';
      if (dateString) {
        url += `?date=${dateString}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch paid fines: ${response.status}`);
      }
      const data: PaidFine[] = await response.json();
      setPaidFines(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching paid fines.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaidFines(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (date) {
      setSelectedDate(format(date, 'yyyy-MM-dd'));
    }
  }, [date]);

  return (
    <div className="min-h-screen px-6 py-8 text-white bg-gradient-to-br from-black via-zinc-900 to-orange-900">
      <div className="max-w-6xl mx-auto">
        <h1 className="mb-8 text-3xl font-bold text-orange-400">Paid Fines</h1>

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
          <p>Loading paid fines...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : (
          <>
            <p className="mb-4 text-orange-200">Showing {paidFines.length} paid fine records</p>
            <div className="overflow-x-auto border border-orange-400 rounded-lg shadow bg-zinc-900">
              <Table>
                <TableHeader>
                  <TableRow className="text-white bg-orange-800">
                    <TableHead className="px-4 py-2 border-r border-orange-700">License Number</TableHead>
                    <TableHead className="px-4 py-2 border-r border-orange-700">Amount (Rs)</TableHead>
                    <TableHead className="px-4 py-2 border-r border-orange-700">Issued Date</TableHead>
                    <TableHead className="px-4 py-2">Fine ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paidFines.length > 0 ? (
                    paidFines.map((fine) => (
                      <TableRow key={fine._id} className="transition hover:bg-orange-950">
                        <TableCell className="px-4 py-2 border-t border-orange-700">{fine.licenseNumber}</TableCell>
                        <TableCell className="px-4 py-2 border-t border-orange-700">Rs. {fine.amount.toFixed(2)}</TableCell>
                        <TableCell className="px-4 py-2 border-t border-orange-700">
                          {fine.issuedDate ? new Date(fine.issuedDate).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell className="px-4 py-2 border-t border-orange-700">{fine.fineId}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="px-4 py-2 text-center border-t border-orange-700">
                        No paid fines found for the selected date.
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

export default AdminPaymentsPage;
