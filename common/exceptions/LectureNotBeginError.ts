export class LectureNotBeginError extends Error {
  constructor(msg: string = "Lecture enrollment hasn't started yet") {
    super(msg);
    Object.setPrototypeOf(this, LectureNotBeginError.prototype);
  }
}
