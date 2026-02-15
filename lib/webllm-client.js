import { CreateMLCEngine } from "@mlc-ai/web-llm";
import logger from './logger';

// We use Llama-3-8B-Instruct because it is a powerful open-source model 
// capable of detailed reasoning and categorization.
// Note: Ensure this ID matches the one in MLC's prebuiltAppConfig or provided model_list
const SELECTED_MODEL = "Llama-3.1-8B-Instruct-q4f32_1-MLC";

let engine = null;

export const initWebLLM = async (progressCallback) => {
    if (engine) return engine;

    try {
        logger.info('Initializing WebLLM Engine', { model: SELECTED_MODEL });
        engine = await CreateMLCEngine(SELECTED_MODEL, {
            initProgressCallback: (progress) => {
                if (progressCallback) {
                    progressCallback(progress);
                }
            },
        });
        logger.info('WebLLM Engine Initialized Successfully');
        return engine;
    } catch (error) {
        logger.error('Failed to initialize WebLLM', { error: error.message });
        throw error;
    }
};

export const analyzeWithWebLLM = async (resumeText, jdText, lang = 'en', progressCallback) => {
    try {
        if (!engine) {
            await initWebLLM(progressCallback);
        }

        logger.info('Starting WebLLM Analysis', { lang });

        const systemPrompt = `You are an expert ATS (Applicant Tracking System) Analyzer.
        Your goal is to compare a Resume against a Job Description and output a detailed JSON analysis.
        
        Rules:
        1. Output MUST be valid JSON only. No markdown.
        2. JSON Structure:
        {
            "score": (0-100),
            "summary": "Brief overall feedback",
            "hard_skills": {
                "match": ["skill1", "skill2"],
                "missing": ["skill3", "skill4"]
            },
            "soft_skills": {
                "match": ["skill1"],
                "missing": ["skill2"]
            },
            "experience_relevance": "Comment on how well experience matches",
            "formatting_check": "Comment on resume structure/readability"
        }
        3. Be strict but fair. Identify specific technologies (Hard Skills) vs Personal attributes (Soft Skills).
        4. "summary", "experience_relevance", "formatting_check" should be in ${lang === 'th' ? 'Thai' : 'English'}.
        `;

        const userPrompt = `
        JOB DESCRIPTION:
        ${jdText.substring(0, 2000)}

        RESUME:
        ${resumeText.substring(0, 2000)}

        Analyze now. usage JSON format.
        `;

        const messages = [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ];

        const reply = await engine.chat.completions.create({
            messages,
        });

        const responseText = reply.choices[0].message.content;

        // Attempt to extract JSON if the model includes markdown blocks
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : responseText;

        const result = JSON.parse(jsonStr);
        logger.info('WebLLM Analysis Completed', { score: result.score });
        return result;

    } catch (error) {
        logger.error('WebLLM Analysis Error', { error: error.message });
        throw error;
    }
};

export const fixResumeWithWebLLM = async (resumeText, jdText, missingKeywords, lang = 'en', progressCallback) => {
    try {
        if (!engine) {
            await initWebLLM(progressCallback);
        }

        logger.info('Starting WebLLM Auto-Fix', { missingKeywordsCount: missingKeywords.length });

        const systemPrompt = `You are an expert Resume Writer. 
        Your goal is to rewrite the candidate's resume to include missing keywords from the Job Description, 
        while maintaining truthfulness and professional tone.
        
        Rules:
        1.  Integrate these missing keywords naturally into the experience or skills sections: ${missingKeywords.join(', ')}.
        2.  Do NOT invent false experiences. Just emphasize relevant skills.
        3.  Output the FULL rewritten resume text in clean markdown/text format.
        4.  Language: ${lang === 'th' ? 'Thai' : 'English'}.
        `;

        const userPrompt = `
        JOB DESCRIPTION:
        ${jdText.substring(0, 1500)}

        ORIGINAL RESUME:
        ${resumeText.substring(0, 2000)}

        Rewrite the resume now to optimize for ATS.
        `;

        const messages = [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ];

        const reply = await engine.chat.completions.create({
            messages,
        });

        logger.info('WebLLM Auto-Fix Completed');
        return reply.choices[0].message.content;

    } catch (error) {
        logger.error('WebLLM Auto-Fix Error', { error: error.message });
        throw error;
    }
};
