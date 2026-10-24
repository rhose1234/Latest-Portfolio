import Reveal from "@/components/ui/Reveal";
import { ROLES } from "@/lib/data";
import { wrap } from "@/lib/styles";

export default function Roles() {
  return (
    <section className="pb-12 pt-4 md:pb-16">
      <div className={wrap}>
        {ROLES.map((role) => (
          <Reveal key={role.title}>
            <div className="grid items-center gap-6 border-t-2 border-crimson py-7 transition-all duration-300 hover:pl-6 hover:text-vivid-pink md:grid-cols-[1.1fr_1fr]">
              <h3 className="text-[clamp(32px,4.5vw,64px)] font-extrabold tracking-tighter whitespace-nowrap">{role.title}</h3>
              <p className="max-w-[40ch] text-[15px] leading-relaxed text-crimson md:text-base">{role.description}</p>
            </div>
          </Reveal>
        ))}
        <div className="border-t-2 border-crimson" />
      </div>
    </section>
  );
}
