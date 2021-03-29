export type SerializedErrors = { message: string; field?: string }[];

export abstract class CustomError extends Error {
   abstract statusCode: number;

   constructor(message: string) {
      super(message);
      Object.setPrototypeOf(this, new.target.prototype);
   }

   abstract serializeErrors(): SerializedErrors;
}
