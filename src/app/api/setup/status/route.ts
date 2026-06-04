import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    )

    const tables = ['profiles', 'restaurants', 'categories', 'products', 'orders']
    const results: Record<string, boolean> = {}

    for (const table of tables) {
      const { error } = await supabase.from(table).select('id').limit(1)
      results[table] = !error
    }

    const allReady = Object.values(results).every(Boolean)
    const anyReady = Object.values(results).some(Boolean)

    return NextResponse.json({
      ready: allReady,
      partial: anyReady && !allReady,
      tables: results,
      message: allReady
        ? 'Banco de dados configurado!'
        : anyReady
          ? 'Algumas tabelas existem mas o schema está incompleto.'
          : 'Tabelas não encontradas. Execute o SQL no Supabase.',
    })
  } catch (err) {
    return NextResponse.json({
      ready: false,
      error: 'Não foi possível conectar ao Supabase.',
    }, { status: 500 })
  }
}
