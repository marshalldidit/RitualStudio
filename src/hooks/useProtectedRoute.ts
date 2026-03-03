import { useEffect } from 'react';
import { useSegments, useRouter } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';

export function useProtectedRoute() {
  const { session, userProfile, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';

    if (!session) {
      if (!inAuthGroup) {
        router.replace('/(auth)/sign-in');
      }
    } else if (!userProfile?.onboarding_completed) {
      if (!inOnboardingGroup) {
        router.replace('/(onboarding)/goal');
      }
    } else {
      if (inAuthGroup || inOnboardingGroup) {
        router.replace('/(tabs)');
      }
    }
  }, [session, userProfile, isLoading, segments]);
}
