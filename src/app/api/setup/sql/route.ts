import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  try {
    const sqlPath = join(process.cwd(), 'supabase', 'schema.sql')
    const sql = readFileSync(sqlPath, 'utf-8')
    return new NextResponse(sql, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': 'inline',
      },
    })
  } catch (err) {
    return new NextResponse(
      '-- Erro: arquivo supabase/schema.sql não encontrado\n-- Verifique se o arquivo existe no repositório',
      { status: 404, headers: { 'Content-Type': 'text/plain' } }
    )
  }
}
