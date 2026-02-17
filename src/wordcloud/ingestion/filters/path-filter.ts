import type { SourceSelectionRules } from '../../pipeline/types';
import type { TFile } from 'obsidian';

type FilePredicate = (file: TFile) => boolean;

export function compilePathPredicate(rules: SourceSelectionRules): FilePredicate | null {
  const pathRules = rules.pathRules;
  if (!pathRules) {
    return null;
  }

  const folderPrefixes = (pathRules.folderPrefixes ?? []).map((prefix) => prefix.trim()).filter(Boolean);
  const exactFolders = new Set((pathRules.exactFolders ?? []).map((folder) => folder.trim()).filter(Boolean));
  const subfolderRoots = (pathRules.subfolderRoots ?? []).map((root) => root.trim()).filter(Boolean);
  const filenameEquals = new Set((pathRules.filenameEquals ?? []).map((name) => name.trim().toLowerCase()).filter(Boolean));
  const extensionSet = new Set((pathRules.extensions ?? [])
    .map((extension) => extension.trim().replace(/^\./, '').toLowerCase())
    .filter(Boolean));

  let filenameRegex: RegExp | null = null;
  const regexSource = pathRules.filenameRegex?.trim();
  if (regexSource) {
    try {
      filenameRegex = new RegExp(regexSource, 'i');
    } catch {
      filenameRegex = null;
    }
  }

  const hasConstraints = folderPrefixes.length > 0
    || exactFolders.size > 0
    || subfolderRoots.length > 0
    || filenameEquals.size > 0
    || extensionSet.size > 0
    || filenameRegex !== null;
  if (!hasConstraints) {
    return null;
  }

  return (file: TFile) => {
    const parentFolder = getParentFolder(file.path);

    if (folderPrefixes.length > 0 && !folderPrefixes.some((prefix) => file.path.startsWith(prefix))) {
      return false;
    }

    if (exactFolders.size > 0 && !exactFolders.has(parentFolder)) {
      return false;
    }

    if (subfolderRoots.length > 0 && !subfolderRoots.some((root) => isInSubfolder(file.path, root))) {
      return false;
    }

    if (filenameEquals.size > 0) {
      const normalizedBasename = file.basename.toLowerCase();
      const normalizedName = file.name.toLowerCase();
      if (!filenameEquals.has(normalizedBasename) && !filenameEquals.has(normalizedName)) {
        return false;
      }
    }

    if (filenameRegex && !filenameRegex.test(file.basename)) {
      return false;
    }

    if (extensionSet.size > 0) {
      const extension = file.extension.replace(/^\./, '').toLowerCase();
      if (!extensionSet.has(extension)) {
        return false;
      }
    }

    return true;
  };
}

function getParentFolder(path: string): string {
  const separatorIndex = path.lastIndexOf('/');
  if (separatorIndex < 0) {
    return '';
  }

  return path.slice(0, separatorIndex);
}

function isInSubfolder(path: string, root: string): boolean {
  if (!root) {
    return false;
  }

  if (!path.startsWith(`${root}/`)) {
    return false;
  }

  const relativePath = path.slice(root.length + 1);
  return relativePath.includes('/');
}
