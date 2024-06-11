export function convertToWindowsLineEndings(codeSnippet:string) {
    return codeSnippet.replace(/\n/g, '\r\n').replace(/"/g, '\\"');
}
