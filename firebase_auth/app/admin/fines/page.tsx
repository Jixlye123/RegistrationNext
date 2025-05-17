'use client';

import React, { useEffect, useState } from 'react';

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

export default function AdminFinesPage() {
  const [fines, setFines] = useState<Fine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const [formData, setFormData] = useState({
    email: '',
    licenseNumber: '',
    violationType: '',
    amount: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ text: '', type: '' });

  const violationTypes = [
    'Speeding',
    'Red Light Violation',
    'Illegal Parking',
    'No Seat Belt',
    'Using Phone While Driving',
    'Driving Without License',
    'Driving Under Influence',
    'Improper Lane Change',
    'Illegal U-Turn',
    'Other'
  ];

  useEffect(() => {
    fetchFines();
  }, []);

  const fetchFines = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/fines');
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.details || 'Failed to fetch fines');
      }
      const data = await res.json();
      setFines(data);
    } catch (err: any) {
      console.error('Error fetching fines:', err);
      setError(err.message || 'Failed to load fines');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.licenseNumber || !formData.violationType || !formData.amount) {
      setSubmitMessage({ text: 'Please fill all required fields', type: 'error' });
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitMessage({ text: '', type: '' });
      const response = await fetch('/api/admin/fines/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          licenseNumber: formData.licenseNumber,
          violationType: formData.violationType,
          amount: parseFloat(formData.amount),
          status: 'pending',
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to add fine');

      setFormData({ email: '', licenseNumber: '', violationType: '', amount: '' });
      setSubmitMessage({ text: 'Fine added successfully!', type: 'success' });
      fetchFines();
    } catch (err: any) {
      console.error('Error adding fine:', err);
      setSubmitMessage({ text: err.message || 'Failed to add fine', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (fineId: string, newStatus: 'pending' | 'paid' | 'disputed' | 'cancelled') => {
    try {
      const response = await fetch(`/api/admin/fines/update-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fineId,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update fine status');
      }

      // Update local state
      setFines((currentFines) =>
        currentFines.map((fine) =>
          fine._id === fineId ? { ...fine, status: newStatus } : fine
        )
      );
    } catch (err: any) {
      console.error('Error updating fine status:', err);
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const filteredFines = filter === 'all' 
    ? fines 
    : fines.filter(fine => fine.status === filter);

  const totalAmount = filteredFines.reduce((sum, fine) => sum + fine.amount, 0);
  const pendingAmount = filteredFines
    .filter(fine => fine.status === 'pending')
    .reduce((sum, fine) => sum + fine.amount, 0);

  return (
    <div className="min-h-screen px-6 py-8 text-white bg-gradient-to-br from-black via-zinc-900 to-orange-900">
      <div className="max-w-6xl mx-auto">
        <h1 className="mb-8 text-3xl font-bold text-orange-400">Manage Fines</h1>

        {/* Add Fine Form */}
        <div className="p-6 mb-10 border border-orange-500 rounded-lg shadow-lg bg-zinc-800">
          <h2 className="mb-4 text-2xl font-semibold text-orange-300">Add New Fine</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block mb-1">Email <span className="text-red-500">*</span></label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded bg-zinc-700 border-zinc-600 focus:outline-none focus:border-orange-400"
                placeholder="user@example.com"
              />
            </div>
            <div>
              <label className="block mb-1">License Number <span className="text-red-500">*</span></label>
              <input
                name="licenseNumber"
                type="text"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded bg-zinc-700 border-zinc-600 focus:outline-none focus:border-orange-400"
                placeholder="e.g. ABC1234"
              />
            </div>
            <div>
              <label className="block mb-1">Violation Type <span className="text-red-500">*</span></label>
              <select
                name="violationType"
                value={formData.violationType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded bg-zinc-700 border-zinc-600 focus:outline-none focus:border-orange-400"
              >
                <option value="">Select Violation Type</option>
                {violationTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1">Amount (Rs.) <span className="text-red-500">*</span></label>
              <input
                name="amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded bg-zinc-700 border-zinc-600 focus:outline-none focus:border-orange-400"
              />
            </div>
            <div className="mt-4 md:col-span-2 lg:col-span-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 font-semibold text-white transition duration-300 bg-orange-600 rounded hover:bg-orange-500 disabled:bg-orange-300"
              >
                {isSubmitting ? 'Adding...' : 'Add Fine'}
              </button>
              {submitMessage.text && (
                <p className={`mt-2 ${submitMessage.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                  {submitMessage.text}
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <label htmlFor="filter" className="font-medium">Filter:</label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-1 border rounded bg-zinc-800 border-zinc-600 focus:outline-none focus:border-orange-400"
            >
              <option value="all">All Fines</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="disputed">Disputed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex space-x-4">
            <div className="px-4 py-2 rounded bg-zinc-800">
              <span className="block text-sm text-orange-300">Total Amount:</span>
              <span className="text-lg font-semibold">Rs. {totalAmount.toFixed(2)}</span>
            </div>
            <div className="px-4 py-2 rounded bg-zinc-800">
              <span className="block text-sm text-orange-300">Pending Amount:</span>
              <span className="text-lg font-semibold">Rs. {pendingAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Fines Table */}
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : filteredFines.length === 0 ? (
          <p>No fine records found.</p>
        ) : (
          <>
            <p className="mb-4 text-orange-200">Showing {filteredFines.length} fine records</p>
            <div className="overflow-x-auto border border-orange-400 rounded-lg shadow bg-zinc-900">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-white bg-orange-800">
                    <th className="px-4 py-2 border-r border-orange-700">Email</th>
                    <th className="px-4 py-2 border-r border-orange-700">License</th>
                    <th className="px-4 py-2 border-r border-orange-700">Violation Type</th>
                    <th className="px-4 py-2 border-r border-orange-700">Amount</th>
                    <th className="px-4 py-2 border-r border-orange-700">Status</th>
                    <th className="px-4 py-2 border-r border-orange-700">Issued Date</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFines.map((fine) => (
                    <tr key={fine._id} className="transition hover:bg-orange-950">
                      <td className="px-4 py-2 border-t border-orange-700">{fine.email}</td>
                      <td className="px-4 py-2 border-t border-orange-700">{fine.licenseNumber}</td>
                      <td className="px-4 py-2 border-t border-orange-700">{fine.violationType}</td>
                      <td className="px-4 py-2 border-t border-orange-700">Rs. {fine.amount}</td>
                      <td className="px-4 py-2 border-t border-orange-700">
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
                      </td>
                      <td className="px-4 py-2 border-t border-orange-700">
                        {new Date(fine.issuedDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 border-t border-orange-700">
                        <select
                          value={fine.status}
                          onChange={(e) => handleStatusChange(fine._id, e.target.value as any)}
                          className="px-2 py-1 text-sm rounded bg-zinc-700 border-zinc-600"
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="disputed">Disputed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}