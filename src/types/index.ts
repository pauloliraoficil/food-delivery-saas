export interface Profile {
  id: string
  full_name: string
  phone?: string
  avatar_url?: string
  role: 'customer' | 'restaurant_owner' | 'driver' | 'admin'
  created_at: string
}

export interface Restaurant {
  id: string
  owner_id: string
  name: string
  slug: string
  description?: string
  logo_url?: string
  cover_url?: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  zip_code: string
  latitude: number
  longitude: number
  cuisine_type?: string
  delivery_fee: number
  min_order: number
  estimated_delivery_time?: number
  rating: number
  total_ratings: number
  is_open: boolean
  opening_hours?: Record<string, { open: string; close: string }>
  subscription_plan: 'basic' | 'professional' | 'premium'
}

export interface Category {
  id: string
  restaurant_id: string
  name: string
  description?: string
  display_order: number
  is_active: boolean
}

export interface Product {
  id: string
  restaurant_id: string
  category_id: string
  name: string
  description?: string
  price: number
  promotional_price?: number
  image_url?: string
  is_available: boolean
  is_featured: boolean
  preparation_time?: number
  tags?: string[]
}

export interface ProductAddon {
  id: string
  product_id: string
  name: string
  price: number
  is_available: boolean
}

export interface Address {
  id: string
  user_id: string
  label: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zip_code: string
  latitude?: number
  longitude?: number
  is_default: boolean
}

export interface Order {
  id: string
  order_number: number
  customer_id: string
  restaurant_id: string
  driver_id?: string
  address_id: string
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'cancelled'
  subtotal: number
  delivery_fee: number
  service_fee: number
  discount: number
  total: number
  payment_method: 'card' | 'pix' | 'cash'
  payment_status: 'pending' | 'paid' | 'refunded'
  notes?: string
  estimated_delivery?: string
  actual_delivery?: string
  created_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  unit_price: number
  total_price: number
  notes?: string
  addons?: { name: string; price: number }[]
}

export interface CartItem {
  product: Product
  quantity: number
  addons: ProductAddon[]
  notes?: string
}
