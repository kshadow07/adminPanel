'use client'

import { useState } from 'react'
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
import { addVariantType } from '@/lib/actions'

interface AddVariantTypeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddVariantTypeDialog({ open, onOpenChange }: AddVariantTypeDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    try {
      setLoading(true)
      await addVariantType(formData)
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error('Failed to add variant type:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1C1C25] border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-center text-xl text-[#3C7EFF]">ADD VARIANT TYPE</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input 
              name="name" 
              placeholder="Variant Name" 
              className="bg-[#1C1C25] border-gray-800 text-white"
              required
            />
          </div>
          <div className="grid gap-2">
            <Select name="type" required>
              <SelectTrigger className="bg-[#1C1C25] border-gray-800">
                <SelectValue placeholder="Variant Type" />
              </SelectTrigger>
              <SelectContent className="bg-[#1C1C25] border-gray-800">
                <SelectItem value="size">Size</SelectItem>
                <SelectItem value="color">Color</SelectItem>
                <SelectItem value="material">Material</SelectItem>
                <SelectItem value="style">Style</SelectItem>
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

