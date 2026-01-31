// PR-related TypeScript types
export interface PR {
  number: number;
  title: string;
  description: string;
  state: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  htmlUrl: string;
  additions: number;
  deletions: number;
  changedFiles: number;
  baseBranch: string;
  headBranch: string;
}

export interface File {
  filename: string;
  status: 'added' | 'removed' | 'modified' | 'renamed';
  additions: number;
  deletions: number;
  changes: number;
  patch: string;
  blobUrl: string;
  rawUrl: string;
  previousFilename?: string;
}

export interface ReviewComment {
  id: number;
  author: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  path: string;
  line: number | null;
  originalLine: number;
  diffHunk: string;
  position: number;
  inReplyTo: number | null;
}

export interface IssueComment {
  id: number;
  author: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface PRMetadata {
  owner: string;
  repo: string;
  prNumber: number;
  fetchedAt: string;
}

export interface PRData {
  pr: PR;
  files: File[];
  reviewComments: ReviewComment[];
  issueComments: IssueComment[];
  metadata: PRMetadata;
}

export interface APIResponse {
  success: boolean;
  data?: PRData;
  error?: string;
}

// UI Types
export type DiffViewType = 'unified' | 'split';

export interface FileTreeNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileTreeNode[];
  file?: File; // Reference to the actual file data
}