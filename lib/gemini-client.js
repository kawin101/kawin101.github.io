import logger from './logger';

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export async function generateContent(apiKey, prompt) {
    if (!apiKey) {
        throw new Error("API Key is missing");
    }

    try {
        logger.info('Calling Gemini API');
        const response = await fetch(`${BASE_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            logger.error('Gemini API Response Error', { error: errorData });
            throw new Error(errorData.error?.message || 'Failed to fetch from Gemini API');
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            logger.warn('Gemini API returned no content');
            throw new Error("No content generated");
        }

        logger.info('Gemini API Success');
        return text;

    } catch (error) {
        logger.error("Gemini API Error:", { error: error.message });
        throw error;
    }
}

export async function analyzeWithGemini(apiKey, resumeText, jdText, lang = 'en') {
    const prompt = `
        Role: Expert ATS System and Resume Scanner.
        Task: Compare the Candidate Resume against the Job Description.

        Resume:
        "${resumeText.substring(0, 3000)}..." (truncated if too long)

        Job Description:
        "${jdText.substring(0, 3000)}..."

        Output Format: JSON Object ONLY.
        {
            "score": (number 0-100),
            "matches": ["keyword1", "keyword2", ...],
            "missing": ["keyword3", "keyword4", ...],
            "summary": "Brief feedback summary strings..."
        }

        Rules:
        1. Be strict but fair.
        2. Identify key technical skills, tools, and soft skills from JD.
        3. 'matches' are keywords found in Resume.
        4. 'missing' are important keywords from JD NOT found in Resume.
        5. 'summary' should be in ${lang === 'th' ? 'Thai' : 'English'}.
        6. Return ONLY the JSON. No markdown formatting.
    `;

    try {
        const text = await generateContent(apiKey, prompt);
        // Clean up markdown code blocks if Gemini sends them
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        logger.error("AI Analysis Failed:", { error: error.message });
        throw new Error("Failed to parse AI Analysis");
    }
}
