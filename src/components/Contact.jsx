function Contact(){
    return (
        <section id="contact">
            <div className="contact-content">
                <p className="section-title">CONTACT ME</p>

                <h2>Let's Work Together</h2>
                
                <p>
                    Have a project or idea you'd like to discuss? Fell free to get in touch.
                </p>

                <form>
                    <input type='text' placeholder="Your Name" />
                    <input type="email" placeholder="Your Email" />
                    <textarea placeholder="Your Message"></textarea>
                    <button type="submit">Send Message</button>
                </form>
            </div>
        </section>
    );
}

export default Contact;