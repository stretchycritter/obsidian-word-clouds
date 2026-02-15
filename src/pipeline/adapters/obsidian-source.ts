import type { App, TFile } from 'obsidian';
import { normalizeTag } from '../../utils';
import type { PipelineDocument } from '../types';

export async function readPipelineDocuments(
  app: App,
  files: TFile[],
  readBatchSize: number,
  onProgress?: (message: string, percent: number) => void,
): Promise<PipelineDocument[]> {
  const documents: PipelineDocument[] = [];
  const totalFiles = Math.max(1, files.length);

  for (let batchStart = 0; batchStart < files.length; batchStart += readBatchSize) {
    const batch = files.slice(batchStart, batchStart + readBatchSize);
    const contents = await Promise.all(batch.map((file) => app.vault.cachedRead(file)));

    for (let index = 0; index < batch.length; index += 1) {
      const file = batch[index];
      const rawText = contents[index];
      const cache = app.metadataCache.getFileCache(file);
      const tags = getFileTags(app, file);
      const fileIndex = batchStart + index;

      onProgress?.(`Scanning ${fileIndex + 1}/${files.length} files...`, Math.round((fileIndex / totalFiles) * 75));

      documents.push({
        id: file.path,
        path: file.path,
        basename: file.basename,
        rawText,
        tags,
        frontmatter: cache?.frontmatter && typeof cache.frontmatter === 'object'
          ? { ...cache.frontmatter }
          : {},
      });
    }
  }

  return documents;
}

export function getFileTags(app: App, file: TFile): string[] {
  const cache = app.metadataCache.getFileCache(file);
  if (!cache) {
    return [];
  }

  const tagSet = new Set<string>();

  if (cache.tags) {
    for (const tagEntry of cache.tags) {
      const normalized = normalizeTag(tagEntry.tag);
      if (normalized) {
        tagSet.add(normalized);
      }
    }
  }

  for (const tag of extractFrontmatterTags(cache.frontmatter)) {
    const normalized = normalizeTag(tag);
    if (normalized) {
      tagSet.add(normalized);
    }
  }

  return [...tagSet];
}

function extractFrontmatterTags(frontmatter: Record<string, unknown> | null | undefined): string[] {
  if (!frontmatter || typeof frontmatter !== 'object') {
    return [];
  }

  const rawTags = frontmatter.tags ?? frontmatter.tag;
  if (typeof rawTags === 'string') {
    return rawTags.split(/[\s,]+/).filter((entry) => entry.length > 0);
  }

  if (Array.isArray(rawTags)) {
    return rawTags
      .filter((entry): entry is string => typeof entry === 'string')
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);
  }

  return [];
}
