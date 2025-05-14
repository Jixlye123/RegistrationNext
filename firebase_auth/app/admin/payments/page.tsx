'use client';

import React, { useEffect, useState } from 'react';

type Payment = {
  _id: string;
  amount: number;
  stripePaymentIntentId: string;
  paidAt: string;
  userId: {
    licenseNumber: string;
    email: string;
  };
};

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    licenseNumber: '',
    email: '',
    amount: '',
    stripeId: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/payments');
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.details || 'Failed to fetch payments');
      }
      const data = await res.json();
      const processedData = data.map((payment: any) => ({
        _id: payment._id,
        amount: payment.amount || 0,
        stripePaymentIntentId: payment.stripePaymentIntentId || 'N/A',
        paidAt: payment.paidAt || new Date().toISOString(),
        userId: {
          licenseNumber: payment.userId?.licenseNumber || 'N/A',
          email: payment.userId?.email || 'N/A',
        },
      }));
      setPayments(processedData);
    } catch (err: any) {
      console.error('Error fetching payments:', err);
      setError(err.message || 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.licenseNumber || !formData.email || !formData.amount || !formData.stripeId) {
      setSubmitMessage({ text: 'Please fill all fields', type: 'error' });
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitMessage({ text: '', type: '' });
      const response = await fetch('/api/admin/fines/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          licenseNumber: formData.licenseNumber,
          email: formData.email,
          amount: parseFloat(formData.amount),
          stripePaymentIntentId: formData.stripeId,
          status: 'succeeded',
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to add payment');

      setFormData({ licenseNumber: '', email: '', amount: '', stripeId: '' });
      setSubmitMessage({ text: 'Payment added successfully!', type: 'success' });
      fetchPayments();
    } catch (err: any) {
      console.error('Error adding payment:', err);
      setSubmitMessage({ text: err.message || 'Failed to add payment', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-8 text-white bg-gradient-to-br from-black via-zinc-900 to-orange-900">
      <div className="max-w-6xl mx-auto">
        <h1 className="mb-8 text-3xl font-bold text-orange-400">Payment History</h1>

        {/* Add Payment Form */}
        <div className="p-6 mb-10 border border-orange-500 rounded-lg shadow-lg bg-zinc-800">
          <h2 className="mb-4 text-2xl font-semibold text-orange-300">Add New Payment</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block mb-1">License Number</label>
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
              <label className="block mb-1">Email</label>
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
              <label className="block mb-1">Amount (Rs.)</label>
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
            <div>
              <label className="block mb-1">Stripe Payment ID</label>
              <input
                name="stripeId"
                type="text"
                value={formData.stripeId}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded bg-zinc-700 border-zinc-600 focus:outline-none focus:border-orange-400"
              />
            </div>
            <div className="mt-4 md:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 font-semibold text-white transition duration-300 bg-orange-600 rounded hover:bg-orange-500 disabled:bg-orange-300"
              >
                {isSubmitting ? 'Adding...' : 'Add Payment'}
              </button>
              {submitMessage.text && (
                <p className={`mt-2 ${submitMessage.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                  {submitMessage.text}
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Payments Table */}
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : payments.length === 0 ? (
          <p>No payment records found.</p>
        ) : (
          <>
            <p className="mb-4 text-orange-200">Total payments: {payments.length}</p>
            <div className="overflow-x-auto border border-orange-400 rounded-lg shadow bg-zinc-900">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-white bg-orange-800">
                    <th className="px-4 py-2 border-r border-orange-700">License</th>
                    <th className="px-4 py-2 border-r border-orange-700">Email</th>
                    <th className="px-4 py-2 border-r border-orange-700">Amount</th>
                    <th className="px-4 py-2 border-r border-orange-700">Stripe ID</th>
                    <th className="px-4 py-2">Paid At</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment._id} className="transition hover:bg-orange-950">
                      <td className="px-4 py-2 border-t border-orange-700">{payment.userId?.licenseNumber}</td>
                      <td className="px-4 py-2 border-t border-orange-700">{payment.userId?.email}</td>
                      <td className="px-4 py-2 border-t border-orange-700">Rs. {payment.amount}</td>
                      <td className="px-4 py-2 border-t border-orange-700">{payment.stripePaymentIntentId}</td>
                      <td className="px-4 py-2 border-t border-orange-700">{new Date(payment.paidAt).toLocaleString()}</td>
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
