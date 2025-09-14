import { DashboardSidebar } from "@/components/dashboard-sidebar";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import Chat from "@/components/chat";

export default function Page() {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <SiteHeader />

        <Chat />
      </SidebarInset>
    </SidebarProvider>
  );
}
