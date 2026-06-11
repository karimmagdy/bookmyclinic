// Deprecated route — redirects handled by [bookingId]
import { redirect } from 'next/navigation';
export default function OldConfirmationPage({ params }: { params: { id: string } }) {
  redirect(`/confirmation/${params.id}`);
}
