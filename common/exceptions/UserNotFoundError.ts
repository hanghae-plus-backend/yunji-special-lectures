export class UserNotFoundError extends Error {
  constructor(msg: string = 'User not found') {
    super(msg);
    Object.setPrototypeOf(this, UserNotFoundError.prototype);
  }
}
