'use client';

import React, { useEffect, useState } from 'react';

type DisputedFine = {
  _id: string;
  amount: number;
  violationType: string;
  issuedDate: string;
  disputeReason: string;
  status: string;
  licenseNumber: string;
  userId: {
    licenseNumber: string;
    email: string;
    name?: string;
  };
};

export default function DisputedFinesPage() {
  const [disputes, setDisputes] = useState<DisputedFine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [selectedDispute, setSelectedDispute] = useState<DisputedFine | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchDisputedFines();
  }, []);

  const fetchDisputedFines = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/fines/disputed');
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.details || 'Failed to fetch disputed fines');
      }
      const data = await res.json();
      setDisputes(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load disputed fines');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDispute = (dispute: DisputedFine) => {
    setSelectedDispute(dispute);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDispute(null);
  };

  const handleResolveFine = async (fineId: string, action: 'keep' | 'remove') => {
    if (!confirm(`Are you sure you want to ${action} this fine?`)) return;

    try {
      setProcessingId(fineId);

      const res = await fetch('/api/admin/fines/resolve-dispute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fineId, action }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.details || `Failed to ${action} fine`);
      }

      setStatusMessage({
        text: `Fine ${action === 'keep' ? 'maintained' : 'removed'} successfully`,
        type: 'success',
      });

      setTimeout(() => setStatusMessage(null), 5000);

      if (action === 'remove') {
        setDisputes(disputes.filter((dispute) => dispute._id !== fineId));
      } else {
        setDisputes(
          disputes.map((dispute) =>
            dispute._id === fineId ? { ...dispute, status: 'active' } : dispute
          )
        );
      }

      if (showModal && selectedDispute?._id === fineId) {
        handleCloseModal();
      }
    } catch (err: any) {
      setStatusMessage({
        text: err.message || `Failed to ${action} fine`,
        type: 'error',
      });
      setTimeout(() => setStatusMessage(null), 5000);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <p className="p-8 text-orange-400">Loading disputed fines...</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen p-8 text-white bg-gradient-to-br from-black to-orange-900">
      <h1 className="mb-6 text-3xl font-bold text-transparent bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text">
        Disputed Fines Management
      </h1>

      {statusMessage && (
        <div className={`p-4 mb-4 rounded ${statusMessage.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {statusMessage.text}
        </div>
      )}

      {disputes.length === 0 ? (
        <p className="text-gray-200">No disputed fines found.</p>
      ) : (
        <>
          <p className="mb-4 text-gray-300">Total disputed fines: {disputes.length}</p>
          <div className="overflow-x-auto rounded-lg shadow-lg bg-black/20">
            <table className="min-w-full text-sm text-white border border-orange-500">
              <thead>
                <tr className="text-white bg-orange-600">
                  <th className="p-3 border">License Number</th>
                  <th className="p-3 border">Violation Type</th>
                  <th className="p-3 border">Amount</th>
                  <th className="p-3 border">Date Issued</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {disputes.map((dispute) => (
                  <tr key={dispute._id} className="hover:bg-orange-800">
                    <td className="p-3 border">{dispute.userId?.licenseNumber || dispute.licenseNumber || 'N/A'}</td>
                    <td className="p-3 border">{dispute.violationType || 'N/A'}</td>
                    <td className="p-3 border">Rs. {dispute.amount}</td>
                    <td className="p-3 border">{new Date(dispute.issuedDate).toLocaleDateString()}</td>
                    <td className="p-3 border">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleViewDispute(dispute)}
                          className="px-3 py-1 text-sm text-white bg-orange-500 rounded hover:bg-orange-600"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleResolveFine(dispute._id, 'keep')}
                          disabled={processingId === dispute._id}
                          className="px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
                        >
                          Keep
                        </button>
                        <button
                          onClick={() => handleResolveFine(dispute._id, 'remove')}
                          disabled={processingId === dispute._id}
                          className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Detail Modal */}
      {showModal && selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="w-full max-w-2xl p-6 text-black bg-white rounded-lg shadow-xl">
            <h2 className="mb-4 text-2xl font-bold text-orange-600">Dispute Details</h2>
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <p className="font-semibold">License Number:</p>
                <p>{selectedDispute.userId?.licenseNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="font-semibold">Email:</p>
                <p>{selectedDispute.userId?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="font-semibold">Amount:</p>
                <p>Rs. {selectedDispute.amount}</p>
              </div>
              <div>
                <p className="font-semibold">Violation Type:</p>
                <p>{selectedDispute.violationType}</p>
              </div>
              <div>
                <p className="font-semibold">Date Issued:</p>
                <p>{new Date(selectedDispute.issuedDate).toLocaleString()}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="font-semibold">Dispute Reason:</p>
              <div className="p-3 mt-1 text-gray-700 bg-gray-100 rounded">
                {selectedDispute.disputeReason || 'No reason provided.'}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => handleResolveFine(selectedDispute._id, 'keep')}
                disabled={processingId === selectedDispute._id}
                className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {processingId === selectedDispute._id ? 'Processing...' : 'Keep Fine'}
              </button>
              <button
                onClick={() => handleResolveFine(selectedDispute._id, 'remove')}
                disabled={processingId === selectedDispute._id}
                className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50"
              >
                {processingId === selectedDispute._id ? 'Processing...' : 'Remove Fine'}
              </button>
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
