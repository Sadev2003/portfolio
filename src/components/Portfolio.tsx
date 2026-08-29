import { motion, useScroll, useTransform, type Variants } from "motion/react";
import { useRef, useState, useEffect, type FormEvent } from "react";
import { z } from "zod";
import Lenis from "lenis";
import profileImage from "@/assests/profile.jpg";
import { createPortal } from "react-dom";

const resumeAsset = "/Sadev_Sabuddhika_Cloud_Engineering_Intern_CV.pdf";

const badges = [
  {
    name: "Azure Management & Governance",
    src: "https://learn.microsoft.com/training/achievements/describe-azure-management-governance.svg",
    link: "https://learn.microsoft.com/api/achievements/share/en-us/SadevSabuddhika-5314/QS6T95FE?sharingId=C64455B572EEBC60"
  },
  {
    name: "Azure Cloud Concepts",
    src: "https://learn.microsoft.com/training/achievements/microsoft-azure-fundamentals-describe-cloud-concepts.svg",
    link: "https://learn.microsoft.com/api/achievements/share/en-us/SadevSabuddhika-5314/QJCQ6RZE?sharingId=C64455B572EEBC60"
  },
  {
    name: "Introduction to Azure IoT Hub",
    src: "https://learn.microsoft.com/training/achievements/student-evangelism/introduction-to-iot-hub.svg",
    link: "https://learn.microsoft.com/api/achievements/share/en-us/SadevSabuddhika-5314/2TD7WWPV?sharingId=C64455B572EEBC60"
  },
  {
    name: "Azure Core Architecture",
    src: "https://learn.microsoft.com/training/achievements/describe-core-architectural-components-of-azure.svg",
    link: "https://learn.microsoft.com/api/achievements/share/en-us/SadevSabuddhika-5314/PLQ69HC4?sharingId=C64455B572EEBC60"
  },
  {
    name: "Intro to GitHub Products",
    src: "https://learn.microsoft.com/training/achievements/github-introduction-products.svg",
    link: "https://learn.microsoft.com/api/achievements/share/en-us/SadevSabuddhika-5314/JU45QGHT?sharingId=C64455B572EEBC60"
  },
  {
    name: "Introduction to GitHub",
    src: "https://learn.microsoft.com/training/achievements/github/introduction-to-github.svg",
    link: "https://learn.microsoft.com/api/achievements/share/en-us/SadevSabuddhika-5314/A4UNWMJ7?sharingId=C64455B572EEBC60"
  },
  {
    name: "Introduction to Git",
    src: "https://learn.microsoft.com/training/achievements/student-evangelism/introduction-to-git-badge.svg",
    link: "https://learn.microsoft.com/api/achievements/share/en-us/SadevSabuddhika-5314/9YBPGXAU?sharingId=C64455B572EEBC60"
  },
  {
    name: "Azure Monitoring Tools",
    src: "https://learn.microsoft.com/training/achievements/describe-monitoring-tools-azure.svg",
    link: "https://learn.microsoft.com/api/achievements/share/en-us/SadevSabuddhika-5314/UR2YMAB3?sharingId=C64455B572EEBC60"
  },
  {
    name: "Azure Management & Deployment",
    src: "https://learn.microsoft.com/training/achievements/describe-features-tools-manage-deploy-azure-resources.svg",
    link: "https://learn.microsoft.com/api/achievements/share/en-us/SadevSabuddhika-5314/HA254V68?sharingId=C64455B572EEBC60"
  },
  {
    name: "Intro to Azure Policy",
    src: "https://learn.microsoft.com/training/achievements/generic-badge.svg",
    link: "https://learn.microsoft.com/api/achievements/share/en-us/SadevSabuddhika-5314/W7SYH96N?sharingId=C64455B572EEBC60"
  },
  {
    name: "Azure Governance & Compliance",
    src: "https://learn.microsoft.com/training/achievements/describe-features-tools-azure-for-governance-compliance.svg",
    link: "https://learn.microsoft.com/api/achievements/share/en-us/SadevSabuddhika-5314/UXBW5NJ3?sharingId=C64455B572EEBC60"
  },
  {
    name: "Azure Cost Management",
    src: "https://learn.microsoft.com/training/achievements/describe-cost-management-azure.svg",
    link: "https://learn.microsoft.com/api/achievements/share/en-us/SadevSabuddhika-5314/W7T9VZEN?sharingId=C64455B572EEBC60"
  },
  {
    name: "Azure Cloud Service Types",
    src: "https://learn.microsoft.com/training/achievements/describe-cloud-service-types.svg",
    link: "https://learn.microsoft.com/api/achievements/share/en-us/SadevSabuddhika-5314/UXVU2SL3?sharingId=C64455B572EEBC60"
  },
  {
    name: "Azure Cloud Benefits",
    src: "https://learn.microsoft.com/training/achievements/describe-benefits-use-cloud-services.svg",
    link: "https://learn.microsoft.com/api/achievements/share/en-us/SadevSabuddhika-5314/F2KFPGSX?sharingId=C64455B572EEBC60"
  },
  {
    name: "Describe Cloud Computing",
    src: "https://learn.microsoft.com/training/achievements/describe-cloud-compute.svg",
    link: "https://learn.microsoft.com/api/achievements/share/en-us/SadevSabuddhika-5314/UXVUYFR3?sharingId=C64455B572EEBC60"
  },
  {
    name: "Explore Azure Functions",
    src: "https://learn.microsoft.com/training/achievements/1-explore-azure-functions.svg",
    link: "https://learn.microsoft.com/api/achievements/share/en-us/SadevSabuddhika-5314/U72RX5Z3?sharingId=C64455B572EEBC60"
  },
  {
    name: "Develop Azure Functions",
    src: "https://learn.microsoft.com/training/achievements/2-develop-azure-functions.svg",
    link: "https://learn.microsoft.com/api/achievements/share/en-us/SadevSabuddhika-5314/3ZVBM8BH?sharingId=C64455B572EEBC60"
  },
  {
    name: "Implement Azure Functions",
    src: "https://learn.microsoft.com/training/achievements/az-204-implement-azure-functions.svg",
    link: "https://learn.microsoft.com/api/achievements/share/en-us/SadevSabuddhika-5314/CR7PZUE9?sharingId=C64455B572EEBC60"
  }
];


