import { getProfile, getAllItems, markdownToHtml } from "../lib/api";
import PortfolioUI from "../components/PortfolioUI";

export default async function Home() {
  const profile = getProfile();
  const experienceRaw = getAllItems("experience");
  const projectsRaw = getAllItems("projects");
  const educationRaw = getAllItems("education");
  const skills = getAllItems("skills");

  // Process markdown content for experience
  const experience = await Promise.all(experienceRaw.map(async (job) => ({
    ...job,
    content: await markdownToHtml(job.content || '')
  })));

  // Process markdown content for projects
  const projects = await Promise.all(projectsRaw.map(async (project) => ({
    ...project,
    content: await markdownToHtml(project.content || '')
  })));

  // Process markdown content for education
  const education = await Promise.all(educationRaw.map(async (edu) => ({
    ...edu,
    content: await markdownToHtml(edu.content || '')
  })));

  return (
    <PortfolioUI
      profile={profile}
      experience={experience}
      education={education}
      projects={projects}
      skills={skills}
    />
  );
}
