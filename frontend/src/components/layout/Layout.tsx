import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { AIChatDrawer } from '../ai/AIChatDrawer';
import { VoiceCFOOverlay } from '../ai/VoiceCFOOverlay';

export const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isVoiceCFOOpen, setIsVoiceCFOOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar
        onOpenAIChat={() => setIsAIChatOpen(true)}
        onOpenVoiceCFO={() => setIsVoiceCFOOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onOpenAIChat={() => setIsAIChatOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      <AIChatDrawer isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
      <VoiceCFOOverlay isOpen={isVoiceCFOOpen} onClose={() => setIsVoiceCFOOpen(false)} />
    </div>
  );
};
