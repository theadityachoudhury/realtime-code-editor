const defaultExtensionMap: Record<string, string> = {
    javascript: 'js',
    typescript: 'ts',
    python: 'py',
    java: 'java',
    c: 'c',
    cpp: 'cpp',
    html: 'html',
    css: 'css',
    scss: 'scss',
    json: 'json',
    xml: 'xml',
    markdown: 'md',
    sql: 'sql',
    shell: 'sh',
    php: 'php',
    ruby: 'rb',
    go: 'go',
    swift: 'swift',
    kotlin: 'kt',
    rust: 'rs',
    perl: 'pl',
    rs: 'rust',
    yaml: 'yaml',
    objectivec: 'm',
    groovy: 'groovy',
    powershell: 'ps1',
    dockerfile: 'dockerfile',
    plaintext: 'txt',
};

const defaultExtensionMapReverse: Record<string, string> = Object.fromEntries(
    Object.entries(defaultExtensionMap).map(([key, value]) => [value, key])
);

export const getLanguageFromExtension = (extension: string | undefined): string => {
    if (!extension) return 'plaintext';
    return defaultExtensionMapReverse[extension];
};

export const getExtensionFromLanguage = (language: string | undefined): string => {
    if (!language) return 'txt';
    return defaultExtensionMap[language];
};
