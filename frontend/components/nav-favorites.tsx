"use client";

import { FolderPen, MoreHorizontal, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { usePathname } from "next/navigation";

export function NavFavorites({
  favorites,
  onDelete,
  onRename,
}: {
  favorites: {
    id: number;
    title: string;
    url: string;
  }[];
  onDelete: (id: number) => void;
  onRename: (id: number, newTitle: string) => void;
}) {
  const { isMobile } = useSidebar();
  const pathname = usePathname();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Chats</SidebarGroupLabel>
      <SidebarMenu>
        {favorites.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton asChild isActive={pathname === item.url}>
              <Link href={item.url}>
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()} // ⬅️ Empêche la fermeture du dropdown
                    >
                      <FolderPen className="text-muted-foreground" />
                      <span>Rename</span>
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Rename the chat</DialogTitle>
                      <DialogDescription>Give a new title</DialogDescription>
                    </DialogHeader>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const newTitle = formData.get("title") as string;
                        onRename(item.id, newTitle);
                      }}
                    >
                      <Input
                        name="title"
                        defaultValue={item.title}
                        className="mt-2"
                      />
                      <DialogFooter className="mt-4">
                        <Button type="submit">Save</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                <DropdownMenuSeparator />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Trash2 className="text-muted-foreground" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm deletion</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action will permanently delete this chat. Are you
                        sure you want to continue?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(item.id)}
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
