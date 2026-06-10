'use client';

import { useState } from 'react';
import { bookSlot } from '../actions';

export default function SlotBookingForm({ slotId }: { slotId: string }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('يرجى إدخال الاسم');
      return;
    }
    if (!phone.trim()) {
      setError('يرجى إدخال رقم الهاتف');
      return;
    }

    setLoading(true);

    try {
      const result = await bookSlot(slotId, { name: name.trim(), phone: phone.trim() });
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      }
    } catch {
      setError('حدث خطأ أثناء الحجز. حاول مرة أخرى.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
          الاسم الكامل
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="مثال: أحمد محمد"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-right focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          disabled={loading}
          autoComplete="name"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="phone" className="block text-gray-700 font-medium mb-1">
          رقم الهاتف
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="مثال: 01012345678"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-right focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          disabled={loading}
          autoComplete="tel"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'جاري الحجز...' : 'تأكيد الحجز'}
      </button>

      <p className="text-xs text-gray-400 text-center mt-4">
        سيتم الدفع نقداً عند الحضور — 100 جنيه
      </p>
    </form>
  );
}
