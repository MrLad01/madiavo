// app/page.tsx
import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect to a default language
  redirect('/lt');
}