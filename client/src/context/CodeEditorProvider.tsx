// src/Context/EditorContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import defaultCodes from '../Utils/defaultCodes';

interface CodeEditorContextType {
    language: string;
    setLanguage: (language: string) => void;
    theme: string;
    setTheme: (theme: string) => void;
    code: string;
    setCode: (code: string) => void;
    getDefaultCode: (language: string) => string;
}

const CodeEditorContext = createContext<CodeEditorContextType | undefined>(undefined);

export const CodeEditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<string>(localStorage.getItem('language') || 'javascript');
    const [theme, setTheme] = useState<string>(localStorage.getItem('theme') || 'vs-dark');
    const [code, setCode] = useState<string>(localStorage.getItem('code') || '// Write your code here');

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('code', code);
    }, [code]);

    const getDefaultCode = (language: string): string => {
        return defaultCodes[language] || '// Write your code here';
    };

    const value = {
        language,
        setLanguage,
        theme,
        setTheme,
        code,
        setCode,
        getDefaultCode,
    };

    return <CodeEditorContext.Provider value={value}>{children}</CodeEditorContext.Provider>;
};

export const useEditor = (): CodeEditorContextType => {
    const context = useContext(CodeEditorContext);
    if (!context) {
        throw new Error('useEditor must be used within an EditorProvider');
    }
    return context;
};
