import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export async function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client for build time
    const mockQuery: any = {
      data: [],
      error: null,
      count: 0,
      single: () => ({ data: null, error: null }),
      eq: () => mockQuery,
      neq: () => mockQuery,
      order: () => mockQuery,
      limit: () => mockQuery,
      select: () => mockQuery,
    }
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signInWithPassword: async () => ({ data: null, error: { message: 'Not configured' } }),
        signUp: async () => ({ data: null, error: { message: 'Not configured' } }),
        signOut: async () => ({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        exchangeCodeForSession: async () => ({ error: null }),
      },
      from: () => ({
        select: () => mockQuery,
        insert: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }), error: null }),
        update: () => ({ eq: () => ({ error: null }) }),
        delete: () => ({ eq: () => ({ error: null }), in: () => ({ error: null }) }),
      }),
      rpc: () => ({ data: [], error: null }),
      storage: {
        from: () => ({
          upload: async () => ({ error: null }),
          getPublicUrl: () => ({ data: { publicUrl: '' } }),
        }),
      },
    } as any
  }

  const cookieStore = await cookies()

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    }
  )
}
