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

interface AddCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AddCategoryDialog({ open, onOpenChange, onSuccess }: AddCategoryDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const nameInput = form.elements.namedItem('name') as HTMLInputElement

    try {
      setLoading(true)
      const response = await categoryApi.createCategory(nameInput.value, file || undefined)
      console.log('Category created:', response)
      onOpenChange(false)
      onSuccess()
      router.refresh()
      toast({
        title: "Success",
        description: "Category added successfully",
      })
    } catch (error: any) {
      console.error('Failed to add category:', error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add category. Please try again.",
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
            ADD CATEGORY
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="flex justify-center">
            <div className="relative w-[200px] h-[150px] bg-[#1C1C25] border-2 border-dashed border-gray-800 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#3C7EFF] transition-colors">
              {preview ? (
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="rounded-lg object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Camera className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-400">Category Image</span>
                </div>
              )}
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
            placeholder="Category Name"
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
              {loading ? 'Adding...' : 'Submit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

