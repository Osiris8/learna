"use client";

import * as React from "react";
import { Github, MessageCircle } from "lucide-react";

import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import axios from "axios";

import Link from "next/link";
import { redirect } from "next/navigation";
import { NavFavorites } from "@/components/nav-favorites";
/*const data = {
  navSecondary: [
    {
      title: "Github",
      url: "https://github.com/Osiris8/learnable-backend",
      icon: Github,
    },
  ],
};*/

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
  });
  const [navMain, setNavMain] = useState<
    {
      id: number;
      title: string;
      url: string;
    }[]
  >([]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    axios
      .get("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
      .then((res) => {
        setUser(res.data.user);
      })
      .catch((err) => {
        console.error("Error to fetch data :", err);
        redirect("/");
      });

    axios
      .get("http://localhost:5000/api/navbar-summaries", {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((res) => {
        const formatted = res.data.map(
          (chat: { id: number; title: string }) => ({
            id: chat.id,
            title: chat.title,
            url: `/chat/${chat.id}`,
          })
        );
        setNavMain(formatted);
      })
      .catch((err) => {
        console.error("Error :", err);
      });
  }, []);

  const handleDelete = async (id: number) => {
    const storedToken = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/chat/${id}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      setNavMain((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleRename = async (id: number, newTitle: string) => {
    const storedToken = localStorage.getItem("token");
    try {
      const res = await axios.put(
        `http://localhost:5000/api/chat/${id}`,
        { title: newTitle },
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );

      setNavMain((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, title: res.data.title } : item
        )
      );
    } catch (err) {
      console.error("Erreur rename:", err);
    }
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Learna AI</span>
                </div>
              </a>
            </SidebarMenuButton>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <MessageCircle /> New Chat
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavFavorites
          favorites={navMain}
          onDelete={handleDelete}
          onRename={handleRename}
        />
       {/* <NavSecondary items={data.navSecondary} className="mt-auto text-4xl" />*/}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
