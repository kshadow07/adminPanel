'use server'

import { revalidatePath } from 'next/cache'

// Types
export type Product = {
  id: string
  name: string
  description: string
  category: string
  subCategory: string
  brand: string
  price: number
  offerPrice: number
  quantity: number
  variantType: string
  variantItems: string[]
  images: string[]
  createdAt: Date
}

export type Category = {
  id: string
  name: string
  image: string
  createdAt: Date
}

export type SubCategory = {
  id: string
  name: string
  categoryId: string
  categoryName: string
  createdAt: Date
}

export type Brand = {
  id: string
  name: string
  subCategoryId: string
  subCategoryName: string
  createdAt: Date
}

export type VariantType = {
  id: string
  name: string
  type: string
  createdAt: Date
}

export type Coupon = {
  id: string
  code: string
  discountType: 'fixed' | 'percentage'
  amount: number
  minPurchaseAmount: number
  expiryDate: Date
  status: 'active' | 'inactive'
  categoryId?: string
  subCategoryId?: string
  productId?: string
  createdAt: Date
}

export type Poster = {
  id: string
  name: string
  image: string
  createdAt: Date
}

export type Notification = {
  id: string
  title: string
  description: string
  imageUrl?: string
  createdAt: Date
}

// In-memory storage (replace with your database)
let products: Product[] = []
let categories: Category[] = []
let subCategories: SubCategory[] = []
let brands: Brand[] = []
let variantTypes: VariantType[] = []
let coupons: Coupon[] = []
let posters: Poster[] = []
let notifications: Notification[] = []

// Default image placeholder
const DEFAULT_IMAGE = '/placeholder.svg?height=200&width=200'

// Helper function to revalidate all connected paths
function revalidateConnectedPaths() {
  revalidatePath('/')
  revalidatePath('/dashboard')
  revalidatePath('/category')
  revalidatePath('/sub-category')
  revalidatePath('/brands')
  revalidatePath('/variant-type')
  revalidatePath('/variants')
  revalidatePath('/coupons')
  revalidatePath('/posters')
  revalidatePath('/notifications')
}

// Product actions
export async function addProduct(formData: FormData) {
  const images = []
  for (let i = 1; i <= 5; i++) {
    const image = formData.get(`image${i}`) as File
    images.push(image?.size > 0 ? URL.createObjectURL(image) : DEFAULT_IMAGE)
  }

  const product: Product = {
    id: Math.random().toString(36).substring(7),
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    category: formData.get('category') as string,
    subCategory: formData.get('subCategory') as string,
    brand: formData.get('brand') as string,
    price: Number(formData.get('price')),
    offerPrice: Number(formData.get('offerPrice')),
    quantity: Number(formData.get('quantity')),
    variantType: formData.get('variantType') as string,
    variantItems: (formData.get('variantItems') as string).split(','),
    images,
    createdAt: new Date()
  }

  products.push(product)
  revalidateConnectedPaths()
  return { success: true, data: product }
}

export async function updateProduct(id: string, formData: FormData) {
  const index = products.findIndex(p => p.id === id)
  if (index === -1) return { success: false, error: 'Product not found' }

  const images = []
  for (let i = 1; i <= 5; i++) {
    const image = formData.get(`image${i}`) as File
    images.push(image?.size > 0 ? URL.createObjectURL(image) : products[index].images[i - 1] || DEFAULT_IMAGE)
  }

  products[index] = {
    ...products[index],
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    category: formData.get('category') as string,
    subCategory: formData.get('subCategory') as string,
    brand: formData.get('brand') as string,
    price: Number(formData.get('price')),
    offerPrice: Number(formData.get('offerPrice')),
    quantity: Number(formData.get('quantity')),
    variantType: formData.get('variantType') as string,
    variantItems: (formData.get('variantItems') as string).split(','),
    images
  }

  revalidateConnectedPaths()
  return { success: true, data: products[index] }
}

export async function deleteProduct(id: string) {
  const index = products.findIndex(p => p.id === id)
  if (index === -1) return { success: false, error: 'Product not found' }

  products.splice(index, 1)
  revalidateConnectedPaths()
  return { success: true }
}

// Category actions
export async function addCategory(formData: FormData) {
  const image = formData.get('image') as File
  const category: Category = {
    id: Math.random().toString(36).substring(7),
    name: formData.get('name') as string,
    image: image?.size > 0 ? URL.createObjectURL(image) : DEFAULT_IMAGE,
    createdAt: new Date()
  }

  categories.push(category)
  revalidateConnectedPaths()
  return { success: true, data: category }
}

