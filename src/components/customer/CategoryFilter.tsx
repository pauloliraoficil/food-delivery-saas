'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'

const categories = [
  'Todos',
  'Pizza',
  'Hambúrguer',
  'Japonesa',
  'Brasileira',
  'Italiana',
  'Mexicana',
  'Lanches',
  'Doces',
  'Bebidas',
]

export function CategoryFilter() {
  const [selected, setSelected] = useState('Todos')

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {categories.map((category) => (
        <Badge
          key={category}
          variant={selected === category ? 'default' : 'outline'}
          className={`cursor-pointer whitespace-nowrap ${
            selected === category
              ? 'bg-orange-500 hover:bg-orange-600'
              : 'hover:bg-gray-100'
          }`}
          onClick={() => setSelected(category)}
        >
          {category}
        </Badge>
      ))}
    </div>
  )
}
