import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/user-nav"

export function Header() {
  return (
    <header className="border-b border-gray-800 bg-[#1C1C25]">
      <div className="flex h-16 items-center px-4 gap-4">
        <div className="flex-1">
          <form className="w-full max-w-sm">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full pl-8 bg-[#1C1C25] border-gray-800"
              />
            </div>
          </form>
        </div>
        <UserNav />
      </div>
    </header>
  )
}