export async function updateCategory(id: string, formData: FormData) {
  const index = categories.findIndex(c => c.id === id)
  if (index === -1) return { success: false, error: 'Category not found' }

  const image = formData.get('image') as File
  categories[index] = {
    ...categories[index],
    name: formData.get('name') as string,
    image: image?.size > 0 ? URL.createObjectURL(image) : categories[index].image
  }

  revalidateConnectedPaths()
  return { success: true, data: categories[index] }
}

export async function deleteCategory(id: string) {
  const index = categories.findIndex(c => c.id === id)
  if (index === -1) return { success: false, error: 'Category not found' }

  // Delete related sub-categories
  subCategories = subCategories.filter(sc => sc.categoryId !== id)
  
  categories.splice(index, 1)
  revalidateConnectedPaths()
  return { success: true }
}

// Sub Category actions
export async function addSubCategory(formData: FormData) {
  const categoryId = formData.get('categoryId') as string
  const category = categories.find(c => c.id === categoryId)
  if (!category) return { success: false, error: 'Category not found' }

  const subCategory: SubCategory = {
    id: Math.random().toString(36).substring(7),
    name: formData.get('name') as string,
    categoryId,
    categoryName: category.name,
    createdAt: new Date()
  }

  subCategories.push(subCategory)
  revalidateConnectedPaths()
  return { success: true, data: subCategory }
}

export async function updateSubCategory(id: string, formData: FormData) {
  const index = subCategories.findIndex(sc => sc.id === id)
  if (index === -1) return { success: false, error: 'Sub Category not found' }

  const categoryId = formData.get('categoryId') as string
  const category = categories.find(c => c.id === categoryId)
  if (!category) return { success: false, error: 'Category not found' }

  subCategories[index] = {
    ...subCategories[index],
    name: formData.get('name') as string,
    categoryId,
    categoryName: category.name
  }

  revalidateConnectedPaths()
  return { success: true, data: subCategories[index] }
}

export async function deleteSubCategory(id: string) {
  const index = subCategories.findIndex(sc => sc.id === id)
  if (index === -1) return { success: false, error: 'Sub Category not found' }

  // Delete related brands
  brands = brands.filter(b => b.subCategoryId !== id)
  
  subCategories.splice(index, 1)
  revalidateConnectedPaths()
  return { success: true }
}

// Brand actions
export async function addBrand(formData: FormData) {
  const subCategoryId = formData.get('subCategoryId') as string
  const subCategory = subCategories.find(sc => sc.id === subCategoryId)
  if (!subCategory) return { success: false, error: 'Sub Category not found' }

  const brand: Brand = {
    id: Math.random().toString(36).substring(7),
    name: formData.get('name') as string,
    subCategoryId,
    subCategoryName: subCategory.name,
    createdAt: new Date()
  }

  brands.push(brand)
  revalidateConnectedPaths()
  return { success: true, data: brand }
}

export async function updateBrand(id: string, formData: FormData) {
  const index = brands.findIndex(b => b.id === id)
  if (index === -1) return { success: false, error: 'Brand not found' }

  const subCategoryId = formData.get('subCategoryId') as string
  const subCategory = subCategories.find(sc => sc.id === subCategoryId)
  if (!subCategory) return { success: false, error: 'Sub Category not found' }

  brands[index] = {
    ...brands[index],
    name: formData.get('name') as string,
    subCategoryId,
    subCategoryName: subCategory.name
  }

  revalidateConnectedPaths()
  return { success: true, data: brands[index] }
}

export async function deleteBrand(id: string) {
  const index = brands.findIndex(b => b.id === id)
  if (index === -1) return { success: false, error: 'Brand not found' }

  brands.splice(index, 1)
  revalidateConnectedPaths()
  return { success: true }
}

// Variant Type actions
export async function addVariantType(formData: FormData) {
  const variantType: VariantType = {
    id: Math.random().toString(36).substring(7),
    name: formData.get('name') as string,
    type: formData.get('type') as string,
    createdAt: new Date()
  }

  variantTypes.push(variantType)
  revalidateConnectedPaths()
  return { success: true, data: variantType }
}

export async function updateVariantType(id: string, formData: FormData) {
  const index = variantTypes.findIndex(vt => vt.id === id)
  if (index === -1) return { success: false, error: 'Variant Type not found' }

  variantTypes[index] = {
    ...variantTypes[index],
    name: formData.get('name') as string,
    type: formData.get('type') as string
  }

  revalidateConnectedPaths()
  return { success: true, data: variantTypes[index] }
}

