-- Perfis de usuários
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Endereços do usuário
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  label TEXT NOT NULL,
  street TEXT NOT NULL,
  number TEXT NOT NULL,
  complement TEXT,
  neighborhood TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Restaurantes
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  cover_url TEXT,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  cuisine_type TEXT,
  delivery_fee DECIMAL(10, 2) DEFAULT 0,
  min_order DECIMAL(10, 2) DEFAULT 0,
  estimated_delivery_time INT,
  rating DECIMAL(3, 2) DEFAULT 0,
  total_ratings INT DEFAULT 0,
  is_open BOOLEAN DEFAULT false,
  opening_hours JSONB,
  stripe_account_id TEXT,
  subscription_plan TEXT DEFAULT 'basic',
  subscription_status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categorias do cardápio
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Produtos/Itens do cardápio
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  promotional_price DECIMAL(10, 2),
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  preparation_time INT,
  calories INT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Adicionais/Extras dos produtos
CREATE TABLE product_addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pedidos
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number SERIAL,
  customer_id UUID NOT NULL REFERENCES profiles(id),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id),
  driver_id UUID REFERENCES profiles(id),
  address_id UUID NOT NULL REFERENCES addresses(id),
  status TEXT NOT NULL DEFAULT 'pending',
  subtotal DECIMAL(10, 2) NOT NULL,
  delivery_fee DECIMAL(10, 2) NOT NULL,
  service_fee DECIMAL(10, 2) DEFAULT 0,
  discount DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  stripe_payment_id TEXT,
  notes TEXT,
  estimated_delivery TIMESTAMPTZ,
  actual_delivery TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Itens do pedido
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  addons JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Entregadores
CREATE TABLE delivery_drivers (
  id UUID PRIMARY KEY REFERENCES profiles(id),
  vehicle_type TEXT,
  vehicle_plate TEXT,
  is_available BOOLEAN DEFAULT false,
  current_latitude DECIMAL(10, 8),
  current_longitude DECIMAL(11, 8),
  total_deliveries INT DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rastreamento de entrega em tempo real
CREATE TABLE delivery_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id),
  driver_id UUID NOT NULL REFERENCES profiles(id),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Avaliações
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id),
  customer_id UUID NOT NULL REFERENCES profiles(id),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id),
  driver_id UUID REFERENCES profiles(id),
  restaurant_rating INT CHECK (restaurant_rating >= 1 AND restaurant_rating <= 5),
  driver_rating INT CHECK (driver_rating >= 1 AND driver_rating <= 5),
  food_quality_rating INT CHECK (food_quality_rating >= 1 AND food_quality_rating <= 5),
  comment TEXT,
  restaurant_reply TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Programa de fidelidade por restaurante
CREATE TABLE loyalty_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  points_per_real DECIMAL(5, 2) DEFAULT 1.00,
  min_points_to_redeem INT DEFAULT 100,
  reward_value DECIMAL(10, 2) DEFAULT 10.00,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pontos do cliente
CREATE TABLE loyalty_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  program_id UUID NOT NULL REFERENCES loyalty_programs(id),
  points INT NOT NULL,
  order_id UUID REFERENCES orders(id),
  type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cupons de desconto
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id),
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL,
  discount_value DECIMAL(10, 2) NOT NULL,
  min_order_value DECIMAL(10, 2),
  max_uses INT,
  used_count INT DEFAULT 0,
  valid_from TIMESTAMPTZ NOT NULL,
  valid_until TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notificações
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_orders_customer_id_status ON orders(customer_id, status);
CREATE INDEX idx_orders_restaurant_id_status ON orders(restaurant_id, status);
CREATE INDEX idx_products_restaurant_id_category_id ON products(restaurant_id, category_id);
CREATE INDEX idx_categories_restaurant_id ON categories(restaurant_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_reviews_restaurant_id ON reviews(restaurant_id);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_restaurants_updated_at
  BEFORE UPDATE ON restaurants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_delivery_drivers_updated_at
  BEFORE UPDATE ON delivery_drivers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- profiles: users can read/update their own
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- addresses: users manage their own
CREATE POLICY "Users can view own addresses"
  ON addresses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own addresses"
  ON addresses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses"
  ON addresses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses"
  ON addresses FOR DELETE
  USING (auth.uid() = user_id);

-- restaurants: public read, owner manage
CREATE POLICY "Anyone can view restaurants"
  ON restaurants FOR SELECT
  USING (true);

CREATE POLICY "Owners can insert own restaurant"
  ON restaurants FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update own restaurant"
  ON restaurants FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete own restaurant"
  ON restaurants FOR DELETE
  USING (auth.uid() = owner_id);

-- categories: public read, restaurant owner manage
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Restaurant owners can manage categories"
  ON categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM restaurants
      WHERE restaurants.id = categories.restaurant_id
        AND restaurants.owner_id = auth.uid()
    )
  );

