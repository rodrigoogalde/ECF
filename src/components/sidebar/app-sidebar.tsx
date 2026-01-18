"use client"

import * as React from "react"
import {
  ChevronLeft,
} from "lucide-react"

import { NavHead } from "./nav-head"
import { NavMain } from "@components/sidebar/nav-main"
import { NavUser } from "@components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarTrigger,
  SidebarProvider
} from "@components/ui/sidebar"
import { NavFooter } from "./nav-footer"
import { useRouter } from "next/navigation";
import { Button } from "../ui/button"
import { config } from "./sidebar-config"
import Link from "next/link"
import { useIsMobile } from "@/hooks/use-mobile"
import { Session } from "next-auth"


export function AppSidebar({
    user,
    children,
    ...props
}: React.ComponentProps<typeof Sidebar> & { user: Session["user"] }) {
    const router = useRouter();
    const isMobile = useIsMobile();
    return (
        <SidebarProvider>
            <Sidebar collapsible="icon" variant="inset" {...props}>
                <SidebarHeader>
                    <NavHead />
                </SidebarHeader>
                <SidebarContent>
                    { !user && <Button asChild><Link href="/login">Iniciar sesión</Link></Button> }
                    { user && <NavMain items={config.navMain} user={user} /> }
                    <NavFooter items={config.navFooter} className="mt-auto" />
                </SidebarContent>
                <SidebarFooter>
                    { user && <NavUser user={user} /> }
                </SidebarFooter>
            </Sidebar>
            <SidebarInset className="flex-1 min-w-0">
                <header className="flex h-16 shrink-0 items-center transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center  px-4">
                        <SidebarTrigger className="-ml-1" />
                        {!isMobile ? (
                            <Button variant="link" onClick={() => router.back()} className="text-foreground gap-1">
                                <ChevronLeft />Volver
                            </Button>
                        ) : <span className="text-lg font-semibold tracking-tighter mx-2">SurgiSkills</span>}
                    </div>
                </header>
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}
