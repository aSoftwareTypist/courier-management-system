import wrapRequestFunction from "../utils/wrapRequest.util.js";
import type { Request, Response } from "express";

const MW404 = wrapRequestFunction(async (req: Request, res: Response) => {
    return res.status(404).render("404", { title: "404 Not Found" });
});

export default MW404;
