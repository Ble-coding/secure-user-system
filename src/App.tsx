
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Users from "./pages/Users";
import Agents from "./pages/Agents";
import Parents from "./pages/Parents";
import Recuperators from "./pages/Recuperators";
import Children from "./pages/Children";
import Entries from "./pages/Entries";
import Chat from "./pages/Chat";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import MonCompte from "./pages/MonCompte";
import Roles from "./pages/Roles";
import QRCode from "./pages/QRCode";
import { DashboardLayout } from "./components/DashboardLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/users" element={
            <DashboardLayout>
              <Users />
            </DashboardLayout>
          } />
          <Route path="/agents" element={
            <DashboardLayout>
              <Agents />
            </DashboardLayout>
          } />
          <Route path="/parents" element={
            <DashboardLayout>
              <Parents />
            </DashboardLayout>
          } />
          <Route path="/recuperators" element={
            <DashboardLayout>
              <Recuperators />
            </DashboardLayout>
          } />
          <Route path="/children" element={
            <DashboardLayout>
              <Children />
            </DashboardLayout>
          } />
          <Route path="/entries" element={
            <DashboardLayout>
              <Entries />
            </DashboardLayout>
          } />
          <Route path="/chat" element={
            <DashboardLayout>
              <Chat />
            </DashboardLayout>
          } />
          <Route path="/mon-compte" element={
            <DashboardLayout>
              <MonCompte />
            </DashboardLayout>
          } />
          <Route path="/profile" element={
            <DashboardLayout>
              <MonCompte />
            </DashboardLayout>
          } />
          <Route path="/roles" element={
            <DashboardLayout>
              <Roles />
            </DashboardLayout>
          } />
          <Route path="/qrcode" element={
            <DashboardLayout>
              <QRCode />
            </DashboardLayout>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
