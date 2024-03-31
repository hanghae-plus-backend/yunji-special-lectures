export class StudentCapacityOverError extends Error {
  constructor(msg?: string) {
    const message = msg ?? 'The lecture is over capacity';
    super(message);
    this.message = message;
    Object.setPrototypeOf(this, StudentCapacityOverError.prototype);
  }
}
