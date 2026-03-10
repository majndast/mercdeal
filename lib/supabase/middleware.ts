import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Skip auth check if Supabase not configured
  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected routes
  const protectedPaths = ['/ucet', '/admin']
  const adminPaths = ['/admin']
  const authPaths = ['/prihlaseni', '/registrace']

  const pathname = request.nextUrl.pathname

  // Redirect to login if accessing protected route without auth
  if (protectedPaths.some(path => pathname.startsWith(path)) && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/prihlaseni'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Check admin access
  if (adminPaths.some(path => pathname.startsWith(path)) && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  // Redirect authenticated users away from auth pages
  if (authPaths.some(path => pathname.startsWith(path)) && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/ucet'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
