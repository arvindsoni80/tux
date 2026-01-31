// Main 3-pane layout
import { useState, ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface LayoutProps {
  leftPanel: ReactNode;
  centerPanel: ReactNode;
  rightPanel?: ReactNode;
}

export function Layout({ leftPanel, centerPanel, rightPanel }: LayoutProps) {
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);

  return (
    <div className="flex h-full overflow-hidden bg-[#0d1117]">
      {/* Left Panel */}
      <div
        className={`
          relative border-r border-[#30363d] bg-[#161b22] transition-all duration-300
          ${isLeftPanelOpen ? 'w-64' : 'w-0'}
        `}
      >
        {isLeftPanelOpen && (
          <div className="h-full overflow-hidden">
            {leftPanel}
          </div>
        )}
        
        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-4 z-10 h-6 w-6 rounded-full border border-[#30363d] bg-[#161b22] hover:bg-[#21262d]"
          onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
        >
          {isLeftPanelOpen ? (
            <ChevronLeft className="h-4 w-4 text-[#c9d1d9]" />
          ) : (
            <ChevronRight className="h-4 w-4 text-[#c9d1d9]" />
          )}
        </Button>
      </div>

      {/* Center Panel */}
      <div className="flex-1 overflow-hidden">
        {centerPanel}
      </div>

      {/* Right Panel (hidden for now) */}
      {rightPanel && (
        <div className="w-80 border-l border-[#30363d] bg-[#161b22]">
          {rightPanel}
        </div>
      )}
    </div>
  );
}