"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Layers, ListTree, Package2, Tags, VariableIcon, ShoppingCart, Ticket, ImageIcon, Bell } from 'lucide-react'

const sidebarLinks = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Category", href: "/category", icon: Layers },
  { title: "Sub Category", href: "/sub-category", icon: ListTree },
  { title: "Brands", href: "/brands", icon: Package2 },
  { title: "Variant Type", href: "/variant-type", icon: Tags },
  { title: "Variants", href: "/variants", icon: VariableIcon },
  { title: "Orders", href: "/orders", icon: ShoppingCart },
  { title: "Coupons", href: "/coupons", icon: Ticket },
  { title: "Posters", href: "/posters", icon: ImageIcon },
  { title: "Notifications", href: "/notifications", icon: Bell }
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-[#1C1C25] text-white flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <Link href="/" className="flex items-center gap-2">
          <Package2 className="h-6 w-6 text-[#3C7EFF]" />
          <span className="font-semibold text-xl">Shop</span>
        </Link>
      </div>
      <nav className="flex-1 p-2">
        {sidebarLinks.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive 
                  ? "bg-[#3C7EFF] text-white" 
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.title}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

