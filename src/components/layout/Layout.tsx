import { motion } from "framer-motion";
import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [headerVisible, setHeaderVisible] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onVisibilityChange={setHeaderVisible} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden" 
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <main className="flex-1 lg:ml-64">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`transition-all duration-300 ease-in-out ${
              headerVisible ? "pt-16 sm:pt-20 lg:pt-24" : "pt-3 sm:pt-4 lg:pt-6"
            } px-3 sm:px-4 lg:px-6 pb-20 lg:pb-6`}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;