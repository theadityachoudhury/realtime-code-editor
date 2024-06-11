import React, { useState } from 'react';
import { Files, Play, Users, MessageSquareMore, User, LogOut, Check, X } from 'lucide-react';
import { File, useFiles } from '../context/FileProvider';
import { useUserContext } from '../context/UserProvider';
import { useEditor } from '../context/CodeEditorProvider';
import { getLanguageFromExtension } from '../Utils/defaultExtensionMap';

enum Tab {
    Files = 'files',
    Run = 'run',
    Users = 'users',
    Chat = 'chat',
    Profile = 'profile',
}

const Header: React.FC = () => {
    const { logout } = useUserContext();
    const [activeTab, setActiveTab] = useState<Tab>(Tab.Files);
    const iconSize = 30;
    const { files, addFile, setActiveFile, renameFile, deleteFile } = useFiles();
    const { language } = useEditor();
    const [renamingFileId, setRenamingFileId] = useState<string | null>(null);
    const [newFileName, setNewFileName] = useState('');

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

    const renderContent = () => {
        switch (activeTab) {
            case Tab.Files:
                return (
                    <div className="h-full flex flex-col">
                        <div className="flex justify-between items-center space-x-36">
                            <h1 className="text-2xl font-bold">Files</h1>
                            <button onClick={handleAddFile} className="p-2 bg-gray-800 text-white rounded-md">Add File</button>
                        </div>
                        <div className="flex-grow mt-4 overflow-y-auto">
                            {files.map((file: File) => (
                                <div key={file.id} className="flex items-center p-2 hover:bg-gray-700">
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
                                        <div className="flex items-center space-x-2 w-full">
                                            <span onClick={() => setActiveFile(file.id)} className="flex-grow cursor-pointer">{file.name}</span>
                                            <Files size={iconSize} className="cursor-pointer" onClick={() => { setRenamingFileId(file.id); setNewFileName(file.name); }} />
                                            <Files size={iconSize} className="cursor-pointer" onClick={() => deleteFile(file.id)} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case Tab.Run:
                return <div className="flex-grow">Run Content</div>;
            case Tab.Users:
                return <div className="flex-grow">Users Content</div>;
            case Tab.Chat:
                return <div className="flex-grow">Chat Content</div>;
            case Tab.Profile:
                return <div className="flex-grow">Profile Content</div>;
            default:
                return <div>Select a tab</div>;
        }
    };

    return (
        <div>
            <div className="hidden h-screen sm:flex bg-gray-800">
                <div className="flex flex-col p-3 text-white min-w-max">
                    <div className="flex-grow space-y-8">
                        <div onClick={() => setActiveTab(Tab.Files)} className='cursor-pointer' title='Files'>
                            <Files size={iconSize} />
                        </div>
                        <div onClick={() => setActiveTab(Tab.Run)} className='cursor-pointer' title='Run'>
                            <Play size={iconSize} />
                        </div>
                        <div onClick={() => setActiveTab(Tab.Users)} className='cursor-pointer' title='Users'>
                            <Users size={iconSize} />
                        </div>
                        <div onClick={() => setActiveTab(Tab.Chat)} className='cursor-pointer' title='Chat'>
                            <MessageSquareMore size={iconSize} />
                        </div>
                    </div>
                    <div className="space-y-8 mt-auto">
                        <div onClick={() => setActiveTab(Tab.Profile)} className='space-x-2 cursor-pointer' title='Profile'>
                            <User size={iconSize} />
                        </div>
                        <div onClick={logout} className='space-x-2 cursor-pointer' title='Logout'>
                            <LogOut size={iconSize} />
                        </div>
                    </div>
                </div>
                <div className="border-l border-black"></div>
                <div className="flex-grow p-4 overflow-hidden">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Header;
