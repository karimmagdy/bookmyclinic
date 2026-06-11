'use client';

type Booking = {
  id: string;
  patient_name: string;
  patient_phone: string;
  created_at: string;
  time_slots: { slot_date: string; slot_time: string };
};

function fmt(date: string) {
  return new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}
function fmtTime(t: string) {
  const [h, m] = t.split(':');
  const hr = parseInt(h);
  return `${hr > 12 ? hr - 12 : hr}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
}
function fmtTs(ts: string) {
  return new Date(ts).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export default function AdminBookingsTable({ bookings }: { bookings: Booking[] }) {
  return (
    <div>
      <div className="mb-4">
        <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
          Total: {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}
        </span>
      </div>
      {bookings.length === 0 ? (
        <p className="text-gray-500 text-center py-16">No bookings yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wide">
              <tr>
                <th className="px-5 py-3 text-left">Patient Name</th>
                <th className="px-5 py-3 text-left">Phone</th>
                <th className="px-5 py-3 text-left">Slot Date</th>
                <th className="px-5 py-3 text-left">Slot Time</th>
                <th className="px-5 py-3 text-left">Booked At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map(b => (
                <tr key={b.id} className="bg-white hover:bg-gray-50 transition">
                  <td className="px-5 py-4 font-medium text-gray-900">{b.patient_name}</td>
                  <td className="px-5 py-4 text-gray-600">{b.patient_phone}</td>
                  <td className="px-5 py-4 text-gray-700">{fmt(b.time_slots.slot_date)}</td>
                  <td className="px-5 py-4 text-gray-700">{fmtTime(b.time_slots.slot_time)}</td>
                  <td className="px-5 py-4 text-gray-500">{fmtTs(b.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
