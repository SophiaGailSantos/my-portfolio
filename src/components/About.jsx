import SpotlightCard from "./SpotlightCard";
import Reveal from "./Reveal";

function About(){
    return (
        <section id="about">
            <SpotlightCard
                className="about-content"
                spotlightColor="rgba(255, 79, 163, 0.22)"
            >
                <Reveal as="p" className="section-title">
                    ABOUT ME
                </Reveal>

                <Reveal as="h2" delay={90}>
                    Nice to meet you!
                </Reveal>

                <Reveal as="p" delay={150}>
                    I'm a fourth-year Computer Science student with a passion for creating clean, user-friendly websites and digital experiences.
                </Reveal>

                <Reveal as="p" delay={210}>
                    I enjoy combining design and technology to create interfaces that are both visually appealing and easy to use.
                </Reveal>
            </SpotlightCard>
        </section>
    )
}

export default About;
