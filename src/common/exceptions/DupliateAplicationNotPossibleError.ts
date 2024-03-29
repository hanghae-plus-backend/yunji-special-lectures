export class DupliateAplicationNotPossibleError extends Error {
  constructor(
    msg: string = "You can't sign up for the same lecture multiple times",
  ) {
    super(msg);
    Object.setPrototypeOf(this, DupliateAplicationNotPossibleError.prototype);
  }
}
