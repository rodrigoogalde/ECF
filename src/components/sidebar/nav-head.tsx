"use client"

import * as React from "react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@components/ui/sidebar"

import { GraduationCap } from "lucide-react"

export function NavHead() {

  return (
    <SidebarMenu>
      <SidebarMenuItem>
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
          
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
