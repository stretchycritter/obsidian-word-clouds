export const VIEW_TYPE_VAULT_WORD_CLOUD = 'vault-word-cloud-view';
export const VIEW_TYPE_NOTE_WORD_CLOUD = 'note-word-cloud-view';
export const MAX_WORDS = 140;
export const MIN_WORD_LENGTH = 3;
export const FRONTMATTER_PATTERN = /^---\s*\n[\s\S]*?\n---\s*(?:\n|$)/;
export const WORD_CLOUD_BLOCK_PATTERN = /```(?:wordcloud|word-cloud)\s*\n[\s\S]*?\n```/gi;

export const DEFAULT_STOP_WORDS: string[] = [
  'the', 'and', 'for', 'that', 'this', 'with', 'from', 'are', 'was', 'were', 'have', 'has', 'had',
  'you', 'your', 'they', 'them', 'their', 'its', 'our', 'ours', 'his', 'her', 'she', 'him', 'not',
  'but', 'can', 'will', 'all', 'any', 'one', 'two', 'too', 'use', 'using', 'into', 'out', 'about',
  'there', 'then', 'than', 'when', 'what', 'where', 'which', 'who', 'whom', 'how', 'why', 'also',
  'just', 'like', 'some', 'more', 'most', 'much', 'many', 'very', 'each', 'other', 'such', 'only',
  'note', 'notes', 'todo', 'done', 'null', 'true', 'false', 'http', 'https', 'www', 'com'
];
