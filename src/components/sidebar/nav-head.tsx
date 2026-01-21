"use client"

import * as React from "react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@components/ui/sidebar"
import Link from "next/link"
import { GraduationCap } from "lucide-react"
import { ROUTES } from "@/lib/config/routes"

export function NavHead() {

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Link href={ROUTES.HOME}>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div className="bg-sidebar-primary flex aspect-square size-8 items-center justify-center rounded-lg">
              <GraduationCap className="size-4 text-primary-foreground" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <h1 className="text-xl font-semibold tracking-tighter">ECF</h1>
            </div>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
