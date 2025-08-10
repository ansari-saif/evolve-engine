import { motion } from "framer-motion";
import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [headerVisible, setHeaderVisible] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <Header onVisibilityChange={setHeaderVisible} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`transition-all duration-300 ease-in-out ${
              headerVisible ? "pt-24" : "pt-6"
            } p-6`}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;