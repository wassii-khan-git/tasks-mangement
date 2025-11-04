import Link from "next/link";
import {
  CalendarCheck2,
  ClipboardList,
  Github,
  Linkedin,
  Mail,
  Share2,
} from "lucide-react";

const footerSections = [{}];

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/wassii-khan-git",
    icon: Github,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/waseem-khan-5a9393214",
    icon: Linkedin,
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-12 sm:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[2fr,3fr]">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
                <ClipboardList className="size-5" />
              </span>
              <div>
                <p className="text-lg font-semibold">TaskFlow</p>
                <p className="text-muted-foreground text-sm">
                  A focused workspace for your task management assignment.
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Track priorities, unblock teammates, and close out deliverables
              with a dashboard that mirrors real sprint workflows.
            </p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="size-4 text-primary" />
                <Link
                  href="mailto:wassiikhan933@gmail.com"
                  className="hover:text-foreground"
                >
                  wassiikhan933@gmail.com
                </Link>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8 text-sm sm:grid-cols-2 lg:grid-cols-3"></div>
        </div>
        <div className="flex flex-col gap-4 border-t pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            © {currentYear} TaskFlow. By{" "}
            <span className="hover:underline">Wassii Khan</span>
          </p>
          <div className="flex items-center gap-2">
            {socialLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <span className="sr-only">{link.label}</span>
                <link.icon className="size-4" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
