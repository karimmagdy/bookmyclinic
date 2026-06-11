import { redirect } from 'next/navigation';
export default function ConfirmationBookingIdShim({ params }) {
  redirect(`/booked/${params.bookingId}`);
}
