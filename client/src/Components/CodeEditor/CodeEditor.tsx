// src/Components/CodeEditor.tsx
import React, { useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useFiles } from '../../context/FileProvider';
import { useEditor } from '../../context/CodeEditorProvider';
import Header from '../Header';
import Loader from '../Loader';


const CodeEditor: React.FC = () => {
    const { language, setLanguage, theme, code, setCode, getDefaultCode } = useEditor();
    const { updateFile, activeFile, handleAddFile } = useFiles();

    useEffect(() => {
        if (activeFile) {
            setCode(activeFile.content || getDefaultCode(language));
            setLanguage(activeFile.language);
        }
    }, [activeFile, setCode]);

    return (
        <div className="flex h-screen" onKeyDown={(e) => {
            if (e.ctrlKey && e.key === '.') {
                handleAddFile();
            }
        }}>
            {/* SideBar */}
            <Header />
            <div className="flex-grow h-full overflow-hidden">
                <p className='text-md p-1 bg-gray-800'>{activeFile?.name}</p>
                <Editor
                    className="w-full h-full"
                    language={language}
                    theme={theme}
                    value={code}
                    onChange={(value) => {
                        if (!activeFile) return;
                        updateFile(activeFile.id, value || '', language);
                    }}
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
                    }}
                />
            </div>
        </div>
    );
};

export default CodeEditor;
