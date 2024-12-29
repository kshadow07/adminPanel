'use client'

import { useState, useEffect } from 'react'
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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { addProduct, getCategories, getSubCategories, getBrands, getVariantTypes, type Category, type SubCategory, type Brand, type VariantType } from '@/lib/actions'
import Image from 'next/image'

interface AddProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddProductDialog({ open, onOpenChange }: AddProductDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [variantTypes, setVariantTypes] = useState<VariantType[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  useEffect(() => {
    async function fetchData() {
      const [categoriesData, subCategoriesData, brandsData, variantTypesData] = await Promise.all([
        getCategories(),
        getSubCategories(),
        getBrands(),
        getVariantTypes()
      ])
      setCategories(categoriesData)
      setSubCategories(subCategoriesData)
      setBrands(brandsData)
      setVariantTypes(variantTypesData)
    }
    fetchData()
  }, [])

  const filteredSubCategories = subCategories.filter(
    sub => sub.categoryId === selectedCategory
  )

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
  }

  async function handleSubmit(formData: FormData) {
    try {
      setLoading(true)
      await addProduct(formData)
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error('Failed to add product:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleImageChange(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const newImages = [...images]
      newImages[index] = URL.createObjectURL(file)
      setImages(newImages)
    }
  }

  const imageLabels = ['Main image', 'Second image', 'Third image', 'Fourth image', 'Fifth image']

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-[#1C1C25] border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-center text-xl text-[#3C7EFF]">
            ADD PRODUCT
          </DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="grid gap-6 py-4">
          <div className="grid grid-cols-5 gap-4">
            {imageLabels.map((label, index) => (
              <div key={index} className="space-y-2">
                <div className="relative aspect-video bg-[#1C1C25] border-2 border-dashed border-gray-800 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#3C7EFF] transition-colors">
                  {images[index] ? (
                    <Image
                      src={images[index]}
                      alt={label}
                      fill
                      className="rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Camera className="w-8 h-8 text-gray-400" />
                      <span className="text-sm text-gray-400">{label}</span>
                    </div>
                  )}
                  <input
                    type="file"
                    name={`image${index + 1}`}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={(e) => handleImageChange(index, e)}
                  />
                </div>
              </div>
            ))}
          </div>

          <Input
            name="name"
            placeholder="Product Name"
            className="bg-[#1C1C25] border-gray-800 text-white"
            required
          />

          <Textarea
            name="description"
            placeholder="Product Description"
            className="bg-[#1C1C25] border-gray-800 text-white min-h-[100px]"
            required
          />

          <div className="grid grid-cols-3 gap-4">
            <Select name="category" onValueChange={handleCategoryChange} required>
              <SelectTrigger className="bg-[#1C1C25] border-gray-800">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-[#1C1C25] border-gray-800">
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select name="subCategory" required>
              <SelectTrigger className="bg-[#1C1C25] border-gray-800">
                <SelectValue placeholder="Sub category" />
              </SelectTrigger>
              <SelectContent className="bg-[#1C1C25] border-gray-800">
                {filteredSubCategories.map((subCategory) => (
                  <SelectItem key={subCategory.id} value={subCategory.id}>
                    {subCategory.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select name="brand" required>
              <SelectTrigger className="bg-[#1C1C25] border-gray-800">
                <SelectValue placeholder="Select Brand" />
              </SelectTrigger>
              <SelectContent className="bg-[#1C1C25] border-gray-800">
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              name="price"
              placeholder="Price"
              type="number"
              className="bg-[#1C1C25] border-gray-800 text-white"
              required
            />
            <Input
              name="offerPrice"
              placeholder="Offer price"
              type="number"
              className="bg-[#1C1C25] border-gray-800 text-white"
            />
            <Input
              name="quantity"
              placeholder="Quantity"
              type="number"
              className="bg-[#1C1C25] border-gray-800 text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select name="variantType">
              <SelectTrigger className="bg-[#1C1C25] border-gray-800">
                <SelectValue placeholder="Select Variant type" />
              </SelectTrigger>
              <SelectContent className="bg-[#1C1C25] border-gray-800">
                {variantTypes.map((variantType) => (
                  <SelectItem key={variantType.id} value={variantType.id}>
                    {variantType.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select name="variantItems">
              <SelectTrigger className="bg-[#1C1C25] border-gray-800">
                <SelectValue placeholder="Select Items" />
              </SelectTrigger>
              <SelectContent className="bg-[#1C1C25] border-gray-800">
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
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

