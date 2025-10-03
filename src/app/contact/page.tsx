'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Contact(): React.JSX.Element {
  const router = useRouter();

  useEffect(() => {
    // Immediately redirect to home page and scroll to contact section
    router.replace('/#contact');
  }, [router]);

  return null;
}
