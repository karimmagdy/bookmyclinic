'use client'
import { bookSlot } from '@/app/book/actions'

export default function SlotBookingForm({ slotId }: { slotId: string }) {
  return (
    <form
      action={bookSlot}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5"
    >
      {/* hidden field so server action receives slotId */}
      <input type="hidden" name="slotId" value={slotId} />

      <h2 className="text-lg font-semibold text-gray-800">Your Details</h2>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Enter your full name"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          placeholder="Enter your phone number"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-base transition-colors"
      >
        Confirm Booking
      </button>
    </form>
  )
}
