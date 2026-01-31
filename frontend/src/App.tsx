import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PRInput } from '@/components/pr/PRInput';
import { FileTree } from '@/components/pr/FileTree';
import { DiffViewer } from '@/components/diff/DiffViewer';
import { usePR } from '@/hooks/usePR';
import { File, DiffViewType } from '@/types/pr.types';
import { Loader2 } from 'lucide-react';

function App() {
  const { data, isLoading, error, fetchPR } = usePR();
  const [viewMode, setViewMode] = useState<DiffViewType>('unified');
  const [selectedFile, setSelectedFile] = useState<File | undefined>();

  // Debug: Log data when it arrives
  useEffect(() => {
    if (data) {
      console.log('=== FRONTEND RECEIVED DATA ===');
      console.log('Total files:', data.files.length);
      console.log('First file:', data.files[0]);
      console.log('First file patch (first 300 chars):', data.files[0]?.patch?.substring(0, 300));
      console.log('==============================');
    }
  }, [data]);

  const handleFileClick = (file: File) => {
    setSelectedFile(file);
  };

  return (
    <div className="h-screen flex flex-col bg-[#0d1117] text-[#c9d1d9]">
      {/* Top Bar */}
      <PRInput
        onFetch={fetchPR}
        isLoading={isLoading}
        data={data}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#58a6ff]" />
              <p className="mt-2 text-sm text-[#8b949e]">Fetching PR data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center">
            <div className="max-w-md rounded-lg border border-[#f85149] bg-[#f85149]/10 p-6 text-center">
              <h3 className="mb-2 text-lg font-semibold text-[#f85149]">Error</h3>
              <p className="text-sm text-[#c9d1d9]">{error.message}</p>
            </div>
          </div>
        ) : data ? (
          <Layout
            leftPanel={
              <FileTree
                files={data.files}
                onFileClick={handleFileClick}
                selectedFile={selectedFile}
              />
            }
            centerPanel={
              <DiffViewer
                files={data.files}
                reviewComments={data.reviewComments}
                viewMode={viewMode}
                selectedFile={selectedFile}
              />
            }
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h1 className="mb-2 text-3xl font-bold text-[#c9d1d9]">
                🎩 Welcome to Tux
              </h1>
              <p className="text-[#8b949e]">
                Enter a GitHub PR URL above to get started
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;