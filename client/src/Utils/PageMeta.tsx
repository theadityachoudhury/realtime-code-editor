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
    keywords = '',
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
