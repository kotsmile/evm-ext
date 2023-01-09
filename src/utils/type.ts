export type Cast<T, C> = T extends C ? T : never

export type RT<T> = T extends (...args: any) => infer R ? R : never
export type OnlyNumber<A> = A extends `${number}` ? A : never
export type Filter<A, B> = A extends B ? A : never

export type RemoveAbstract<C extends abstract new (...args: any) => any> = new (
  ...args: ConstructorParameters<C>
) => InstanceType<C>

export type Function = (...args: any) => any
