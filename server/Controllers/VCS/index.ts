import { Request, Response } from "express";
import { customRequest } from "../Auth";
import CommitModel, { ICommit } from "../../Models/Commits";
import FileModel from "../../Models/Files";
import { CHANGES_ADDED, CHANGES_COMMITTED, COMMIT_NOT_FOUND, INTERNAL_SERVER_ERROR, LOGS_FOUND, NO_CHANGES_FOUND } from "../../Utils/responseReason";

const add = async (req: customRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { user_id } = req;

        const files = await FileModel.find({ room: id }, { fileName: 1, content: 1, file: "$_id", _id: 0 });

        if (!files) {
            return res.status(200).json({
                data: null,
                message: NO_CHANGES_FOUND,
                success: false,
                status: 404
            })
        }

        const existingCommit = await CommitModel.findOne({ room: id, status: "staging" });


        let commitId = null;
        if (existingCommit) {
            existingCommit.changes = files as any;
            await existingCommit.save();
            commitId = existingCommit._id;
        } else {
            const newCommit = new CommitModel({
                room: id,
                stagedBy: user_id,
                status: "staging",
                changes: files
            });
            await newCommit.save();
            commitId = newCommit._id;
        }

        return res.status(200).json({
            message: CHANGES_ADDED,
            data: {
                commitId: commitId
            },
            status: 200,
            success: true,
        });


    } catch (error) {
        console.log("Error in VCS add: ", error);
        return res.status(500).json({
            message: INTERNAL_SERVER_ERROR,
            data: null,
            status: 500,
            success: false,
        });
    }
}

const commit = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const existingCommit = await CommitModel.findOne({ room: id, status: "staging" });
        if (!existingCommit) {
            return res.status(200).json({
                message: NO_CHANGES_FOUND,
                data: null,
                status: 404,
                success: false
            });
        }

        existingCommit.status = "committed";
        existingCommit.message = `Changes on ${new Date().toLocaleString()}`
        await existingCommit.save();
        return res.status(200).json({
            message: CHANGES_COMMITTED,
            data: {
                commitId: existingCommit._id
            },
            status: 200,
            success: true
        });
    } catch (error) {
        console.log("Error in VCS commit: ", error);
        return res.status(500).json({
            message: INTERNAL_SERVER_ERROR,
            data: null,
            status: 500,
            success: false
        });
    }

}

const revert = async (req: Request, res: Response) => {

}

const showLogs = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        //in descending order of time
        const logs = await CommitModel.find({ room: id }, { changes: 0 }).sort({ createdAt: -1 });
        return res.status(200).json({
            message: LOGS_FOUND,
            data: logs,
            status: 200,
            success: true
        });
    } catch (error) {
        console.log("Error in VCS showLogs: ", error);
        return res.status(500).json({
            message: INTERNAL_SERVER_ERROR,
            data: null,
            status: 500,
            success: false
        });

    }
}

const getCommit = async (req: Request, res: Response) => {
    try {
        const { commitId } = req.params;
        const commit = await CommitModel.findById(commitId);
        if (!commit) {
            return res.status(200).json({
                message: COMMIT_NOT_FOUND,
                data: null,
                status: 404,
                success: false
            });
        }
        return res.status(200).json({
            message: LOGS_FOUND,
            data: commit,
            status: 200,
            success: true
        });
    } catch (error) {
        console.log("Error in VCS getCommit: ", error);
        return res.status(500).json({
            message: INTERNAL_SERVER_ERROR,
            data: null,
            status: 500,
            success: false
        });

    }
}

export default {
    commit,
    add,
    revert,
    showLogs,
    getCommit
}