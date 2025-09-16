import { Icons } from "@/components/icons";
import { HomeIcon, NotebookIcon } from "lucide-react";

export const DATA = {
  name: "Anslem Seguya",
  initials: "SA",
  url: "https://ansy-io.vercel.app",
  location: "Somehwere in Africa, UG",
  locationLink: "https://www.google.com/maps/place/kampala",
  description:
    "Casual Gamer ( Redditor / Developer / Writer / Cat Lover )",
  summary:
    "I am a software developer with a passion for creating digital solutions and stunning UIs. I specialize in mobile app development, from basic planning and design to solving real-life problems with code . Offline, I enjoy listening to indie alternative music. I also write articles about coding and other topics on [medium](https://medium.com/@anslemAnsy).",
  avatarUrl: "/me.jpeg",
  skills: [
    "Flutter",
    "Next.js",
    "Typescript",
    "React",
    "Dart",
    "Kotlin",
    "Postgres",
    "Docker",
    "Swift",
    "Swift UI",
  ],
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/blog", icon: NotebookIcon, label: "Blog" },
  ],
  contact: {
    email: "anslembarn@gmail.com",
    tel: "+256784491735",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/Anslem27/",
        icon: Icons.github,

        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "www.linkedin.com/in/seguya-anslem",
        icon: Icons.linkedin,

        navbar: true,
      },
      email: {
        name: "Send Email",
        url: "mailto:anslembarn@gmail.com",
        icon: Icons.email,
        navbar: false,
      },
    },
  },
  projects: [
    {
      title: "Backlogr - Game backlog tracking mobile app.",
      href: "#",
      dates: "July 2025 - Feb 2024",
      active: true,
      description:
        "Backlogr helps you track, rate, and organize your entire game collection. Manage your backlog, wishlist upcoming titles, and share your gaming journey with friends. Never lose track of what to play next!",
      technologies: [
        "Flutter",
        "Dart",
        "Provider",
        "Shared Prefs",
        "Hive ce",
      ],
      links: [
        {
          type: "Website",
          href: "#",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "/backlogr.png",
      video:
        "",
    },
    {
      title: "Versify",
      href: "https://play.google.com/store/apps/details?id=com.versify.app",
      dates: "June 2023 - Present",
      active: true,
      description:
        "Versify is a modern eBook reader and poetry app.",
      technologies: [
        "Flutter",
        "Dart",
        "Provider",
        "Shared Prefs",
        "Hive ce",
      ],
      links: [
        {
          type: "Website",
          href: "https://play.google.com/store/apps/details?id=com.versify.app",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://versify-site.vercel.app/",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/versify_dark.png",
      video: "",
    },
    {
      title: "Gem Music",
      href: "https://gem-one.vercel.app/",
      dates: "April 2023 - September 2023",
      active: true,
      description:
        "Gem Music is a modernly designed music app, with more than you could've ever imagined.",
      technologies: [
        "Flutter",
        "Dart",
        "Hive ce",
      ],
      links: [
        {
          type: "Website",
          href: "https://gem-one.vercel.app/",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://ansy-io.vercel.app/https://github.com/Anslem27/gem-music",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/gem.webp",
      video: "",
    },
    {
      title: "Growing - ui",
      href: "https://barnstorm.gumroad.com/l/habit-flutter-app",
      dates: "April 2023 - March 2024",
      active: true,
      description:
        "Growing (Become the best version of yourself) - Habit tracker a habit tracking flutter ui. Available on gumroad.",
      technologies: [
        "Flutter",
        "Dart",
      ],
      links: [
        {
          type: "Website",
          href: "https://barnstorm.gumroad.com/l/habit-flutter-app",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "/growing.png",
      video:
        "",
    },
  ],
} as const;
