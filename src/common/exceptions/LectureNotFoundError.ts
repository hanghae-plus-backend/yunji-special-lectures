export class LectureNotFoundError extends Error {
  constructor(msg?: string) {
    const message = msg ?? "Can't find a lecture";
    super(message);
    this.message = message;
    Object.setPrototypeOf(this, LectureNotFoundError.prototype);
  }
}
