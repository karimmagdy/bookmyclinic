import { redirect } from 'next/navigation';

// Compatibility shim: redirect old [id] URLs to the canonical [bookingId] route.
// Both resolve to the same booking UUID — no data loss.
export default function OldConfirmationRedirect({ params }: { params: { id: string } }) {
  redirect(`/confirmation/${params.id}`);
}
