import Link from "next/link";
import {
  CalendarCheck2,
  ClipboardList,
  Github,
  Linkedin,
  Mail,
  Share2,
} from "lucide-react";

const footerSections = [
  {
    title: "Product",
    links: [
      { label: "Task Dashboard", href: "/task" },
      { label: "Contacts CRM", href: "/contacts" },
      { label: "Workflow Builder", href: "#" },
      { label: "Automation Rules", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Sprint Planning Guide", href: "#" },
      { label: "Stand-up Checklist", href: "#" },
      { label: "Release Notes", href: "#" },
      { label: "API Docs", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "#" },
      { label: "Status Page", href: "#" },
      { label: "Community Forum", href: "#" },
      { label: "Schedule a Demo", href: "#" },
    ],
  },
];

const socialLinks = [
  {
    label: "Share milestone update",
    href: "#",
    icon: Share2,
  },
  {
    label: "GitHub",
    href: "https://github.com/",
    icon: Github,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/",
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
                <CalendarCheck2 className="size-4 text-primary" />
                <span>
                  Next milestone review{" "}
                  <span className="font-medium text-foreground">
                    Mon, Nov 17 · 09:00 AM
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="size-4 text-primary" />
                <Link
                  href="mailto:support@taskflow.app"
                  className="hover:text-foreground"
                >
                  support@taskflow.app
                </Link>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8 text-sm sm:grid-cols-2 lg:grid-cols-3">
            {footerSections.map((section) => (
              <div key={section.title} className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {section.title}
                </h3>
                <ul className="grid gap-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
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
