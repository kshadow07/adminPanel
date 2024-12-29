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
import { categoryApi } from '@/lib/api/categoryApi'
import { EditCategoryDialog } from './edit-category-dialog'
import Image from 'next/image'
import { toast } from "@/components/ui/use-toast"

export type Category = {
  id: string;
  name: string;
  image: string | null;
  created_at: string;
  updated_at: string;
  sub_categories: Array<{
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
    category_id: string;
  }>;
};

export function CategoryTable() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editCategory, setEditCategory] = useState<Category | null>(null)

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    try {
      setLoading(true)
      const response = await categoryApi.getCategories()
      console.log('Fetched categories:', response)
      if (response && response.success && Array.isArray(response.data)) {
        setCategories(response.data)
      } else {
        console.error('Unexpected data structure:', response)
        setCategories([])
      }
    } catch (error) {
      console.error('Failed to load categories:', error)
      toast({
        title: "Error",
        description: "Failed to load categories. Please try again.",
        variant: "destructive",
      })
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await categoryApi.deleteCategory(id)
      setCategories(categories.filter(category => category.id !== id))
      toast({
        title: "Success",
        description: "Category deleted successfully",
      })
    } catch (error: any) {
      console.error('Failed to delete category:', error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete category. Please try again.",
        variant: "destructive",
      })
    }
    setDeleteId(null)
  }

  return (
    <>
      <div className="rounded-md border border-gray-800 bg-[#1C1C25]">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800">
              <TableHead>Image</TableHead>
              <TableHead>Category Name</TableHead>
              <TableHead>Added Date</TableHead>
              <TableHead>Edit</TableHead>
              <TableHead>Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id} className="border-gray-800">
                <TableCell>
                  <div className="relative h-10 w-10">
                    <Image
                      src={category.image || '/placeholder.svg'}
                      alt={category.name}
                      fill
                      className="rounded-md object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{new Date(category.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setEditCategory(category)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setDeleteId(category.id)}
                  >
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {categories.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No categories found
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
              category and all related sub-categories.
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

      {editCategory && (
        <EditCategoryDialog
          category={editCategory}
          open={!!editCategory}
          onOpenChange={(open) => !open && setEditCategory(null)}
          onSuccess={loadCategories}
        />
      )}
    </>
  )
}

