import type { App, TFile } from 'obsidian';
import type { TagMatchMode } from '../../../types';
import type { LinkRules, SourceSelectionRules } from '../../pipeline/types';
import { getFileTags } from '../obsidian-source';
import { normalizeTag } from '../../../utils';

type FilePredicate = (file: TFile) => boolean;

type LinkIndex = {
  targetsBySource: Map<string, string[]>;
  totalBySource: Map<string, number>;
  sourcesByTarget: Map<string, string[]>;
  totalByTarget: Map<string, number>;
};

export function compileOutgoingLinkPredicate(app: App, rules: SourceSelectionRules): FilePredicate | null {
  const constraints = normalizeLinkRules(rules.outgoingLinks);
  if (!constraints) {
    return null;
  }

  const linkIndex = buildLinkIndex(app);
  const tagCache = new Map<string, Set<string>>();

  return (file: TFile) => {
    const linkedTargets = linkIndex.targetsBySource.get(file.path) ?? [];
    const totalLinkCount = linkIndex.totalBySource.get(file.path) ?? 0;

    if (!matchesLinkConstraints(app, linkedTargets, totalLinkCount, constraints, tagCache)) {
      return false;
    }

    return true;
  };
}

export function compileIncomingLinkPredicate(app: App, rules: SourceSelectionRules): FilePredicate | null {
  const constraints = normalizeLinkRules(rules.incomingLinks);
  if (!constraints) {
    return null;
  }

  const linkIndex = buildLinkIndex(app);
  const tagCache = new Map<string, Set<string>>();

  return (file: TFile) => {
    const sourcePaths = linkIndex.sourcesByTarget.get(file.path) ?? [];
    const totalLinkCount = linkIndex.totalByTarget.get(file.path) ?? 0;

    if (!matchesLinkConstraints(app, sourcePaths, totalLinkCount, constraints, tagCache)) {
      return false;
    }

    return true;
  };
}

type NormalizedLinkRules = {
  filePaths: Set<string>;
  folderPrefixes: string[];
  minCount?: number;
  maxCount?: number;
  withTags: string[];
  tagMatchMode: TagMatchMode;
};

function normalizeLinkRules(rules: LinkRules | undefined): NormalizedLinkRules | null {
  if (!rules) {
    return null;
  }

  const filePaths = new Set((rules.filePaths ?? []).map((path) => path.trim()).filter(Boolean));
  const folderPrefixes = (rules.folderPrefixes ?? []).map((prefix) => prefix.trim()).filter(Boolean);
  const withTags = (rules.withTags ?? []).map((tag) => normalizeTag(tag)).filter(Boolean);

  const minCount = Number.isFinite(rules.minCount) ? Math.max(0, Number(rules.minCount)) : undefined;
  const maxCount = Number.isFinite(rules.maxCount) ? Math.max(0, Number(rules.maxCount)) : undefined;

  const hasConstraints = filePaths.size > 0
    || folderPrefixes.length > 0
    || minCount !== undefined
    || maxCount !== undefined
    || withTags.length > 0;
  if (!hasConstraints) {
    return null;
  }

  return {
    filePaths,
    folderPrefixes,
    minCount,
    maxCount,
    withTags,
    tagMatchMode: rules.tagMatchMode === 'all' ? 'all' : 'any',
  };
}

function buildLinkIndex(app: App): LinkIndex {
  const targetsBySource = new Map<string, string[]>();
  const totalBySource = new Map<string, number>();
  const sourcesByTarget = new Map<string, string[]>();
  const totalByTarget = new Map<string, number>();

  const resolvedLinks = app.metadataCache.resolvedLinks ?? {};
  for (const [sourcePath, destinations] of Object.entries(resolvedLinks)) {
    const targetPaths = Object.keys(destinations);
    targetsBySource.set(sourcePath, targetPaths);

    let totalOutgoing = 0;
    for (const [targetPath, count] of Object.entries(destinations)) {
      const safeCount = Number.isFinite(count) ? Math.max(0, count) : 0;
      totalOutgoing += safeCount;

      const currentSources = sourcesByTarget.get(targetPath) ?? [];
      if (!currentSources.includes(sourcePath)) {
        currentSources.push(sourcePath);
        sourcesByTarget.set(targetPath, currentSources);
      }
      totalByTarget.set(targetPath, (totalByTarget.get(targetPath) ?? 0) + safeCount);
    }

    totalBySource.set(sourcePath, totalOutgoing);
  }

  return {
    targetsBySource,
    totalBySource,
    sourcesByTarget,
    totalByTarget,
  };
}

function matchesLinkConstraints(
  app: App,
  linkedPaths: string[],
  totalLinkCount: number,
  rules: NormalizedLinkRules,
  tagCache: Map<string, Set<string>>,
): boolean {
  if (rules.minCount !== undefined && totalLinkCount < rules.minCount) {
    return false;
  }

  if (rules.maxCount !== undefined && totalLinkCount > rules.maxCount) {
    return false;
  }

  if (rules.filePaths.size > 0 && !linkedPaths.some((path) => rules.filePaths.has(path))) {
    return false;
  }

  if (rules.folderPrefixes.length > 0 && !linkedPaths.some((path) => isPathInFolder(path, rules.folderPrefixes))) {
    return false;
  }

  if (rules.withTags.length > 0 && !linkedPaths.some((path) => linkedFileMatchesTags(app, path, rules, tagCache))) {
    return false;
  }

  return true;
}

function linkedFileMatchesTags(
  app: App,
  path: string,
  rules: NormalizedLinkRules,
  tagCache: Map<string, Set<string>>,
): boolean {
  const file = asTFile(app.vault.getAbstractFileByPath(path));
  if (!file) {
    return false;
  }

  let tags = tagCache.get(path);
  if (!tags) {
    tags = new Set(getFileTags(app, file));
    tagCache.set(path, tags);
  }

  if (rules.tagMatchMode === 'all') {
    return rules.withTags.every((tag) => tags.has(tag));
  }

  return rules.withTags.some((tag) => tags.has(tag));
}

function isPathInFolder(path: string, folders: string[]): boolean {
  return folders.some((folder) => path === folder || path.startsWith(`${folder}/`));
}

function asTFile(value: unknown): TFile | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  if (!('path' in value) || !('basename' in value) || !('extension' in value) || !('stat' in value)) {
    return null;
  }

  return value as TFile;
}
