import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, BookOpen, Tag, Home, LogOut, ExternalLink, Newspaper, Phone, MessageSquareQuote, MessageSquare } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const items = [
  { url: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { url: "/admin/cursos", label: "Cursos", icon: BookOpen },
  { url: "/admin/categorias", label: "Categorias", icon: Tag },
  { url: "/admin/home", label: "Página inicial", icon: Home },
  { url: "/admin/blog", label: "Blog", icon: Newspaper },
  { url: "/admin/depoimentos", label: "Depoimentos", icon: MessageSquareQuote },
  { url: "/admin/popups", label: "Pop-ups", icon: MessageSquare },
  { url: "/admin/contato", label: "Contato", icon: Phone },
];

const AdminLayout = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/30">
        <Sidebar>
          <SidebarHeader className="border-b px-4 py-4">
            <h1 className="font-display text-lg font-bold">Admin Marinho Educacional</h1>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Gerenciar</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => {
                    const active = item.end ? pathname === item.url : pathname.startsWith(item.url);
                    return (
                      <SidebarMenuItem key={item.url}>
                        <SidebarMenuButton asChild isActive={active}>
                          <NavLink to={item.url} end={item.end} className="flex items-center gap-2">
                            <item.icon className="h-4 w-4" />
                            <span>{item.label}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t p-2">
            <Button variant="ghost" size="sm" asChild className="w-full justify-start">
              <a href="/" target="_blank" rel="noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" /> Ver site
              </a>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start text-destructive hover:text-destructive">
              <LogOut className="mr-2 h-4 w-4" /> Sair
            </Button>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-1 flex-col">
          <header className="flex h-14 items-center gap-2 border-b bg-background px-4">
            <SidebarTrigger />
            <span className="text-sm font-medium text-muted-foreground">Painel administrativo</span>
          </header>
          <main className={cn("flex-1 overflow-auto p-4 md:p-6")}>
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