const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().trim().email("Invalid email").max(255, "Email too long"),
  message: z.string().trim().min(1, "Message is required").max(1000, "Message too long"),
});

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
      delay: i * 0.08,
    },
  }),
};

const skillGroups = [
  {
    label: "Cloud & Infrastructure",
    items: [
      { name: "Microsoft Azure", featured: true },
      { name: "Docker Containers", featured: true },
      { name: "Azure Static Web Apps" },
      { name: "Azure Functions" },
      { name: "Azure Cosmos DB" },
    ],
  },
  {
    label: "DevOps & Observability",
    items: [
      { name: "GitHub Actions CI/CD", featured: true },
      { name: "Prometheus", featured: true },
      { name: "Grafana", featured: true },
      { name: "Git & GitHub" },
    ],
  },
  {
    label: "Backend & Systems",
    items: [
      { name: "Python Programming", featured: true },
      { name: "Django", featured: true },
      { name: "PostgreSQL" },
      { name: "MySQL" },
      { name: "Supabase" },
    ],
  },
  {
    label: "Networking & Tools",
    items: [
      { name: "Cisco Packet Tracer" },
      { name: "Wireshark" },
      { name: "MQTT", featured: true },
      { name: "Domain Routing" },
      { name: "JIRA / Azure Boards" },
      { name: "Figma" },
    ],
  },
];

const projects = [
  {
    index: "01",
    tag: "DevOps · Observability",
    title: "Enterprise Infrastructure Monitoring & Alerting Stack",
    role: "Infrastructure Engineer / Administrator",
    stack: ["Prometheus", "Grafana", "Alertmanager", "Docker Compose", "Node Exporter", "Telegram Bot API"],
    achievements: [
      "Designed a production-grade, containerized observability pipeline to track real-time system metrics across multi-platform hosts.",
      "Built a low-latency incident alerting flow via Telegram Bot API utilizing custom-formatted HTML push notification templates (sub-45-second latency).",
      "Unified host diagnostics (CPU, memory, disk, network) into active Grafana telemetry dashboards for centralized visualization.",
      "Configured Alertmanager routing, grouping rules, and rate-limited dispatch intervals to prevent notification fatigue."
    ],
    github: "https://github.com/Sadev2003/Containerized-Infrastructure-Monitoring-Alerting-Stack"
  },
  {
    index: "02",
    tag: "Azure · Serverless",
    title: "Serverless Portfolio Platform & Integration Engine",
    role: "Cloud & Backend Developer",
    stack: ["Azure Static Web Apps", "Azure Functions (Python)", "Cosmos DB", "GitHub Actions", "Communication Services", "Python", "Git"],
    achievements: [
      "Engineered a two-tier serverless portfolio platform with Azure SWA for static asset delivery and Python Azure Functions for microservices APIs.",
      "Designed an active visitor counter that reads/writes transactional metrics to a NoSQL Azure Cosmos DB database.",
      "Implemented a custom proxy-header rate limiter (sliding window) to secure API endpoints against flooding.",
      "Built automated contact message dispatching through Azure Communication Services integrating SMTP relay.",
      "Created a GitHub Actions CI/CD workflow to automate build validation and deployment to Azure Static Web Apps on code push."
    ],
    github: "https://github.com/Sadev2003/portfolio"
  },
  {
    index: "03",
    tag: "Django · Docker · AI",
    title: "Parithyaga — Donation Coordination Platform",
    role: "Backend & Infrastructure Developer",
    stack: ["Next.js", "Django", "PostgreSQL", "Python", "Google Gemini AI", "Docker"],
    achievements: [
      "Volunteering as a backend developer for RIKILI (Non-Profit Organization) to engineer this secure resource allocation platform.",
      "Designed role-based access control inside Django rest framework to protect sensitive donor and organizational records.",
      "Integrated Google Gemini API to parse need descriptions from uploaded PDF documents, reducing manual cataloging overhead.",
      "Containerized application layers with Docker Compose to achieve parity across development and testing environments."
    ],
    github: "https://github.com/PrabathKuruwita/rebuild_man"
  },
  {
    index: "04",
    tag: "Next.js · MongoDB",
    title: "Mobile Shop POS",
    role: "Full Stack Developer",
    stack: ["Next.js", "MongoDB", "Node.js", "Prisma"],
    achievements: [
      "Developed a multi-user inventory management and Point of Sale (POS) system for mobile repair centers.",
      "Designed schema structures with Prisma ORM to track device lifecycle stages (received, in-repair, completed, collected).",
      "Implemented role-based permissions for cashier, technician, and store administrator accounts.",
      "Optimized inventory query latency utilizing MongoDB indexing and search aggregates."
    ],
    link: "https://www.akaigen.com/pos",
    linkLabel: "Website"
  },
  {
    index: "05",
    tag: "PHP · MySQL",
    title: "Flavor POS — Restaurant Management",
    role: "Collaborative Developer",
    stack: ["PHP", "HTML", "CSS", "JavaScript", "MySQL"],
    achievements: [
      "Co-created a role-based order management system connecting restaurant tables, kitchen staff, cashiers, and admins.",
      "Built responsive management dashboards using vanilla JavaScript and CSS grid/flexbox layouts.",
      "Established relational database schemas in MySQL to handle live menu items, billing transactions, and order logs.",
      "Enforced secure session management and role validation on backend endpoints."
    ],
    github: "https://github.com/dev-dojo-uok/flavour-pos",
    link: "https://flavour.akaigen.online/index.php",
    linkLabel: "Live Demo"
  },
  {
    index: "06",
    tag: "IoT · MQTT · ESP32",
    title: "Building Energy Optimization & Automation",
    role: "Embedded Systems & Integration Developer",
    stack: ["IoT", "React", "FastAPI", "MQTT", "ESP32"],
    achievements: [
      "Engineered an IoT energy management prototype featuring ESP32 sensors and switch control units (SCUs) to automate appliances.",
      "Configured a local MQTT message broker to relay telemetry between hardware edge units and a centralized server over Wi-Fi.",
      "Developed a React web control panel displaying live power consumption and trigger switches via WebSockets.",
      "Built FastAPI backend routers to handle historical energy telemetry logs and log database snapshots."
    ],
    github: "https://github.com/dev-dojo-uok/iot-manager",
    link: "https://drive.google.com/drive/folders/1YwwHOhY673IeTdOhQ7tOFXyBvlYqu_HK?usp=drive_link",
    linkLabel: "Docs"
  }
];

