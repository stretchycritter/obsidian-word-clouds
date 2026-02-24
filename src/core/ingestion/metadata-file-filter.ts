import type { App, TFile } from 'obsidian';
import { normalizePath } from 'obsidian';
import type { SourceSelectionRules } from '@/settings/types';
import { compilePathPredicate } from '@/core/ingestion/filters/path-filter';
import { compileTagPredicate } from '@/core/ingestion/filters/tag-filter';
import { compileDatePredicate } from '@/core/ingestion/filters/date-filter';
import { compileFrontmatterPredicate } from '@/core/ingestion/filters/frontmatter-filter';
import { compileLinkPredicates } from '@/core/ingestion/filters/link-filter';

type FilePredicate = (file: TFile) => boolean;

export function filterSourceFilesByMetadata(app: App, files: TFile[], rules?: SourceSelectionRules): TFile[] {
  if (!rules) {
    return files;
  }

  const predicates = compilePredicates(app, rules);
  if (predicates.length === 0) {
    return files;
  }

  return files.filter((file) => predicates.every((predicate) => predicate(file)));
}

function compilePredicates(app: App, rules: SourceSelectionRules): FilePredicate[] {
  const predicates: FilePredicate[] = [];

  const scopePredicate = compileScopePredicate(rules);
  if (scopePredicate) {
    predicates.push(scopePredicate);
  }

  const pathPredicate = compilePathPredicate(rules);
  if (pathPredicate) {
    predicates.push(pathPredicate);
  }

  const tagPredicate = compileTagPredicate(app, rules);
  if (tagPredicate) {
    predicates.push(tagPredicate);
  }

  const frontmatterPredicate = compileFrontmatterPredicate(app, rules);
  if (frontmatterPredicate) {
    predicates.push(frontmatterPredicate);
  }

  const datePredicate = compileDatePredicate(rules);
  if (datePredicate) {
    predicates.push(datePredicate);
  }

  const { outgoing: outgoingLinkPredicate, incoming: incomingLinkPredicate } = compileLinkPredicates(app, rules);
  if (outgoingLinkPredicate) {
    predicates.push(outgoingLinkPredicate);
  }

  if (incomingLinkPredicate) {
    predicates.push(incomingLinkPredicate);
  }

  return predicates;
}

function compileScopePredicate(rules: SourceSelectionRules): FilePredicate | null {
  const mode = rules.scope?.mode ?? 'vault';
  if (mode === 'vault') {
    return null;
  }

  if (mode === 'active-file') {
    const activeFilePath = rules.scope?.activeFilePath?.trim() ?? '';
    return (file: TFile) => activeFilePath.length > 0 && file.path === activeFilePath;
  }

  const folderPaths = (rules.scope?.folderPaths ?? [])
    .map((path) => normalizePath(path.trim()))
    .filter((path) => path.length > 0);
  if (folderPaths.length === 0) {
    console.warn('[WordCloud] Scope mode is "folder" but no folder paths are configured. No files will be included.');
    return () => false;
  }

  return (file: TFile) => folderPaths.some((folderPath) => file.path === folderPath || file.path.startsWith(`${folderPath}/`));
}
