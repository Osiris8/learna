"use client";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import PromptInputWithActions from "@/components/dashboard-form";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";

export default function Page() {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <SiteHeader />

        <PromptInputWithActions />
      </SidebarInset>
    </SidebarProvider>
  );
}
