// src/Components/CodeEditor.tsx
import React, { useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useFiles } from '../../context/FileProvider';
import { useEditor } from '../../context/CodeEditorProvider';
import Header from '../Header';
import { convertToWindowsLineEndings } from '../../Utils/codeConverter';
import Loader from '../Loader';


const CodeEditor: React.FC = () => {
    const { language, setLanguage, theme, code, setCode, getDefaultCode } = useEditor();
    const { updateFile, activeFile } = useFiles();


    localStorage.setItem('testCode', convertToWindowsLineEndings(code));

    useEffect(() => {
        if (activeFile) {
            setCode(activeFile.content || getDefaultCode(language));
            setLanguage(activeFile.language);
        }
    }, [activeFile, setCode]);

    // const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     const selectedLanguage = e.target.value;
    //     setLanguage(selectedLanguage);
    //     if (activeFile) {
    //         updateFile(activeFile.id, getDefaultCode(selectedLanguage), selectedLanguage);
    //     }
    // };

    // const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     setTheme(e.target.value);
    // };

    return (
        <div className="flex h-screen">
            {/* SideBar */}
            <Header />
            <div className="flex-grow h-full overflow-hidden">
                <Editor
                    className="w-full h-full"
                    language={language}
                    theme={theme}
                    value={code}
                    onChange={(value) => {
                        if (!activeFile) return;
                        updateFile(activeFile.id, value || '', language);
                    }}
                    loading={<Loader type='spinner' size={48}/>}
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
