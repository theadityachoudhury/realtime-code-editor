import axios from "axios";
import { Request, Response } from "express";
import RoomModel from "../../Models/Room";
import { customRequest } from "../Auth";
import { BAD_REQUEST, DB_SUCCESS, DB_UNABLE, FILE_ALREADY_EXISTS, FILE_CREATED, FILE_DELETED, FILE_NOT_FOUND, FILE_UPDATED, ROOM_CANNOT_CREATE, ROOM_CREATED, ROOM_DELETED, ROOM_NOT_FOUND, SERVER_ERROR } from "../../Utils/responseReason";
import FileModel from "../../Models/Files";
import mongoose from "mongoose";
import CommitModel from "../../Models/Commits";

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

const createRoom = async (req: customRequest, res: Response) => {
    try {
        const room = new RoomModel({
            createdBy: req.user_id
        });
        await room.save();
        return res.status(200).json({
            status: 201,
            reason: ROOM_CREATED,
            success: true,
            data: room
        })
    } catch (error) {
        return res.status(200).json({
            status: 500,
            reason: ROOM_CANNOT_CREATE,
            success: false,
            data: null
        })

    }
};

const getAllRooms = async (req: customRequest, res: Response) => {
    try {
        const rooms = await RoomModel.find({ createdBy: req.user_id });
        return res.status(200).json({
            status: 200,
            success: true,
            reason: DB_SUCCESS,
            data: rooms
        });
    } catch (error) {
        return res.status(200).json({
            status: 500,
            success: false,
            reason: DB_UNABLE,
            data: null
        });

    }
};

const checkRoom = async (req: customRequest, res: Response) => {
    try {
        const room = await RoomModel.findById(req.params.id);
        if (room) {
            return res.status(200).json({
                status: 200,
                success: true,
                reason: DB_SUCCESS,
                data: room
            });
        }
        return res.status(200).json({
            status: 404,
            success: false,
            reason: DB_SUCCESS,
            data: null
        });
    } catch (error) {
        return res.status(200).json({
            status: 500,
            success: false,
            reason: DB_UNABLE,
            data: null
        });
    }

};

const deleteRoom = async (req: customRequest, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {

        //deleting all the files in the room
        await FileModel.deleteMany({ room: req.params.id }).session(session);
        const room = await RoomModel.findByIdAndDelete(req.params.id).session(session);
        if (!room) {
            await session.abortTransaction();
            session.endSession();
            return res.status(200).json({
                status: 404,
                success: false,
                reason: ROOM_NOT_FOUND,
                data: null
            });
        }
        await CommitModel.deleteMany({ room: req.params.id }).session(session);
        await session.commitTransaction();
        session.endSession();
        return res.status(200).json({
            status: 200,
            success: true,
            reason: ROOM_DELETED,
            data: room
        })
    } catch (error) {
        console.log(error);
        await session.abortTransaction();
        session.endSession();
        return res.status(200).json({
            status: 500,
            success: true,
            reason: DB_UNABLE,
            data: null
        })
    }
};


const addFile = async (req: customRequest, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const existingFile = await FileModel.findOne({ room: req.params.id, fileName: req.body.fileName }).session(session);
        if (existingFile) {
            await session.abortTransaction();
            session.endSession();
            return res.status(200).json({
                status: 409,
                success: false,
                reason: FILE_ALREADY_EXISTS,
                data: null
            });
        }

        const { fileName, content } = req.body;
        const newFile = new FileModel({ room: req.params.id, fileName, content });
        await newFile.save({ session });

        await RoomModel.findByIdAndUpdate(req.params.id, { $inc: { files: 1 } }, { session });

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            status: 200,
            success: true,
            reason: FILE_CREATED,
            data: newFile
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error(error);
        return res.status(200).json({
            status: 500,
            success: false,
            reason: SERVER_ERROR,
            data: null
        });
    }
};

const updateFile = async (req: customRequest, res: Response) => {
    try {
        const file = await FileModel.findOne({ room: req.params.id, _id: req.params.fileId });
        if (!file) {
            return res.status(200).json({
                status: 404,
                success: false,
                reason: FILE_NOT_FOUND,
                data: null
            });
        }

        if (req.body.fileName && req.body.content) {
            file.fileName = req.body.fileName;
            file.content = req.body.content;
        }
        else if (req.body.fileName) {
            file.fileName = req.body.fileName;
        }
        else if (req.body.content) {
            file.content = req.body.content;
        }
        else {
            return res.status(200).json({
                status: 400,
                success: false,
                reason: BAD_REQUEST,
                data: null
            });
        }
        await file.save();
        return res.status(200).json({
            status: 200,
            success: true,
            reason: FILE_UPDATED,
            data: file
        });
    } catch (error) {
        return res.status(200).json({
            status: 500,
            success: false,
            reason: SERVER_ERROR,
            data: null
        });
    }
}

const getFilesInRoom = async (req: customRequest, res: Response) => {
    try {
        const files = await FileModel.find({ room: req.params.id });
        return res.status(200).json({
            status: 200,
            success: true,
            reason: DB_SUCCESS,
            data: files
        });
    } catch (error) {
        return res.status(200).json({
            status: 500,
            success: false,
            reason: DB_UNABLE,
            data: null
        });
    }
};

const getFileContent = async (req: customRequest, res: Response) => {
    try {
        const file = await FileModel.findOne({ room: req.params.id, _id: req.params.fileId });
        if (!file) {
            return res.status(200).json({
                status: 404,
                success: false,
                reason: FILE_NOT_FOUND,
                data: null
            });
        }
        return res.status(200).json({
            status: 200,
            success: true,
            reason: DB_SUCCESS,
            data: file
        });
    } catch (error) {
        return res.status(200).json({
            status: 500,
            success: false,
            reason: DB_UNABLE,
            data: null
        });

    }
};

const deleteFile = async (req: customRequest, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const file = await FileModel.findOneAndDelete({ room: req.params.id, _id: req.params.fileId }).session(session);
        if (!file) {
            await session.abortTransaction();
            session.endSession();
            return res.status(200).json({
                status: 404,
                success: false,
                reason: FILE_NOT_FOUND,
                data: null
            });
        }
        await RoomModel.findByIdAndUpdate(req.params.id, { $inc: { files: -1 } }, { session });
        await session.commitTransaction();
        session.endSession();
        return res.status(200).json({
            status: 200,
            success: true,
            reason: FILE_DELETED,
            data: file
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(200).json({
            status: 500,
            success: false,
            reason: SERVER_ERROR,
            data: null
        });
    }

}



export default {
    execute,
    runtimes,
    createRoom,
    getAllRooms,
    checkRoom,
    deleteRoom,
    addFile,
    updateFile,
    getFilesInRoom,
    getFileContent,
    deleteFile
};
