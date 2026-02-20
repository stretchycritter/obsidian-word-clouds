import { MarkdownView, Notice, type App } from 'obsidian';
import { t } from '@/i18n';

export function insertEmbedAtCursor(app: App, embedBlock: string, appendNewline = false): boolean {
  const view = app.workspace.getActiveViewOfType(MarkdownView);
  if (!view) {
    new Notice(t('notices.openMarkdownNoteForEmbed'));
    return false;
  }

  const { editor } = view;
  const cursor = editor.getCursor();
  const currentLine = editor.getLine(cursor.line);

  const hasTextBeforeCursor = currentLine.slice(0, cursor.ch).trim().length > 0;
  const hasTextAfterCursor = currentLine.slice(cursor.ch).trim().length > 0;

  const prefix = hasTextBeforeCursor ? '\n' : '';
  const suffix = hasTextAfterCursor || appendNewline ? '\n' : '';
  const textToInsert = `${prefix}${embedBlock}${suffix}`;

  editor.replaceSelection(textToInsert);

  if (appendNewline && !hasTextAfterCursor) {
    const newCursor = editor.getCursor();
    editor.setCursor({ line: newCursor.line, ch: 0 });
  }

  return true;
}
