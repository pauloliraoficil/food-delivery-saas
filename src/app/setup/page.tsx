'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SetupPage() {
  const [sql, setSql] = useState('')
  const [seedSql, setSeedSql] = useState('')
  const [copied, setCopied] = useState<'schema' | 'seed' | null>(null)
  const [status, setStatus] = useState<'idle' | 'checking' | 'ready' | 'empty'>('idle')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [restaurantCount, setRestaurantCount] = useState(0)

  useEffect(() => {
    Promise.all([
      fetch('/api/setup/sql').then(r => r.text()),
      fetch('/api/setup/seed').then(r => r.text())
    ]).then(([schema, seed]) => {
      setSql(schema)
      setSeedSql(seed)
      setLoading(false)
    }).catch(() => {
      setMessage('Erro ao carregar SQL')
      setLoading(false)
    })
  }, [])

  async function checkDatabase() {
    setStatus('checking')
    setMessage('Verificando banco de dados...')
    try {
      const r = await fetch('/api/setup/status')
      const data = await r.json()
      if (data.ready) {
        const countR = await fetch('/api/setup/status?table=restaurants')
        const countData = await countR.json()
        setRestaurantCount(countData.count || 0)
        if (countData.count > 0) {
          setStatus('ready')
          setMessage('✅ Banco de dados configurado e populado!')
        } else {
          setStatus('empty')
          setMessage('✅ Tabelas criadas! Agora popule com dados de exemplo.')
        }
      } else {
        setStatus('idle')
        setMessage('⚠️ Tabelas não encontradas. Siga os passos abaixo.')
      }
    } catch (err) {
      setStatus('idle')
      setMessage('Erro ao verificar banco de dados.')
    }
  }

  async function copyToClipboard(text: string, type: 'schema' | 'seed') {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      const textarea = type === 'schema'
        ? document.getElementById('sql-textarea') as HTMLTextAreaElement
        : document.getElementById('seed-textarea') as HTMLTextAreaElement
      if (textarea) {
        textarea.select()
        document.execCommand('copy')
        setCopied(type)
        setTimeout(() => setCopied(null), 2000)
      }
    }
  }

  function selectAll(id: string) {
    const textarea = document.getElementById(id) as HTMLTextAreaElement
    if (textarea) {
      textarea.focus()
      textarea.select()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center pt-8">
          <h1 className="text-4xl font-bold text-gray-900">🍔 FoodDelivery</h1>
          <p className="text-gray-600 mt-2">Configuração do Banco de Dados</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>📊 Status do Banco de Dados</CardTitle>
            <CardDescription>
              Supabase: lmccexrrearscaqgdklg.supabase.co
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={checkDatabase} disabled={status === 'checking'} className="w-full bg-orange-500 hover:bg-orange-600">
              {status === 'checking' ? '🔄 Verificando...' : '🔍 Verificar Banco de Dados'}
            </Button>
            {message && (
              <div className={`p-3 rounded-md text-sm ${
                status === 'ready' ? 'bg-green-50 text-green-700' :
                status === 'empty' ? 'bg-blue-50 text-blue-700' :
                'bg-amber-50 text-amber-700'
              }`}>
                {message}
                {status === 'ready' && ` (${restaurantCount} restaurantes cadastrados)`}
              </div>
            )}
          </CardContent>
        </Card>

        {status === 'idle' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>📋 Passo 1: Abrir o SQL Editor do Supabase</CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href="https://supabase.com/dashboard/project/lmccexrrearscaqgdklg/sql/new"
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
                <CardTitle>📋 Passo 2: Executar Schema</CardTitle>
                <CardDescription>
                  Selecione TODO o texto abaixo, copie, cole no SQL Editor e clique Run
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {loading ? (
                  <p className="text-center text-gray-500 py-4">Carregando...</p>
                ) : (
                  <>
                    <textarea
                      id="sql-textarea"
                      readOnly
                      value={sql}
                      onClick={() => selectAll('sql-textarea')}
                      className="w-full h-48 p-3 text-xs font-mono border border-gray-300 rounded-md bg-gray-50 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <div className="flex gap-2">
                      <Button onClick={() => selectAll('sql-textarea')} variant="outline" className="flex-1">
                        📝 Selecionar
                      </Button>
                      <Button onClick={() => copyToClipboard(sql, 'schema')} className="flex-1 bg-orange-500 hover:bg-orange-600">
                        {copied === 'schema' ? '✅ Copiado!' : '📋 Copiar'}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {status === 'empty' && (
          <Card>
            <CardHeader>
              <CardTitle>📋 Passo 3: Popular com Dados de Exemplo</CardTitle>
              <CardDescription>
                Execute este SQL para criar 6 restaurantes, categorias e produtos de demonstração
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <p className="text-center text-gray-500 py-4">Carregando...</p>
              ) : (
                <>
                  <textarea
                    id="seed-textarea"
                    readOnly
                    value={seedSql}
                    onClick={() => selectAll('seed-textarea')}
                    className="w-full h-48 p-3 text-xs font-mono border border-gray-300 rounded-md bg-gray-50 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <div className="flex gap-2">
                    <Button onClick={() => selectAll('seed-textarea')} variant="outline" className="flex-1">
                      📝 Selecionar
                    </Button>
                    <Button onClick={() => copyToClipboard(seedSql, 'seed')} className="flex-1 bg-orange-500 hover:bg-orange-600">
                      {copied === 'seed' ? '✅ Copiado!' : '📋 Copiar'}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {status === 'ready' && (
          <Card>
            <CardContent className="pt-6 text-center space-y-4">
              <p className="text-4xl">🎉</p>
              <p className="text-lg font-semibold">Tudo pronto!</p>
              <p className="text-sm text-gray-600">{restaurantCount} restaurantes cadastrados</p>
              <a href="/" className="inline-block w-full px-4 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600">
                🚀 Ir para o App
              </a>
            </CardContent>
          </Card>
        )}

        {(status === 'idle' || status === 'empty') && (
          <Card>
            <CardContent className="pt-6">
              <Button onClick={checkDatabase} variant="outline" className="w-full">
                🔄 Verificar Novamente
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
