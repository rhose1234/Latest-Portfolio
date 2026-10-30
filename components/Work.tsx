'use client';

import { useState } from "react";
import Image from "next/image";
import { WORK, type Project } from "@/lib/data";
import { wrap } from "@/lib/styles";

type Category = Project['category'];

const LABELS: Record<Category, string> = { websites: 'Website', java: 'Java' };

/** One project. Cards are sticky, so each new one slides up over the last as you scroll. */
function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <div className="sticky" style={{ top: `${96 + index * 16}px`, zIndex: index + 1 }}>
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="group grid overflow-hidden rounded-[28px] bg-crimson text-light-red shadow-[0_-12px_40px_rgba(30,1,7,.18)] md:grid-cols-[1fr_1.5fr]"
      >
        <div className="overflow-hidden bg-[#efedf0] md:order-2">
          <Image
            src={project.image}
            alt={`${project.title} website`}
            width={1600}
            height={1000}
            sizes="(min-width: 1200px) 690px, (min-width: 768px) 60vw, 100vw"
            className="aspect-[16/10] h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          />
        </div>

        <div className="flex flex-col p-6 md:p-10">
          <h3 className="text-[clamp(26px,3vw,44px)] font-extrabold leading-none tracking-tighter text-white">{project.title}</h3>
          <p className="mt-4 max-w-[38ch] text-[15px] leading-relaxed text-light-red/75 md:text-base">{project.description}</p>
          <span className="mt-6 inline-flex items-center gap-1 self-start font-semibold underline decoration-2 underline-offset-4 transition group-hover:text-vivid-pink md:mt-auto md:pt-8">
            Visit site
            <svg aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M9 7h8v8" />
            </svg>
          </span>
        </div>
      </a>
    </div>
  );
}

export default function Work() {
  const [activeCategory, setActiveCategory] = useState<Category>('websites');

  const categories = Object.keys(LABELS) as Category[];
  const filteredProjects = WORK.filter((project) => project.category === activeCategory);

  return (
    <section id="work" className="py-12 md:py-16">
      <div className={wrap}>
        <h2 className="text-[clamp(26px,7vw,40px)] font-extrabold leading-[.95] tracking-tighter md:text-[clamp(32px,5vw,72px)]">My Projects</h2>
        <p className="mt-3 max-w-[52ch] text-[15px] leading-normal md:text-[17px]">
          Products and sites I&apos;ve built, from first sketch to live deploy.
        </p>

        <div className="mt-6 flex justify-start gap-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-5 py-1 text-sm font-semibold transition-all ${activeCategory === category
                ? 'bg-crimson text-light-red'
                : 'border border-crimson text-crimson hover:bg-crimson hover:text-light-red'
                }`}
            >
              {LABELS[category]}
            </button>
          ))}
        </div>
      </div>

      <div className={`${wrap} mt-10 space-y-8`}>
        {filteredProjects.length ? (
          filteredProjects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))
        ) : (
          <p className="rounded-[28px] border-2 border-dashed border-crimson/30 px-6 py-16 text-center text-base">
            My {LABELS[activeCategory]} projects are on the way.
          </p>
        )}
      </div>
    </section>
  );
}
