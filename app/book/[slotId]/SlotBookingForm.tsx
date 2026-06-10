'use client'

import { useFormState } from 'react-dom'
import { bookSlot } from '../actions'

const initialState: { error?: string; fieldErrors?: { name?: string; phone?: string } } = {}

export default function SlotBookingForm({ slotId }: { slotId: string }) {
  const [state, formAction] = useFormState(
    async (_prev: typeof initialState, formData: FormData) => {
      formData.set('slotId', slotId)
      return bookSlot(formData)
    },
    initialState
  )

  return (
    <form action={formAction} className="bg-white border border-gray-200 rounded-xl p-6 max-w-md">
      {state?.error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {state.error}
        </div>
      )}

      <label className="block mb-1 text-sm font-medium text-gray-700">
        Your Name
      </label>
      <input
        type="text"
        name="name"
        required
        className="block w-full rounded-lg border border-gray-300 px-4 py-3 mb-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="e.g. Ahmed Ali"
      />
      {state?.fieldErrors?.name && (
        <p className="text-red-600 text-sm -mt-3 mb-4">{state.fieldErrors.name}</p>
      )}

      <label className="block mb-1 text-sm font-medium text-gray-700">
        Phone Number
      </label>
      <input
        type="tel"
        name="phone"
        required
        className="block w-full rounded-lg border border-gray-300 px-4 py-3 mb-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="e.g. 01234567890"
      />
      {state?.fieldErrors?.phone && (
        <p className="text-red-600 text-sm -mt-3 mb-4">{state.fieldErrors.phone}</p>
      )}

      <p className="text-sm text-gray-500 mb-4">
        💵 Pay <strong>100 EGP</strong> in cash when you arrive.
      </p>

      <button
        type="submit"
        className="w-full bg-blue-700 text-white font-semibold rounded-lg px-6 py-3 hover:bg-blue-800 disabled:opacity-50 transition-colors"
      >
        Book Now
      </button>
    </form>
  )
}
