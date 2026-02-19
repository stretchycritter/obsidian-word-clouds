export type PipelineDocument = {
  id: string;
  path: string;
  basename: string;
  rawText: string;
  tags: string[];
  frontmatter: Record<string, unknown>;
};
