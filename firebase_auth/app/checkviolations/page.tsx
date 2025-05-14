'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Violation = {
  _id: string;
  amount: number;
  stripePaymentIntentId: string;
  paidAt: string;
  status: string;
};

export default function CheckViolationsPage() {
  const [email, setEmail] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [violations, setViolations] = useState<Violation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email && !licenseNumber) {
      setError('Please enter either email or license number');
      return;
    }
    await fetchUserViolations();
  };

  const fetchUserViolations = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (email) params.append('email', email);
      if (licenseNumber) params.append('licenseNumber', licenseNumber);

      const res = await fetch(`/api/user/violations?${params.toString()}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.details || 'Failed to fetch violations');
      }

      const data = await res.json();
      setViolations(data);
      setSearched(true);
    } catch (err: any) {
      setError(err.message || 'Failed to load violations');
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = (violationId: string) => {
    router.push(`/payment?violationId=${violationId}`);
  };

  return (
    <div className="min-h-screen p-8 text-white bg-gradient-to-br from-black to-orange-900">
      <h1 className="mb-10 text-4xl font-bold text-center text-transparent bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text drop-shadow-lg">
        Check Your Traffic Violations
      </h1>

      {/* Search Form */}
      <div className="max-w-4xl p-8 mx-auto mb-10 border shadow-md bg-white/10 backdrop-blur-lg border-white/20 rounded-2xl">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm font-medium text-white">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-white border rounded-md bg-black/40 border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-white">License Number</label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full px-3 py-2 text-white border rounded-md bg-black/40 border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Enter your license number"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 mt-4 text-sm text-red-100 rounded-md bg-red-800/40">
              {error}
            </div>
          )}

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 font-semibold text-white bg-orange-600 rounded-md hover:bg-orange-700 disabled:bg-orange-300"
            >
              {loading ? 'Searching...' : 'Check Violations'}
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      {searched && (
        <div className="max-w-5xl p-8 mx-auto border shadow-md bg-white/10 backdrop-blur-lg border-white/20 rounded-2xl">
          {loading ? (
            <p>Loading your violations...</p>
          ) : violations.length === 0 ? (
            <div className="p-4 text-center text-green-200 border border-green-300 rounded-md bg-green-100/20">
              Good news! You have no pending traffic violations.
            </div>
          ) : (
            <>
              <h2 className="mb-4 text-2xl font-semibold">Your Violations</h2>
              <p className="mb-6 text-orange-200">Found {violations.length} violation(s) on record.</p>
              <div className="overflow-x-auto">
                <table className="min-w-full text-white border border-white/20">
                  <thead>
                    <tr className="text-orange-200 bg-black/50">
                      <th className="p-2 border border-white/10">Violation ID</th>
                      <th className="p-2 border border-white/10">Amount</th>
                      <th className="p-2 border border-white/10">Date</th>
                      <th className="p-2 border border-white/10">Status</th>
                      <th className="p-2 border border-white/10">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {violations.map((violation) => (
                      <tr key={violation._id} className="transition hover:bg-white/10">
                        <td className="p-2 border border-white/10">{violation._id}</td>
                        <td className="p-2 border border-white/10">Rs. {violation.amount}</td>
                        <td className="p-2 border border-white/10">{new Date(violation.paidAt).toLocaleDateString()}</td>
                        <td className="p-2 border border-white/10">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            violation.status === 'succeeded'
                              ? 'bg-green-300 text-green-900'
                              : 'bg-yellow-300 text-yellow-900'
                          }`}>
                            {violation.status === 'succeeded' ? 'Paid' : 'Pending'}
                          </span>
                        </td>
                        <td className="p-2 border border-white/10">
                          {violation.status !== 'succeeded' ? (
                            <button
                              onClick={() => handlePayNow(violation._id)}
                              className="px-3 py-1 text-white bg-orange-600 rounded hover:bg-orange-700"
                            >
                              Pay Now
                            </button>
                          ) : (
                            <span className="text-green-400">Payment Complete</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
