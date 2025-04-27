"use client";

import Link from "next/link";

export default function DisputeFinesPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-red-800 via-black to-black">
      <div className="w-full max-w-4xl p-8 text-center text-white border shadow-lg bg-white/10 backdrop-blur-md border-white/20 rounded-2xl">
        <h1 className="mb-6 text-4xl font-bold">🚨 Dispute Your Fine</h1>
        <p className="mb-8 text-lg">If you believe this fine is incorrect, you can submit a dispute below. Please wait while we review your dispute request.</p>

        <form className="flex flex-col gap-6">
          <textarea
            placeholder="Enter your reason for disputing..."
            className="p-4 text-black rounded-md resize-none"
            rows={6}
          />
          <button
            type="submit"
            className="px-6 py-3 font-bold text-black transition bg-white rounded-md hover:bg-gray-300"
          >
            Submit Dispute
          </button>
        </form>

        <div className="mt-8">
          <Link href="/payfines" className="text-blue-300 underline hover:text-blue-400">
            ← Back to Pay Fine
          </Link>
        </div>
      </div>
    </div>
  );
}
