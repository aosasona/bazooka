export default class CustomException extends Error {
  public static errorName = "CustomException" as const;
  constructor(message: string, err?: Error) {
    super(message);
    this.name = CustomException.errorName;
    this.message = message;
    this.cause = err?.message || "";
  }
}
