import Counter from "@/components/ui/Counter";
import { STATS } from "@/lib/data";
import { wrap } from "@/lib/styles";

export default function Stats() {
  return (
    <section className="pb-16 pt-5">
      <div className={`${wrap} grid grid-cols-2 gap-6 md:grid-cols-3 justify-items-center text-center max-w-4xl mx-auto`}>
        {STATS.map((stat) => (
          <div key={stat.l}>
            <Counter to={stat.n} suffix={stat.s} />
            <span className="mt-2 block max-w-[20ch] text-[15px] opacity-75">{stat.l}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
