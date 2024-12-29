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
import { addPoster } from '@/lib/actions'
import Image from 'next/image'

interface AddPosterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddPosterDialog({ open, onOpenChange }: AddPosterDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string>('')

  async function handleSubmit(formData: FormData) {
    try {
      setLoading(true)
      await addPoster(formData)
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error('Failed to add poster:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1C1C25] border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-center text-xl text-[#3C7EFF]">ADD POSTER</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="grid gap-6 py-4">
          <div className="flex justify-center">
            <div className="relative w-[300px] h-[200px] bg-[#1C1C25] border-2 border-dashed border-gray-800 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#3C7EFF] transition-colors">
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
                  <span className="text-sm text-gray-400">Poster</span>
                </div>
              )}
              <input
                type="file"
                name="image"
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
            </div>
          </div>
          <Input 
            name="name" 
            placeholder="Poster Name" 
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

