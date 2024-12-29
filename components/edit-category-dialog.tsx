'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { categoryApi } from '@/lib/api/categoryApi'
import Image from 'next/image'
import { toast } from "@/components/ui/use-toast"
import { Category } from './category-table'

interface EditCategoryDialogProps {
  category: Category
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditCategoryDialog({ category, open, onOpenChange, onSuccess }: EditCategoryDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string>(category.image || '')
  const [file, setFile] = useState<File | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const nameInput = form.elements.namedItem('name') as HTMLInputElement

    try {
      setLoading(true)
      await categoryApi.updateCategory(category.id, nameInput.value, category.image || '', file || undefined)
      onOpenChange(false)
      onSuccess()
      router.refresh()
      toast({
        title: "Success",
        description: "Category updated successfully",
      })
    } catch (error: any) {
      console.error('Failed to update category:', error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update category. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setFile(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1C1C25] border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-center text-xl text-[#3C7EFF]">
            EDIT CATEGORY
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="flex justify-center">
            <div className="relative w-[200px] h-[150px] bg-[#1C1C25] border-2 border-dashed border-gray-800 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#3C7EFF] transition-colors">
              <Image
                src={preview || '/placeholder.svg'}
                alt="Preview"
                fill
                className="rounded-lg object-cover"
              />
              <input
                type="file"
                name="image"
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>

          <Input
            name="name"
            defaultValue={category.name}
            className="bg-[#1C1C25] border-gray-800 text-white"
            required
          />

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
              {loading ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

