import Link from "next/link";
import { Zap, Twitter, Github, Linkedin, Mail, Terminal } from "lucide-react";

const footerLinks = {
  Systems: [
    { label: "Neural Analytics", href: "#features" },
    { label: "AI Core v3.0",     href: "#features" },
    { label: "Cryptowall Shield", href: "#features" },
    { label: "Changelog",        href: "#" },
  ],
  Company: [
    { label: "Origin Story", href: "#about" },
    { label: "Intel Blog",   href: "/blog" },
    { label: "Careers",      href: "#" },
    { label: "Contact Ops",  href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Matrix",   href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Protocol",  href: "#" },
  ],
};

const socials = [
  { icon: Twitter,  href: "#",                     label: "Twitter" },
  { icon: Github,   href: "#",                     label: "GitHub" },
  { icon: Linkedin, href: "#",                     label: "LinkedIn" },
  { icon: Mail,     href: "mailto:ops@nexus.com",  label: "Email" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center glow-sm">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-black text-sm gradient-text tracking-tight">NEXUS</span>
                <div className="text-[7px] font-mono text-muted-foreground tracking-widest leading-none">NEURAL·OS</div>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-6 font-light">
              The unified command layer for modern teams. One mesh to replace all fragmented tooling.
            </p>
            <div className="flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg glass-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-purple-500/40 transition-all"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <div className="text-[9px] font-mono text-muted-foreground/60 uppercase tracking-widest mb-4">{title}</div>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 group">
                      <Terminal className="w-2.5 h-2.5 opacity-0 group-hover:opacity-60 transition-opacity text-purple-400" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 mt-8 border-t border-white/8 gap-4">
          <p className="text-xs font-mono text-muted-foreground/60">
            © 2026 NEXUS·PLATFORM·INC // ALL·RIGHTS·RESERVED
          </p>
          <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground/50">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            ALL·SYSTEMS·NOMINAL // BUILD·v2.6.1
          </div>
        </div>
      </div>
    </footer>
  );
}
