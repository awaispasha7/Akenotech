'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Services(): React.JSX.Element {
  const router = useRouter();

  useEffect(() => {
    // Immediately redirect to home page and scroll to services section
    router.replace('/#areas-of-expertise');
  }, [router]);

  return <div>Redirecting...</div>;
}