const certifications = [
  { name: "Microsoft Certified: Azure Fundamentals (AZ-900)", status: "In Progress" },
  { name: "Cisco Networking Academy — Linux Essentials", status: "Verified", link: "https://www.credly.com/users/sadev-bandara" },
  { name: "Cisco Networking Academy — IT Essentials", status: "Verified", link: "https://www.credly.com/users/sadev-bandara" },
  { name: "Docker Training Course for the Absolute Beginner — KodeKloud", status: "Verified", link: "https://learn.kodekloud.com/learn/certificate/c9bc8991-d114-432e-b30f-cb1df99fec44" },
];

function SectionHeading({ label, count }: { label: string; count?: string }) {
  let command = "ls -la";
  let target = label.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") + "/";

  const lowerLabel = label.toLowerCase();
  if (lowerLabel.includes("who am i") || lowerLabel.includes("about")) {
    command = "whoami";
    target = "";
  } else if (lowerLabel.includes("ecosystem") || lowerLabel.includes("stack") || lowerLabel.includes("skills")) {
    command = "cat";
    target = "tech_stack.yml";
  } else if (lowerLabel.includes("projects")) {
    command = "ls -la";
    target = "projects/";
  } else if (lowerLabel.includes("education")) {
    command = "cat";
    target = "education.txt";
  } else if (lowerLabel.includes("certifications")) {
    command = "openssl x509 -text -in";
    target = "certs.pem";
  } else if (lowerLabel.includes("credentials") || lowerLabel.includes("badges") || lowerLabel.includes("azure")) {
    command = "az account show --query";
    target = "\"[tenantId, user.name]\"";
  }

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="flex items-center gap-4 mb-12 select-none"
    >
      <h2 className="font-mono text-[11px] md:text-xs tracking-wider text-white flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="text-muted-foreground/60">sadev@sys:~$</span>
        <span className="text-white/80">{command}</span>
        {target && <span className="text-accent font-bold">{target}</span>}
      </h2>
      <div className="h-px flex-1 bg-border/30" />
      {count && <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{count}</span>}
    </motion.div>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);

  return (
    <section ref={ref} className="mb-32 relative scroll-mt-24">
      <div className="grid md:grid-cols-[1.3fr_1fr] gap-12 items-center">
        <motion.div style={{ y, opacity }}>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-white/5 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider">Available for Internships</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-6 text-balance"
          >
            Sadev <span className="text-accent">Sabuddhika</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="text-xl md:text-2xl text-muted-foreground max-w-[60ch] leading-relaxed text-pretty"
          >
            Cloud & DevOps Engineering Intern. Building cost-efficient serverless architectures on Microsoft Azure and automating delivery pipelines. BICT undergraduate at the University of Kelaniya.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-10 flex flex-wrap items-center gap-3 font-mono text-xs"
          >
            <a
              href="#contact"
              className="px-5 py-2.5 bg-accent text-background font-bold tracking-wider hover:bg-accent/80 transition-colors rounded-none uppercase"
            >
              Get in touch
            </a>
            <a
              href="#projects"
              className="px-4 py-2.5 border border-border hover:border-accent/50 hover:text-accent transition-colors rounded-none bg-background"
            >
              View deployments
            </a>
            <a
              href={resumeAsset}
              download="Sadev_Sabuddhika_Cloud_Engineering_Intern_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 border border-border hover:border-accent/50 hover:text-accent transition-colors rounded-none flex items-center gap-2 cursor-pointer bg-background"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download CV
            </a>
          </motion.div>
        </motion.div>

        <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto shrink-0 group">
          <div className="absolute inset-0 border border-accent translate-x-3 translate-y-3 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:translate-y-1.5 rounded-none" />
          <div className="relative w-full h-full border border-border bg-background rounded-none overflow-hidden">
            <img
              src={profileImage}
              alt="Sadev Sabuddhika Profile"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="mb-40 scroll-mt-24">
      <SectionHeading label="who am i." />
      <div className="grid md:grid-cols-[1fr_300px] gap-12 items-start">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="space-y-5 text-muted-foreground leading-relaxed text-pretty max-w-[70ch]"
        >
          <p>
            I'm a BICT (Hons) undergraduate at the University of Kelaniya, specializing in Computer Networks and building toward a career in Cloud & DevOps engineering. My focus is designing cost-efficient, serverless-first architectures on Microsoft Azure that scale to zero when idle and hold up under real production load.
          </p>
          <p>
            I enjoy the space where infrastructure, security, and code meet — wiring CI/CD pipelines through GitHub Actions, containerizing services with Docker, and instrumenting systems with Grafana and Prometheus. On the backend I lean on Python, Django, and both SQL and NoSQL data stores.
          </p>
          <p>
            Currently deepening my Azure expertise (AZ-900 in progress), collecting Microsoft Learn badges, and open to internship opportunities where I can ship real infrastructure alongside a strong engineering team.
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          custom={1}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col gap-6"
        >
          <div className="grid grid-cols-2 gap-3 font-mono text-[10px] uppercase tracking-widest">
            <div className="p-4 border border-border bg-[#111216] rounded-none">
              <div className="text-muted-foreground mb-1">Location</div>
              <div className="text-foreground normal-case tracking-normal">Homagama, LK</div>
            </div>
            <div className="p-4 border border-border bg-[#111216] rounded-none">
              <div className="text-muted-foreground mb-1">Focus</div>
              <div className="text-foreground normal-case tracking-normal">Cloud / DevOps</div>
            </div>
            <div className="col-span-2 p-4 border border-accent/40 bg-[#161a24] rounded-none relative overflow-hidden group">
              <div className="text-accent font-semibold mb-1 tracking-[0.2em]">Status</div>
              <div className="text-white normal-case tracking-normal font-bold flex items-center gap-2 text-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                </span>
                Open to Internships / Opportunities
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section id="stack" className="mb-40 scroll-mt-24">
      <SectionHeading label="Technical Ecosystem" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skillGroups.map((group, i) => (
          <motion.div
            key={group.label}
            variants={fadeUp}
            custom={i}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="group p-6 border border-border bg-[#111216] hover:border-accent/50 transition-colors rounded-none"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                {String(i + 1).padStart(2, "0")} // {group.label}
              </div>
              <div className="h-1 w-1 rounded-full bg-accent/60 group-hover:bg-accent transition-colors" />
            </div>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item.name}
                  className={
                    item.featured
                      ? "px-2.5 py-1 bg-[#132228] border border-accent/30 text-accent text-[11px] font-medium rounded-none"
                      : "px-2.5 py-1 bg-background border border-border text-foreground text-[11px] font-medium rounded-none"
                  }
                >
                  {item.name}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
          // And plenty more technologies I'm exploring & mastering every day.
        </p>
      </div>
    </section>
  );
}

