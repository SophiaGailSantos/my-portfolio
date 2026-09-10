import BounceCards from "./BounceCards";
import ProjectCard from "./ProjectCard";

function Projects() {
    const projects = [
  {
    title: "GirlTalk",
      description:
        "A women's health application that provides helpful health information, period tracking, reminders, and wellness tips.",
      technologies: ["React", "CSS", "MySQL"],
      github: "https://github.com/",
      figma: "https://www.figma.com/"
    },
    {
      title: "JEN Academia",
      description:
        "An online English learning platform designed to connect students with teachers and manage lessons, schedules, and feedback.",
      technologies: ["React", "Node.js", "MySQL"],
      github: "https://github.com/",
      figma: "https://www.figma.com/"
    },
    {
      title: "Personal Portfolio",
      description:
        "A responsive personal portfolio showcasing my skills, projects, and experience as a UI/UX designer and front-end developer.",
      technologies: ["React", "CSS", "JavaScript"],
      github: "https://github.com/",
      figma: "https://www.figma.com/"
    }
  ];

    return (
    <section id="projects">
      <div className="projects-content">
        <p className="section-title">MY PROJECTS</p>

        <h2>Things I've Built</h2>

        <BounceCards
          className="projects-list projects-bounce"
          items={projects}
          containerHeight={430}
          animationDelay={0.35}
          animationStagger={0.16}
          transformStyles={[
            "rotate(-6deg) translate(-365px)",
            "rotate(0deg)",
            "rotate(6deg) translate(365px)",
          ]}
          renderCard={(project) => (
            <ProjectCard
              title={project.title}
              description={project.description}
              technologies={project.technologies}
              github={project.github}
              figma={project.figma}
            />
          )}
        />
      </div>
    </section>
  );
}

export default Projects;
