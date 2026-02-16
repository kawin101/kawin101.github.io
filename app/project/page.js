import { getAllItems, markdownToHtml } from '@/lib/api';
import ProjectList from '@/components/ProjectList';

export default async function ProjectIndex() {
    const projectsRaw = getAllItems('projects');

    // Process markdown and serialize
    const projects = await Promise.all(projectsRaw.map(async (project) => ({
        ...project,
        content: await markdownToHtml(project.content || ''),
        date: project.date ? project.date.toString() : null,
        startDate: project.startDate ? project.startDate.toString() : null,
        endDate: project.endDate ? project.endDate.toString() : null,
    })));

    return <ProjectList projects={projects} />;
}
