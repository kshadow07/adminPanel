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
import { getSubCategories, deleteSubCategory, type SubCategory } from '@/lib/actions'

export function SubCategoryTable() {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    loadSubCategories()
  }, [])

  async function loadSubCategories() {
    try {
      setLoading(true)
      const data = await getSubCategories()
      setSubCategories(data)
    } catch (error) {
      console.error('Failed to load sub categories:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteSubCategory(id)
      setSubCategories(subCategories.filter(subCategory => subCategory.id !== id))
    } catch (error) {
      console.error('Failed to delete sub category:', error)
    }
    setDeleteId(null)
  }

  return (
    <>
      <div className="rounded-md border border-gray-800 bg-[#1C1C25]">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800">
              <TableHead>SubCategory Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Added Date</TableHead>
              <TableHead>Edit</TableHead>
              <TableHead>Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subCategories.map((subCategory) => (
              <TableRow key={subCategory.id} className="border-gray-800">
                <TableCell>{subCategory.name}</TableCell>
                <TableCell>{subCategory.categoryName}</TableCell>
                <TableCell>{subCategory.createdAt.toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setDeleteId(subCategory.id)}
                  >
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {subCategories.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No sub categories found
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
              This action cannot be undone. This will permanently delete the
              sub category and all related brands.
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

