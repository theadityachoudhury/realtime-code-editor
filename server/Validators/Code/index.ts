import { NextFunction, Response } from "express";
import { customRequest } from "../../Controllers/Auth";
import RoomModel from "../../Models/Room";
import { ROOM_NOT_FOUND, SERVER_ERROR } from "../../Utils/responseReason";

const isValidRoom = async (req: customRequest, res: Response, next: NextFunction) => {
    try {
        const room = await RoomModel.findById(req.params.id);
        if (room) {
            return next();
        }
        else {
            return res.status(200).json({
                status: 404,
                success: false,
                reason: ROOM_NOT_FOUND,
                data: null
            })
        }
    } catch (error) {
        return res.status(200).json({
            status: 500,
            success: false,
            reason: SERVER_ERROR,
            data: null
        })

    }
}

export default {
    isValidRoom,
}