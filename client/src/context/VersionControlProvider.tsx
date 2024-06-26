import React, { createContext, useContext, useEffect, useState } from "react"
import { useRoom } from "./RoomProvider";
import instance from "../axios";
import useToast from "../Hooks/useToast";
import { useUserContext } from "./UserProvider";

type VersionControlContextType = {
    stageChanges: () => void;
    vcsOutput: string;
    commits: { _id: string, message: string }[] | [];
    commitChanges: () => void;
    refreshData: () => void;
}

const VersionControlContext = createContext<VersionControlContextType | undefined>(undefined);

type VersionControlProviderProps = {
    children: React.ReactNode;
};

export const VersionControlProvider: React.FC<VersionControlProviderProps> = ({ children }) => {
    const { currentRoom } = useRoom();
    const [vcsOutput, setVcsOutput] = useState<string>("");
    const [commits, setCommits] = useState<{ _id: string, message: string }[] | []>([]);
    const { toastSuccess, toastInfo, toastError } = useToast();
    const [refresh, setRefresh] = useState<boolean>(false);
    const { authenticated } = useUserContext();

    useEffect(() => {
        if (!authenticated || !currentRoom) return;
        fetchVCSCommits();
    }, [currentRoom, refresh, authenticated]);


    const stageChanges = async () => {
        try {
            const { data } = await instance.post(`/api/vcs/add/${currentRoom}`);
            if (data.status == 200) {
                const out = `Added to the staging area \n\n \n Staging Id:- ${data.data.commitId}`
                setVcsOutput(out);
                toastSuccess("Changes Staged Successfully");
            } else {
                setVcsOutput(data.message);
                toastInfo(data.message);
            }
        } catch (error) {
            console.info(error);
            toastError("Failed to stage changes");
        }
    }

    const commitChanges = async () => {
        try {
            const { data } = await instance.post(`/api/vcs/commit/${currentRoom}`);
            if (data.status == 200) {
                const out = `Committed changes \n\n \n Commit Id:- ${data.data.commitId}`
                setVcsOutput(out);
                toastSuccess("Changes Committed Successfully");
                setRefresh(!refresh);
            } else {
                setVcsOutput(data.message);
                toastInfo(data.message);
            }

        } catch (error) {
            console.info(error);
            toastError("Failed to commit changes");
        }
    }

    const fetchVCSCommits = async () => {
        try {
            const { data } = await instance.get(`/api/vcs/commits/${currentRoom}`);
            if (data.status == 200) {
                setCommits(data.data);
                toastSuccess("Fetched Commits Successfully");
            } else {
                toastInfo(data.message);
            }
        } catch (error) {
            console.info(error);
            toastError("Failed to fetch commits");
        }
    }

    const refreshData = () => {
        setRefresh(!refresh);
    }



    const value = {
        stageChanges,
        vcsOutput,
        commitChanges,
        commits,
        refreshData
    }
    return (
        <VersionControlContext.Provider
            value={value}
        >
            {children}
        </VersionControlContext.Provider>
    );
}

export const useVersionControl = (): VersionControlContextType => {
    const context = useContext(VersionControlContext);
    if (context === undefined) {
        throw new Error("useVersionControl must be used within a versionControlProvider");
    }
    return context;
};