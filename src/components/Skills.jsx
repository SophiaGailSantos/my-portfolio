import {
    SiCss,
    SiFigma,
    SiHtml5,
    SiJavascript,
    SiMysql,
    SiPhp,
    SiReact,
    SiSupabase,
    SiVercel,
} from "react-icons/si";
import { FaJava, FaPalette } from "react-icons/fa";
import { TbBrandCSharp } from "react-icons/tb";
import LogoLoop from "./LogoLoop";
import Reveal from "./Reveal";

function Skills(){
    const skills = [
        { node: <SiFigma />, title: "Figma", color: "#f24e1e" },
        { node: <FaPalette />, title: "Canva", color: "#00c4cc" },
        { node: <SiHtml5 />, title: "HTML", color: "#e34f26" },
        { node: <SiCss />, title: "CSS", color: "#663399" },
        { node: <SiJavascript />, title: "JavaScript", color: "#f7df1e" },
        { node: <SiReact />, title: "React", color: "#61dafb" },
        { node: <FaJava />, title: "Java", color: "#f89820" },
        { node: <TbBrandCSharp />, title: "C#", color: "#9b4f96" },
        { node: <SiPhp />, title: "PHP", color: "#777bb4" },
        { node: <SiMysql />, title: "MySQL", color: "#4479a1" },
        { node: <SiSupabase />, title: "Supabase", color: "#3ecf8e" },
        { node: <SiVercel />, title: "Vercel", color: "#ffffff" },
    ];

    return (
        <section id="skills">
            <div className="skills-content">
                <Reveal as="p" className="section-title">
                    MY SKILLS
                </Reveal>

                <Reveal as="h2" delay={90}>
                    What I Work With
                </Reveal>

                <Reveal delay={170}>
                    <div className="skills-loop-wrap">
                        <LogoLoop
                            logos={skills}
                            speed={35}
                            direction="left"
                            logoHeight={38}
                            gap={18}
                            hoverSpeed={8}
                            fadeOut
                            fadeOutColor="#111111"
                            scaleOnHover
                            ariaLabel="Technology skills"
                            renderItem={(skill) => (
                                <div
                                    className="skill-logo"
                                    title={skill.title}
                                    style={{ "--skill-color": skill.color }}
                                >
                                    <span className="skill-logo-icon" aria-hidden="true">
                                        {skill.node}
                                    </span>
                                    <span>{skill.title}</span>
                                </div>
                            )}
                        />
                    </div>
                </Reveal>
            </div>
        </section>
    )
    }

export default Skills;
