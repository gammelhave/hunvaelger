import { redirect } from 'next/navigation';

export default function SignupRedirectPage() {
  // Automatisk viderestilling fra /signup → /tilmeld
  redirect('/tilmeld');
  return null;
}
