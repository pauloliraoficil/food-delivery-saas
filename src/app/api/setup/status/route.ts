import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const table = url.searchParams.get('table')

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    )

    if (table === 'restaurants') {
      const { count, error } = await supabase
        .from('restaurants')
        .select('*', { count: 'exact', head: true })

      return NextResponse.json({
        count: count || 0,
        error: error?.message || null,
      })
    }

    const tables = ['profiles', 'restaurants', 'categories', 'products', 'orders']
    const results: Record<string, boolean> = {}

    for (const t of tables) {
      const { error } = await supabase.from(t).select('id').limit(1)
      results[t] = !error
    }

    const allReady = Object.values(results).every(Boolean)

    return NextResponse.json({
      ready: allReady,
      tables: results,
      message: allReady
        ? 'Banco de dados configurado!'
        : 'Tabelas não encontradas. Execute o SQL no Supabase.',
    })
  } catch (err) {
    return NextResponse.json({
      ready: false,
      error: 'Não foi possível conectar ao Supabase.',
    }, { status: 500 })
  }
}
