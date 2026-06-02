import { login } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Entrar</CardTitle>
        <CardDescription>Acesse sua conta para fazer pedidos</CardDescription>
      </CardHeader>
      <form action={login}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required placeholder="seu@email.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" name="password" type="password" required placeholder="••••••••" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
            Entrar
          </Button>
          <p className="text-sm text-gray-500">
            Não tem conta?{' '}
            <Link href="/register" className="text-orange-500 hover:underline">
              Cadastre-se
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
