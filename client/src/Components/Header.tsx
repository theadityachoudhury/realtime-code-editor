import React, { useState } from 'react';
import { Files, Play, Users, MessageSquareMore, User, LogOut, DoorOpen, GitBranchPlus } from 'lucide-react';
import { useFiles } from '../context/FileProvider';
import { useUserContext } from '../context/UserProvider';
import FilesList from './Tabs/FilesList';
import Runner from './Tabs/Runner';
import UsersList from './Tabs/UsersList';
import UserChat from './Tabs/UserChat';
import ProfilePage from './Tabs/Profile';
import { useRoom } from '../context/RoomProvider';
import VersionControl from './Tabs/VersionControl';

enum Tab {
    Files = 'files',
    Run = 'run',
    Users = 'users',
    Chat = 'chat',
    Profile = 'profile',
    VersionControl = 'versionControl'
}

const Header: React.FC = () => {
    const { logout } = useUserContext();
    const { leaveRoom } = useRoom();
    const [activeTab, setActiveTab] = useState<Tab>(Tab.Files);
    const iconSize = 20;
    const { files, setActiveFile, activeFile, handleRenameFile, deleteFile, renamingFileId, newFileName, setRenamingFileId, handleAddFile, setNewFileName } = useFiles();

    const renderContent = () => {
        switch (activeTab) {
            case Tab.Files:
                return (
                    <FilesList
                        handleAddFile={handleAddFile}
                        files={files}
                        activeFile={activeFile}
                        renamingFileId={renamingFileId}
                        newFileName={newFileName}
                        setNewFileName={setNewFileName}
                        handleRenameFile={handleRenameFile}
                        iconSize={iconSize}
                        setRenamingFileId={setRenamingFileId}
                        deleteFile={deleteFile}
                        setActiveFile={setActiveFile} />
                );
            case Tab.Run:
                return <Runner />;
            case Tab.Users:
                return <UsersList />;
            case Tab.Chat:
                return <UserChat />;
            case Tab.Profile:
                return <ProfilePage />;
            case Tab.VersionControl:
                return <VersionControl />;
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
                        <div onClick={() => setActiveTab(Tab.VersionControl)} className='cursor-pointer' title='Version Control'>
                            <GitBranchPlus size={iconSize} />
                        </div>
                    </div>
                    <div className="space-y-8 mt-auto">
                        <div onClick={() => {
                            leaveRoom();
                        }} className='space-x-2 cursor-pointer' title='Leave Room'>
                            <DoorOpen size={iconSize} />
                        </div>
                        <div onClick={() => setActiveTab(Tab.Profile)} className='space-x-2 cursor-pointer' title='Profile'>
                            <User size={iconSize} />
                        </div>
                        <div onClick={() => {
                            leaveRoom();
                            logout();
                        }} className='space-x-2 cursor-pointer' title='Logout'>
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
