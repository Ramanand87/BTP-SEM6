"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  AlertTriangle,
  BarChart3,
  Bell,
  FileText,
  Home,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Search,
  Settings,
  User,
  Users,
} from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "@/redux/features/authFeature"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export default function AdminNavbar() {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useDispatch()
  const userInfo = useSelector((state) => state.auth.userInfo)

  const handleLogout = () => {
    dispatch(logout())
    router.push("/login")
  }

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin/dashboard",
    },
    {
      label: "Registrations",
      icon: FileText,
      href: "/admin/registrations",
    },
    {
      label: "Progress Tracking",
      icon: ListChecks,
      href: "/admin/progress",
    },
    {
      label: "Concerns & Disputes",
      icon: AlertTriangle,
      href: "/admin/concerns",
    },
    {
      label: "Users",
      icon: Users,
      href: "/admin/users",
    }
 
  ]

  return (
    <header className="sticky  top-0 z-10 flex h-14 items-center justify-between border-b bg-white px-4 lg:px-6">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Home className="h-5 w-5 text-green-600" />
          <span className="text-lg">Farm Contract</span>
        </Link>

        {/* Sidebar Routes Rendered Horizontally */}
        <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
          {routes.map((route) => {
            const active = pathname === route.href
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md transition-all",
                  active
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
               
                {route.label}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="rounded-full">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full">
              <User className="h-4 w-4" />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              Admin
              <p className="text-xs font-normal text-muted-foreground">admin</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
