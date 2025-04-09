// components/SidebarNavigation.jsx
import { Button } from "@/components/ui/button";
import { LayoutList, PieChart, PlusCircle, LogIn, LogOut } from "lucide-react";

export default function SidebarNavigation({ activePage, setActivePage, onAddRisk, onLogin, onLogout, isAuthenticated }) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-6">Navigation</h2>
        <nav className="space-y-2">
          <Button 
            variant={activePage === 'list' ? 'default' : 'ghost'} 
            onClick={() => setActivePage('list')} 
            className="w-full justify-start"
          >
            <LayoutList className="mr-2 h-5 w-5" /> Risk List
          </Button>
          <Button 
            variant={activePage === 'analytics' ? 'default' : 'ghost'} 
            onClick={() => setActivePage('analytics')} 
            className="w-full justify-start"
          >
            <PieChart className="mr-2 h-5 w-5" /> Analytics
          </Button>
        </nav>
        <div className="mt-6">
          <Button onClick={onAddRisk} className="w-full">
            <PlusCircle className="mr-2 h-5 w-5" /> Add Risk
          </Button>
        </div>
      </div>
      <div>
        {isAuthenticated ? (
          <Button onClick={onLogout} variant="outline" className="w-full">
            <LogOut className="mr-2 h-5 w-5" /> Logout
          </Button>
        ) : (
          <Button onClick={onLogin} variant="outline" className="w-full">
            <LogIn className="mr-2 h-5 w-5" /> Login
          </Button>
        )}
      </div>
    </aside>
  );
}