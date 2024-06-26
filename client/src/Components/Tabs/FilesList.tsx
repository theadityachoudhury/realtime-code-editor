import React from 'react';
import { Check, X, Pencil, Trash2 } from 'lucide-react';
import { File } from '../../context/FileProvider';

interface FilesProps {
    handleAddFile: () => void;
    files: File[];
    activeFile: File | null;
    renamingFileId: string | null;
    newFileName: string;
    setNewFileName: React.Dispatch<React.SetStateAction<string>>;
    handleRenameFile: (fileId: string) => void;
    iconSize: number;
    setRenamingFileId: React.Dispatch<React.SetStateAction<string | null>>;
    deleteFile: (id: string) => void;
    setActiveFile: (id: string) => void;
}

const FilesList: React.FC<FilesProps> = ({
    handleAddFile,
    files,
    activeFile,
    renamingFileId,
    newFileName,
    setNewFileName,
    handleRenameFile,
    iconSize,
    setRenamingFileId,
    deleteFile,
    setActiveFile,
}) => {
    return (
        <div className="h-full max-w-72 min-w-72 flex flex-col">
            <div className="flex justify-between items-center space-x-36">
                <h1 className="text-2xl font-bold">Files</h1>
                <button onClick={handleAddFile} className="p-2 bg-indigo-800 hover:bg-indigo-600 text-indigo-50 hover:text-indigo-100 rounded-md">Add File</button>
            </div>
            <div className="flex-grow mt-4 overflow-y-auto">
                {files.map((file: File) => (
                    <div key={file.id} className={`flex items-center p-2 hover:bg-gray-700 ${file.id === activeFile?.id ? 'bg-gray-700 text-white rounded-md' : ''}`}>
                        {renamingFileId === file.id ? (
                            <div className="flex items-center space-x-2">
                                <input
                                    autoFocus
                                    value={newFileName}
                                    onChange={(e) => setNewFileName(e.target.value)}
                                    className="p-1 bg-gray-800 text-white rounded-md"
                                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                        if (e.key === 'Enter') handleRenameFile(file.id);
                                    }}
                                />
                                <Check size={iconSize} className="cursor-pointer" onClick={() => handleRenameFile(file.id)} />
                                <X size={iconSize} className="cursor-pointer" onClick={() => setRenamingFileId(null)} />
                            </div>
                        ) : (
                            <div className={`flex items-center space-x-2 w-full cursor-pointer ${file.id === activeFile?.id ? 'bg-gray-700 text-white' : ''}`} onClick={() => setActiveFile(file.id)}>
                                <span className="flex-grow">{file.name}</span>
                                <div className='flex space-x-3'>
                                    <Pencil size={iconSize} className="cursor-pointer hover:text-indigo-500" onClick={() => { setRenamingFileId(file.id); setNewFileName(file.name); }} />
                                    <Trash2 size={iconSize} className="cursor-pointer hover:text-red-500" onClick={() => deleteFile(file.id)} />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FilesList;
