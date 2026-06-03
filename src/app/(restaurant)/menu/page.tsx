'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function MenuManagementPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [restaurantId, setRestaurantId] = useState<string | null>(null)
  const [newCategory, setNewCategory] = useState('')
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category_id: '' })

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: restaurant } = await supabase
        .from('restaurants')
        .select('id')
        .eq('owner_id', user.id)
        .single()

      if (!restaurant) return
      setRestaurantId(restaurant.id)

      const { data: cats } = await supabase
        .from('categories')
        .select('*')
        .eq('restaurant_id', restaurant.id)
        .order('display_order')

      const { data: prods } = await supabase
        .from('products')
        .select('*')
        .eq('restaurant_id', restaurant.id)

      setCategories(cats || [])
      setProducts(prods || [])
    }

    fetchData()
  }, [])

  const addCategory = async () => {
    if (!newCategory || !restaurantId) return
    const supabase = createClient()
    await supabase.from('categories').insert({
      name: newCategory,
      restaurant_id: restaurantId,
      display_order: categories.length,
    })
    setNewCategory('')
    window.location.reload()
  }

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category_id || !restaurantId) return
    const supabase = createClient()
    await supabase.from('products').insert({
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      category_id: newProduct.category_id,
      restaurant_id: restaurantId,
    })
    setNewProduct({ name: '', price: '', category_id: '' })
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gerenciar Cardápio</h1>

      <Card>
        <CardHeader>
          <CardTitle>Adicionar Categoria</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input
            placeholder="Nome da categoria"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <Button onClick={addCategory} className="bg-orange-500 hover:bg-orange-600">
            Adicionar
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Adicionar Produto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Nome</Label>
              <Input
                placeholder="Nome do produto"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Preço</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              />
            </div>
            <div>
              <Label>Categoria</Label>
              <select
                className="w-full border rounded-md p-2"
                value={newProduct.category_id}
                onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}
              >
                <option value="">Selecione</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
          <Button onClick={addProduct} className="bg-orange-500 hover:bg-orange-600">
            Adicionar Produto
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Produtos Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {products.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-2 border rounded">
                <span>{product.name}</span>
                <span className="font-bold">R$ {product.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
