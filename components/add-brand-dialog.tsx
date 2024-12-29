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
import { addBrand, getSubCategories, type SubCategory } from '@/lib/actions'

interface AddBrandDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddBrandDialog({ open, onOpenChange }: AddBrandDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])

  useEffect(() => {
    async function fetchSubCategories() {
      const data = await getSubCategories()
      setSubCategories(data)
    }
    fetchSubCategories()
  }, [])

  async function handleSubmit(formData: FormData) {
    try {
      setLoading(true)
      await addBrand(formData)
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error('Failed to add brand:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1C1C25] border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-center text-xl text-[#3C7EFF]">ADD BRAND</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Select name="subCategoryId" required>
              <SelectTrigger className="bg-[#1C1C25] border-gray-800">
                <SelectValue placeholder="Select Sub Category" />
              </SelectTrigger>
              <SelectContent className="bg-[#1C1C25] border-gray-800">
                {subCategories.map((subCategory) => (
                  <SelectItem key={subCategory.id} value={subCategory.id}>
                    {subCategory.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Input 
              name="name" 
              placeholder="Brand Name" 
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