-- products: public read, restaurant owner manage
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Restaurant owners can manage products"
  ON products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM restaurants
      WHERE restaurants.id = products.restaurant_id
        AND restaurants.owner_id = auth.uid()
    )
  );

-- product_addons: public read, manage via product owner
CREATE POLICY "Anyone can view product addons"
  ON product_addons FOR SELECT
  USING (true);

CREATE POLICY "Restaurant owners can manage product addons"
  ON product_addons FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM products
      JOIN restaurants ON restaurants.id = products.restaurant_id
      WHERE products.id = product_addons.product_id
        AND restaurants.owner_id = auth.uid()
    )
  );

-- orders: customer sees own, restaurant sees own, driver sees assigned
CREATE POLICY "Customers can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = customer_id);

CREATE POLICY "Customers can insert own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Restaurant owners can view restaurant orders"
  ON orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM restaurants
      WHERE restaurants.id = orders.restaurant_id
        AND restaurants.owner_id = auth.uid()
    )
  );

CREATE POLICY "Restaurant owners can update restaurant orders"
  ON orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM restaurants
      WHERE restaurants.id = orders.restaurant_id
        AND restaurants.owner_id = auth.uid()
    )
  );

CREATE POLICY "Drivers can view assigned orders"
  ON orders FOR SELECT
  USING (auth.uid() = driver_id);

CREATE POLICY "Drivers can update assigned orders"
  ON orders FOR UPDATE
  USING (auth.uid() = driver_id);

-- order_items: access via order ownership
CREATE POLICY "Order participants can view order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND (
          orders.customer_id = auth.uid()
          OR orders.driver_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM restaurants
            WHERE restaurants.id = orders.restaurant_id
              AND restaurants.owner_id = auth.uid()
          )
        )
    )
  );

CREATE POLICY "Customers can insert order items"
  ON order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.customer_id = auth.uid()
    )
  );

-- delivery_drivers: public read availability, driver manages own
CREATE POLICY "Anyone can view driver availability"
  ON delivery_drivers FOR SELECT
  USING (true);

CREATE POLICY "Drivers can update own profile"
  ON delivery_drivers FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Drivers can insert own profile"
  ON delivery_drivers FOR INSERT
  WITH CHECK (auth.uid() = id);

-- delivery_tracking: order participants can view
CREATE POLICY "Order participants can view tracking"
  ON delivery_tracking FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = delivery_tracking.order_id
        AND (
          orders.customer_id = auth.uid()
          OR orders.driver_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM restaurants
            WHERE restaurants.id = orders.restaurant_id
              AND restaurants.owner_id = auth.uid()
          )
        )
    )
  );

CREATE POLICY "Drivers can insert tracking updates"
  ON delivery_tracking FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = delivery_tracking.order_id
        AND orders.driver_id = auth.uid()
    )
  );

-- reviews: public read, customer manages own
CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Customers can insert own reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers can update own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = customer_id);

CREATE POLICY "Restaurant owners can reply to reviews"
  ON reviews FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM restaurants
      WHERE restaurants.id = reviews.restaurant_id
        AND restaurants.owner_id = auth.uid()
    )
  );

-- loyalty_programs: public read, restaurant owner manage
CREATE POLICY "Anyone can view loyalty programs"
  ON loyalty_programs FOR SELECT
  USING (true);

CREATE POLICY "Restaurant owners can manage loyalty programs"
  ON loyalty_programs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM restaurants
      WHERE restaurants.id = loyalty_programs.restaurant_id
        AND restaurants.owner_id = auth.uid()
    )
  );

-- loyalty_points: user sees own
CREATE POLICY "Users can view own loyalty points"
  ON loyalty_points FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert loyalty points"
  ON loyalty_points FOR INSERT
  WITH CHECK (true);

-- coupons: public read, restaurant owner manage
CREATE POLICY "Anyone can view coupons"
  ON coupons FOR SELECT
  USING (true);

CREATE POLICY "Restaurant owners can manage coupons"
  ON coupons FOR ALL
  USING (
    coupons.restaurant_id IS NULL
    OR EXISTS (
      SELECT 1 FROM restaurants
      WHERE restaurants.id = coupons.restaurant_id
        AND restaurants.owner_id = auth.uid()
    )
  );

-- notifications: user sees own
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);