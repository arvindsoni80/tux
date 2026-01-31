import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { File, FileTreeNode } from '@/types/pr.types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get programming language from filename for syntax highlighting
 * Returns refractor-compatible language names
 */
export function getLanguageFromFilename(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  const languageMap: Record<string, string> = {
    // JavaScript/TypeScript
    'js': 'javascript',
    'jsx': 'jsx',
    'ts': 'typescript',
    'tsx': 'tsx',
    'mjs': 'javascript',
    'cjs': 'javascript',
    
    // Web
    'html': 'markup',
    'htm': 'markup',
    'xml': 'markup',
    'svg': 'markup',
    'css': 'css',
    'scss': 'scss',
    'sass': 'scss',
    'less': 'css',
    
    // Python
    'py': 'python',
    'pyw': 'python',
    
    // Java/Kotlin
    'java': 'java',
    'kt': 'java',
    'kts': 'java',
    
    // C-family
    'c': 'c',
    'h': 'c',
    'cpp': 'cpp',
    'cc': 'cpp',
    'cxx': 'cpp',
    'hpp': 'cpp',
    'cs': 'csharp',
    
    // Ruby
    'rb': 'ruby',
    'rake': 'ruby',
    
    // Go
    'go': 'go',
    
    // Rust
    'rs': 'rust',
    
    // PHP
    'php': 'php',
    
    // Shell
    'sh': 'bash',
    'bash': 'bash',
    'zsh': 'bash',
    
    // Config/Data
    'json': 'json',
    'yaml': 'yaml',
    'yml': 'yaml',
    'toml': 'toml',
    'md': 'markdown',
    'mdx': 'markdown',
    
    // Other
    'sql': 'sql',
    'graphql': 'graphql',
    'gql': 'graphql',
    'dockerfile': 'docker',
  };
  
  return extension ? (languageMap[extension] || 'text') : 'text';
}

/**
 * Build hierarchical file tree from flat file list
 */
export function buildFileTree(files: File[]): FileTreeNode[] {
  const root: FileTreeNode[] = [];
  
  files.forEach(file => {
    const parts = file.filename.split('/');
    let currentLevel = root;
    
    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      const path = parts.slice(0, index + 1).join('/');
      
      let existingNode = currentLevel.find(node => node.name === part);
      
      if (!existingNode) {
        const newNode: FileTreeNode = {
          name: part,
          path,
          type: isFile ? 'file' : 'folder',
          ...(isFile && { file }),
          ...(!isFile && { children: [] }),
        };
        currentLevel.push(newNode);
        existingNode = newNode;
      }
      
      if (!isFile && existingNode.children) {
        currentLevel = existingNode.children;
      }
    });
  });
  
  return sortFileTree(root);
}

/**
 * Sort file tree: folders first, then alphabetically
 */
function sortFileTree(nodes: FileTreeNode[]): FileTreeNode[] {
  return nodes.sort((a, b) => {
    // Folders before files
    if (a.type !== b.type) {
      return a.type === 'folder' ? -1 : 1;
    }
    // Alphabetical
    return a.name.localeCompare(b.name);
  }).map(node => {
    if (node.children) {
      return { ...node, children: sortFileTree(node.children) };
    }
    return node;
  });
}

/**
 * Format large numbers (e.g., 1234 -> "1.2k")
 */
export function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

/**
 * Get badge variant based on file status
 */
export function getStatusVariant(status: string): 'default' | 'success' | 'destructive' | 'outline' {
  switch (status) {
    case 'added':
      return 'success';
    case 'removed':
      return 'destructive';
    case 'modified':
      return 'outline';
    case 'renamed':
      return 'default';
    default:
      return 'outline';
  }
}

/**
 * Get status display text
 */
export function getStatusText(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}