function Projects({
  hoveredProject,
  setHoveredProject
}: {
  hoveredProject: number | null;
  setHoveredProject: (idx: number | null) => void;
}) {
  return (
    <section id="projects" className="mb-40 scroll-mt-24">
      <SectionHeading label="Selected Deployments" count={`${projects.length} Systems`} />
      <div className="space-y-6">
        {projects.map((p, i) => (
          <motion.article
            key={p.title}
            data-project-index={i}
            onMouseEnter={() => setHoveredProject(i)}
            onMouseLeave={() => setHoveredProject(null)}
            variants={fadeUp}
            custom={i}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className={`group relative p-8 md:p-10 rounded-2xl border transition-all duration-300 ${
              hoveredProject === i 
                ? "border-accent/40 bg-[#16171d]" 
                : "border-border bg-[#111216]"
            }`}
          >
            <div className="grid md:grid-cols-[auto_1fr] gap-8 md:gap-12">
              <div className="font-mono text-sm text-accent tracking-widest">{p.index}</div>
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {p.tag}
                  </span>
                  <span className="h-px w-6 bg-border" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {p.role}
                  </span>
                </div>

                <h3 className={`text-2xl md:text-3xl font-bold tracking-tight mb-5 transition-colors duration-300 ${
                  hoveredProject === i ? "text-accent" : "text-white"
                }`}>{p.title}</h3>

                <div className="flex flex-wrap gap-2 mb-6">
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-1 text-[10px] font-mono border border-border rounded bg-white/[0.02] text-muted-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <ul className="space-y-3">
                  {p.achievements.map((a) => (
                    <li key={a} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                      <span className="font-mono text-accent shrink-0 mt-0.5">→</span>
                      <span className="text-pretty">{a}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-border/50">
                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-accent transition-colors"
                    >
                      <span>//</span> GitHub
                    </a>
                  )}
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-accent transition-colors"
                    >
                      <span>//</span> {p.linkLabel || "Website / Demo"}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function Badges() {
  return (
    <section id="badges" className="mb-40 scroll-mt-24">
      <SectionHeading label="Azure Credentials" />
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-x-6 gap-y-8"
      >
        {badges.map((b, i) => (
          <motion.a
            key={i}
            href={b.link}
            target="_blank"
            rel="noopener noreferrer"
            variants={fadeUp}
            custom={i * 0.05}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            whileHover={{ scale: 1.08 }}
            className="group flex flex-col items-center justify-start cursor-pointer text-center"
            title={b.name}
          >
            <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-3">
              <img
                src={b.src}
                alt={b.name}
                loading="lazy"
                width={256}
                height={256}
                className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-all duration-300"
              />
            </div>
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground group-hover:text-accent transition-colors line-clamp-2 max-w-[100px] leading-tight">
              {b.name}
            </span>
          </motion.a>
        ))}
      </motion.div>

      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        <a
          href="https://learn.microsoft.com/en-us/users/sadevsabuddhika-5314/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg border border-border hover:border-accent/40 text-xs font-mono text-muted-foreground hover:text-accent transition-colors bg-background"
        >
          <span>//</span> Microsoft Learn Profile
        </a>
        <a
          href="https://www.credly.com/users/sadev-bandara"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg border border-border hover:border-accent/40 text-xs font-mono text-muted-foreground hover:text-accent transition-colors bg-background"
        >
          <span>//</span> Credly Badges Verification
        </a>
      </div>
    </section>
  );
}

function EducationCerts() {
  return (
    <section className="mb-40 grid md:grid-cols-2 gap-16">
      <div>
        <SectionHeading label="Education" />
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="p-6 border border-border bg-[#111216] rounded-none"
        >
          <div className="font-mono text-[10px] uppercase tracking-widest text-accent mb-3">
            Sep 2023 — Present
          </div>
          <h3 className="text-lg font-semibold mb-1">
            Bachelor of Information and Communication Technology (Honours)
          </h3>
          <p className="text-sm text-accent font-mono mb-2">
            Specialization: Computer Networks
          </p>
          <p className="text-sm text-muted-foreground">
            Faculty of Computing & Technology, University of Kelaniya, Sri Lanka
          </p>
        </motion.div>
      </div>

      <div>
        <SectionHeading label="Certifications" />
        <div className="space-y-3">
          {certifications.map((c, i) => {
            const Content = (
              <>
                <span className="text-sm font-medium">{c.name}</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground shrink-0">
                  {c.status}
                </span>
              </>
            );

            const className = "flex items-center justify-between gap-4 p-4 border border-border bg-[#111216] hover:border-accent/40 transition-colors rounded-none w-full text-left";

            if (c.link) {
              return (
                <motion.a
                  key={c.name}
                  href={c.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={fadeUp}
                  custom={i}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className={`${className} cursor-pointer block`}
                >
                  {Content}
                </motion.a>
              );
            }

            return (
              <motion.div
                key={c.name}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className={className}
              >
                {Content}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

type ContactStatus = { type: "idle" | "loading" | "success" | "error"; message?: string };

function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof values, string>>>({});
  const [status, setStatus] = useState<ContactStatus>({ type: "idle" });

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (field: keyof typeof values) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof typeof values, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof typeof values;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      setStatus({ type: "error", message: "Please fix the highlighted fields." });
      return;
    }

    setStatus({ type: "loading", message: "Sending message telemetry..." });

    try {
      const response = await fetch(
        "https://sadev-portfolio-counter-ajc3hrg9d7djexe5.southeastasia-01.azurewebsites.net/api/send_message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(parsed.data),
        }
      );

      if (response.ok) {
        setStatus({ type: "success", message: "Thank you! Your message has been sent successfully." });
        setValues({ name: "", email: "", message: "" });
      } else {
        throw new Error("Server rejected message");
      }
    } catch (error) {
      console.warn("API delivery failed, using fallback mailto client:", error);
      const subject = encodeURIComponent(`Portfolio inquiry — ${parsed.data.name}`);
      const body = encodeURIComponent(
        `${parsed.data.message}\n\n— ${parsed.data.name}\n${parsed.data.email}`,
      );
      window.location.href = `mailto:sadevsabuddhika89@gmail.com?subject=${subject}&body=${body}`;
      setStatus({
        type: "success",
        message: "API offline. Opening your local email client...",
      });
      setValues({ name: "", email: "", message: "" });
    }
  };

  const inputBase =
    "w-full bg-white/[0.02] border border-border/30 rounded-none px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-accent transition-colors";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div>
        <label htmlFor="name" className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
          Name
        </label>
        <div 
          onClick={() => nameRef.current?.focus()}
          className={`font-mono text-xs flex items-center bg-[#090a0d] border px-3.5 py-3.5 focus-within:border-accent transition-colors rounded-none cursor-text ${errors.name ? "border-destructive" : "border-border/30"}`}
        >
          <span className="text-muted-foreground mr-2 select-none">sadev@sys:~$ set_name --val</span>
          <input
            ref={nameRef}
            id="name"
            type="text"
            maxLength={100}
            value={values.name}
            onChange={handleChange("name")}
            className="flex-1 bg-transparent border-none outline-none p-0 text-foreground focus:ring-0 text-xs font-mono placeholder:text-muted-foreground/30"
            placeholder="&quot;John Doe&quot;"
          />
        </div>
        {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
          Email
        </label>
        <div 
          onClick={() => emailRef.current?.focus()}
          className={`font-mono text-xs flex items-center bg-[#090a0d] border px-3.5 py-3.5 focus-within:border-accent transition-colors rounded-none cursor-text ${errors.email ? "border-destructive" : "border-border/30"}`}
        >
          <span className="text-muted-foreground mr-2 select-none">sadev@sys:~$ set_email --val</span>
          <input
            ref={emailRef}
            id="email"
            type="email"
            maxLength={255}
            value={values.email}
            onChange={handleChange("email")}
            className="flex-1 bg-transparent border-none outline-none p-0 text-foreground focus:ring-0 text-xs font-mono placeholder:text-muted-foreground/30"
            placeholder="&quot;john@example.com&quot;"
          />
        </div>
        {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="message" className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
          Message
        </label>
        <div 
          onClick={() => messageRef.current?.focus()}
          className={`font-mono text-xs bg-[#090a0d] border p-3.5 focus-within:border-accent transition-colors rounded-none cursor-text ${errors.message ? "border-destructive" : "border-border/30"}`}
        >
          <span className="text-muted-foreground block mb-2 select-none">sadev@sys:~$ cat &lt;&lt; 'EOF' &gt; message.txt</span>
          <textarea
            ref={messageRef}
            id="message"
            rows={5}
            maxLength={1000}
            value={values.message}
            onChange={handleChange("message")}
            className="w-full bg-transparent border-none outline-none p-0 text-foreground focus:ring-0 text-xs font-mono resize-none placeholder:text-muted-foreground/30"
            placeholder="Type your message here..."
          />
          <span className="text-muted-foreground block mt-1 select-none">EOF</span>
        </div>
        {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
      </div>

      <div className="flex flex-col gap-4 pt-2">
        <button
          type="submit"
          disabled={status.type === "loading"}
          className="w-full py-3.5 bg-accent text-background font-bold uppercase tracking-widest hover:bg-accent/90 transition-colors text-xs flex items-center justify-center gap-2 cursor-pointer rounded-none disabled:opacity-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-4 h-4 transform rotate-45 -mt-0.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          SEND MESSAGE
        </button>
        {status.type !== "idle" && (
          <span
            className={`text-xs ${status.type === "success" ? "text-accent" : "text-destructive"}`}
          >
            {status.message}
          </span>
        )}
      </div>
    </form>
  );
}

function Contact() {
  return (
    <section id="contact" className="pt-24 border-t border-border/30 scroll-mt-24">
      <div className="grid md:grid-cols-[1.1fr_1fr] gap-16 items-start">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent block mb-3">
              GET IN TOUCH
            </span>
            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-white mb-6 flex flex-wrap items-baseline gap-x-3">
              <span>Let's talk</span>
              <span className="text-accent text-6xl md:text-7xl font-black">cloud.</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed text-pretty max-w-[45ch]">
              I enjoy combining infrastructure, code, and networking to deploy stable, high-performance cloud applications. Open to Cloud, DevOps, and Cloud Administrator internships (remote or on-site). Based in Homagama, Sri Lanka.
            </p>
          </div>

          <div className="space-y-6 pt-4 max-w-[45ch]">
            <div className="border-t border-border/40 pt-4 flex justify-between items-center font-mono text-xs">
              <span className="text-muted-foreground uppercase tracking-widest">GITHUB</span>
              <a
                href="https://github.com/Sadev2003"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-accent transition-colors"
              >
                github.com/Sadev2003
              </a>
            </div>
            <div className="border-t border-border/40 pt-4 flex justify-between items-center font-mono text-xs">
              <span className="text-muted-foreground uppercase tracking-widest">LINKEDIN</span>
              <a
                href="https://www.linkedin.com/in/sadevsabuddhika/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-accent transition-colors"
              >
                linkedin.com/in/sadevsabuddhika
              </a>
            </div>
            <div className="border-t border-border/40 pt-4 flex justify-between items-center font-mono text-xs">
              <span className="text-muted-foreground uppercase tracking-widest">EMAIL</span>
              <a
                href="mailto:sadevsabuddhika89@gmail.com"
                className="text-white hover:text-accent transition-colors"
              >
                sadevsabuddhika89@gmail.com
              </a>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          custom={1}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="bg-[#111216] border border-border/30 p-8 rounded-none"
        >
          <ContactForm />
        </motion.div>
      </div>
    </section>
  );
}

const commandOutputs: Record<string, string[]> = {
  "ls -la": [
    "total 32",
    "drwxr-xr-x  3 sadev sadev 4096 Jul 26 01:00 .",
    "drwxr-xr-x 12 sadev sadev 4096 Jul 26 00:30 ..",
    "-rwxr-xr-x  1 sadev sadev 1024 Jul 26 01:03 deploy.sh"
  ],
  "cd ..": [],
  "pwd": [
    "/home/sadev/portfolio"
  ],
  "whoami": [
    "sadev"
  ],
  "uname -a": [
    "Linux sys 6.1.0-21-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.1.90-1 x86_64"
  ],
  "cat credentials.json": [
    "{ \"client_id\": \"9a8b7c6d\", \"tenant_id\": \"2d4e6f8a\" }"
  ],
  "chmod +x deploy.sh": [],
  "history | grep terraform": [
    "  154  terraform init",
    "  155  terraform plan",
    "  156  terraform apply"
  ],
  "systemctl status docker": [
    "● docker.service - Docker Application Container Engine",
    "   Active: active (running) since Sun 2026-07-26 00:01:10 UTC"
  ],
  "journalctl -u docker.service -n 10": [
    "Jul 26 00:01:10 sys dockerd[1245]: API listen on /var/run/docker.sock"
  ],
  "df -h": [
    "Filesystem      Size  Used Avail Use% Mounted on",
    "/dev/sda1        50G   14G   36G  28% /"
  ],
  "top -b -n 1": [
    "tasks: 125 total,   1 running, 124 sleeping,   0 stopped"
  ],
  "iptables -L -n -v": [
    "Chain INPUT (policy ACCEPT 120 packets, 8400 bytes)"
  ],
  "netstat -tuln": [
    "Proto Recv-Q Send-Q Local Address           Foreign Address         State",
    "tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN"
  ],
  "ping -c 3 sadevsabuddhika.tech": [
    "64 bytes from 104.21.32.11: icmp_seq=1 ttl=56 time=11.4 ms",
    "64 bytes from 104.21.32.11: icmp_seq=2 ttl=56 time=11.9 ms"
  ],
  "host sadevsabuddhika.tech": [
    "sadevsabuddhika.tech has address 104.21.32.11"
  ],
  "nslookup 10.0.0.4": [
    "Name:   private-api.internal",
    "Address: 10.0.0.4"
  ],
  "traceroute 8.8.8.8": [
    " 1  192.168.1.1 (192.168.1.1)  1.23 ms",
    " 2  10.0.0.1 (10.0.0.1)  4.56 ms"
  ],
  "curl -I http://localhost:80": [
    "HTTP/1.1 200 OK",
    "Content-Type: text/html; charset=UTF-8"
  ],
  "env | grep AZURE": [
    "AZURE_TENANT_ID=2d4e6f8a-9a8b",
    "AZURE_SUBSCRIPTION_ID=8f9e0d1a"
  ],
  "az group list -o table": [
    "Name           Location       ProvisioningState",
    "rg-sadev       southeastasia  Succeeded"
  ],
  "az aks get-credentials -g rg-sadev -n k8s-sadev": [
    "Merged \"k8s-sadev\" as current context in /root/.kube/config"
  ],
  "docker ps -a": [
    "CONTAINER ID   IMAGE          STATUS         PORTS",
    "8f9a2b1c4d0e   nginx:alpine   Up 2 hours     0.0.0.0:80->80/tcp"
  ],
  "docker images": [
    "REPOSITORY         TAG       IMAGE ID       SIZE",
    "portfolio-web      latest    a1b2c3d4e5f6   185MB"
  ],
  "docker logs api-server": [
    "info: server started on port 3000",
    "info: database connection established"
  ],
  "docker-compose up -d --build": [
    "Building api-server",
    "Recreating api-server ... done"
  ],
  "terraform init": [
    "Initializing the backend ...",
    "Terraform has been successfully initialized!"
  ],
  "terraform plan -out=tfplan": [
    "Plan: 2 to add, 0 to change, 0 to destroy."
  ],
  "terraform apply -auto-approve": [
    "Apply complete! Resources: 2 added, 0 changed, 0 destroyed."
  ],
  "kubectl get pods -A": [
    "default       portfolio-frontend-7f9b8c6d-2d4e   1/1     Running"
  ],
  "kubectl logs deployment/gateway -n prod": [
    "[INFO] Routing request GET /api/v1/projects to downstream service"
  ],
  "kubectl describe node aks-nodepool": [
    "Name:               aks-nodepool-12345",
    "OS Image:           Ubuntu 22.04.4 LTS"
  ],
  "helm list -A": [
    "ingress-nginx   ingress     1           deployed"
  ],
  "prometheus --config.file=prometheus.yml": [
    "ts=2026-07-26T00:00:01Z caller=main.go:450 msg=\"Server is ready to receive web requests.\""
  ],
  "grafana-server --config=grafana.ini": [
    "info: HTTP Server Listen on http://0.0.0.0:3000"
  ]
};

function CanvasBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const devopsLogs = Object.keys(commandOutputs);

    class LogStream {
      lines: { text: string; y: number; opacity: number; isCommand: boolean }[] = [];
      x: number;
      direction: "up" | "down";
      lastAddedTime: number = 0;

      constructor(x: number, direction: "up" | "down") {
        this.x = x;
        this.direction = direction;
      }

      addLog() {
        const text = devopsLogs[Math.floor(Math.random() * devopsLogs.length)];
        const commandText = `sadev@sys:~$ ${text}`;
        const outputLines = commandOutputs[text] || [];

        let startY = this.direction === "up" ? height - 50 : 50;

        if (this.lines.length > 0) {
          if (this.direction === "up") {
            const maxY = Math.max(...this.lines.map((l) => l.y));
            startY = Math.max(height - 50, maxY + 20);
          } else {
            const minY = Math.min(...this.lines.map((l) => l.y));
            const blockHeight = (outputLines.length + 1) * 15;
            startY = Math.min(50, minY - blockHeight - 20);
          }
        }

        // Push command
        this.lines.push({
          text: commandText,
          y: startY,
          opacity: 0.35,
          isCommand: true
        });

        // Push output lines
        outputLines.forEach((outText, idx) => {
          this.lines.push({
            text: outText,
            y: startY + (idx + 1) * 15,
            opacity: 0.22,
            isCommand: false
          });
        });
      }

      update() {
        this.lines.forEach((line) => {
          if (this.direction === "up") {
            line.y -= 0.35; // scroll up speed
            const progress = line.y / height;
            const maxOpacity = line.isCommand ? 0.38 : 0.24;
            line.opacity = Math.max(0, progress * maxOpacity);
          } else {
            line.y += 0.35; // scroll down speed
            const progress = 1 - line.y / height;
            const maxOpacity = line.isCommand ? 0.38 : 0.24;
            line.opacity = Math.max(0, progress * maxOpacity);
          }
        });

        if (this.direction === "up") {
          this.lines = this.lines.filter((line) => line.y > 20 && line.opacity > 0);
        } else {
          this.lines = this.lines.filter((line) => line.y < height && line.opacity > 0);
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.font = "10px 'JetBrains Mono', 'Courier New', monospace";
        this.lines.forEach((line) => {
          if (line.isCommand) {
            c.fillStyle = `rgba(6, 182, 212, ${line.opacity})`;
          } else {
            c.fillStyle = `rgba(148, 163, 184, ${line.opacity})`;
          }
          c.fillText(line.text, this.x, line.y);
        });
      }
    }

    const streams: LogStream[] = [];

    const resizeCanvas = () => {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);
    };

    const populateInitialLines = (stream: LogStream) => {
      stream.lines = [];
      let currentY = stream.direction === "up" ? height - 50 : 50;
      for (let j = 0; j < 6; j++) {
        const text = devopsLogs[Math.floor(Math.random() * devopsLogs.length)];
        const outputLines = commandOutputs[text] || [];
        const blockHeight = (outputLines.length + 1) * 15;

        let startY = currentY;
        if (stream.direction === "up") {
          startY = currentY - blockHeight - (Math.random() * 80 + 40);
          currentY = startY;
        } else {
          startY = currentY + (Math.random() * 80 + 40);
          currentY = startY + blockHeight;
        }

        if (startY > -200 && startY < height + 200) {
          stream.lines.push({
            text: `sadev@sys:~$ ${text}`,
            y: startY,
            opacity: 0.18,
            isCommand: true
          });
          outputLines.forEach((outText, idx) => {
            stream.lines.push({
              text: outText,
              y: startY + (idx + 1) * 15,
              opacity: 0.10,
              isCommand: false
            });
          });
        }
      }
    };

    const updateStreamPositions = () => {
      if (width > 1024) {
        if (streams.length === 0) {
          const s1 = new LogStream(30, "up");
          const s2 = new LogStream(width - 350, "down");
          populateInitialLines(s1);
          populateInitialLines(s2);
          streams.push(s1, s2);
        } else if (streams.length === 1) {
          streams[0].x = 30;
          streams[0].direction = "up";
          const s2 = new LogStream(width - 350, "down");
          populateInitialLines(s2);
          streams.push(s2);
        } else {
          streams[0].x = 30;
          streams[1].x = width - 350;
        }
      } else if (width > 768) {
        if (streams.length === 0) {
          const s1 = new LogStream(20, "up");
          populateInitialLines(s1);
          streams.push(s1);
        } else {
          streams[0].x = 20;
          streams[0].direction = "up";
          if (streams.length > 1) {
            streams.splice(1, 1);
          }
        }
      } else {
        streams.length = 0;
      }
    };

    resizeCanvas();
    updateStreamPositions();

    const handleResize = () => {
      resizeCanvas();
      updateStreamPositions();
    };

    window.addEventListener("resize", handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const currentTime = Date.now();
      streams.forEach((stream) => {
        if (currentTime - stream.lastAddedTime > Math.random() * 4000 + 3000) {
          stream.addLog();
          stream.lastAddedTime = currentTime;
        }

        stream.update();
        stream.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);

  const logs = [
    "Initializing Azure deployment pipeline...",
    "Resolving cloudflare DNS sadevsabuddhika.tech...",
    "Pulling base image node:20-alpine...",
    "Compiling TanStack application code...",
    "Running Vite production bundles...",
    "Generating static asset headers...",
    "Uploading client build files to Azure SWA...",
    "Verifying SSL handshake & routes...",
    "Warm-starting edge server endpoints...",
    "Pipeline status: DEPLOYMENT SUCCESSFUL!"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 8) + 3;
        return next > 100 ? 100 : next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const index = Math.min(
      logs.length - 1,
      Math.floor((progress / 100) * logs.length)
    );
    setLogIndex(index);

    if (progress === 100) {
      const timeout = setTimeout(() => {
        onComplete();
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  const barLength = 20;
  const filledLength = Math.floor((progress / 100) * barLength);
  const bar = "█".repeat(filledLength) + "░".repeat(barLength - filledLength);

  return (
    <div className="fixed inset-0 bg-background z-[99999] flex flex-col items-center justify-center font-mono p-6 selection:bg-accent/30 select-none">
      <div className="w-full max-w-md border border-border bg-card/30 p-6 flex flex-col gap-4 shadow-[0_0_30px_rgba(6,182,212,0.05)]">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-2 text-muted-foreground text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500/80" />
            <span className="h-2 w-2 rounded-full bg-yellow-500/80" />
            <span className="h-2 w-2 rounded-full bg-green-500/80" />
          </div>
          <span>DEPLOY_LOG.SH</span>
        </div>

        <div className="flex flex-col gap-2 min-h-[60px] text-xs">
          <div className="text-muted-foreground flex items-center gap-2">
            <span className="text-accent font-bold">&gt;</span>
            <span>sadev@sys:~$ ./deploy_portfolio.sh</span>
          </div>
          <div className="text-white/80 transition-all duration-200">
            {logs[logIndex]}
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <div className="flex justify-between items-center text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
            <span>Deploying...</span>
            <span className="text-accent font-mono">{progress}%</span>
          </div>
          <div className="text-accent font-mono text-[11px] md:text-sm tracking-wider text-center select-none">
            [{bar}]
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [visitorCount, setVisitorCount] = useState<string>("Loading...");
  const [isLoading, setIsLoading] = useState(true);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHoveringLink, setIsHoveringLink] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const mousePosRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      if ((e as any).isSynthetic) return;
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.getAttribute("role") === "button"
      ) {
        setIsHoveringLink(true);
      } else {
        setIsHoveringLink(false);
      }
    };

    let lastScrollTime = 0;
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScrollTime < 50) return;
      lastScrollTime = now;

      const current = mousePosRef.current;
      if (current.x !== -100) {
        const evt = new MouseEvent("mousemove", {
          clientX: current.x,
          clientY: current.y,
          bubbles: true,
          cancelable: true,
        });
        (evt as any).isSynthetic = true;

        const target = document.elementFromPoint(current.x, current.y);
        if (target) {
          target.dispatchEvent(evt);

          if (
            target.tagName === "A" ||
            target.tagName === "BUTTON" ||
            target.closest("a") ||
            target.closest("button") ||
            target.closest("input") ||
            target.closest("textarea") ||
            target.getAttribute("role") === "button"
          ) {
            setIsHoveringLink(true);
          } else {
            setIsHoveringLink(false);
          }

          const article = target.closest("article");
          if (article) {
            const indexAttr = article.getAttribute("data-project-index");
            if (indexAttr !== null) {
              setHoveredProject(parseInt(indexAttr, 10));
              return;
            }
          }
        }
      }
      setHoveredProject(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
          lenis.scrollTo(element, { offset: -80 });
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        const response = await fetch(
          "https://sadev-portfolio-counter-ajc3hrg9d7djexe5.southeastasia-01.azurewebsites.net/api/visitor_counter"
        );
        if (!response.ok) throw new Error("API error");
        const text = await response.text();
        const matches = text.match(/\d+/);
        if (matches) {
          const formatted = parseInt(matches[0], 10).toLocaleString();
          setVisitorCount(formatted);
        } else {
          setVisitorCount("---");
        }
      } catch (error) {
        console.error("Error fetching visitor counter:", error);
        setVisitorCount("---");
      }
    };
    fetchVisitorCount();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/30 relative overflow-hidden">
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <CanvasBackground />
      {/* Custom Terminal Prompt Cursor */}
      {mounted && !isLoading && typeof window !== "undefined" && createPortal(
        <div
          className="hidden lg:block fixed pointer-events-none z-[9999]"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
            transform: `translate(-50%, -50%) scale(${isHoveringLink ? 1.5 : 1})`,
          }}
        >
          {isHoveringLink ? (
            <div className="w-3.5 h-3.5 border border-accent bg-accent/20 flex items-center justify-center font-mono text-[9px] text-accent font-bold">
              +
            </div>
          ) : (
            <div className="w-2 h-4 bg-accent animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
          )}
        </div>,
        document.body
      )}
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="#" className="flex items-center gap-2 font-mono text-xs tracking-[0.2em] font-bold uppercase text-white hover:text-accent transition-colors">
              <span className="h-1.5 w-1.5 bg-accent" />
              SADEV
            </a>
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 border border-border bg-white/5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground rounded-none">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span>VISITORS:</span>
              <span className="text-foreground font-semibold">{visitorCount}</span>
            </div>
          </div>
          <div className="flex gap-8 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
            <a href="#about" className="hover:text-accent hover:underline hover:underline-offset-8 decoration-accent transition-all duration-300">About</a>
            <a href="#stack" className="hover:text-accent hover:underline hover:underline-offset-8 decoration-accent transition-all duration-300">Stack</a>
            <a href="#projects" className="hover:text-accent hover:underline hover:underline-offset-8 decoration-accent transition-all duration-300">Projects</a>
            <a href="#badges" className="hover:text-accent hover:underline hover:underline-offset-8 decoration-accent transition-all duration-300">Badges</a>
            <a href="#contact" className="hover:text-accent hover:underline hover:underline-offset-8 decoration-accent transition-all duration-300">Contact</a>
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-6 pt-32 pb-24 relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects hoveredProject={hoveredProject} setHoveredProject={setHoveredProject} />
        <EducationCerts />
        <Badges />
        <Contact />


      </main>

      <footer className="py-12 border-t border-border/20 text-center relative z-10">
        <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.4em]">
          © 2026 SADEV SABUDDHIKA // BUILT FOR SCALE
        </p>
      </footer>
    </div>
  );
}
