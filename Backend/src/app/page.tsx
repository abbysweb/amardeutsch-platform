import { redirect } from 'next/navigation';

export default function BackendIndex() {
  // Automatically redirect the base /backend route to the Dashboard
  redirect('/Dashboard');
}
