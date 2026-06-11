'use client';

type Booking = {
  id: string;
  patient_name: string;
  patient_phone: string;
  created_at: string;
  slot: { slot_date: string; slot_time: string } | null;
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${m} ${ampm}`;
}

function formatTimestamp(ts: string) {
  return new Date(ts).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true
  });
}

export default function AdminBookingsTable({
  bookings,
  logoutAction
}: {
  bookings: Booking[];
  logoutAction: () => Promise<void>;
}) {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-blue-700">Bookings Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">
              Total: {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
            </p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-sm text-gray-500 hover:text-red-600 border border-gray-300 rounded-lg px-4 py-2 transition-colors"
            >
              Sign Out
            </button>
          </form>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-xl">No bookings yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-2xl border shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-600 text-left">
                  <th className="px-5 py-4 font-semibold">Patient Name</th>
                  <th className="px-5 py-4 font-semibold">Phone</th>
                  <th className="px-5 py-4 font-semibold">Slot Date</th>
                  <th className="px-5 py-4 font-semibold">Slot Time</th>
                  <th className="px-5 py-4 font-semibold">Booked At</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => (
                  <tr key={b.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-5 py-4 font-medium text-gray-900">{b.patient_name}</td>
                    <td className="px-5 py-4 text-gray-600">{b.patient_phone}</td>
                    <td className="px-5 py-4 text-gray-700">{b.slot ? formatDate(b.slot.slot_date) : '—'}</td>
                    <td className="px-5 py-4 text-gray-700">{b.slot ? formatTime(b.slot.slot_time) : '—'}</td>
                    <td className="px-5 py-4 text-gray-500">{formatTimestamp(b.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
