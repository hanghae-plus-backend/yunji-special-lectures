export class ApplicationNotFoundError extends Error {
  constructor(msg?: string) {
    const message = msg ?? 'Application history not found';
    super(message);
    this.message = message;
    Object.setPrototypeOf(this, ApplicationNotFoundError.prototype);
  }
}
