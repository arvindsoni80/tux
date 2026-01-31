// Input for PR URL
import { useState, FormEvent } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, FileText, Plus, Minus, MessageSquare } from 'lucide-react';
import { PRData, DiffViewType } from '@/types/pr.types';

interface PRInputProps {
  onFetch: (url: string) => void;
  isLoading: boolean;
  data?: PRData;
  viewMode: DiffViewType;
  onViewModeChange: (mode: DiffViewType) => void;
}

export function PRInput({ onFetch, isLoading, data, viewMode, onViewModeChange }: PRInputProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onFetch(url.trim());
    }
  };

  return (
    <div className="border-b border-[#30363d] bg-[#161b22] px-4 py-3">
      <div className="flex items-center gap-4">
        {/* Left: Input and Fetch Button */}
        <form onSubmit={handleSubmit} className="flex flex-1 items-center gap-2">
          <div className="flex-1 max-w-2xl">
            <Input
              type="text"
              placeholder="Enter GitHub PR URL (e.g., https://github.com/facebook/react/pull/28000)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
              className="bg-[#0d1117] border-[#30363d] text-[#c9d1d9] placeholder:text-[#8b949e]"
            />
          </div>
          <Button 
            type="submit" 
            disabled={isLoading || !url.trim()}
            className="bg-[#238636] hover:bg-[#2ea043] text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Fetching...
              </>
            ) : (
              'Fetch PR'
            )}
          </Button>
        </form>

        {/* Right: Stats and View Toggle */}
        {data && (
          <div className="flex items-center gap-4">
            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-[#8b949e]">
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span className="text-[#c9d1d9]">{data.files.length}</span>
                <span>files</span>
              </div>
              <div className="flex items-center gap-1 text-[#3fb950]">
                <Plus className="h-3 w-3" />
                <span>{data.pr.additions}</span>
              </div>
              <div className="flex items-center gap-1 text-[#f85149]">
                <Minus className="h-3 w-3" />
                <span>{data.pr.deletions}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span className="text-[#c9d1d9]">
                  {data.reviewComments.length + data.issueComments.length}
                </span>
                <span>comments</span>
              </div>
            </div>

            {/* View Mode Toggle */}
            <Tabs value={viewMode} onValueChange={(v) => onViewModeChange(v as DiffViewType)}>
              <TabsList className="bg-[#0d1117]">
                <TabsTrigger value="unified" className="data-[state=active]:bg-[#238636]">
                  Unified
                </TabsTrigger>
                <TabsTrigger value="split" className="data-[state=active]:bg-[#238636]">
                  Split
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}