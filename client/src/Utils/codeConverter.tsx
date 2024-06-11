export function convertToWindowsLineEndings(codeSnippet: string): string {
    // Replace all occurrences of LF (\n) with CRLF (\r\n)
    return codeSnippet.replace(/\r?\n/g, '\r\n');
}