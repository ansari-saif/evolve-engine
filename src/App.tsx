import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { AppProvider } from "@/contexts/AppContext";
import { useWebSocket } from "@/hooks/useWebSocket";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Goals from "./pages/Goals";
import Diary from "./pages/Diary";
import Statistics from "./pages/Statistics";
import Settings from "./pages/Settings";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Chat from "./pages/Chat";
import BottomTabBar from "@/components/layout/BottomTabBar";
import Header from "@/components/layout/Header";
import MenuBar from "@/components/navigation/MenuBar";

const queryClient = new QueryClient();

const App = () => {
  // Global WebSocket connection
  const { isConnected, lastMessage } = useWebSocket({
    url: 'ws://localhost:8000/api/v1/ws',
    userId: '123456789',
    reconnectInterval: 5000,
    maxReconnectAttempts: 10
  }, {
    onMessage: (message) => {
      console.log('🔔 Global WebSocket message received:', message);
    },
    onConnect: () => {
      console.log('🟢 Global WebSocket connected successfully');
    },
    onDisconnect: () => {
      console.log('🔴 Global WebSocket disconnected');
    }
  });

  // Force dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-background p-8 pb-24 pt-28">
              <MenuBar />
              <Header />
              <Routes>
                <Route path="/welcome" element={<Index />} />
                <Route path="/" element={<Dashboard />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/diary" element={<Diary />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/chat" element={<Chat />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <BottomTabBar />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
};

export default App;
