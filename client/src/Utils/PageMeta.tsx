import React, { useEffect } from 'react';

interface PageMetaProps {
    title: string;
    description: string;
    keywords?: string;
    author?: string;
    robots?: string;
    canonical?: string;
}

const PageMeta: React.FC<PageMetaProps> = ({
    title,
    description,
    keywords = 'Online Code Editor, Real-time Code Collaboration, Collaborative Programming, Code Sharing Platform, Multi-user Code Editor, Synchronous Coding, Live Coding Collaboration, Collaborative Coding Tools, Code Collaboration Software, Online Coding Workspace, Real-time Programming Environment, Team Coding Platform, Web-based Code Editor, Live Code Sharing, Remote Coding Collaboration, Pair Programming Online, Online Code Pairing, Interactive Code Editor, Cloud-based Code Editor, Collaborative Development Environment, Online IDE for Teams, Live Code Review, Multi-person Code Editing, Real-time Development Tool, Online Code Collaboration Tool, Remote Development Platform, Code Collaboration in the Cloud, Web IDE Collaboration, Online Programming Platform, Shared Coding Environment',
    author = 'Aditya Choudhury',
    robots = 'index, follow',
    canonical = '',
}) => {
    useEffect(() => {
        document.title = title;
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', description);
        } else {
            const newMeta = document.createElement('meta');
            newMeta.setAttribute('name', 'description');
            newMeta.setAttribute('content', description);
            document.head.appendChild(newMeta);
        }

        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
            metaKeywords.setAttribute('content', keywords);
        } else if (keywords) {
            const newMeta = document.createElement('meta');
            newMeta.setAttribute('name', 'keywords');
            newMeta.setAttribute('content', keywords);
            document.head.appendChild(newMeta);
        }

        if (author) {
            const metaAuthor = document.querySelector('meta[name="author"]');
            if (metaAuthor) {
                metaAuthor.setAttribute('content', author);
            } else {
                const newMeta = document.createElement('meta');
                newMeta.setAttribute('name', 'author');
                newMeta.setAttribute('content', author);
                document.head.appendChild(newMeta);
            }
        }

        if (robots) {
            const metaRobots = document.querySelector('meta[name="robots"]');
            if (metaRobots) {
                metaRobots.setAttribute('content', robots);
            } else {
                const newMeta = document.createElement('meta');
                newMeta.setAttribute('name', 'robots');
                newMeta.setAttribute('content', robots);
                document.head.appendChild(newMeta);
            }
        }

        if (canonical) {
            const linkCanonical = document.querySelector('link[rel="canonical"]');
            if (linkCanonical) {
                linkCanonical.setAttribute('href', canonical);
            } else {
                const newLink = document.createElement('link');
                newLink.setAttribute('rel', 'canonical');
                newLink.setAttribute('href', canonical);
                document.head.appendChild(newLink);
            }
        }
    }, [title, description, keywords, author, robots, canonical]);

    return null;
};

export default PageMeta;
