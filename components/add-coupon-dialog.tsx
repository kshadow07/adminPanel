'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { addCoupon, getCategories, getSubCategories, getProducts, type Category, type SubCategory, type Product } from '@/lib/actions'

interface AddCouponDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddCouponDialog({ open, onOpenChange }: AddCouponDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    async function fetchData() {
      const categoriesData = await getCategories()
      const subCategoriesData = await getSubCategories()
      const productsData = await getProducts()
      setCategories(categoriesData)
      setSubCategories(subCategoriesData)
      setProducts(productsData)
    }
    fetchData()
  }, [])

  async function handleSubmit(formData: FormData) {
    try {
      setLoading(true)
      await addCoupon(formData)
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error('Failed to add coupon:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1C1C25] border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-center text-xl text-[#3C7EFF]">ADD COUPON</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="grid gap-4 py-4">
          <Input 
            name="code" 
            placeholder="Coupon Code" 
            className="bg-[#1C1C25] border-gray-800 text-white"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Select name="discountType" required>
              <SelectTrigger className="bg-[#1C1C25] border-gray-800">
                <SelectValue placeholder="Discount Type" />
              </SelectTrigger>
              <SelectContent className="bg-[#1C1C25] border-gray-800">
                <SelectItem value="fixed">Fixed</SelectItem>
                <SelectItem value="percentage">Percentage</SelectItem>
              </SelectContent>
            </Select>
            <Select name="status" required>
              <SelectTrigger className="bg-[#1C1C25] border-gray-800">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-[#1C1C25] border-gray-800">
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Input 
            name="amount" 
            type="number" 
            placeholder="Discount Amount" 
            className="bg-[#1C1C25] border-gray-800 text-white"
            required
          />
          <Input 
            name="minPurchaseAmount" 
            type="number" 
            placeholder="Minimum Purchase Amount" 
            className="bg-[#1C1C25] border-gray-800 text-white"
            required
          />
          <Input 
            name="expiryDate" 
            type="date" 
            placeholder="Select Date" 
            className="bg-[#1C1C25] border-gray-800 text-white"
            required
          />
          <div className="grid grid-cols-3 gap-4">
            <Select name="categoryId">
              <SelectTrigger className="bg-[#1C1C25] border-gray-800">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-[#1C1C25] border-gray-800">
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select name="subCategoryId">
              <SelectTrigger className="bg-[#1C1C25] border-gray-800">
                <SelectValue placeholder="Select sub category" />
              </SelectTrigger>
              <SelectContent className="bg-[#1C1C25] border-gray-800">
                {subCategories.map((subCategory) => (
                  <SelectItem key={subCategory.id} value={subCategory.id}>
                    {subCategory.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select name="productId">
              <SelectTrigger className="bg-[#1C1C25] border-gray-800">
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent className="bg-[#1C1C25] border-gray-800">
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-800 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#3C7EFF] hover:bg-[#3C7EFF]/90"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Submit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

