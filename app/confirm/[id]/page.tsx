import { redirect } from 'next/navigation';
export default function ConfirmShim({ params }: { params: { id: string } }) {
  redirect(`/booked/${params.id}`);
}
