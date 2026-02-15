// Basic client-side logic for keyword matching
// In a real app, this might use NLP or deeper analysis

// Helper to extract keywords from text (Naive implementation)
// Ignores common stop words and finds frequent words/phrases
const STOP_WORDS = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'to', 'of', 'in', 'on', 'at', 'for', 'with', 'by', 'as', 'it', 'this', 'that', 'i', 'you', 'he', 'she', 'we', 'they', 'experience', 'work', 'job', 'skills', 'responsibilities', 'requirements', 'summary', 'education'
]);

export function extractKeywords(text) {
    if (!text) return [];

    // Normalize text
    const normalized = text.toLowerCase().replace(/[^\w\s]/g, '');
    const words = normalized.split(/\s+/);

    // Count frequency
    const freq = {};
    words.forEach(word => {
        if (word.length > 2 && !STOP_WORDS.has(word)) {
            freq[word] = (freq[word] || 0) + 1;
        }
    });

    // Valid keywords (appearing more than once or being specific technical terms)
    // For now, we return unique words as "keywords"
    return Object.keys(freq);
}

import logger from './logger';

export function analyzeATS(resumeText, jdText) {
    if (!resumeText || !jdText) {
        logger.warn('AnalyzeATS called with empty resume or job description');
        return null;
    }

    logger.info('Starting Basic Regex Analysis');

    const resumeKeywords = new Set(extractKeywords(resumeText));
    const jdKeywords = extractKeywords(jdText);

    // Identify Matches and Missing
    const matches = [];
    const missing = [];

    // We only care about matching JD keywords
    const uniqueJDKeywords = [...new Set(jdKeywords)];

    uniqueJDKeywords.forEach(kw => {
        if (resumeKeywords.has(kw)) {
            matches.push(kw);
        } else {
            missing.push(kw);
        }
    });

    // Score Calculation
    // Weighted by coverage of JD keywords
    const coverage = matches.length / uniqueJDKeywords.length;
    let score = Math.round(coverage * 100);

    // Heuristic Adjustments
    if (resumeText.length > 500) score += 5; // Bonus for reasonable length
    if (score > 100) score = 100;

    return {
        score,
        matches,
        missing
    };
}
