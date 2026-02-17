import type { App, TFile } from 'obsidian';
import type { SourceSelectionRules } from '../pipeline/types';
import { compilePathPredicate } from './filters/path-filter';
import { compileTagPredicate } from './filters/tag-filter';
import { compileDatePredicate } from './filters/date-filter';
import { compileFrontmatterPredicate } from './filters/frontmatter-filter';
import { compileIncomingLinkPredicate, compileOutgoingLinkPredicate } from './filters/link-filter';

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

  const outgoingLinkPredicate = compileOutgoingLinkPredicate(app, rules);
  if (outgoingLinkPredicate) {
    predicates.push(outgoingLinkPredicate);
  }

  const incomingLinkPredicate = compileIncomingLinkPredicate(app, rules);
  if (incomingLinkPredicate) {
    predicates.push(incomingLinkPredicate);
  }

  return predicates;
}
