import axios from "axios";
import { Request, Response } from "express";
import RoomModel from "../../Models/Room";
import { customRequest } from "../Auth";
import { DB_SUCCESS, DB_UNABLE, ROOM_CANNOT_CREATE, ROOM_CREATED,ROOM_DELETED } from "../../Utils/responseReason";

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

const deleteRoom = async (req:customRequest,res:Response)=>{
  try {
    const room = await RoomModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      status:200,
      success:true,
      reason:ROOM_DELETED,
      data:room
    })
  } catch (error)
   {
     console.log(error);
    return res.status(200).json({
      status:500,
      success:true,
      reason: DB_UNABLE,
      data:null
    })
  }
};



export default {
    execute,
    runtimes,
    createRoom,
    getAllRooms,
    checkRoom,
    deleteRoom
};
