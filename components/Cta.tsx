import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/ui/Reveal";
import { SOCIALS } from "@/lib/socials";
import { wrap } from "@/lib/styles";

export default function Cta() {
  return (
    <section id="contact" className="rounded-t-[48px] bg-crimson py-20 text-center text-light-red md:py-24">
      <div className={wrap}>
        <Reveal>
          <h2 className="text-[clamp(44px,8.5vw,120px)] font-extrabold leading-[.95] tracking-tighter text-white">
            Got a project<br /> coming up?
          </h2>
          <ContactForm />

          {/* Social Links */}
          <div className="mt-16 flex flex-wrap justify-center gap-3 sm:gap-6">
            {SOCIALS.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="flex size-11 shrink-0 items-center justify-center rounded-full bg-light-red/10 text-light-red transition-all hover:bg-vivid-pink hover:text-white sm:size-12"
              >
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d={social.icon} />
                </svg>
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
