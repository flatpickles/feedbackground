export type ForegroundContent =
  | { kind: 'svg'; url: string }
  | { kind: 'text'; text: string }
