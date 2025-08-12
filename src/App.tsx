import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";
import { WebSocketMessage } from "@/services/websocketService";
import { useAppConfig } from "@/hooks/redux/useAppConfig";
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

// Inner App component that has access to Redux store
const AppContent = () => {
  const { userId, webSocketUrl } = useAppConfig();

  // Stable WebSocket config and options (don't recreate on every render)
  const webSocketConfig = useMemo(() => ({
    url: webSocketUrl + '/api/v1/ws',
    userId: userId,
    reconnectInterval: 5000,
    maxReconnectAttempts: 10
  }), [webSocketUrl, userId]);

  const webSocketOptions = useMemo(() => ({
    onMessage: (message: WebSocketMessage) => {
      console.log('🔔 Global WebSocket message received:', message);
    },
    onConnect: () => {
      console.log('🟢 Global WebSocket connected successfully');
    },
    onDisconnect: () => {
      console.log('🔴 Global WebSocket disconnected');
    }
  }), []);

  // Global WebSocket connection
  const { isConnected, lastMessage } = useWebSocket(webSocketConfig, webSocketOptions);

  return (
    <div className="min-h-screen bg-background">
      <MenuBar />
      <Header />
      <main className="px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-24">
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
      </main>
      <BottomTabBar />
    </div>
  );
};

const App = () => {
  // Force dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
