export class ApplicationNotFoundError extends Error {
  constructor(msg: string = 'Application history not found') {
    super(msg);
    Object.setPrototypeOf(this, ApplicationNotFoundError.prototype);
  }
}
