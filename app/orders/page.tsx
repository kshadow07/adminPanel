"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RotateCcw } from 'lucide-react'
import { OrdersTable } from "@/components/orders-table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function OrdersPage() {
  const [status, setStatus] = useState<string>("all")

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <div className="flex items-center gap-2">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter Order By Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All order</SelectItem>
              <SelectItem value="pending">pending</SelectItem>
              <SelectItem value="processing">processing</SelectItem>
              <SelectItem value="shipped">shipped</SelectItem>
              <SelectItem value="delivered">delivered</SelectItem>
              <SelectItem value="cancelled">cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        <div className="text-sm">My Orders</div>
        <OrdersTable status={status} />
      </div>
    </div>
  )
}

