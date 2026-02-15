'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ResumeInput from './ResumeInput';
import JobDescriptionInput from './JobDescriptionInput';
import ScoreDashboard from './ScoreDashboard';
import KeywordAnalysis from './KeywordAnalysis';
import SettingsModal from './SettingsModal';
import HistoryList from './HistoryList';
import SuggestionCard from './SuggestionCard';
import WebsiteImportModal from './WebsiteImportModal';
import ResultEditor from './ResultEditor';
import logger from '../../lib/logger';
import { analyzeATS } from '../../lib/ats-logic';
import { generateContent, analyzeWithGemini } from '../../lib/gemini-client';
import { analyzeWithWebLLM, initWebLLM, fixResumeWithWebLLM } from '../../lib/webllm-client';


export default function ATSPageClient({ portfolioData }) {
    // State
    const [resumeText, setResumeText] = useState('');
    const [jdText, setJdText] = useState('');
    const [targetRole, setTargetRole] = useState('');
    const [targetCompany, setTargetCompany] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isAiGenerating, setIsAiGenerating] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState([]);

    // Settings & Modals State
    const [showSettings, setShowSettings] = useState(false);
    const [showImportWeb, setShowImportWeb] = useState(false);
    const [showResultEditor, setShowResultEditor] = useState(false);
    const [optimizedResume, setOptimizedResume] = useState('');

    const [apiKey, setApiKey] = useState('');
    const [lang, setLang] = useState('en');
    const [aiProvider, setAiProvider] = useState('cloud'); // 'cloud' | 'local'
    const [modelProgress, setModelProgress] = useState(null); // { text, progress }

    // History State
    const [showHistory, setShowHistory] = useState(false);
    const [refreshHistory, setRefreshHistory] = useState(0);

    // Load Settings from LocalStorage
    useEffect(() => {
        const storedKey = localStorage.getItem('gemini_api_key');
        const storedLang = localStorage.getItem('ats_lang');
        const storedProvider = localStorage.getItem('ats_ai_provider');

        if (storedKey) setApiKey(storedKey);
        if (storedLang) setLang(storedLang);
        if (storedProvider) setAiProvider(storedProvider);
    }, []);

    const saveSettings = (key, language, provider) => {
        setApiKey(key);
        setLang(language);
        setAiProvider(provider);
        localStorage.setItem('gemini_api_key', key);
        localStorage.setItem('ats_lang', language);
        localStorage.setItem('ats_ai_provider', provider);
    };

    const handleSaveHistory = () => {
        if (!analysis) return;

        try {
            const newEntry = {
                id: Date.now().toString(),
                score: analysis.score,
                role: targetRole,
                company: targetCompany,
                analysis: analysis,
                resumeText: resumeText,
                jdText: jdText,
                date: new Date().toISOString()
            };

            const storedHistory = localStorage.getItem('ats_history');
            const history = storedHistory ? JSON.parse(storedHistory) : [];
            const updatedHistory = [newEntry, ...history];

            localStorage.setItem('ats_history', JSON.stringify(updatedHistory));
            alert("Analysis Saved to Local Storage!");
            setRefreshHistory(prev => prev + 1);

        } catch (error) {
            logger.error('Failed to save history to localStorage', { error });
            alert("Failed to save.");
        }
    };

    const handleHistorySelect = (item) => {
        // Load history item back into state
        setAnalysis(item.analysis || item); // Handle legacy structure if any
        setTargetRole(item.role);
        setTargetCompany(item.company);
        setResumeText(item.resumeText || '');
        setJdText(item.jdText || '');
        setShowHistory(false);
    };


    // Text Strings (Localization)
    const t = {
        en: {
            title: "ATS Optimizer",
            subtitle: "Optimize your resume against job descriptions to increase your interview chances.",
            back: "Back to Portfolio",
            settings: "Settings",
            rolePlaceholder: "Target Job Title (e.g. Senior Frontend Dev)",
            companyPlaceholder: "Target Company (e.g. Google)",
            analyzeBtn: "Analyze Match",
            analyzing: "Analyzing...",
            aiFixBtn: "Auto-Fix with AI",
            aiFixing: "Generating...",
            templatesTitle: "ATS-Friendly Templates",
            templatesSubtitle: "Download these templates to get started quickly.",
            noKeyWarning: "Please set your Gemini API Key in Settings to use AI features.",
            importBtn: "Load Portfolio Data",
            importWebBtn: "Import from URL",
            importing: "Importing...",
            importSuccess: "Portfolio data loaded!",
            localLoading: "Loading Local AI Model..."
        },
        th: {
            title: "ระบบวิเคราะห์ ATS",
            subtitle: "ปรับปรุงเรซูเม่ของคุณให้ตรงกับประกาศงานเพื่อเพิ่มโอกาสสัมภาษณ์",
            back: "กลับสู่หน้าหลัก",
            settings: "ตั้งค่า",
            rolePlaceholder: "ตําแหน่งงานเป้าหมาย (เช่น Frontend Dev)",
            companyPlaceholder: "บริษัทเป้าหมาย (เช่น Google)",
            analyzeBtn: "วิเคราะห์คะแนน",
            analyzing: "กําลังวิเคราะห์...",
            aiFixBtn: "แก้ไขด้วย AI",
            aiFixing: "กําลังสร้าง...",
            templatesTitle: "เทมเพลตเรซูเม่ ATS",
            templatesSubtitle: "ดาวน์โหลดเทมเพลตที่ถูกต้องเพื่อเริ่มต้นใช้งาน",
            noKeyWarning: "กรุณาระบุ Gemini API Key ในการตั้งค่าเพื่อใช้งาน AI",
            importBtn: "ดึงข้อมูลจาก CMS",
            importWebBtn: "ดึงจาก URL",
            importing: "กําลังดึง...",
            importSuccess: "โหลดข้อมูลเรียบร้อย!",
            localLoading: "กําลังโหลดโมเดล AI..."
        }
    }[lang];

    const formatPortfolioToText = () => {
        if (!portfolioData) return;

        const { profile, experience, education, skills, projects } = portfolioData;
        let text = '';

        // Header
        text += `${profile.name}\n${profile.email} | ${profile.role}\n${profile.bio}\n\n`;

        // Skills
        text += `SKILLS\n`;
        skills.forEach(skill => {
            text += `${skill.title} (${skill.category})\n`;
        });
        text += `\n`;

        // Experience
        text += `EXPERIENCE\n`;
        experience.forEach(exp => {
            text += `${exp.title} at ${exp.company}\n`;
            text += `${new Date(exp.startDate).getFullYear()} - ${exp.endDate || 'Present'}\n`;
            text += `${exp.content || ''}\n`;
            if (exp.technologies) {
                text += `Technologies: ${exp.technologies.join(', ')}\n`;
            }
            text += `\n`;
        });

        // Projects
        text += `PROJECTS\n`;
        projects.forEach(proj => {
            text += `${proj.title}\n${proj.description}\n`;
            if (proj.tags) text += `Tags: ${proj.tags.join(', ')}\n`;
            text += `\n`;
        });

        // Education
        text += `EDUCATION\n`;
        education.forEach(edu => {
            text += `${edu.degree} in ${edu.major || ''}, ${edu.school}\n`;
        });

        // Cleanup markdown-ish artifacts (basic regex)
        text = text.replace(/<[^>]*>?/gm, ''); // Remove HTML tags

        setResumeText(text);
    };

    const handleWebImport = (scrapedText) => {
        setResumeText(prev => prev + (prev ? '\n\n' : '') + scrapedText);
    };

    const handleAnalyze = async () => {
        if (!resumeText.trim() || !jdText.trim()) return;

        setIsAnalyzing(true);
        setAnalysis(null);
        setModelProgress(null);
        logger.info('Analysis Initiated', { provider: aiProvider, lang });

        try {
            if (aiProvider === 'local') {
                // LOCAL AI ANALYSIS
                const result = await analyzeWithWebLLM(resumeText, jdText, lang, (progress) => {
                    setModelProgress(progress);
                });
                setAnalysis(result);
            }
            else if (aiProvider === 'cloud' && apiKey) {
                // CLOUD AI ANALYSIS
                const result = await analyzeWithGemini(apiKey, resumeText, jdText, lang);
                setAnalysis(result);
            }
            else {
                // LOCAL FALLBACK (REGEX)
                await new Promise(resolve => setTimeout(resolve, 1000));
                const result = analyzeATS(resumeText, jdText);
                setAnalysis(result);
            }

            setAiSuggestions([]);
        } catch (error) {
            logger.error('Analysis Failed', { error: error.message, provider: aiProvider });
            alert("Analysis Error: " + error.message);
        } finally {
            setIsAnalyzing(false);
            setModelProgress(null);
        }
    };

    const handleAiAutoFix = async () => {
        if (aiProvider === 'cloud' && !apiKey) {
            alert(t.noKeyWarning);
            setShowSettings(true);
            return;
        }

        setIsAiGenerating(true);
        setModelProgress(null);

        try {
            if (aiProvider === 'local') {
                // Local AI Auto-Fix
                const missingKeywords = analysis?.hard_skills?.missing || [];
                const fixedResume = await fixResumeWithWebLLM(resumeText, jdText, missingKeywords, lang, (progress) => {
                    setModelProgress(progress);
                });

                setOptimizedResume(fixedResume);
                setShowResultEditor(true);
            }
            else {
                // Cloud AI Auto-Fix (existing logic + improved)
                const prompt = `
                    Role: Expert Resume Writer and ATS Specialist.
                    Task: Analyze the provided Resume part and Job Description to suggest improvements.
                    Context: Target Role: ${targetRole || 'General'}, Target Company: ${targetCompany || 'General'}.
                    
                    Resume Content: 
                    "${resumeText.substring(0, 1000)}..." (truncated)

                    Job Description Keywords:
                    ${analysis?.hard_skills?.missing?.join(', ') || ''}

                    Instruction:
                    Provide 3 specific bullet points that incorporate the missing keywords naturally. 
                    Output ONLY the 3 bullet points in ${lang === 'th' ? 'Thai' : 'English'}.
                `;

                const suggestion = await generateContent(apiKey, prompt);
                setAiSuggestions([
                    {
                        title: lang === 'th' ? 'ข้อเสนอแนะจาก AI' : 'AI Suggestion',
                        content: suggestion.replace(/\n/g, '<br/>'),
                        type: 'ai'
                    }
                ]);
            }

        } catch (error) {
            alert("AI Error: " + error.message);
        } finally {
            setIsAiGenerating(false);
            setModelProgress(null);
        }
    };

    const handlePdfUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            alert("Please upload a PDF file.");
            return;
        }

        try {
            // Dynamic import to prevent SSR issues
            const pdfjsLib = await import('pdfjs-dist/build/pdf');

            // Set worker source
            if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
                pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
            }

            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

            let fullText = '';

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += pageText + '\n\n';
            }

            setResumeText(fullText);
            logger.info('PDF Uploaded and Parsed', { fileName: file.name, pages: pdf.numPages });
        } catch (error) {
            console.error(error);
            alert("Failed to parse PDF: " + error.message);
        }
    };

    return (
        <div className="container py-5">
            {/* History Offcanvas or Modal */}
            <div className={`offcanvas offcanvas-end ${showHistory ? 'show' : ''}`} tabIndex="-1" style={{ visibility: showHistory ? 'visible' : 'hidden' }}>
                <div className="offcanvas-header border-bottom">
                    <h5 className="offcanvas-title fw-bold"><i className="fas fa-history me-2"></i>Analysis History</h5>
                    <button type="button" className="btn-close text-reset" onClick={() => setShowHistory(false)}></button>
                </div>
                <div className="offcanvas-body p-0">
                    <HistoryList onSelect={handleHistorySelect} onRefresh={refreshHistory} />
                </div>
            </div>
            {showHistory && <div className="offcanvas-backdrop fade show" onClick={() => setShowHistory(false)}></div>}


            <SettingsModal
                show={showSettings}
                onClose={() => setShowSettings(false)}
                onSave={saveSettings}
                initialApiKey={apiKey}
                initialLang={lang}
                initialAiProvider={aiProvider}
            />

            <WebsiteImportModal
                show={showImportWeb}
                onClose={() => setShowImportWeb(false)}
                onImport={handleWebImport}
            />

            {showResultEditor && (
                <ResultEditor
                    initialText={optimizedResume}
                    onClose={() => setShowResultEditor(false)}
                />
            )}

            <div className="d-flex align-items-center justify-content-between mb-5">
                <div>
                    <Link href="/" className="btn btn-outline-secondary btn-sm mb-3">
                        <i className="fas fa-arrow-left me-2"></i>{t.back}
                    </Link>

                    {/* Highly Visible Title & Badge */}
                    <div className="d-flex align-items-center mb-2">
                        <h1 className="display-5 fw-bold mb-0 text-dark">
                            {t.title}
                        </h1>
                        <span
                            className="ms-3 px-3 py-1 fw-bold shadow-sm"
                            style={{
                                backgroundColor: '#45b5d2',
                                color: '#ffffff',
                                borderRadius: '20px',
                                fontSize: '0.9rem',
                                letterSpacing: '1px'
                            }}
                        >
                            BETA
                        </span>
                    </div>

                    {/* Clear Subtitle */}
                    <p className="lead" style={{ color: '#555555', fontWeight: '500' }}>
                        {t.subtitle}
                    </p>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-outline-secondary rounded-pill border" onClick={() => setShowHistory(true)}>
                        <i className="fas fa-history me-2"></i>History
                    </button>
                    <button className="btn btn-outline-dark rounded-pill border" onClick={() => setShowImportWeb(true)}>
                        <i className="fas fa-globe me-2"></i>{t.importWebBtn}
                    </button>
                    {portfolioData && (
                        <button className="btn btn-outline-primary rounded-pill border" onClick={formatPortfolioToText}>
                            <i className="fas fa-download me-2"></i>{t.importBtn}
                        </button>
                    )}
                    <button className="btn btn-light rounded-pill border" onClick={() => setShowSettings(true)}>
                        <i className="fas fa-cog me-2"></i>{t.settings}
                    </button>
                </div>
            </div>

            {/* Target Inputs */}
            <div className="row g-3 mb-4">
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control form-control-lg bg-white"
                        placeholder={t.rolePlaceholder}
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                    />
                </div>
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control form-control-lg bg-white"
                        placeholder={t.companyPlaceholder}
                        value={targetCompany}
                        onChange={(e) => setTargetCompany(e.target.value)}
                    />
                </div>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-lg-6">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <label className="form-label fw-bold mb-0">Resume Content</label>
                        <div className="d-flex gap-2">
                            <label className="btn btn-outline-danger btn-sm rounded-pill" style={{ cursor: 'pointer' }}>
                                <i className="fas fa-file-pdf me-2"></i>Upload PDF
                                <input
                                    type="file"
                                    accept=".pdf"
                                    className="d-none"
                                    onChange={handlePdfUpload}
                                />
                            </label>
                        </div>
                    </div>
                    <ResumeInput value={resumeText} onChange={setResumeText} />
                </div>
                <div className="col-lg-6">
                    <JobDescriptionInput value={jdText} onChange={setJdText} />
                </div>
            </div>

            <div className="text-center mb-5">
                <button
                    onClick={handleAnalyze}
                    disabled={!resumeText || !jdText || isAnalyzing}
                    className="btn btn-primary-glow btn-lg rounded-pill px-5 shadow-lg"
                >
                    {isAnalyzing ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            {modelProgress ? modelProgress.text : t.analyzing}
                        </>
                    ) : (
                        <><i className="fas fa-magic me-2"></i>{t.analyzeBtn}</>
                    )}
                </button>
                {modelProgress && (
                    <div className="mt-2 w-50 mx-auto">
                        <div className="progress" style={{ height: '5px' }}>
                            <div
                                className="progress-bar bg-success"
                                role="progressbar"
                                style={{ width: `${modelProgress.progress * 100}%` }}
                            ></div>
                        </div>
                        <small className="text-muted">{modelProgress.text}</small>
                    </div>
                )}
            </div>

            {analysis && (
                <div className="row g-4 mb-5">
                    <div className="col-lg-4">
                        <ScoreDashboard score={analysis.score} isAnalyzing={isAnalyzing} />

                        <div className="d-grid gap-2 mt-3">
                            <button className="btn btn-outline-success btn-sm" onClick={handleSaveHistory}>
                                <i className="fas fa-save me-2"></i>Save Analysis
                            </button>
                        </div>

                        <div className="card shadow-sm mt-4">
                            <div className="card-body">
                                <h5 className="fw-bold mb-3"><i className="fas fa-robot me-2 text-primary"></i>AI Suggestions</h5>
                                <p className="text-muted small">
                                    Your matching score is <strong>{analysis.score}%</strong>.
                                </p>

                                {aiSuggestions.map((s, i) => (
                                    <SuggestionCard key={i} title={s.title} content={s.content} type={s.type} />
                                ))}

                                <button
                                    className="btn btn-outline-primary btn-sm w-100 mt-2"
                                    onClick={handleAiAutoFix}
                                    disabled={isAiGenerating}
                                >
                                    {isAiGenerating ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            {modelProgress ? "Generating..." : t.aiFixing}
                                        </>
                                    ) : (
                                        <><i className="fas fa-pen-fancy me-2"></i>{t.aiFixBtn}</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-8">
                        <KeywordAnalysis analysis={analysis} />
                    </div>
                </div>
            )}

            {/* Templates Section */}
            <div className="py-5 border-top">
                <div className="text-center mb-5">
                    <h2 className="fw-bold">{t.templatesTitle}</h2>
                    <p className="text-muted">{t.templatesSubtitle}</p>
                </div>
                <div className="row g-4">
                    {[1, 2, 3].map((num) => (
                        <div className="col-md-4" key={num}>
                            <div className="card shadow-sm h-100 hover-card">
                                <div className="card-body text-center p-5 bg-light">
                                    <i className="far fa-file-pdf fa-3x text-danger mb-3"></i>
                                    <h5 className="fw-bold">Standard ATS Template {num}</h5>
                                    <p className="small text-muted">Clean, simple format optimized for parsing.</p>
                                    <button className="btn btn-outline-dark btn-sm rounded-pill mt-2">Download PDF</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
