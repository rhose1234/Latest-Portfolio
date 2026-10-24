import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";
import Scribble from "@/components/ui/Scribble";
import { ME } from "@/lib/data";
import { wrap } from "@/lib/styles";

export default function About() {
  return (
    <section id="about" className="pb-24 pt-36">
      <div className={`${wrap} grid items-center gap-16 md:grid-cols-[1fr_1.1fr]`}>
        <Reveal>
          <div className="relative h-[420px] md:h-[520px]">
            <Photo src="/images/about2.jpeg" alt={`${ME.name} smiling at a desk with a laptop and sticky notes`} className="absolute inset-0 rounded-[28px] shadow-[0_30px_60px_rgba(30,1,7,.2)] object-cover w-full h-full" />
          </div>
        </Reveal>

        <Reveal>
          <h2 className="relative inline-block text-[clamp(28px,4vw,56px)] font-extrabold leading-[.95] tracking-tighter whitespace-nowrap">
            Get to know{" "}
            <span className="relative inline-block text-vivid-pink">
              me
              <Scribble className="absolute -bottom-3 left-0 h-3 w-full md:-bottom-4 md:h-4" />
            </span>
            {/* A name sticker slapped on the corner of the heading */}
            <span className="absolute -right-6 -top-7 rotate-6 rounded-full bg-crimson px-3 py-1 text-xs font-semibold tracking-normal text-light-red shadow-[0_6px_14px_rgba(30,1,7,.2)] transition-transform hover:rotate-0 md:-right-10 md:-top-8 md:text-sm">
              Hi, I&apos;m {ME.name.split(" ")[0]}
            </span>
          </h2>
          <div className="mt-8 max-w-[52ch] space-y-4 text-[15px] leading-relaxed md:text-base">
            <p>
              I grew up in a home where my dad used to think Computer Science was all about photocopying, printing, and laminating. The funny thing? I knew it was more than that, but I couldn't explain what it really was either. Birds of the same feather!
            </p>
            <p>
              I had always wanted to study Food Science, but somehow, I ended up studying Computer Science. Then, during my IT year in school, I explored website development for three months and fell in love with tech.
            </p>
            <p>
              Today, I'm growing as a Software Engineer, building functional stuff on the web using JavaScript, React.js, Next.js, Tailwind CSS, Bootstrap, Java, and MySQL. I also help businesses build websites and web apps that represent their brands, while creating relatable video content that helps brands connect with their audiences.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
