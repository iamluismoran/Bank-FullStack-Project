import { useQuery } from '@tanstack/react-query';
import { getHealth } from '../api/health';

export default function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: getHealth,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}