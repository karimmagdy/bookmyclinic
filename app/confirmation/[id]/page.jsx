import { redirect } from 'next/navigation';
export default function ConfirmationIdShim({ params }) {
  redirect(`/booked/${params.id}`);
}
