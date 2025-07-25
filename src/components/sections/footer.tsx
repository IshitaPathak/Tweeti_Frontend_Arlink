import { Icons } from "@/components/icons";
import { siteConfig } from "@/lib/config";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FaDiscord, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full py-20 px-6 sm:px-12 bg-white">
      <div className="flex flex-col items-center justify-center">
        <h2 className="mx-auto mt-4 max-w-xs text-3xl font-heading tracking-heading font-semibold sm:max-w-none sm:text-4xl md:text-5xl mb-12 text-center">
          Follow us for latest updates!
        </h2>
        <div className="flex flex-row items-center justify-center gap-8 mt-6 mb-10 py-2">
          <a href="https://x.com/usetweeti" target="_blank" rel="noopener noreferrer" aria-label="X" className="hover:scale-110 transition-transform">
            <Icons.twitter className="w-9 h-9" />
          </a>
          <a href="https://github.com/Tweeti-org" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:scale-110 transition-transform">
            <Icons.github className="w-10 h-10" />
          </a>
          <a href="https://discord.com" target="_blank" rel="noopener noreferrer" aria-label="Discord" className="hover:scale-110 transition-transform">
            <FaDiscord className="w-10 h-10" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:scale-110 transition-transform">
            <FaLinkedin className="w-10 h-10" />
          </a>
        </div>
        <div className="flex flex-col items-center justify-center mt-6 mb-2">
          <Image src="/Tweeti_Logo.png" alt="Tweeti Logo" width={56} height={56} />
        </div>
        <div className="mt-2 text-center text-sm text-muted-foreground font-serif">
          © {new Date().getFullYear()} Tweeti. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
