import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useMemo, Suspense, lazy } from "react";
import { AppProvider } from "@/contexts/AppContext";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { useWebSocket } from "@/hooks/useWebSocket";
import { WebSocketMessage } from "@/services/websocketService";
import { useAppContext } from "@/contexts/AppContext";
import { Skeleton } from "@/components/ui/skeleton";
import BottomTabBar from "@/components/layout/BottomTabBar";
import Header from "@/components/layout/Header";
import MenuBar from "@/components/navigation/MenuBar";
import { initPerformanceMonitoring } from "@/utils/performance";
import { performanceMonitor } from "@/utils/performance-monitoring";
import { useAiPreloading } from "@/hooks/use-ai-preloading";
import { useAdvancedCaching } from "@/hooks/use-advanced-caching";
import { createSkipLink } from "@/utils/accessibility";

// Lazy load pages for better performance
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Tasks = lazy(() => import("./pages/Tasks"));
const Goals = lazy(() => import("./pages/Goals"));
const Diary = lazy(() => import("./pages/Diary"));
const Statistics = lazy(() => import("./pages/Statistics"));
const Settings = lazy(() => import("./pages/Settings"));
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Chat = lazy(() => import("./pages/Chat"));
const ControlCenter = lazy(() => import("./pages/ControlCenter"));

// Loading component for Suspense fallback
const PageLoading = () => (
  <div className="space-y-4 p-4">
    <Skeleton className="h-8 w-1/3" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error: unknown) => {
        if (error?.response?.status >= 400 && error?.response?.status < 500) return false;
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});

// Inner App component that has access to AppContext
const AppContent = () => {
  const { userId, config } = useAppContext();

  // Initialize AI preloading
  useAiPreloading({
    enabled: true,
    idleDelay: 30000, // 30 seconds
    preloadTasks: true,
    preloadGoals: true,
  });

  // Initialize advanced caching
  useAdvancedCaching({
    prefetchRelated: true,
    keepFrequent: true,
    preloadNextPage: true,
    cachePreferences: true,
  });

  // Stable WebSocket config and options (don't recreate on every render)
  const webSocketConfig = useMemo(() => ({
    url: config.webSocketUrl + '/api/v1/ws',
    userId: userId,
    reconnectInterval: 5000,
    maxReconnectAttempts: 10
  }), [config.webSocketUrl, userId]);

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
      <a {...createSkipLink('main-content')} />
      <MenuBar />
      <Header />
      <main id="main-content" className="px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-24">
        <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route path="/welcome" element={<Index />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/diary" element={<Diary />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/control-center" element={<ControlCenter />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <BottomTabBar />
    </div>
  );
};

const App = () => {
  // Initialize performance monitoring
  useEffect(() => {
    initPerformanceMonitoring();
    performanceMonitor.trackWebVitals();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <ThemeProvider defaultTheme="dark">
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </AppProvider>
    </QueryClientProvider>
  );
};

export default App;
