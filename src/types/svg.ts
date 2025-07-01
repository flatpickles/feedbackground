export type SvgSize =
  | { type: 'natural' }
  | { type: 'scaled'; factor: number }
  | { type: 'relative'; fraction: number }
