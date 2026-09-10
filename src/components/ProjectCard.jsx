function ProjectCard({title, description, technologies, github, figma}) {
    return (
        <div className="project-card">
            <h3>{title}</h3>

            <p>{description}</p>

            <div className="technologies">
                {technologies.map((technology) => (
                    <span key={technology}>{technology}</span>
                    ))}
            </div>

            <div className="project-links">
                    {github && (
                        <a href={github} target="_blank" rel="noreferrer">
                            GitHub
                        </a>
                    )}
            {figma && (
                <a href={figma} target="_blank" rel="noreferrer">
                    Figma
                </a>
            )}
        </div>
     </div>
    );
}

export default ProjectCard;