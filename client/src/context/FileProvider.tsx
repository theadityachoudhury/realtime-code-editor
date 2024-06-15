// src/Context/FileContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useEditor } from './CodeEditorProvider';
import { getLanguageFromExtension } from '../Utils/defaultExtensionMap';
import instance from '../axios';
import { useRoom } from './RoomProvider';
import useToast from '../Hooks/useToast';
import { useUserContext } from './UserProvider';
import handleServerResponse from '../Utils/serverMessages';

export interface File {
    id: string;
    name: string;
    content: string;
    language: string;
}

export interface FileContextType {
    files: File[];
    addFile: (file: File) => void;
    updateFile: (id: string, content: string, language: string) => void;
    setActiveFile: (id: string) => void;
    activeFile: File | null;
    renameFile: (id: string, name: string, language: string) => void;
    deleteFile: (id: string) => void;
    handleAddFile: () => void;
    renamingFileId: string | null;
    setRenamingFileId: React.Dispatch<React.SetStateAction<string | null>>;
    newFileName: string;
    setNewFileName: React.Dispatch<React.SetStateAction<string>>;
    handleRenameFile: (fileId: string) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { authenticated } = useUserContext();
    const { currentRoom } = useRoom();
    const { toastError, toastSuccess } = useToast();
    const { getDefaultCode, setCode, setLanguage, language } = useEditor();
    const [files, setFiles] = useState<File[]>([]);
    const [activeFileId, setActiveFileId] = useState<string | null>(null);

    const [renamingFileId, setRenamingFileId] = useState<string | null>(null);
    const [newFileName, setNewFileName] = useState('');

    useEffect(() => {
        // console.log(authenticated, currentRoom);
        // console.log(files)
        if (authenticated && currentRoom) {
            instance.get(`/api/code/room/${currentRoom._id}/files`)
                .then(({ data }) => {
                    if (data.status === 200) {
                        // console.log(data);
                        data.data.forEach((file: any) => {

                            const fileData: File = {
                                id: file._id,
                                name: file.fileName,
                                content: file.content,
                                language: getLanguageFromExtension(file.fileName.split('.').pop() || ''),
                            }
                            setFiles((prevFiles) => [...prevFiles, fileData]);

                        })
                        if (files.length) {
                            setActiveFile(files[0].id);
                        }

                    } else {
                        throw new Error('Failed to fetch files');
                    }
                })
                .catch((error) => {
                    console.log(error);
                    toastError('Failed to fetch files');
                });
        }

    }, [authenticated, currentRoom]);

    const addFile = (file: File) => {
        setFiles((prevFiles) => [...prevFiles, file]);
        setActiveFileId(file.id);
    };

    const updateFile = (id: string, content: string, language: string) => {
        setFiles((prevFiles) =>
            prevFiles.map((file) => (file.id === id ? { ...file, content, language } : file))
        );
    };

    const renameFile = (id: string, name: string, language: string) => {
        setFiles((prevFiles) =>
            prevFiles.map((file) => (file.id === id ? { ...file, name, language } : file))
        );
        updateFile(id, files.find((file) => file.id === id)?.content || "//Write your code here", language);
    };

    const deleteFile = async (id: string) => {
        try {
            const { data } = await instance.delete(`/api/code/room/${currentRoom?._id}/file/${id}`);
            if (data.status === 200) {
                setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
                if (files.length == 0) {
                    setActiveFile("")
                    setLanguage("")
                    setCode(getDefaultCode())
                } else {
                    setActiveFile(files[0].id);
                }
                toastSuccess(handleServerResponse(data.reason));
            } else {
                toastError(handleServerResponse(data.reason));
            }
        } catch (error) {
            console.log(error);
            toastError('Failed to delete file');
        }

    }

    const setActiveFile = (id: string) => {
        setActiveFileId(id);
    };

    const handleAddFile = async () => {
        const fileName = `File ${files.length + 1}`;
        try {
            const { data } = await instance.post(`/api/code/room/${currentRoom?._id}/files`, { fileName: fileName, content: getDefaultCode() });
            if (data.status === 200) {
                const newFile = { id: data.data._id, name: fileName, content: "", language };
                addFile(newFile);
                setRenamingFileId(data.data._id);
                setNewFileName(fileName);
            } else {
                throw new Error('Failed to create file');
            }
        } catch (error) {
            console.log(error);
            toastError('Failed to create file');
        }

    };

    const handleRenameFile = async (fileId: string) => {
        const language = getLanguageFromExtension(newFileName.split('.').pop() || '');
        try {

            const { data } = await instance.put(`/api/code/room/${currentRoom?._id}/file/${fileId}`, { fileName: newFileName })
            if (data.status === 200) {
                renameFile(fileId, newFileName, language);
                setRenamingFileId(null);
            } else {
                throw new Error('Failed to rename file');
            }

        } catch (error) {
            console.log(error);
            toastError('Failed to rename file');

        }

    };

    const activeFile = files.find((file) => file.id === activeFileId) || files[0] || null;

    const value = {
        files,
        addFile,
        updateFile,
        setActiveFile,
        activeFile,
        renameFile,
        deleteFile,
        handleAddFile,
        renamingFileId,
        setRenamingFileId,
        newFileName,
        setNewFileName,
        handleRenameFile,
    };

    return <FileContext.Provider value={value}>{children}</FileContext.Provider>;
};

export const useFiles = (): FileContextType => {
    const context = useContext(FileContext);
    if (!context) {
        throw new Error('useFiles must be used within a FileProvider');
    }
    return context;
};
