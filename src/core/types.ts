export type PipelineDocument = {
  id: string;
  path: string;
  basename: string;
  rawText: string;
  tags: string[];
  frontmatter: Record<string, unknown>;
};

export type WeightedWord = {
  text: string;
  count: number;
  size: number;
};
