export default class CustomError extends Error {
    override message: string;
    code: number;
    errObj: unknown;

    constructor(statusCode: number, msg: string, err?: unknown) {
        super(msg);
        this.code = statusCode;
        this.message = msg;
        this.errObj = err;
    }
}