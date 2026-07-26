import { getAuthUser } from '../../../../../lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DecisionClient } from './decision-client'

export default async function DecisionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await getAuthUser()

  if (!user) redirect('/login')

  const { data: session } = await supabase
    .from('pause_sessions')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single() as { data: any }

  if (!session) redirect('/home')

  if (session.outcome) {
    redirect(`/pause/${session.id}/outcome`)
  }

  return <DecisionClient session={session} />
}

