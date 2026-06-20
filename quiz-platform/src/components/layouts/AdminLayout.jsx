import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Navbar } from './Navbar';
import { AdminSidebar } from './AdminSidebar';
import { Menu } from 'lucide-react';

export const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[--color-bg]">
      <Navbar />
      <div className="flex max-w-7xl mx-auto px-4 sm:px-6">
        <AdminSidebar
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />
        <main className="flex-1 py-8 lg:pl-8 min-w-0">
          <div className="lg:hidden mb-4">
            <button
              className="flex items-center gap-2 text-sm font-medium text-dark-600 dark:text-dark-400"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={18} /> Menu
            </button>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
