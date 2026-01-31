import React, { useRef, useEffect } from 'react';
import { parseDiff, Diff, Hunk } from 'react-diff-view';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { File, ReviewComment, DiffViewType } from '@/types/pr.types';
import { getStatusVariant, getStatusText } from '@/lib/utils';
import 'react-diff-view/style/index.css';

interface DiffViewerProps {
  files: File[];
  reviewComments: ReviewComment[];
  viewMode: DiffViewType;
  selectedFile?: File;
  onFileInView?: (file: File) => void;
}

export function DiffViewer({ files, reviewComments, viewMode, selectedFile, onFileInView }: DiffViewerProps) {
  const fileRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Scroll to selected file
  useEffect(() => {
    if (selectedFile) {
      const element = fileRefs.current.get(selectedFile.filename);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [selectedFile]);

  if (files.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-[#8b949e]">
        <div className="text-center">
          <p className="text-lg">No files to display</p>
          <p className="text-sm">Enter a PR URL above to get started</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full bg-[#0d1117]">
      <div className="p-4">
        {files.map((file) => (
          <FileDiff
            key={file.filename}
            file={file}
            reviewComments={reviewComments.filter(c => c.path === file.filename)}
            viewMode={viewMode}
            ref={(el) => {
              if (el) {
                fileRefs.current.set(file.filename, el);
              }
            }}
          />
        ))}
      </div>
    </ScrollArea>
  );
}

interface FileDiffProps {
  file: File;
  reviewComments: ReviewComment[];
  viewMode: DiffViewType;
}

const FileDiff = React.forwardRef<HTMLDivElement, FileDiffProps>(
  ({ file, reviewComments, viewMode }, ref) => {
    // Skip files without patches (e.g., binary files)
    if (!file.patch || file.patch.trim() === '') {
      return (
        <div ref={ref} className="mb-6 overflow-hidden rounded-lg border border-[#30363d]">
          <div className="flex items-center justify-between border-b border-[#30363d] bg-[#161b22] px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-[#c9d1d9]">{file.filename}</span>
              <Badge variant={getStatusVariant(file.status)}>
                {getStatusText(file.status)}
              </Badge>
            </div>
            <span className="text-sm text-[#8b949e]">Binary file or no changes</span>
          </div>
        </div>
      );
    }

    let parsedDiff;
    
    try {
      // parseDiff expects diff in unified format with headers
      const diffText = file.patch.includes('diff --git') 
        ? file.patch 
        : `diff --git a/${file.filename} b/${file.filename}\n--- a/${file.filename}\n+++ b/${file.filename}\n${file.patch}`;
      
      const parsedDiffs = parseDiff(diffText);
      
      if (!parsedDiffs || parsedDiffs.length === 0) {
        throw new Error('No diffs parsed');
      }
      parsedDiff = parsedDiffs[0];
      
      // Validate parsedDiff has required properties
      if (!parsedDiff.hunks || !Array.isArray(parsedDiff.hunks)) {
        throw new Error('Invalid diff structure - missing hunks');
      }
    } catch (error) {
      console.error('Error parsing diff for', file.filename, error);
      return (
        <div ref={ref} className="mb-6 overflow-hidden rounded-lg border border-[#30363d]">
          <div className="flex items-center justify-between border-b border-[#30363d] bg-[#161b22] px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-[#c9d1d9]">{file.filename}</span>
              <Badge variant={getStatusVariant(file.status)}>
                {getStatusText(file.status)}
              </Badge>
            </div>
            <span className="text-sm text-[#f85149]">Error parsing diff</span>
          </div>
          <div className="bg-[#0d1117] p-4 text-sm text-[#8b949e]">
            Unable to display diff. Error: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        </div>
      );
    }

    return (
      <div ref={ref} className="mb-6 overflow-hidden rounded-lg border border-[#30363d]">
        {/* File Header */}
        <div className="flex items-center justify-between border-b border-[#30363d] bg-[#161b22] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-[#c9d1d9]">{file.filename}</span>
            <Badge variant={getStatusVariant(file.status)}>
              {getStatusText(file.status)}
            </Badge>
            {file.previousFilename && (
              <span className="text-xs text-[#8b949e]">
                from {file.previousFilename}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[#3fb950]">+{file.additions}</span>
            <span className="text-[#f85149]">-{file.deletions}</span>
          </div>
        </div>

        {/* Diff Content */}
        <div className="bg-[#0d1117]">
          <Diff
            viewType={viewMode}
            diffType={parsedDiff.type}
            hunks={parsedDiff.hunks}
            gutterType={viewMode === 'unified' ? 'default' : 'default'}
          >
            {(hunks) =>
              hunks.map((hunk) => (
                <Hunk key={hunk.content} hunk={hunk} />
              ))
            }
          </Diff>
        </div>

        {/* Comments Section */}
        {reviewComments.length > 0 && (
          <div className="border-t border-[#30363d] bg-[#161b22] p-4">
            <h4 className="mb-2 text-sm font-semibold text-[#c9d1d9]">
              Comments ({reviewComments.length})
            </h4>
            <div className="space-y-2">
              {reviewComments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded border border-[#30363d] bg-[#0d1117] p-3"
                >
                  <div className="mb-1 flex items-center gap-2 text-xs text-[#8b949e]">
                    <span className="font-semibold text-[#c9d1d9]">{comment.author}</span>
                    <span>•</span>
                    <span>Line {comment.line || comment.originalLine}</span>
                  </div>
                  <p className="text-sm text-[#c9d1d9]">{comment.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

FileDiff.displayName = 'FileDiff';