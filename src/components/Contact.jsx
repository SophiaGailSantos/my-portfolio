import { useState } from "react";
import { CONTACT_FUNCTION, isSupabaseConfigured, supabase } from "../lib/supabase";
import Reveal from "./Reveal";

const FALLBACK_EMAIL = "gailsantos38@gmail.com";
const MAX_MESSAGE_LENGTH = 4000;

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  // Bots fill hidden fields; humans never see this one.
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent

  async function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in your name, email, and message.");
      return;
    }

    setError("");

    if (!isSupabaseConfigured) {
      setError(
        "This form is not connected yet. Please email me directly at " +
          FALLBACK_EMAIL +
          " instead."
      );
      return;
    }

    setStatus("sending");

    const { data, error: requestError } = await supabase.functions.invoke(
      CONTACT_FUNCTION,
      {
        body: {
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          company_website: honeypot,
        },
      }
    );

    if (requestError) {
      setStatus("idle");
      setError(
        "Could not send your message. Please try again, or email me directly at " +
          FALLBACK_EMAIL +
          "."
      );
      return;
    }

    // The function answers { ok: true } only after the row is stored.
    if (!data?.ok) {
      setStatus("idle");
      setError("Something went wrong. Please try again.");
      return;
    }

    setStatus("sent");
    setName("");
    setEmail("");
    setMessage("");
  }

  const isSending = status === "sending";

  return (
    <section id="contact">
      <div className="contact-content">
        <Reveal as="p" className="section-title">
          CONTACT ME
        </Reveal>

        <Reveal as="h2" delay={90}>
          Let's Work Together
        </Reveal>

        <Reveal as="p" delay={150}>
          Have a project or idea you'd like to discuss? Fell free to get in
          touch.
        </Reveal>

        <Reveal delay={210}>
          {status === "sent" ? (
            <div className="form-success" role="status">
              <h3>Thank you for messaging.</h3>
              <p>I'll contact you as soon as possible.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <textarea
                name="message"
                placeholder="Your Message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                maxLength={MAX_MESSAGE_LENGTH}
              ></textarea>
              <input
                type="text"
                name="company_website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="honeypot"
                value={honeypot}
                onChange={(event) => setHoneypot(event.target.value)}
              />
              <button type="submit" disabled={isSending}>
                {isSending ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </Reveal>

        {error && (
          <p className="form-status error" role="alert">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}

export default Contact;
