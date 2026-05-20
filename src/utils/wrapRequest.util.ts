import type { RequestHandler } from "express";

const wrapRequestFunction = (
    controllerFunction: RequestHandler
): RequestHandler => {
    return async (req, res, next) => {
        try {
            return await Promise.resolve(controllerFunction(req, res, next));
        } catch (error) {
            next(error);
        }
    };
};

export default wrapRequestFunction;
