import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client for build time or when not configured
    const mockChain: any = {
      data: [],
      error: null,
      count: 0,
      select: () => mockChain,
      single: () => ({ data: null, error: null }),
      eq: () => mockChain,
      neq: () => mockChain,
      in: () => mockChain,
      is: () => mockChain,
      not: () => mockChain,
      or: () => mockChain,
      order: () => mockChain,
      limit: () => mockChain,
      range: () => mockChain,
      ilike: () => mockChain,
      then: (resolve: any) => resolve({ data: [], error: null }),
    }
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signInWithPassword: async () => ({ data: null, error: { message: 'Not configured' } }),
        signUp: async () => ({ data: null, error: { message: 'Not configured' } }),
        signOut: async () => ({ error: null }),
        onAuthStateChange: (callback: any) => ({ data: { subscription: { unsubscribe: () => {} } } }),
        exchangeCodeForSession: async () => ({ error: null }),
      },
      from: () => ({
        select: () => mockChain,
        insert: () => ({ ...mockChain, select: () => ({ single: () => ({ data: null, error: null }) }) }),
        update: () => mockChain,
        delete: () => mockChain,
      }),
      rpc: () => Promise.resolve({ data: [], error: null }),
      storage: {
        from: () => ({
          upload: async () => ({ error: null }),
          getPublicUrl: () => ({ data: { publicUrl: '' } }),
        }),
      },
    } as any
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}
