import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import instance from '../axios';
import { Transition } from '@headlessui/react';
import Loader from '../Components/Loader';
import { Editor } from '@monaco-editor/react';
import { getLanguageFromExtension } from '../Utils/defaultExtensionMap';

interface Commit {
    _id: string;
    room: string;
    status: string;
    stagedBy: string;
    message: string;
    changes: Array<{
        file: string;
        fileName: string;
        content: string;
        _id: string;
    }>;
    createdAt: string;
    updatedAt: string;
}

const CommitHistory: React.FC = () => {
    const { id, commitId } = useParams<{ id: string; commitId: string }>();
    const [commit, setCommit] = useState<Commit | null>(null);
    const [openFileId, setOpenFileId] = useState<string | null>(null);

    useEffect(() => {
        const fetchCommit = async () => {
            try {
                const response = await instance.get<{
                    message: string;
                    data: Commit;
                    success: boolean;
                }>(`/api/vcs/commit/${id}/${commitId}`);
                if (response.data.success) {
                    setCommit(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching commit details:", error);
            }
        };

        fetchCommit();
    }, [id, commitId]);

    if (!commit) {
        return <Loader fullScreen={true} type='spinner' size={60} />;
    }

    const toggleFile = (fileId: string) => {
        setOpenFileId(openFileId === fileId ? null : fileId);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
            <div className="w-full max-w-4xl p-6 bg-gray-800 rounded-lg shadow-lg space-y-5">
                <div>
                    <button onClick={() => { window.close() }} className="py-2 px-4 bg-blue-600 rounded hover:bg-blue-700 transition-colors">
                        Back to Room
                    </button>
                </div>
                <h2 className="text-2xl font-semibold mb-4">Commit Details</h2>
                <div className="mb-2">
                    <strong>Commit ID:</strong> {commit._id}
                </div>
                <div className="mb-2">
                    <strong>Status:</strong> {commit.status}
                </div>
                <div className="mb-2">
                    <strong>Staged By:</strong> {commit.stagedBy}
                </div>
                <div className="mb-2">
                    <strong>Message:</strong> {commit.message}
                </div>
                <div className="mb-2">
                    <strong>Created At:</strong> {new Date(commit.createdAt).toLocaleString()}
                </div>
                <div className="mb-4">
                    <strong>Updated At:</strong> {new Date(commit.updatedAt).toLocaleString()}
                </div>
                <div>
                    <strong>Changes:</strong>
                    <ul className="pl-5">
                        {commit.changes.map((change) => {
                            const language = getLanguageFromExtension(change.fileName.split('.').pop() || '');
                            console.log(language);
                            return <li key={change._id} className="mb-2">
                                <button
                                    onClick={() => toggleFile(change._id)}
                                    className="text-left w-full text-lg font-semibold focus:outline-none flex items-center"
                                >
                                    <span className="mr-2 transform transition-transform duration-300">
                                        {openFileId === change._id ? '▼' : '▶'}
                                    </span>
                                    {change.fileName}
                                </button>
                                <Transition
                                    show={openFileId === change._id}
                                    enter="transition-all duration-500 ease-out"
                                    enterFrom="transform scale-95 opacity-0"
                                    enterTo="transform scale-100 opacity-100"
                                    leave="transition-all duration-500 ease-in"
                                    leaveFrom="transform scale-100 opacity-100"
                                    leaveTo="transform scale-95 opacity-0"
                                >
                                    <div className="bg-gray-700 p-2 h-full rounded-lg mt-2">
                                        <Editor
                                            height="50vh"
                                            width="100%"
                                            defaultLanguage="plaintext"
                                            defaultValue={change.content}
                                            loading={<Loader type='spinner' size={48} />}
                                            options={{
                                                wordWrap: 'on',
                                                minimap: { enabled: false },
                                                autoClosingBrackets: 'always',
                                                "semanticHighlighting.enabled": true,
                                                fontSize: 16,
                                                tabSize: 4,
                                                autoClosingComments: 'always',
                                                autoSurround: 'languageDefined',
                                                columnSelection: true,
                                                codeLens: true,
                                                autoIndent: 'full',
                                                formatOnType: true,
                                                formatOnPaste: true,
                                                contextmenu: true,
                                                accessibilitySupport: 'auto',
                                                acceptSuggestionOnEnter: 'on',
                                                acceptSuggestionOnCommitCharacter: true,
                                                snippetSuggestions: 'inline',
                                                suggestOnTriggerCharacters: true,
                                                suggestSelection: 'first',
                                                tabCompletion: 'on',
                                                autoClosingQuotes: 'always',
                                                autoClosingOvertype: 'always',
                                                autoClosingDelete: 'always',
                                                automaticLayout: true,
                                                dragAndDrop: true,
                                                colorDecorators: true,
                                                colorDecoratorsActivatedOn: "clickAndHover",
                                                copyWithSyntaxHighlighting: true,
                                                cursorBlinking: 'blink',
                                                cursorSmoothCaretAnimation: "on",
                                                mouseWheelZoom: true,
                                                quickSuggestions: { other: true, comments: true, strings: true },
                                                readOnly: true,
                                            }}
                                            theme="vs-dark"
                                            language={language}
                                        />
                                    </div>
                                </Transition>
                            </li>
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CommitHistory;
