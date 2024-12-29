"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, RotateCcw } from 'lucide-react'
import { NotificationsTable } from "@/components/notifications-table"
import { SendNotificationDialog } from "@/components/send-notification-dialog"

export default function NotificationsPage() {
  const [open, setOpen] = useState(false)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Notification</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Send New
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        <div className="text-sm">All Notification</div>
        <NotificationsTable />
      </div>
      <SendNotificationDialog open={open} onOpenChange={setOpen} />
    </div>
  )
}

