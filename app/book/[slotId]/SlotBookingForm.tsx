'use client'
import { useFormState } from 'react-dom'
import { bookSlot } from '@/app/book/actions'

type FormState = { error: string | null }
const initialState: FormState = { error: null }

export default function SlotBookingForm({ slotId }: { slotId: string }) {
  const boundAction = async (_prevState: FormState, formData: FormData) => {
    return bookSlot(slotId, formData)
  }
  const [state, formAction] = useFormState(boundAction, initialState)

  return (
    <form action={formAction} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
      <h2 className="text-lg font-semibold text-gray-800">Your Details</h2>

      {state?.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
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
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
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
