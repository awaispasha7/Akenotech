'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Testimonials(): React.JSX.Element {
  const router = useRouter();

  useEffect(() => {
    // Immediately redirect to home page and scroll to testimonials section
    router.replace('/#testimonials');
  }, [router]);

  return null;
}
