export class AppError extends Error {
    constructor(message, statusCode, code) {
        super(message);

        this.status = statusCode;
        this.code = code;
    }
}