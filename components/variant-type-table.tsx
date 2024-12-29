'use client'

import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { getVariantTypes, deleteVariantType, type VariantType } from '@/lib/actions'

export function VariantTypeTable() {
  const [variantTypes, setVariantTypes] = useState<VariantType[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    loadVariantTypes()
  }, [])

  async function loadVariantTypes() {
    try {
      setLoading(true)
      const data = await getVariantTypes()
      setVariantTypes(data)
    } catch (error) {
      console.error('Failed to load variant types:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteVariantType(id)
      setVariantTypes(variantTypes.filter(variantType => variantType.id !== id))
    } catch (error) {
      console.error('Failed to delete variant type:', error)
    }
    setDeleteId(null)
  }

  return (
    <>
      <div className="rounded-md border border-gray-800 bg-[#1C1C25]">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800">
              <TableHead>Variant Name</TableHead>
              <TableHead>Variant Type</TableHead>
              <TableHead>Added Date</TableHead>
              <TableHead>Edit</TableHead>
              <TableHead>Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variantTypes.map((variantType) => (
              <TableRow key={variantType.id} className="border-gray-800">
                <TableCell>{variantType.name}</TableCell>
                <TableCell>{variantType.type}</TableCell>
                <TableCell>{variantType.createdAt.toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setDeleteId(variantType.id)}
                  >
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {variantTypes.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No variant types found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-[#1C1C25] border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the variant type.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-800 hover:bg-gray-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

