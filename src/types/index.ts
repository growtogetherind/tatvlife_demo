export interface Product {
  id: string
  name: string
  slug: string
  description: string
  manufacturer: string
  price: number
  stock: number
  dosage: string
  side_effects: string
  category_id: string
  featured: boolean
  active: boolean
  created_at: string
  categories?: { name: string; slug: string }
  product_images?: { image_url: string }[]
}

export interface Category {
  id: string
  name: string
  slug: string
}

export interface Profile {
  id: string
  full_name: string
  email: string
  phone: string
  role: 'customer' | 'admin'
  created_at: string
}

export interface Address {
  id: string
  user_id: string
  full_name: string
  phone: string
  country: string
  state: string
  city: string
  postal_code: string
  address_line: string
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  product?: Product
}

export interface Order {
  id: string
  user_id: string
  total_amount: number
  payment_status: 'unpaid' | 'paid' | 'failed' | 'refunded'
  order_status: 'pending_payment' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shipping_address_id: string
  crypto_payment_id: string
  created_at: string
  addresses?: Address
  order_items?: OrderItem[]
  payments?: Payment[]
  profiles?: Profile
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  products?: Product
}

export interface Payment {
  id: string
  order_id: string
  gateway: string
  payment_link: string
  transaction_hash: string
  amount: number
  status: 'pending' | 'confirmed' | 'failed'
  created_at: string
}

export interface Review {
  id: string
  product_id: string
  user_id: string
  rating: number
  review: string
  created_at: string
  profiles?: Profile
}

export interface Coupon {
  id: string
  code: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  active: boolean
}

export interface EmailLog {
  id: string
  user_id: string
  email_type: string
  status: string
  sent_at: string
}

export interface LocalCartItem {
  product: Product
  quantity: number
}
