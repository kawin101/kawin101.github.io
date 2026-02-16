import { getProfile, getAllItems } from '@/lib/api';
import PageWrapper from '@/components/PageWrapper';

export default function ProjectLayout({ children }) {
    const profile = getProfile();
    const projects = getAllItems("projects");
    const blogPosts = getAllItems("blog");
    const experience = getAllItems("experience");
    const education = getAllItems("education");

    return (
        <PageWrapper
            profile={profile}
            projects={projects}
            blogPosts={blogPosts}
            experience={experience}
            education={education}
        >
            {children}
        </PageWrapper>
    );
}
