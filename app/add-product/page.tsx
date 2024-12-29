"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Camera } from 'lucide-react'
import { Button } from "@/components/ui/button"
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

export default function AddProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [variantTypes, setVariantTypes] = useState<VariantType[]>([])

  useEffect(() => {
    async function fetchData() {
      const categoriesData = await getCategories()
      const subCategoriesData = await getSubCategories()
      const brandsData = await getBrands()
      const variantTypesData = await getVariantTypes()
      setCategories(categoriesData)
      setSubCategories(subCategoriesData)
      setBrands(brandsData)
      setVariantTypes(variantTypesData)
    }
    fetchData()
  }, [])

  async function handleSubmit(formData: FormData) {
    try {
      setLoading(true)
      await addProduct(formData)
      router.push('/')
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

  return (
    <div className="p-6">
      <div className="rounded-lg border border-gray-800 bg-[#1C1C25]">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-center text-[#3C7EFF] mb-6">ADD PRODUCT</h2>
          <form action={handleSubmit} className="grid gap-6">
            <div className="grid grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="relative aspect-[4/3] bg-[#1C1C25] border-2 border-dashed border-gray-800 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#3C7EFF] transition-colors">
                    {images[i] ? (
                      <Image
                        src={images[i]}
                        alt={`Product image ${i + 1}`}
                        fill
                        className="rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Camera className="w-8 h-8 text-gray-400" />
                        <span className="text-sm text-gray-400">
                          {i === 0 ? 'Main image' : 
                           i === 1 ? 'Second image' : 
                           i === 2 ? 'Third image' : 
                           i === 3 ? 'Fourth image' : 'Fifth image'}
                        </span>
                      </div>
                    )}
                    <input 
                      type="file" 
                      name={`image${i + 1}`}
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      accept="image/*"
                      onChange={(e) => handleImageChange(i, e)}
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
              <Select name="category" required>
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
                  {subCategories.map((subCategory) => (
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

              <Input
                name="variantItems"
                placeholder="Select Items"
                className="bg-[#1C1C25] border-gray-800 text-white"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
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
        </div>
      </div>
    </div>
  )
}

