"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@components/ui/sidebar"
import { Badge } from "@components/ui/badge"
import { Session } from "next-auth"


export function NavMain({
  user,
  items,
}: {
  user: Session["user"]
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    showFor?: string[]
    comingSoon?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const [isMounted, setIsMounted] = useState(false)
  const [openItems, setOpenItems] = useState<string[]>([])

  // Load state from localStorage on mount
  useEffect(() => {
    setIsMounted(true)
    const savedOpenItems = localStorage.getItem("nav-main-open-items")
    if (savedOpenItems) {
      setOpenItems(JSON.parse(savedOpenItems))
    } else {
      // Initialize with currently active items
      const activeItems = items
        .filter((item) => item.isActive)
        .map((item) => item.title)
      setOpenItems(activeItems)
    }
  }, [items])

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("nav-main-open-items", JSON.stringify(openItems))
  }, [openItems])

  const handleOpenChange = (itemTitle: string, isOpen: boolean) => {
    setOpenItems((prev) =>
      isOpen
        ? [...prev.filter((title) => title !== itemTitle), itemTitle]
        : prev.filter((title) => title !== itemTitle)
    )
  }

  return (

    <SidebarGroup>
      <SidebarMenu>
        {items
          .filter((item) => {
            // Si no hay restricción de roles, mostramos el ítem
            if (!item.showFor) return true;

            // Verificamos si el rol del usuario está en la lista de roles permitidos
            return item.showFor?.includes(user.role) || false;
          })
          .map((item) => (

            <Collapsible
              key={item.title}
              asChild
              open={isMounted ? openItems.includes(item.title) : false}
              onOpenChange={(isOpen) => handleOpenChange(item.title, isOpen)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title} asChild>
                    <Link href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      {item.comingSoon && (
                        <Badge variant="secondary" className="ml-auto text-xs ">
                          Próximamente
                        </Badge>
                      )}
                      { item?.items && <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" /> }
                    </Link>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                {item.items && (
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
