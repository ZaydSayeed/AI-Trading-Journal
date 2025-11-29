import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

interface PageWrapperProps {
  children: ReactNode;
  showTopbar?: boolean;
}

export function PageWrapper({ children, showTopbar = true }: PageWrapperProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Sidebar />
      
      <div className="ml-64 min-h-screen">
        {showTopbar && <Topbar />}
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

