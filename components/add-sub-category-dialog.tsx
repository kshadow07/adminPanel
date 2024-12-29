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
import { addSubCategory, getCategories, type Category } from '@/lib/actions'

interface AddSubCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddSubCategoryDialog({ open, onOpenChange }: AddSubCategoryDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    async function fetchCategories() {
      const data = await getCategories()
      setCategories(data)
    }
    fetchCategories()
  }, [])

  async function handleSubmit(formData: FormData) {
    try {
      setLoading(true)
      await addSubCategory(formData)
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error('Failed to add sub category:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1C1C25] border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-center text-xl text-[#3C7EFF]">ADD SUB CATEGORY</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Select name="categoryId" required>
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
          </div>
          <div className="grid gap-2">
            <Input 
              name="name" 
              placeholder="Sub Category Name" 
              className="bg-[#1C1C25] border-gray-800 text-white"
              required
            />
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

