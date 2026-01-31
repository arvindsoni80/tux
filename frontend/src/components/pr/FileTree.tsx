// File navigation
import { useState } from 'react';
import { ChevronRight, ChevronDown, FileCode, Folder } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { File, FileTreeNode } from '@/types/pr.types';
import { buildFileTree, getStatusVariant, getStatusText } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface FileTreeProps {
  files: File[];
  onFileClick: (file: File) => void;
  selectedFile?: File;
}

export function FileTree({ files, onFileClick, selectedFile }: FileTreeProps) {
  const tree = buildFileTree(files);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[#30363d] px-4 py-3">
        <h2 className="text-sm font-semibold text-[#c9d1d9]">Files Changed</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {tree.map((node) => (
            <TreeNode
              key={node.path}
              node={node}
              onFileClick={onFileClick}
              selectedFile={selectedFile}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

interface TreeNodeProps {
  node: FileTreeNode;
  onFileClick: (file: File) => void;
  selectedFile?: File;
  depth?: number;
}

function TreeNode({ node, onFileClick, selectedFile, depth = 0 }: TreeNodeProps) {
  const [isOpen, setIsOpen] = useState(true);
  const isSelected = selectedFile?.filename === node.file?.filename;

  if (node.type === 'folder') {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center gap-1 rounded px-2 py-1 text-sm text-[#c9d1d9] hover:bg-[#21262d]"
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-[#8b949e]" />
          ) : (
            <ChevronRight className="h-4 w-4 text-[#8b949e]" />
          )}
          <Folder className="h-4 w-4 text-[#8b949e]" />
          <span>{node.name}</span>
        </button>
        {isOpen && node.children && (
          <div>
            {node.children.map((child) => (
              <TreeNode
                key={child.path}
                node={child}
                onFileClick={onFileClick}
                selectedFile={selectedFile}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // File node
  return (
    <button
      onClick={() => node.file && onFileClick(node.file)}
      className={cn(
        "flex w-full items-center gap-2 rounded px-2 py-1 text-sm hover:bg-[#21262d]",
        isSelected && "bg-[#238636]/20"
      )}
      style={{ paddingLeft: `${depth * 12 + 20}px` }}
    >
      <FileCode className="h-4 w-4 flex-shrink-0 text-[#8b949e]" />
      <span className="flex-1 truncate text-left text-[#c9d1d9]">{node.name}</span>
      <div className="flex items-center gap-1">
        <Badge 
          variant={getStatusVariant(node.file?.status || 'modified')}
          className="h-5 text-xs"
        >
          {getStatusText(node.file?.status || 'modified').charAt(0)}
        </Badge>
        {node.file && (
          <span className="text-xs text-[#8b949e]">
            <span className="text-[#3fb950]">+{node.file.additions}</span>
            {' '}
            <span className="text-[#f85149]">-{node.file.deletions}</span>
          </span>
        )}
      </div>
    </button>
  );
}