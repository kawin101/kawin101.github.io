import { getAllItems } from '@/lib/api';
import ProjectList from '@/components/ProjectList';

export default function ProjectIndex() {
    const projects = getAllItems('projects');

    // Serialize projects
    const serializableProjects = projects.map(project => ({
        ...project,
        date: project.date ? project.date.toString() : null,
        startDate: project.startDate ? project.startDate.toString() : null,
        endDate: project.endDate ? project.endDate.toString() : null,
    }));

    return <ProjectList projects={serializableProjects} />;
}
