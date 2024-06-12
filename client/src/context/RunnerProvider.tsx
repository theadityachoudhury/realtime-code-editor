import React, { createContext, useContext, useState, useEffect } from 'react';
import config from '../Config';
import { useFiles } from './FileProvider';
import { convertToWindowsLineEndings } from '../Utils/codeConverter';
import instance from '../axios';
import {useUserContext} from "./UserProvider";

// Define the type for the language info
type LanguageInfo = {
    language: string;
    version: string;
    aliases?: string[];
};

// Define the type for the runner provider context
type RunnerContextType = {
    languageInfo: LanguageInfo | null;
    setLanguageInfo: (info: LanguageInfo | null) => void;
    getLanguageInfoByExtension: (extension: string) => LanguageInfo | null;
    languageMap: Record<string, LanguageInfo>;
    run: () => void;
    output: string;
    setOutput: (output: string) => void;
    stdin: string;
    setStdin: (stdin: string) => void;
};

// Create the context
const RunnerContext = createContext<RunnerContextType>({
    languageInfo: null,
    setLanguageInfo: () => { },
    getLanguageInfoByExtension: () => null,
    languageMap: {},
    run: () => { },
    output: '',
    setOutput: () => { },
    stdin: '',
    setStdin: () => { },
});

// Define the props interface for the RunnerProvider component
type RunnerProviderProps = {
    children: React.ReactNode;
};

// Define the RunnerProvider component
export const RunnerProvider: React.FC<RunnerProviderProps> = ({ children }) => {
    const { activeFile } = useFiles();
    const {authenticated} = useUserContext();
    const [languageInfo, setLanguageInfo] = useState<LanguageInfo | null>(null);
    const [languageMap, setLanguageMap] = useState<Record<string, LanguageInfo>>({});
    const [output, setOutput] = useState<string>('');
    const [stdin, setStdin] = useState<string>('');

    // Function to fetch supported languages and versions
    const fetchLanguages = async () => {
        try {
            // Replace the URL with your actual endpoint
            const response = await instance.get(`${config.BACKEND_URL}/api/code/runtimes`);

            // Extract the data from the response
            const data = response.data;

            // Create language map
            const map: Record<string, LanguageInfo> = {};
            data.forEach((lang: LanguageInfo) => {
                map[lang.language] = lang;
            });
            setLanguageMap(map);
        } catch (error) {
            console.error('Error fetching languages:', error);
        }
    };

    useEffect(() => {
        if (authenticated && activeFile) {
            setLanguageInfo(getLanguageInfoByExtension(activeFile.language));
        }
    }, [activeFile, languageMap,authenticated]);

    // Fetch languages on component mount
    useEffect(() => {
      if(authenticated)
        fetchLanguages();
    }, [authenticated]);

    // Function to get language info by extension
    const getLanguageInfoByExtension = (extension: string): LanguageInfo | null => {
        for (const langInfo of Object.values(languageMap)) {
            if (langInfo.language === extension || langInfo.aliases?.includes(extension)) {
                return langInfo;
            }
        }
        return null;
    };


    const run = async () => {
        if (!activeFile) return;

        try {
            const response = await instance.post(`${config.BACKEND_URL}/api/code/execute`, {
                language: languageInfo?.language,
                version: languageInfo?.version,
                files: [{
                    name: activeFile.name,
                    content: convertToWindowsLineEndings(activeFile.content),
                }],
                stdin: convertToWindowsLineEndings(stdin),
            });


            if (response.data.run.code != 0) {
                if (response.data.compile)
                    setOutput(response.data.compile.stderr);
                else
                    setOutput(response.data.run.stderr);
            } else {
                setOutput(response.data.run.stdout);
            }
        } catch (error) {
            console.error('Error running code:', error);
        }
    }

    return (
        <RunnerContext.Provider
            value={{ languageInfo, setLanguageInfo, languageMap, getLanguageInfoByExtension, run, output, setOutput, stdin, setStdin }}
        >
            {children}
        </RunnerContext.Provider>
    );
};

// Custom hook to use the Runner context
export const useRunner = () => useContext(RunnerContext);
