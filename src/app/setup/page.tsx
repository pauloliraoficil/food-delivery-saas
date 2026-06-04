'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SetupPage() {
  const [copied, setCopied] = useState(false)
  const [status, setStatus] = useState<'idle' | 'checking' | 'ready' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const schemaUrl = '/api/setup/sql'

  async function checkDatabase() {
    setStatus('checking')
    setMessage('Verificando banco de dados...')
    try {
      const r = await fetch('/api/setup/status')
      const data = await r.json()
      if (data.ready) {
        setStatus('ready')
        setMessage('✅ Banco de dados configurado e funcionando!')
      } else {
        setStatus('error')
        setMessage('⚠️ Tabelas não encontradas. Siga os passos abaixo.')
      }
    } catch (err) {
      setStatus('error')
      setMessage('Erro ao verificar banco de dados.')
    }
  }

  async function copySql() {
    try {
      const r = await fetch(schemaUrl)
      const sql = await r.text()
      await navigator.clipboard.writeText(sql)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      setMessage('Erro ao copiar SQL. Acesse o link direto.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center pt-8">
          <h1 className="text-4xl font-bold text-gray-900">🍔 FoodDelivery</h1>
          <p className="text-gray-600 mt-2">Configuração do Banco de Dados</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Status do Banco de Dados</CardTitle>
            <CardDescription>
              Supabase URL: lmccexrrearscaqgdklg.supabase.co
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={checkDatabase} disabled={status === 'checking'} className="w-full">
              {status === 'checking' ? 'Verificando...' : '🔍 Verificar Banco de Dados'}
            </Button>
            {message && (
              <div className={`p-3 rounded-md text-sm ${
                status === 'ready' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
              }`}>
                {message}
              </div>
            )}
          </CardContent>
        </Card>

        {status !== 'ready' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>📋 Passo 1: Acessar SQL Editor do Supabase</CardTitle>
                <CardDescription>
                  Abra o editor SQL do seu projeto Supabase
                </CardDescription>
              </CardHeader>
              <CardContent>
                <a
                  href="https://supabase.com/dashboard/project/lmccexrrearscaqgdklg/sql"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                  🔗 Abrir Supabase SQL Editor →
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📋 Passo 2: Copiar o Schema SQL</CardTitle>
                <CardDescription>
                  Clique no botão abaixo para copiar todo o SQL necessário
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={copySql} variant="outline" className="w-full">
                  {copied ? '✅ Copiado!' : '📄 Copiar SQL do Schema'}
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Ou acesse diretamente: <a href={schemaUrl} target="_blank" className="text-blue-600 underline">/api/setup/sql</a>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>▶️ Passo 3: Executar no Supabase</CardTitle>
                <CardDescription>
                  No SQL Editor: Cole o SQL (Ctrl+V) → Clique em "Run" (Ctrl+Enter)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-md text-sm space-y-2">
                  <p>1. Volte para a aba do Supabase SQL Editor</p>
                  <p>2. Cole o SQL copiado (Ctrl+V)</p>
                  <p>3. Clique no botão <strong>▶ Run</strong> ou pressione <strong>Ctrl+Enter</strong></p>
                  <p>4. Aguarde a execução (pode levar ~10 segundos)</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>✅ Passo 4: Verificar</CardTitle>
                <CardDescription>
                  Volte aqui e clique em "Verificar" novamente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={checkDatabase} variant="outline" className="w-full">
                  🔄 Verificar Novamente
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {status === 'ready' && (
          <Card>
            <CardContent className="pt-6 text-center space-y-4">
              <p className="text-2xl">🎉</p>
              <p className="text-lg font-semibold">Tudo pronto!</p>
              <a href="/" className="inline-block w-full px-4 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600">
                🚀 Ir para o App
              </a>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
