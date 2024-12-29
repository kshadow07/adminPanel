import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Package2, Clock, CheckCircle2, XCircle, Truck, PackageCheck } from 'lucide-react'

const orderStatuses = [
  {
    title: "All Orders",
    count: "0 Files",
    icon: Package2,
    color: "text-primary"
  },
  {
    title: "Pending Orders",
    count: "0 Files",
    icon: Clock,
    color: "text-yellow-500"
  },
  {
    title: "Processed Orders",
    count: "0 Files",
    icon: CheckCircle2,
    color: "text-green-500"
  },
  {
    title: "Cancelled Orders",
    count: "0 Files",
    icon: XCircle,
    color: "text-red-500"
  },
  {
    title: "Shipped Orders",
    count: "0 Files",
    icon: Truck,
    color: "text-blue-500"
  },
  {
    title: "Delivered Orders",
    count: "0 Files",
    icon: PackageCheck,
    color: "text-green-500"
  }
]

export function OrderStatus() {
  return (
    <div className="w-[300px]">
      <Card>
        <CardHeader>
          <CardTitle>Orders Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {orderStatuses.map((status) => {
            const Icon = status.icon
            return (
              <div
                key={status.title}
                className="flex items-center justify-between p-2 rounded-lg border"
              >
                <div className="flex items-center gap-2">
                  <Icon className={cn("h-4 w-4", status.color)} />
                  <span className="text-sm font-medium">{status.title}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {status.count}
                </span>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}

