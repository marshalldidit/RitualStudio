import { supabase } from '@/lib/supabase'
import { SubscriptionRow } from '@/types/database'

export async function getSubscription(userId: string): Promise<SubscriptionRow | null> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('[payments] Failed to fetch subscription:', error.message)
    return null
  }

  return data as SubscriptionRow
}

export async function isPro(userId: string): Promise<boolean> {
  const sub = await getSubscription(userId)
  return sub?.plan === 'pro' && sub?.status === 'active'
}