export async function deleteVariantType(id: string) {
  const index = variantTypes.findIndex(vt => vt.id === id)
  if (index === -1) return { success: false, error: 'Variant Type not found' }

  variantTypes.splice(index, 1)
  revalidateConnectedPaths()
  return { success: true }
}

// Coupon actions
export async function addCoupon(formData: FormData) {
  const coupon: Coupon = {
    id: Math.random().toString(36).substring(7),
    code: formData.get('code') as string,
    discountType: formData.get('discountType') as 'fixed' | 'percentage',
    amount: Number(formData.get('amount')),
    minPurchaseAmount: Number(formData.get('minPurchaseAmount')),
    expiryDate: new Date(formData.get('expiryDate') as string),
    status: formData.get('status') as 'active' | 'inactive',
    categoryId: formData.get('categoryId') as string,
    subCategoryId: formData.get('subCategoryId') as string,
    productId: formData.get('productId') as string,
    createdAt: new Date()
  }

  coupons.push(coupon)
  revalidateConnectedPaths()
  return { success: true, data: coupon }
}

export async function updateCoupon(id: string, formData: FormData) {
  const index = coupons.findIndex(c => c.id === id)
  if (index === -1) return { success: false, error: 'Coupon not found' }

  coupons[index] = {
    ...coupons[index],
    code: formData.get('code') as string,
    discountType: formData.get('discountType') as 'fixed' | 'percentage',
    amount: Number(formData.get('amount')),
    minPurchaseAmount: Number(formData.get('minPurchaseAmount')),
    expiryDate: new Date(formData.get('expiryDate') as string),
    status: formData.get('status') as 'active' | 'inactive',
    categoryId: formData.get('categoryId') as string,
    subCategoryId: formData.get('subCategoryId') as string,
    productId: formData.get('productId') as string
  }

  revalidateConnectedPaths()
  return { success: true, data: coupons[index] }
}

export async function deleteCoupon(id: string) {
  const index = coupons.findIndex(c => c.id === id)
  if (index === -1) return { success: false, error: 'Coupon not found' }

  coupons.splice(index, 1)
  revalidateConnectedPaths()
  return { success: true }
}

// Poster actions
export async function addPoster(formData: FormData) {
  const image = formData.get('image') as File
  const poster: Poster = {
    id: Math.random().toString(36).substring(7),
    name: formData.get('name') as string,
    image: image?.size > 0 ? URL.createObjectURL(image) : DEFAULT_IMAGE,
    createdAt: new Date()
  }

  posters.push(poster)
  revalidateConnectedPaths()
  return { success: true, data: poster }
}

export async function updatePoster(id: string, formData: FormData) {
  const index = posters.findIndex(p => p.id === id)
  if (index === -1) return { success: false, error: 'Poster not found' }

  const image = formData.get('image') as File
  posters[index] = {
    ...posters[index],
    name: formData.get('name') as string,
    image: image?.size > 0 ? URL.createObjectURL(image) : posters[index].image
  }

  revalidateConnectedPaths()
  return { success: true, data: posters[index] }
}

export async function deletePoster(id: string) {
  const index = posters.findIndex(p => p.id === id)
  if (index === -1) return { success: false, error: 'Poster not found' }

  posters.splice(index, 1)
  revalidateConnectedPaths()
  return { success: true }
}

// Notification actions
export async function addNotification(formData: FormData) {
  const notification: Notification = {
    id: Math.random().toString(36).substring(7),
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    imageUrl: formData.get('imageUrl') as string || undefined,
    createdAt: new Date()
  }

  notifications.push(notification)
  revalidateConnectedPaths()
  return { success: true, data: notification }
}

export async function updateNotification(id: string, formData: FormData) {
  const index = notifications.findIndex(n => n.id === id)
  if (index === -1) return { success: false, error: 'Notification not found' }

  notifications[index] = {
    ...notifications[index],
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    imageUrl: formData.get('imageUrl') as string || undefined
  }

  revalidateConnectedPaths()
  return { success: true, data: notifications[index] }
}

export async function deleteNotification(id: string) {
  const index = notifications.findIndex(n => n.id === id)
  if (index === -1) return { success: false, error: 'Notification not found' }

  notifications.splice(index, 1)
  revalidateConnectedPaths()
  return { success: true }
}

// Get functions
export async function getProducts() {
  return products
}

export async function getCategories() {
  return categories
}

export async function getSubCategories() {
  return subCategories
}

export async function getBrands() {
  return brands
}

export async function getVariantTypes() {
  return variantTypes
}

export async function getCoupons() {
  return coupons
}

export async function getPosters() {
  return posters
}

export async function getNotifications() {
  return notifications
}

