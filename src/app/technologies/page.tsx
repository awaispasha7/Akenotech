'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Technologies(): React.JSX.Element {
  const router = useRouter();

  useEffect(() => {
    // Immediately redirect to home page and scroll to technologies section
    router.replace('/#technologies-tools');
  }, [router]);

  return null;
}
