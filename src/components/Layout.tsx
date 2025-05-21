// src/components/layout/Layout.tsx
import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, Package, Microscope as MicroscopeIcon, Settings,
  Menu, X, History, LogOut, Bell, Sun, Moon, Users, ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext"; // Sesuaikan path jika perlu
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

// --- NavItem Component ---
type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
};

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isActive, onClick }) => {
  return (
    <Link to={to} onClick={onClick} className="block">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start items-center gap-3 px-3 py-2.5 text-sm",
          "text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md",
          isActive && "bg-accent text-accent-foreground font-semibold"
        )}
      >
        {icon}
        <span className="flex-1 text-left">{label}</span>
      </Button>
    </Link>
  );
};

// --- Layout Component ---
interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  // Default sidebar terbuka di desktop, tertutup di mobile
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const { logout, user, isAuthenticated, isAdmin, isAslab, isStudent } = useAuth();

  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('labsys-darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('labsys-darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Update isMobile state on resize
  useEffect(() => {
    const handleResize = () => {
      const mobileCheck = window.innerWidth < 768;
      setIsMobile(mobileCheck);
      if (!mobileCheck && !sidebarOpen) { // Jika berubah ke desktop dan sidebar tadinya tertutup (karena mobile)
        setSidebarOpen(true); // Buka sidebar di desktop
      } else if (mobileCheck && sidebarOpen) { // Jika berubah ke mobile dan sidebar tadinya terbuka
        setSidebarOpen(false); // Tutup sidebar di mobile
      }
    };
    window.addEventListener('resize', handleResize);
    // Panggil sekali saat mount untuk set initial state
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []); // sidebarOpen tidak di dependency sini untuk mencegah loop


  // Menutup sidebar di mobile saat route berubah jika sidebar sedang terbuka
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile, sidebarOpen]);


  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = () => {
    logout();
    toast.success("Anda telah berhasil logout.");
    navigate("/login");
  };

  const navItems = useMemo(() => [
    { to: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" />, label: "Dashboard" },
    { to: "/inventory", icon: <Package className="h-4 w-4" />, label: "Inventaris" },
    { to: "/borrowing-history", icon: <History className="h-4 w-4" />, label: "Riwayat Pinjam" },
    { to: "/laboratories", icon: <MicroscopeIcon className="h-4 w-4" />, label: "Laboratorium" },
  ], []);

  const adminNavItems = useMemo(() => [
    { to: "/settings", icon: <Settings className="h-4 w-4" />, label: "Pengaturan" },
  ], []);

  const getAvatarFallback = () => {
    if (user?.name) {
      const nameParts = user.name.trim().split(" ");
      if (nameParts.length > 1) return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
      if (nameParts[0]?.length > 1) return nameParts[0].substring(0, 2).toUpperCase();
      return nameParts[0]?.[0]?.toUpperCase() || "U";
    }
    return user?.role ? user.role.substring(0,1).toUpperCase() : "U";
  };

  const getPageTitle = () => {
    const currentNavItem = [...navItems, ...adminNavItems].find(item => location.pathname.startsWith(item.to) && (item.to !== "/" || location.pathname === "/"));
    if (currentNavItem) return currentNavItem.label;
    if (location.pathname === "/" || location.pathname.startsWith("/dashboard")) return "Dashboard";
    const segments = location.pathname.split("/").filter(Boolean);
    const lastSegment = segments[segments.length -1];
    return lastSegment ? lastSegment.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) : "LabSys";
  };

  return (
    <div className="min-h-screen flex bg-muted/40 dark:bg-background text-foreground">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && isMobile && (
          <motion.div
            key="mobile-overlay"
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={cn(
          "bg-background border-r flex flex-col w-64 fixed inset-y-0 left-0 z-50 shadow-lg",
          "transition-transform duration-300 ease-in-out"
        )}
        animate={{ x: sidebarOpen ? 0 : "-100%" }}
        transition={{ type: "tween", duration: 0.3 }}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
            <div className="bg-primary p-2 rounded-md"><MicroscopeIcon className="h-6 w-6 text-primary-foreground" /></div>
            <span className="text-foreground">LabSys</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-muted-foreground">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3">
          {isAuthenticated && user && (
            <div className="px-1 py-3 mb-3 border-b">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10"><AvatarFallback>{getAvatarFallback()}</AvatarFallback></Avatar>
                <div>
                  <p className="text-sm font-medium line-clamp-1 text-foreground" title={user.name || undefined}>{user.name || "User"}</p>
                  <p className="text-xs text-muted-foreground">NPM: {user.npm || "N/A"}</p>
                </div>
              </div>
              <Badge variant={isAdmin || isAslab ? "secondary" : "outline"} className="mt-2 text-xs capitalize">{user.role}</Badge>
            </div>
          )}
          <nav className="grid items-start gap-1">
            {navItems.map(item => <NavItem key={item.to} {...item} isActive={location.pathname === item.to || (item.to === "/dashboard" && location.pathname === "/")} onClick={isMobile ? toggleSidebar : undefined}/>)}
            {isAdmin && adminNavItems.map(item => <NavItem key={item.to} {...item} isActive={location.pathname.startsWith(item.to)} onClick={isMobile ? toggleSidebar : undefined}/>)}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t space-y-2">
          {/* Tombol Dark Mode & Notif dipindah ke header utama */}
          <Button variant="destructive" className="w-full justify-center gap-2 text-sm" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" /><span>Logout</span>
          </Button>
          <p className="text-muted-foreground text-[10px] text-center pt-1">© {new Date().getFullYear()} LabSys</p>
        </div>
      </motion.aside>

      {/* Main Content Wrapper */}
      <div
        className={cn(
            "flex flex-1 flex-col transition-all duration-300 ease-in-out",
            // Di desktop, beri margin kiri jika sidebar terbuka
            // Di mobile, sidebar adalah overlay jadi tidak perlu margin
            !isMobile && sidebarOpen ? "md:ml-64" : "md:ml-0"
        )}
      >
        {/* Header untuk Main Content */}
        <header
          className={cn(
            "sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm sm:h-16 sm:px-6",
            "transition-all duration-300 ease-in-out" // Untuk animasi halus jika lebar berubah
          )}
        >
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-muted-foreground">
            <Menu className="h-5 w-5" /> <span className="sr-only">Toggle Sidebar</span>
          </Button>
          <div className="flex-1"><h1 className="font-semibold text-lg">{getPageTitle()}</h1></div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)} className="text-muted-foreground">
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="sr-only">Toggle Theme</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-muted-foreground">
                  <Bell className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel>Notifikasi</DropdownMenuLabel><DropdownMenuSeparator />
                <div className="p-2 text-center text-xs text-muted-foreground">Belum ada notifikasi.</div>
              </DropdownMenuContent>
            </DropdownMenu>
            {isAuthenticated && user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative flex items-center gap-2 p-1.5 rounded-full h-9 w-auto">
                    <Avatar className="h-7 w-7"><AvatarFallback className="text-xs">{getAvatarFallback()}</AvatarFallback></Avatar>
                    <span className="hidden sm:inline-block text-sm font-medium">{user.name?.split(' ')[0]}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:inline-block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal"><div className="flex flex-col space-y-1"><p className="text-sm font-medium leading-none">{user.name}</p><p className="text-xs leading-none text-muted-foreground">{user.email}</p></div></DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Pengaturan Profil</DropdownMenuItem>
                  {isStudent && (<DropdownMenuItem onClick={() => navigate('/borrowing-history')}>Peminjaman Saya</DropdownMenuItem>)}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive focus:text-destructive-foreground"><LogOut className="mr-2 h-4 w-4"/>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto bg-muted/20 dark:bg-background">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;