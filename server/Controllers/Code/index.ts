import axios from "axios";
import { Request, Response } from "express";

const execute = async (req: Request, res: Response) => {
    const { language, version, files, stdin }: {
        language: string,
        version: string,
        files: { name: string, content: string }[],
        stdin: string
    } = req.body;

    const data = {
        language,
        version,
        files,
        stdin,
    };
    try {
        const response = await axios.post("https://emkc.org/api/v2/piston/execute", data);
        return res.status(200).json({ ...response.data });
    } catch (error: any) {
        return res.status(200).json(error.message);
    }
};

const runtimes = async (req: Request, res: Response) => {
    try {
        const { data } = await axios.get("https://emkc.org/api/v2/piston/runtimes");
        return res.status(200).json(data);
    } catch (error: any) {
        return res.status(200).json(error.message);
    }
};


export default { execute, runtimes };