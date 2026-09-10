import SpotlightCard from "./SpotlightCard";

function About(){
    return (
        <section id="about">
            <SpotlightCard
                className="about-content"
                spotlightColor="rgba(255, 79, 163, 0.22)"
            >
                <p className="section-title">ABOUT ME</p>

                    <h2>Nice to meet you!</h2>
                
                <p>
                    I'm a fourth-year Computer Science student with a passion for creating clean, user-friendly websites and digital experiences.
                </p>

                <p>
                    I enjoy combining design and technology to create interfaces that are both visually appealing and easy to use.
                </p>
            </SpotlightCard>
        </section>
    )
}

export default About;
