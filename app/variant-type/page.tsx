"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, RotateCcw } from 'lucide-react'
import { VariantTypeTable } from "@/components/variant-type-table"
import { AddVariantTypeDialog } from "@/components/add-variant-type-dialog"

export default function VariantTypePage() {
  const [open, setOpen] = useState(false)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Variants Type</h1>
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
        <div className="text-sm">All Variants Type</div>
        <VariantTypeTable />
      </div>
      <AddVariantTypeDialog open={open} onOpenChange={setOpen} />
    </div>
  )
}

