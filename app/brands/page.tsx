"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, RotateCcw } from 'lucide-react'
import { BrandsTable } from "@/components/brands-table"
import { AddBrandDialog } from "@/components/add-brand-dialog"

export default function BrandsPage() {
  const [open, setOpen] = useState(false)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Brands</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        <div className="text-sm">All Brands</div>
        <BrandsTable />
      </div>
      <AddBrandDialog open={open} onOpenChange={setOpen} />
    </div>
  )
}

