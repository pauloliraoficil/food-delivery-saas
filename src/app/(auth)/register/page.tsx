import { register } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Criar Conta</CardTitle>
        <CardDescription>Cadastre-se para começar a pedir</CardDescription>
      </CardHeader>
      <form action={register}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Nome Completo</Label>
            <Input id="full_name" name="full_name" type="text" required placeholder="Seu nome" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required placeholder="seu@email.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" name="password" type="password" required minLength={6} placeholder="••••••••" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
            Criar Conta
          </Button>
          <p className="text-sm text-gray-500">
            Já tem conta?{' '}
            <Link href="/login" className="text-orange-500 hover:underline">
              Entrar
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
