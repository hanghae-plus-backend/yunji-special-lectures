export class LectureNotFoundError extends Error {
  constructor(msg: string = "Can't find a lecture") {
    super(msg);
    Object.setPrototypeOf(this, LectureNotFoundError.prototype);
  }
}
