import { redirect } from 'next/navigation';
export default function ConfirmationRedirect({ params }: { params: { id: string } }) {
  redirect(`/booked/${params.id}`);
}
