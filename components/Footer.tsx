import { ME } from "@/lib/data";
import { wrap } from "@/lib/styles";

export default function Footer() {
  return (
    <footer className="border-t border-light-red/20 bg-crimson pb-10 pt-7 text-[15px] text-light-red">
      <div className={`${wrap} flex flex-wrap justify-between gap-4`}>
        <span>© {new Date().getFullYear()} {ME.full}</span>
        <a href={ME.instagram} className="hover:text-vivid-pink">{ME.handle}</a>
      </div>
    </footer>
  );
}
