import { UserContext } from '@/contexts';
import { useContext } from 'react';

export const useAuth = () => {
  const { user, loading } = useContext(UserContext);
  return { user, loading };
};
