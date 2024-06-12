// src/Context/FileContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { useEditor } from './CodeEditorProvider';
import { getLanguageFromExtension } from '../Utils/defaultExtensionMap';

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
    const { getDefaultCode, setCode, setLanguage, language } = useEditor();
    const [files, setFiles] = useState<File[]>([]);
    const [activeFileId, setActiveFileId] = useState<string | null>(null);

    const [renamingFileId, setRenamingFileId] = useState<string | null>(null);
    const [newFileName, setNewFileName] = useState('');

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
        setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
        if (files.length == 0) {
            setActiveFile("")
            setLanguage("")
            setCode(getDefaultCode(""))
        } else {
            setActiveFile(files[0].id);
        }

    }

    const setActiveFile = (id: string) => {
        setActiveFileId(id);
    };

    const handleAddFile = () => {
        const id = Date.now().toString();
        const newFile = { id, name: `File ${files.length + 1}`, content: "", language };
        addFile(newFile);
        setRenamingFileId(id);
        setNewFileName(`File ${files.length + 1}`);
    };

    const handleRenameFile = (fileId: string) => {
        renameFile(fileId, newFileName, getLanguageFromExtension(newFileName.split('.').pop() || ''));
        setRenamingFileId(null);
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
