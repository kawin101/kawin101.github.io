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
  const projects = await Promise.all(projectsRaw.map(async (project) => {
    // Convert description from markdown to HTML
    const descriptionHtml = await markdownToHtml(project.description || '');
    return {
      ...project,
      description: descriptionHtml, // Overwrite with HTML
      content: await markdownToHtml(project.content || '') // Keep content for backward compatibility if needed, though hidden in CMS now
    };
  }));

  // Process markdown content for education
  const education = await Promise.all(educationRaw.map(async (edu) => ({
    ...edu,
    content: await markdownToHtml(edu.content || '')
  })));

  // Get latest blog post date for notification
  const blogPosts = getAllItems("blog");

  return (
    <PortfolioUI
      profile={profile}
      experience={experience}
      education={education}
      projects={projects}
      skills={skills}
      blogPosts={blogPosts}
    />
  );
}
