// Fetch PR data
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPR } from '@/lib/api';
import { PRData } from '@/types/pr.types';

export function usePR() {
  const [prUrl, setPrUrl] = useState('');
  const [shouldFetch, setShouldFetch] = useState(false);

  const { data, isLoading, error, refetch } = useQuery<PRData, Error>({
    queryKey: ['pr', prUrl],
    queryFn: () => fetchPR(prUrl),
    enabled: shouldFetch && prUrl.length > 0,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleFetchPR = (url: string) => {
    setPrUrl(url);
    setShouldFetch(true);
  };

  const reset = () => {
    setPrUrl('');
    setShouldFetch(false);
  };

  return {
    prUrl,
    setPrUrl,
    data,
    isLoading,
    error,
    fetchPR: handleFetchPR,
    refetch,
    reset,
  };
}