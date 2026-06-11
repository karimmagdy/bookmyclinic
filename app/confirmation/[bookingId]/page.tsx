import { redirect } from 'next/navigation';
export default function ConfirmationLegacyRedirect({ params }: { params: { bookingId: string } }) {
  redirect(`/booked/${params.bookingId}`);
}
