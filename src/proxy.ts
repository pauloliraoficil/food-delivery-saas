import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch (err) {
    console.error('Proxy auth error:', err)
  }

  const isCustomerRoute = request.nextUrl.pathname.startsWith('/restaurant') ||
    request.nextUrl.pathname.startsWith('/cart') ||
    request.nextUrl.pathname.startsWith('/checkout') ||
    request.nextUrl.pathname.startsWith('/orders') ||
    request.nextUrl.pathname.startsWith('/profile')

  const isRestaurantRoute = request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/menu') ||
    (request.nextUrl.pathname.startsWith('/orders') && request.nextUrl.searchParams.has('restaurant'))

  const isDriverRoute = request.nextUrl.pathname.startsWith('/deliveries') ||
    request.nextUrl.pathname.startsWith('/driver')

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')

  if ((isCustomerRoute || isRestaurantRoute || isDriverRoute || isAdminRoute) && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
