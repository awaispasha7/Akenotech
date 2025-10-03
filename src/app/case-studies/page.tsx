'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CaseStudies(): React.JSX.Element {
  const router = useRouter();

  useEffect(() => {
    // Immediately redirect to home page and scroll to case studies section
    router.replace('/#highlighted-use-cases');
  }, [router]);

  return null;
}
