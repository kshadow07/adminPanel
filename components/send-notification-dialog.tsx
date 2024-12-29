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
import { Textarea } from "@/components/ui/textarea"
import { addNotification } from '@/lib/actions'

interface SendNotificationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SendNotificationDialog({ open, onOpenChange }: SendNotificationDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    try {
      setLoading(true)
      await addNotification(formData)
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error('Failed to send notification:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1C1C25] border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-center text-xl text-[#3C7EFF]">SEND NOTIFICATION</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="grid gap-4 py-4">
          <Input 
            name="title"
            placeholder="Enter Notification Title ...." 
            className="bg-[#1C1C25] border-gray-800 text-white"
            required
          />
          <Textarea 
            name="description"
            placeholder="Enter Notification Description ...." 
            className="bg-[#1C1C25] border-gray-800 text-white min-h-[100px]"
            required
          />
          <Input 
            name="imageUrl"
            placeholder="Enter Notification Image Url ...." 
            className="bg-[#1C1C25] border-gray-800 text-white"
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
              {loading ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

