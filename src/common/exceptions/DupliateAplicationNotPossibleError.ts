export class DupliateAplicationNotPossibleError extends Error {
  constructor(msg?: string) {
    const message =
      msg ?? "You can't sign up for the same lecture multiple times";
    super(message);
    this.message = message;
    Object.setPrototypeOf(this, DupliateAplicationNotPossibleError.prototype);
  }
}
