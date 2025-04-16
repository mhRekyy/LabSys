
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Package, 
  Microscope, 
  Tags, 
  Settings, 
  Menu, 
  X,
  History,
  LogOut,
  Search,
  ChevronRight,
  Bell,
  Sun,
  Moon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  notifications?: number;
};

const NavItem = ({ to, icon, label, isActive, notifications }: NavItemProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link to={to}>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 px-4 py-6 text-sidebar-foreground hover:bg-sidebar-accent/20 transition-all relative rounded-xl",
            isActive && "bg-sidebar-accent/30 font-semibold"
          )}
        >
          <div className={cn(
            "p-2 rounded-lg",
            isActive ? "bg-sidebar-primary/20" : "bg-sidebar-primary/10"
          )}>
            {icon}
          </div>
          <span>{label}</span>
          {notifications && (
            <Badge className="absolute right-3 top-3 bg-red-500">{notifications}</Badge>
          )}
          {isActive && (
            <motion.div 
              className="absolute left-0 top-0 bottom-0 w-1 bg-sidebar-primary rounded-full"
              layoutId="activeNavIndicator"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </Button>
      </Link>
    </motion.div>
  );
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { logout, studentNpm } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navItems = [
    { to: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" />, label: "Dashboard", notifications: 2 },
    { to: "/inventory", icon: <Package className="h-5 w-5" />, label: "Inventory" },
    { to: "/borrowing-history", icon: <History className="h-5 w-5" />, label: "Borrowing History" },
    { to: "/laboratories", icon: <Microscope className="h-5 w-5" />, label: "Laboratories", notifications: 1 },
    { to: "/categories", icon: <Tags className="h-5 w-5" />, label: "Categories" },
    { to: "/settings", icon: <Settings className="h-5 w-5" />, label: "Settings" },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Mobile Header */}
      <div className="md:hidden bg-sidebar py-4 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-sidebar-primary/20 p-2 rounded-lg">
            <Microscope className="h-6 w-6 text-sidebar-primary" />
          </div>
          <h1 className="text-sidebar-foreground text-xl font-bold">LabSys</h1>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="text-sidebar-foreground hover:bg-sidebar-accent/20 h-9 w-9"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Sidebar for mobile (overlay) */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={toggleSidebar}></div>
      )}
      
      {/* Sidebar */}
      <motion.div 
        className={cn(
          "bg-sidebar flex-shrink-0 flex flex-col w-full md:w-72 fixed md:sticky top-0 h-screen z-50 transition-all duration-300 ease-in-out shadow-lg",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : (window.innerWidth < 768 ? -300 : 0) }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <motion.div 
              className="bg-gradient-to-br from-blue-500 to-purple-600 p-2.5 rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Microscope className="h-6 w-6 text-white" />
            </motion.div>
            <h1 className="text-sidebar-foreground text-xl font-bold">LabSys</h1>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="md:hidden text-sidebar-foreground hover:bg-sidebar-accent/20"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-sidebar-primary/30 transition-all hover:border-sidebar-primary cursor-pointer">
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-700 text-white text-base">
                {studentNpm ? studentNpm.substring(0, 2) : "ST"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sidebar-foreground font-medium">Student</p>
              <p className="text-sidebar-foreground/70 text-sm">NPM: {studentNpm || "N/A"}</p>
            </div>
          </div>
          
          <div className="mt-4 relative">
            <Input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-9 bg-sidebar-accent/10 border-sidebar-border placeholder:text-sidebar-foreground/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-sidebar-foreground/70" />
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isActive={location.pathname === item.to || (item.to === "/dashboard" && location.pathname === "/")}
              notifications={item.notifications}
            />
          ))}
        </nav>
        
        <div className="p-4 border-t border-sidebar-border space-y-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-sidebar-foreground hover:bg-sidebar-accent/20"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? (
                <><Sun className="h-4 w-4 mr-2" /> Light Mode</>
              ) : (
                <><Moon className="h-4 w-4 mr-2" /> Dark Mode</>
              )}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5 text-sidebar-foreground" />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-56 overflow-y-auto">
                  <DropdownMenuItem className="cursor-pointer flex flex-col items-start">
                    <div className="font-medium">Equipment due for return</div>
                    <p className="text-xs text-muted-foreground">Microscope #M102 is due today</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer flex flex-col items-start">
                    <div className="font-medium">New equipment available</div>
                    <p className="text-xs text-muted-foreground">Physics Lab has added new oscilloscopes</p>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <Button 
            variant="default" 
            className="w-full justify-start gap-2 bg-red-500 hover:bg-red-600"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </Button>
          
          <div className="pt-2 border-t border-sidebar-border/50">
            <p className="text-sidebar-foreground/50 text-xs">
              © 2025 LabSys - Laboratory Information System
            </p>
          </div>
        </div>
      </motion.div>
      
      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden min-h-screen transition-all duration-300">
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between px-6 py-3 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-1 text-lg font-medium">
              {location.pathname === "/" || location.pathname === "/dashboard" ? (
                "Dashboard"
              ) : location.pathname.split("/")[1].charAt(0).toUpperCase() + location.pathname.split("/")[1].slice(1).replace(/-/g, " ")}
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-56 overflow-y-auto">
                  <DropdownMenuItem className="cursor-pointer flex flex-col items-start">
                    <div className="font-medium">Equipment due for return</div>
                    <p className="text-xs text-muted-foreground">Microscope #M102 is due today</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer flex flex-col items-start">
                    <div className="font-medium">New equipment available</div>
                    <p className="text-xs text-muted-foreground">Physics Lab has added new oscilloscopes</p>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative flex items-center gap-2" size="sm">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {studentNpm ? studentNpm.substring(0, 2) : "ST"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline-block">Student</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Borrowed Equipment
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-500" onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="container py-6 px-4 md:px-6 max-w-7xl mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
