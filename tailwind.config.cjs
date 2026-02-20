/** @type {import('tailwindcss').Config} */
module.exports = {
  // Prefix all generated utilities with 'wc-' to avoid conflicts with Obsidian's own styles.
  // In @apply directives, reference utilities WITH the prefix: @apply wc-flex wc-flex-col
  // In TypeScript cls strings, use prefixed names: createDiv({ cls: 'wc-flex wc-flex-col' })
  prefix: 'wc-',

  // Disable Tailwind's base/preflight resets — Obsidian manages its own base styles
  corePlugins: {
    preflight: false,
  },

  // Scan TypeScript source for utility class usage (JIT tree-shaking)
  content: ['./src/**/*.ts'],

  theme: {
    extend: {
      // Map Obsidian design tokens so they can be used in @apply and TS cls strings.
      // Usage: wc-text-obs-muted, wc-bg-obs-secondary, wc-gap-obs-2, wc-rounded-obs-m, etc.
      colors: {
        'obs-bg':           'var(--background-primary)',
        'obs-bg-secondary': 'var(--background-secondary)',
        'obs-bg-alt':       'var(--background-primary-alt)',
        'obs-text':         'var(--text-normal)',
        'obs-text-muted':   'var(--text-muted)',
        'obs-text-faint':   'var(--text-faint)',
        'obs-accent':       'var(--interactive-accent)',
        'obs-border':       'var(--background-modifier-border)',
        'obs-border-hover': 'var(--background-modifier-border-hover)',
        'obs-hover':        'var(--background-modifier-hover)',
        'obs-modal':        'var(--modal-background)',
      },
      spacing: {
        'obs-1': 'var(--size-4-1)',
        'obs-2': 'var(--size-4-2)',
        'obs-3': 'var(--size-4-3)',
        'obs-6': 'var(--size-4-6)',
      },
      borderRadius: {
        'obs-m': 'var(--radius-m)',
        'obs-s': 'var(--radius-s)',
      },
      fontSize: {
        'obs-xs': ['var(--font-ui-smaller)', { lineHeight: 'inherit' }],
        'obs-sm': ['var(--font-ui-small)',   { lineHeight: 'inherit' }],
        'obs-md': ['var(--font-ui-medium)',  { lineHeight: 'inherit' }],
      },
      fontWeight: {
        'obs-medium': 'var(--font-medium)',
      },
      boxShadow: {
        'obs-s': 'var(--shadow-s)',
      },
      // Named z-index scale — documents stacking relationships across components
      // wc-z-above (1), wc-z-overlay (2), wc-z-panel (3), wc-z-dropdown (10)
      zIndex: {
        'above':    '1',   // sticky bars (modal action bar)
        'overlay':  '2',   // floating control groups (zoom, export, refresh)
        'panel':    '3',   // inline edit panels
        'dropdown': '10',  // popup menus
      },
    },
  },
};
