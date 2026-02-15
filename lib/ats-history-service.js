import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { v4 as uuidv4 } from 'uuid';
import winstonLogger from './winston-logger';

const HISTORY_DIR = path.join(process.cwd(), 'content/ats-history');

// Ensure directory exists
if (!fs.existsSync(HISTORY_DIR)) {
    fs.mkdirSync(HISTORY_DIR, { recursive: true });
}

export const atsHistoryService = {
    getAll: async () => {
        try {
            const files = fs.readdirSync(HISTORY_DIR);
            const history = files
                .filter(file => file.endsWith('.md'))
                .map(file => {
                    const filePath = path.join(HISTORY_DIR, file);
                    const fileContent = fs.readFileSync(filePath, 'utf-8');
                    const { data } = matter(fileContent);
                    return {
                        id: file.replace('.md', ''),
                        ...data,
                        date: data.date ? new Date(data.date).toISOString() : new Date().toISOString()
                    };
                })
                .sort((a, b) => new Date(b.date) - new Date(a.date));

            return history;
        } catch (error) {
            winstonLogger.error('Failed to get history', { error: error.message });
            return [];
        }
    },

    getById: async (id) => {
        try {
            const filePath = path.join(HISTORY_DIR, `${id}.md`);
            if (!fs.existsSync(filePath)) return null;

            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const { data, content } = matter(fileContent);

            return {
                id,
                ...data,
                analysisRaw: content
            };
        } catch (error) {
            winstonLogger.error('Failed to get history by id', { id, error: error.message });
            return null;
        }
    },

    save: async (analysisData) => {
        try {
            const date = new Date();
            const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD

            // Create a slug from Role and Company
            const roleSlug = (analysisData.role || 'general').toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const companySlug = (analysisData.company || 'unknown').toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const slug = `${dateStr}-${roleSlug}-${companySlug}`;

            // Ensure uniqueness
            let fileName = `${slug}.md`;
            let counter = 1;
            while (fs.existsSync(path.join(HISTORY_DIR, fileName))) {
                fileName = `${slug}-${counter}.md`;
                counter++;
            }

            const frontmatter = {
                title: `${analysisData.role} at ${analysisData.company}`, // Added title for CMS
                date: date.toISOString(),
                score: analysisData.score,
                role: analysisData.role || 'General',
                company: analysisData.company || 'Unknown',
                summary: analysisData.analysis.summary,
                keywords_match: analysisData.analysis.matches?.length || 0,
                keywords_missing: analysisData.analysis.missing?.length || 0
            };

            // Store the full analysis JSON object in the content body as a JSON string block
            // allowing us to reconstruct it strictly later
            const fileContent = matter.stringify(
                JSON.stringify(analysisData, null, 2),
                frontmatter
            );

            fs.writeFileSync(path.join(HISTORY_DIR, fileName), fileContent);

            const id = fileName.replace('.md', ''); // ID is the filename without extension
            winstonLogger.info('Saved ATS History', { id, score: analysisData.score });

            return { id, ...frontmatter };
        } catch (error) {
            winstonLogger.error('Failed to save history', { error: error.message });
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const filePath = path.join(HISTORY_DIR, `${id}.md`);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                winstonLogger.info('Deleted ATS History', { id });
                return true;
            }
            return false;
        } catch (error) {
            winstonLogger.error('Failed to delete history', { id, error: error.message });
            throw error;
        }
    }
};
