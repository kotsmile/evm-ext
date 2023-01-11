export class EVMError extends Error {
  constructor(message: string) {
    super(message) // (1)
    this.name = 'EVMError' // (2)
  }
}
