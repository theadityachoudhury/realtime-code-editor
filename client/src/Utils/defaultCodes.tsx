// defaultCodes.ts
interface DefaultCodes {
    [key: string]: string;
}

const defaultCodes: DefaultCodes = {
    javascript: `console.log('Hello, world!');`,
    typescript: `console.log('Hello, world!');`,
    python: `print('Hello, world!')`,
    java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, world!");
    }
}`,
    c: `#include <stdio.h>

int main() {
    printf("Hello, world!\\n");
    return 0;
}`,
    cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, world!" << endl;
    return 0;
}`,
    html: `<!DOCTYPE html>
<html>
<head>
    <title>Hello World</title>
</head>
<body>
    <h1>Hello, world!</h1>
</body>
</html>`,
    css: `body {
    font-family: Arial, sans-serif;
    text-align: center;
    margin-top: 50px;
}

h1 {
    color: #333;
}`,
    scss: `body {
    font-family: Arial, sans-serif;
    text-align: center;
    margin-top: 50px;
    
    h1 {
        color: #333;
    }
}`,
    json: `{
    "message": "Hello, world!"
}`,
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<message>Hello, world!</message>`,
    markdown: `# Hello, world!`,
    sql: `SELECT 'Hello, world!';`,
    shell: `echo "Hello, world!"`,
    php: `<?php
echo "Hello, world!";
?>`,
    ruby: `puts 'Hello, world!'`,
    go: `package main
import "fmt"

func main() {
    fmt.Println("Hello, world!")
}`,
    swift: `import Swift
print("Hello, world!")`,
    kotlin: `fun main() {
    println("Hello, world!")
}`,
    rust: `fn main() {
    println!("Hello, world!");
}`,
    perl: `print "Hello, world!\\n";`,
    r: `print("Hello, world!")`,
    yaml: `message: "Hello, world!"`,
    objectivec: `#import <Foundation/Foundation.h>

int main() {
    @autoreleasepool {
        NSLog(@"Hello, world!");
    }
    return 0;
}`,
    groovy: `println 'Hello, world!'`,
    powershell: `Write-Output "Hello, world!"`,
    dockerfile: `FROM alpine:latest
CMD ["echo", "Hello, world!"]`,
    plaintext: `Hello, world!`
};

export default defaultCodes;
