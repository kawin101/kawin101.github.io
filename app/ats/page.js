import { getProfile, getAllItems } from '../../lib/api';
import ATSPageClient from '../../components/ats/ATSPageClient';

export const metadata = {
    title: 'AI ATS Optimizer | Career Tools',
    description: 'Optimize your resume for Applicant Tracking Systems with AI-powered analysis.',
}

export default function ATSPage() {
    const profile = getProfile();
    const experience = getAllItems('experience');
    const education = getAllItems('education');
    const skills = getAllItems('skills');
    const projects = getAllItems('projects');

    const portfolioData = {
        profile,
        experience,
        education,
        skills,
        projects
    };

    return <ATSPageClient portfolioData={portfolioData} />;
}
