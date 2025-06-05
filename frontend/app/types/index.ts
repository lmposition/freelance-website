export interface Tool {
  id: string
  slug: string
  name: string
  description: string
  url: string
  color: string
  category: Category
  featured?: boolean
  logo?: string
  tags?: string[]
  rating?: number
  reviewCount?: number
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  color: string
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: string
  publishedAt: string
  author: {
    name: string
    avatar?: string
  }
}