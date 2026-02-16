import { getAllItems, markdownToHtml } from '@/lib/api';
import ProjectPostContent from '@/components/ProjectPostContent';

export async function generateStaticParams() {
    const projects = getAllItems('projects');

    return projects.map((project) => ({
        slug: project.slug,
    }));
}

export default async function ProjectPage({ params }) {
    const { slug } = await params;
    const projects = getAllItems('projects');
    const project = projects.find((p) => p.slug === decodeURIComponent(slug));

    if (!project) {
        return <div className="container py-5 mt-5 text-center"><h1>Project not found</h1></div>;
    }

    // markdownToHtml is async
    const content = await markdownToHtml(project.content || '');

    // Serialize Date objects for Client Component
    const serializableProject = {
        ...project,
        date: project.date ? project.date.toString() : null,
        startDate: project.startDate ? project.startDate.toString() : null,
        endDate: project.endDate ? project.endDate.toString() : null,
    };

    return <ProjectPostContent project={serializableProject} content={content} />;
}
