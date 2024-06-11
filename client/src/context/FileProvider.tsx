// src/Context/FileContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useEditor } from './CodeEditorProvider';

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
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { getDefaultCode, setCode, setLanguage } = useEditor();
    const [files, setFiles] = useState<File[]>(() => {
        const savedFiles = localStorage.getItem('files');
        return savedFiles ? JSON.parse(savedFiles) : [];
    });
    const [activeFileId, setActiveFileId] = useState<string | null>(() => {
        const savedActiveFileId = localStorage.getItem('activeFileId');
        return savedActiveFileId ? JSON.parse(savedActiveFileId) : null;
    });

    useEffect(() => {
        localStorage.setItem('files', JSON.stringify(files));
    }, [files]);

    useEffect(() => {
        localStorage.setItem('activeFileId', JSON.stringify(activeFileId));
    }, [activeFileId]);

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
        updateFile(id, files.find((file) => file.id === id)?.content || getDefaultCode(language), language);
    };

    const deleteFile = (id: string) => {
        if (files.length >= 2) setActiveFile(files[files.length - 2].id);
        else {
            setActiveFile("")
            setLanguage("")
            setCode(getDefaultCode(""))
        };
        setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));

    }

    const setActiveFile = (id: string) => {
        setActiveFileId(id);
    };

    const activeFile = files.find((file) => file.id === activeFileId) || null;

    const value = {
        files,
        addFile,
        updateFile,
        setActiveFile,
        activeFile,
        renameFile,
        deleteFile,
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
