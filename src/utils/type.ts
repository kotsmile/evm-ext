export type Cast<T, C> = T extends C ? T : never

export type RT<T> = T extends (...args: any) => infer R ? R : never
