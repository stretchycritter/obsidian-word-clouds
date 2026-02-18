import type { DateRangeRule, SourceSelectionRules } from '@/settings/types';
import type { TFile } from 'obsidian';

type FilePredicate = (file: TFile) => boolean;

export function compileDatePredicate(rules: SourceSelectionRules): FilePredicate | null {
  const hasModifiedRule = hasDateRule(rules.modifiedTime);
  const hasCreatedRule = hasDateRule(rules.createdTime);
  if (!hasModifiedRule && !hasCreatedRule) {
    return null;
  }

  return (file: TFile) => {
    if (hasModifiedRule && !matchesDateRule(file.stat.mtime, rules.modifiedTime)) {
      return false;
    }

    if (hasCreatedRule && !matchesDateRule(file.stat.ctime, rules.createdTime)) {
      return false;
    }

    return true;
  };
}

function hasDateRule(rule: DateRangeRule | undefined): boolean {
  if (!rule) {
    return false;
  }

  return Number.isFinite(rule.before)
    || Number.isFinite(rule.after)
    || (rule.between !== undefined
      && Number.isFinite(rule.between.start)
      && Number.isFinite(rule.between.end));
}

function matchesDateRule(value: number, rule: DateRangeRule | undefined): boolean {
  if (!rule) {
    return true;
  }

  if (Number.isFinite(rule.before) && !(value < Number(rule.before))) {
    return false;
  }

  if (Number.isFinite(rule.after) && !(value > Number(rule.after))) {
    return false;
  }

  if (rule.between && Number.isFinite(rule.between.start) && Number.isFinite(rule.between.end)) {
    const start = Math.min(rule.between.start, rule.between.end);
    const end = Math.max(rule.between.start, rule.between.end);
    if (value < start || value > end) {
      return false;
    }
  }

  return true;
}
