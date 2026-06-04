'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SetupPage() {
  const [sql, setSql] = useState('')
  const [copied, setCopied] = useState(false)
  const [status, setStatus] = useState<'idle' | 'checking' | 'ready' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/setup/sql')
      .then(r => r.text())
      .then(text => {
        setSql(text)
        setLoading(false)
      })
      .catch(() => {
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
      await navigator.clipboard.writeText(sql)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      const textarea = document.getElementById('sql-textarea') as HTMLTextAreaElement
      if (textarea) {
        textarea.select()
        document.execCommand('copy')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    }
  }

  function selectAll() {
    const textarea = document.getElementById('sql-textarea') as HTMLTextAreaElement
    if (textarea) {
      textarea.select()
      textarea.setSelectionRange(0, 99999)
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
                <CardTitle>📋 Passo 1: Abrir o SQL Editor do Supabase</CardTitle>
                <CardDescription>
                  Clique no botão abaixo para abrir o editor SQL
                </CardDescription>
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
                <CardTitle>📋 Passo 2: Copiar o SQL</CardTitle>
                <CardDescription>
                  Selecione TODO o texto abaixo (Ctrl+A) e copie (Ctrl+C)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {loading ? (
                  <p className="text-center text-gray-500 py-4">Carregando SQL...</p>
                ) : (
                  <>
                    <textarea
                      id="sql-textarea"
                      readOnly
                      value={sql}
                      onClick={selectAll}
                      className="w-full h-64 p-3 text-xs font-mono border border-gray-300 rounded-md bg-gray-50 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="SQL será carregado aqui..."
                    />
                    <p className="text-xs text-gray-500">
                      💡 Clique no textarea acima para selecionar todo o conteúdo
                    </p>
                    <div className="flex gap-2">
                      <Button onClick={selectAll} variant="outline" className="flex-1">
                        📝 Selecionar Tudo
                      </Button>
                      <Button onClick={copySql} className="flex-1 bg-orange-500 hover:bg-orange-600">
                        {copied ? '✅ Copiado!' : '📋 Copiar SQL'}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>▶️ Passo 3: Colar e Executar no Supabase</CardTitle>
                <CardDescription>
                  No SQL Editor que você abriu no Passo 1:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-md text-sm space-y-2">
                  <p>1. Clique no editor de texto vazio</p>
                  <p>2. Cole com <strong>Ctrl+V</strong></p>
                  <p>3. Clique no botão <strong>▶ Run</strong> (ou pressione <strong>Ctrl+Enter</strong>)</p>
                  <p>4. Aguarde ~10 segundos para a execução</p>
                </div>
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-800">
                  ⚠️ <strong>Importante:</strong> Cole apenas o CONTEÚDO do SQL (CREATE TABLE, etc.), não o nome do arquivo.
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
              <p className="text-4xl">🎉</p>
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
