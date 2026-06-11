'use client';

type Booking = {
  id: string;
  patient_name: string;
  patient_phone: string;
  slot_date: string;
  slot_time: string;
  created_at: string;
};

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(timeStr: string) {
  const [hourStr, minuteStr] = timeStr.split(':');
  const hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h = hour % 12 || 12;
  return `${h}:${minuteStr ?? '00'} ${ampm}`;
}

function formatTimestamp(ts: string) {
  const d = new Date(ts);
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
}

export default function AdminBookingsTable({ bookings }: { bookings: Booking[] }) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-lg">No bookings yet.</p>
        <p className="text-sm mt-1">Bookings will appear here once patients start booking.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left px-4 py-3 font-semibold text-gray-600">#</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600">Patient Name</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600">Phone</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600">Slot Date</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600">Slot Time</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600">Booked At</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {bookings.map((b, i) => (
            <tr key={b.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-gray-400">{i + 1}</td>
              <td className="px-4 py-3 font-medium text-gray-900">{b.patient_name}</td>
              <td className="px-4 py-3 text-gray-600">{b.patient_phone}</td>
              <td className="px-4 py-3 text-gray-700">{formatDate(b.slot_date)}</td>
              <td className="px-4 py-3 text-gray-700">{formatTime(b.slot_time)}</td>
              <td className="px-4 py-3 text-gray-400">{formatTimestamp(b.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
