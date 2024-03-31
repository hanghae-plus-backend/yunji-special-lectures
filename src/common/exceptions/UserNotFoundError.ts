export class UserNotFoundError extends Error {
  constructor(msg?: string) {
    const message = msg ?? 'User not found';
    super(message);
    this.message = message;
    Object.setPrototypeOf(this, UserNotFoundError.prototype);
  }
}
