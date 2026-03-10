export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          role: 'customer' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          role?: 'customer' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          role?: 'customer' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          parent_id: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          parent_id?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          parent_id?: string | null
          sort_order?: number
          created_at?: string
        }
      }
      mercedes_models: {
        Row: {
          id: string
          name: string
          slug: string
          code: string | null
          year_from: number | null
          year_to: number | null
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          code?: string | null
          year_from?: number | null
          year_to?: number | null
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          code?: string | null
          year_from?: number | null
          year_to?: number | null
          image_url?: string | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          price: number
          original_price: number | null
          sku: string | null
          stock: number
          category_id: string | null
          badge: string | null
          is_active: boolean
          is_featured: boolean
          rating: number
          review_count: number
          search_vector: unknown | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          price: number
          original_price?: number | null
          sku?: string | null
          stock?: number
          category_id?: string | null
          badge?: string | null
          is_active?: boolean
          is_featured?: boolean
          rating?: number
          review_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          price?: number
          original_price?: number | null
          sku?: string | null
          stock?: number
          category_id?: string | null
          badge?: string | null
          is_active?: boolean
          is_featured?: boolean
          rating?: number
          review_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          url: string
          alt: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          url: string
          alt?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          url?: string
          alt?: string | null
          sort_order?: number
          created_at?: string
        }
      }
      product_models: {
        Row: {
          product_id: string
          model_id: string
        }
        Insert: {
          product_id: string
          model_id: string
        }
        Update: {
          product_id?: string
          model_id?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
          payment_method: 'cod' | 'bank_transfer'
          payment_status: 'pending' | 'paid' | 'failed'
          subtotal: number
          shipping: number
          total: number
          shipping_name: string
          shipping_email: string
          shipping_phone: string
          shipping_address: string
          shipping_city: string
          shipping_zip: string
          billing_same: boolean
          billing_name: string | null
          billing_address: string | null
          billing_city: string | null
          billing_zip: string | null
          billing_ico: string | null
          billing_dic: string | null
          note: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
          payment_method: 'cod' | 'bank_transfer'
          payment_status?: 'pending' | 'paid' | 'failed'
          subtotal: number
          shipping: number
          total: number
          shipping_name: string
          shipping_email: string
          shipping_phone: string
          shipping_address: string
          shipping_city: string
          shipping_zip: string
          billing_same?: boolean
          billing_name?: string | null
          billing_address?: string | null
          billing_city?: string | null
          billing_zip?: string | null
          billing_ico?: string | null
          billing_dic?: string | null
          note?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
          payment_method?: 'cod' | 'bank_transfer'
          payment_status?: 'pending' | 'paid' | 'failed'
          subtotal?: number
          shipping?: number
          total?: number
          shipping_name?: string
          shipping_email?: string
          shipping_phone?: string
          shipping_address?: string
          shipping_city?: string
          shipping_zip?: string
          billing_same?: boolean
          billing_name?: string | null
          billing_address?: string | null
          billing_city?: string | null
          billing_zip?: string | null
          billing_ico?: string | null
          billing_dic?: string | null
          note?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          name: string
          price: number
          quantity: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          name: string
          price: number
          quantity: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          name?: string
          price?: number
          quantity?: number
          created_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          quantity?: number
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          product_id: string
          rating: number
          title: string | null
          content: string | null
          is_approved: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          rating: number
          title?: string | null
          content?: string | null
          is_approved?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          rating?: number
          title?: string | null
          content?: string | null
          is_approved?: boolean
          created_at?: string
        }
      }
      wishlist: {
        Row: {
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          product_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          product_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      search_products: {
        Args: {
          search_query: string
        }
        Returns: {
          id: string
          name: string
          slug: string
          price: number
          original_price: number | null
          badge: string | null
          rating: number
          review_count: number
          category_name: string | null
          image_url: string | null
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
