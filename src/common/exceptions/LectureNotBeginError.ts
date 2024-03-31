export class LectureNotBeginError extends Error {
  constructor(msg?: string) {
    const message = msg ?? "Lecture enrollment hasn't started yet";
    super(message);
    this.message = message;
    Object.setPrototypeOf(this, LectureNotBeginError.prototype);
  }
}
