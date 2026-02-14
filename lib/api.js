import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const contentDirectory = path.join(process.cwd(), 'content');

export function getProfile() {
    const fullPath = path.join(contentDirectory, 'profile.json');
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    return JSON.parse(fileContents);
}

export async function markdownToHtml(markdown) {
    const result = await remark().use(html).process(markdown);
    return result.toString();
}

export function getAllItems(collection) {
    const collectionDirectory = path.join(contentDirectory, collection);
    if (!fs.existsSync(collectionDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(collectionDirectory);
    const allItems = fileNames.map((fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(collectionDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
            slug,
            ...data,
            content,
        };
    });

    // Sort by date if available
    return allItems.sort((a, b) => {
        if (a.date && b.date) {
            return new Date(b.date) - new Date(a.date);
        }
        if (a.startDate && b.startDate) {
            return new Date(b.startDate) - new Date(a.startDate);
        }
        return 0;
    });
}
