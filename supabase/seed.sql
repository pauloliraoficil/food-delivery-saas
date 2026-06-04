-- ============================================================
-- SEED DATA - Sample restaurants, categories, and products
-- Run this AFTER the schema.sql to populate the database
-- ============================================================

-- Note: This seed creates a sample restaurant owner profile and restaurants
-- The owner_id references must match a real auth.users entry
-- For demo purposes, we'll use a fixed UUID

-- Create a sample owner profile (normally created via Supabase Auth signup)
DO $$
DECLARE
  sample_owner_id UUID := '00000000-0000-0000-0000-000000000001';
  rest1_id UUID;
  rest2_id UUID;
  rest3_id UUID;
  rest4_id UUID;
  rest5_id UUID;
  rest6_id UUID;
BEGIN
  -- Insert sample owner profile
  INSERT INTO profiles (id, full_name, phone, role)
  VALUES (sample_owner_id, 'Demo Owner', '+5511999999999', 'restaurant_owner')
  ON CONFLICT (id) DO NOTHING;

  -- Restaurant 1: Pizza Hut
  INSERT INTO restaurants (id, owner_id, name, slug, description, phone, email, address, city, state, zip_code, latitude, longitude, cuisine_type, delivery_fee, min_order, estimated_delivery_time, rating, total_ratings, is_open)
  VALUES (gen_random_uuid(), sample_owner_id, 'Pizza Hut', 'pizza-hut', 'Pizzas tradicionais e especiais', '+551133333333', 'contato@pizzahut.com', 'Av. Paulista, 1000', 'São Paulo', 'SP', '01310100', -23.561414, -46.655881, 'Pizza', 8.00, 20.00, 30, 4.8, 234, true)
  RETURNING id INTO rest1_id;

  -- Restaurant 2: Burger King
  INSERT INTO restaurants (id, owner_id, name, slug, description, phone, email, address, city, state, zip_code, latitude, longitude, cuisine_type, delivery_fee, min_order, estimated_delivery_time, rating, total_ratings, is_open)
  VALUES (gen_random_uuid(), sample_owner_id, 'Burger King', 'burger-king', 'Hambúrgueres e combos', '+551144444444', 'contato@burgerking.com', 'Rua Augusta, 500', 'São Paulo', 'SP', '01304000', -23.556414, -46.660881, 'Hambúrguer', 6.00, 15.00, 20, 4.6, 189, true)
  RETURNING id INTO rest2_id;

  -- Restaurant 3: Sushi Express
  INSERT INTO restaurants (id, owner_id, name, slug, description, phone, email, address, city, state, zip_code, latitude, longitude, cuisine_type, delivery_fee, min_order, estimated_delivery_time, rating, total_ratings, is_open)
  VALUES (gen_random_uuid(), sample_owner_id, 'Sushi Express', 'sushi-express', 'Sushi e comida japonesa', '+551155555555', 'contato@sushiexpress.com', 'Rua Liberdade, 200', 'São Paulo', 'SP', '01503000', -23.558414, -46.635881, 'Japonesa', 10.00, 30.00, 35, 4.9, 312, true)
  RETURNING id INTO rest3_id;

  -- Restaurant 4: Cantina Bella
  INSERT INTO restaurants (id, owner_id, name, slug, description, phone, email, address, city, state, zip_code, latitude, longitude, cuisine_type, delivery_fee, min_order, estimated_delivery_time, rating, total_ratings, is_open)
  VALUES (gen_random_uuid(), sample_owner_id, 'Cantina Bella', 'cantina-bella', 'Massas e comida italiana', '+551166666666', 'contato@cantinabella.com', 'Rua Oscar Freire, 300', 'São Paulo', 'SP', '01426000', -23.561414, -46.672881, 'Italiana', 7.00, 25.00, 25, 4.7, 156, true)
  RETURNING id INTO rest4_id;

  -- Restaurant 5: Açaí do Pará
  INSERT INTO restaurants (id, owner_id, name, slug, description, phone, email, address, city, state, zip_code, latitude, longitude, cuisine_type, delivery_fee, min_order, estimated_delivery_time, rating, total_ratings, is_open)
  VALUES (gen_random_uuid(), sample_owner_id, 'Açaí do Pará', 'acai-do-para', 'Açaí e acompanhamentos', '+551177777777', 'contato@acaidopara.com', 'Av. Brigadeiro, 800', 'São Paulo', 'SP', '01310000', -23.571414, -46.645881, 'Brasileira', 5.00, 10.00, 15, 4.5, 98, true)
  RETURNING id INTO rest5_id;

  -- Restaurant 6: Arabia Food
  INSERT INTO restaurants (id, owner_id, name, slug, description, phone, email, address, city, state, zip_code, latitude, longitude, cuisine_type, delivery_fee, min_order, estimated_delivery_time, rating, total_ratings, is_open)
  VALUES (gen_random_uuid(), sample_owner_id, 'Arabia Food', 'arabia-food', 'Comida árabe e esfihas', '+551188888888', 'contato@arabiafood.com', 'Rua 25 de Março, 150', 'São Paulo', 'SP', '01021000', -23.541414, -46.625881, 'Árabe', 7.50, 20.00, 30, 4.4, 145, true)
  RETURNING id INTO rest6_id;

  -- Categories for Pizza Hut
  INSERT INTO categories (restaurant_id, name, display_order, is_active) VALUES
    (rest1_id, 'Pizzas Tradicionais', 1, true),
    (rest1_id, 'Pizzas Especiais', 2, true),
    (rest1_id, 'Bebidas', 3, true);

  -- Products for Pizza Hut
  INSERT INTO products (restaurant_id, category_id, name, description, price, is_available, is_featured) VALUES
    (rest1_id, (SELECT id FROM categories WHERE restaurant_id = rest1_id AND name = 'Pizzas Tradicionais' LIMIT 1), 'Pizza Margherita', 'Molho de tomate, mozzarella, manjericão', 28.00, true, true),
    (rest1_id, (SELECT id FROM categories WHERE restaurant_id = rest1_id AND name = 'Pizzas Tradicionais' LIMIT 1), 'Pizza 4 Queijos', 'Mozzarella, provolone, parmesão, gorgonzola', 42.00, true, false),
    (rest1_id, (SELECT id FROM categories WHERE restaurant_id = rest1_id AND name = 'Pizzas Tradicionais' LIMIT 1), 'Pizza Pepperoni', 'Molho de tomate, mozzarella, pepperoni', 36.00, true, true),
    (rest1_id, (SELECT id FROM categories WHERE restaurant_id = rest1_id AND name = 'Pizzas Especiais' LIMIT 1), 'Pizza Portuguesa', 'Presunto, ovos, cebola, azeitona, ervilha', 45.00, true, false),
    (rest1_id, (SELECT id FROM categories WHERE restaurant_id = rest1_id AND name = 'Bebidas' LIMIT 1), 'Coca-Cola 2L', 'Refrigerante gelado', 12.00, true, false);

  -- Categories and products for Burger King
  INSERT INTO categories (restaurant_id, name, display_order, is_active) VALUES
    (rest2_id, 'Hambúrgueres', 1, true),
    (rest2_id, 'Combos', 2, true);

  INSERT INTO products (restaurant_id, category_id, name, description, price, is_available, is_featured) VALUES
    (rest2_id, (SELECT id FROM categories WHERE restaurant_id = rest2_id AND name = 'Hambúrgueres' LIMIT 1), 'Whopper', 'Pão, carne, alface, tomate, cebola, picles', 25.00, true, true),
    (rest2_id, (SELECT id FROM categories WHERE restaurant_id = rest2_id AND name = 'Hambúrgueres' LIMIT 1), 'Big King', 'Dois hambúrgueres, queijo, alface, molho especial', 22.00, true, false),
    (rest2_id, (SELECT id FROM categories WHERE restaurant_id = rest2_id AND name = 'Combos' LIMIT 1), 'Combo Whopper', 'Whopper + Batata + Bebida', 35.00, true, true);

  -- Categories and products for Sushi Express
  INSERT INTO categories (restaurant_id, name, display_order, is_active) VALUES
    (rest3_id, 'Sashimi', 1, true),
    (rest3_id, 'Sushi', 2, true),
    (rest3_id, 'Hot Rolls', 3, true);

  INSERT INTO products (restaurant_id, category_id, name, description, price, is_available, is_featured) VALUES
    (rest3_id, (SELECT id FROM categories WHERE restaurant_id = rest3_id AND name = 'Sashimi' LIMIT 1), 'Sashimi Salmão 10un', '10 fatias de salmão fresco', 45.00, true, true),
    (rest3_id, (SELECT id FROM categories WHERE restaurant_id = rest3_id AND name = 'Sushi' LIMIT 1), 'Combo Sushi 20 peças', 'Sushi variado com 20 peças', 65.00, true, true),
    (rest3_id, (SELECT id FROM categories WHERE restaurant_id = rest3_id AND name = 'Hot Rolls' LIMIT 1), 'Hot Roll Salmão 10un', '10 hot rolls de salmão empanado', 38.00, true, false);

  -- Categories and products for Cantina Bella
  INSERT INTO categories (restaurant_id, name, display_order, is_active) VALUES
    (rest4_id, 'Massas', 1, true),
    (rest4_id, 'Pizzas', 2, true);

  INSERT INTO products (restaurant_id, category_id, name, description, price, is_available, is_featured) VALUES
    (rest4_id, (SELECT id FROM categories WHERE restaurant_id = rest4_id AND name = 'Massas' LIMIT 1), 'Spaghetti Carbonara', 'Massa fresca com molho carbonara', 38.00, true, true),
    (rest4_id, (SELECT id FROM categories WHERE restaurant_id = rest4_id AND name = 'Massas' LIMIT 1), 'Fettuccine Alfredo', 'Massa com molho alfredo e frango', 42.00, true, false),
    (rest4_id, (SELECT id FROM categories WHERE restaurant_id = rest4_id AND name = 'Pizzas' LIMIT 1), 'Pizza Margherita Italiana', 'Receita original napolitana', 52.00, true, true);

  -- Categories and products for Açaí do Pará
  INSERT INTO categories (restaurant_id, name, display_order, is_active) VALUES
    (rest5_id, 'Açaí', 1, true),
    (rest5_id, 'Acompanhamentos', 2, true);

  INSERT INTO products (restaurant_id, category_id, name, description, price, is_available, is_featured) VALUES
    (rest5_id, (SELECT id FROM categories WHERE restaurant_id = rest5_id AND name = 'Açaí' LIMIT 1), 'Açaí 500ml', 'Açaí puro com acompanhamentos', 18.00, true, true),
    (rest5_id, (SELECT id FROM categories WHERE restaurant_id = rest5_id AND name = 'Açaí' LIMIT 1), 'Açaí 1L', 'Açaí grande para compartilhar', 32.00, true, true);

  -- Categories and products for Arabia Food
  INSERT INTO categories (restaurant_id, name, display_order, is_active) VALUES
    (rest6_id, 'Esfihas', 1, true),
    (rest6_id, 'Pratos', 2, true);

  INSERT INTO products (restaurant_id, category_id, name, description, price, is_available, is_featured) VALUES
    (rest6_id, (SELECT id FROM categories WHERE restaurant_id = rest6_id AND name = 'Esfihas' LIMIT 1), 'Esfiha de Carne 10un', '10 esfihas abertas de carne', 28.00, true, true),
    (rest6_id, (SELECT id FROM categories WHERE restaurant_id = rest6_id AND name = 'Esfihas' LIMIT 1), 'Esfiha de Queijo 10un', '10 esfihas abertas de queijo', 26.00, true, false),
    (rest6_id, (SELECT id FROM categories WHERE restaurant_id = rest6_id AND name = 'Pratos' LIMIT 1), 'Kafta no Prato', 'Kafta grelhada com arroz e salada', 42.00, true, true);
END $$;
