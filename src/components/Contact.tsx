import { FaGithub, FaLinkedin, FaItchIo, FaBluesky } from "react-icons/fa6";
import SectionWrapper from "./SectionWrapper";

const SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com/giovanny-garcia",
    icon: FaGithub,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/giovanny-garcia-482376243/",
    icon: FaLinkedin,
  },
  {
    label: "itch.io",
    href: "https://cry0smith.itch.io/",
    icon: FaItchIo,
  },
  {
    label: "Bluesky",
    href: "https://bsky.app/profile/optionselect.bsky.social",
    icon: FaBluesky,
  },
] as const;

export default function Contact() {
  return (
    <SectionWrapper id="contact">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="mb-2 font-heading text-3xl font-bold tracking-tight text-text-primary md:text-4xl">
          Get In Touch
        </h2>
        <p className="mb-10 text-text-secondary">
          I'm looking for my first software development internship. GitHub and
          LinkedIn are the best ways to reach me.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {SOCIALS.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel={
                href.startsWith("mailto") ? undefined : "noopener noreferrer"
              }
              className="group flex items-center gap-2.5 rounded-xl border border-border bg-bg-card px-5 py-3 transition-all hover:border-accent/30 hover:bg-bg-card-hover hover:shadow-lg hover:shadow-accent/5"
            >
              <Icon
                size={20}
                className="text-text-muted transition-colors group-hover:text-accent"
              />
              <span className="text-sm font-medium text-text-secondary transition-colors group-hover:text-text-primary">
                {label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
