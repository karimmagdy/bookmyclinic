'use client';
import { bookSlot } from './actions';

export default function SlotBookingForm({ slotId }: { slotId: string }) {
  return (
    <form action={bookSlot} className="space-y-5">
      <input type="hidden" name="slotId" value={slotId} />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">Full Name</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="e.g. Ahmed Mohamed"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone">Phone Number</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          placeholder="e.g. 01012345678"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-semibold rounded-xl py-3 text-lg hover:bg-blue-700 transition-colors"
      >
        Confirm Booking
      </button>
    </form>
  );
}
