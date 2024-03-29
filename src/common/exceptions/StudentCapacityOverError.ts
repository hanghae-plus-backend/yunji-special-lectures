export class StudentCapacityOverError extends Error {
  constructor(msg: string = 'The lecture is over capacity') {
    super(msg);
    Object.setPrototypeOf(this, StudentCapacityOverError.prototype);
  }
}
