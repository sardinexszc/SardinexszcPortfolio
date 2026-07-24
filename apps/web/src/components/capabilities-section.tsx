"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  type Variants,
} from "framer-motion";
import {
  Activity,
  BrainCircuit,
  Bug,
  CloudCog,
  Code2,
  Database,
  FileText,
  FolderKanban,
  Globe,
  Network,
  Rocket,
  Search,
  ServerCog,
  Settings2,
  ShieldCheck,
  Workflow,
} from "lucide-react";

const processSteps = [
  {
    title: "Discovery",
    description: "Understand requirements, users, and project goals.",
    icon: Search,
  },
  {
    title: "System Design",
    description: "Design scalable architecture, databases, and APIs.",
    icon: FolderKanban,
  },
  {
    title: "Development",
    description: "Build responsive frontend, backend services, and integrations.",
    icon: Code2,
  },
  {
    title: "Testing",
    description: "Perform debugging, validation, and performance optimization.",
    icon: Bug,
  },
  {
    title: "Deployment",
    description: "Deploy production-ready applications and monitor reliability.",
    icon: Rocket,
  },
  {
    title: "Maintenance",
    description: "Continuously improve systems through updates and enhancements.",
    icon: Settings2,
  },
] as const;

const impactStats = [
  { value: 3, suffix: "", label: "Web Apps Deployed Online", icon: Globe },
  { value: 3, suffix: "", label: "Locally Hosted Web Apps", icon: ServerCog },
  { value: 4, suffix: "", label: "Research Projects (2 DOST-PCAARRD / 2 CLSU)", icon: Workflow },
  { value: 3, suffix: "", label: "Approved Copyrights", icon: ShieldCheck },
  { value: 7, suffix: "", label: "Copyrights in Application", icon: FileText },
  { value: 1, suffix: "", label: "Approved Patent", icon: BrainCircuit },
  { value: 1, suffix: "", label: "Patent in Application", icon: Activity },
  { value: 7, suffix: "+", label: "Years of Development", icon: Network },
] as const;

const strengths = [
  {
    title: "Full-Stack Development",
    description: "Develop scalable web applications using modern frontend and backend technologies.",
    icon: Code2,
  },
  {
    title: "Artificial Intelligence",
    description: "Build AI-powered applications, LLM integrations, intelligent agents, and workflow automation.",
    icon: BrainCircuit,
  },
  {
    title: "IoT Systems",
    description: "Develop real-time monitoring and automation platforms using embedded devices and sensors.",
    icon: Activity,
  },
  {
    title: "Research Information Systems",
    description: "Create digital solutions for research institutions and government organizations.",
    icon: FolderKanban,
  },
  {
    title: "API Development",
    description: "Design RESTful APIs and integrate third-party services.",
    icon: Network,
  },
  {
    title: "Database Engineering",
    description: "Design efficient relational databases and optimize data management.",
    icon: Database,
  },
  {
    title: "Deployment & DevOps",
    description: "Deploy applications using modern cloud platforms and version control.",
    icon: CloudCog,
  },
  {
    title: "Technical Documentation",
    description: "Produce comprehensive documentation for systems, APIs, and research projects.",
    icon: FileText,
  },
] as const;

const stagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function CountUpStat({ value, suffix, label, icon: Icon }: (typeof impactStats)[number]) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const controls = animate(0, value, {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setCount(Math.round(latest)),
    });

    return () => controls.stop();
  }, [inView, value]);

  return (
    <motion.div
      ref={ref}
      className="impact-card"
      variants={fadeUp}
      whileHover={{ y: -6 }}
    >
      <div className="impact-card-top">
        <Icon size={18} strokeWidth={1.7} />
        <span>{label}</span>
      </div>
      <div className="impact-value">{count}{suffix}</div>
    </motion.div>
  );
}

export function CapabilitiesSection() {
  return (
    <section className="content-section capabilities-section" aria-labelledby="skills-title">
      <div className="section-title capabilities-title-block">
        <span>03 / Capabilities</span>
        <div className="capabilities-heading-wrap">
          <h2 id="skills-title">Building complete software solutions.</h2>
          <p>
            From research systems and enterprise web applications to AI automation and IoT platforms, I build software that solves real-world problems from concept to deployment.
          </p>
        </div>
      </div>

      <div className="capabilities-group">
        <div className="capabilities-subhead">
          <span>Development process</span>
          <h3>A workflow built for clarity and delivery.</h3>
        </div>
        <motion.div
          className="process-grid"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {processSteps.map(({ title, description, icon: Icon }) => (
            <motion.article key={title} className="process-card" variants={fadeUp} whileHover={{ y: -4 }}>
              <div className="process-icon"><Icon size={18} strokeWidth={1.7} /></div>
              <div>
                <h4>{title}</h4>
                <p>{description}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>

      <div className="capabilities-group">
        <div className="capabilities-subhead">
          <span>Impact by the numbers</span>
          <h3>Evidence of shipped systems and sustained output.</h3>
        </div>
        <motion.div
          className="impact-grid"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {impactStats.map((stat) => <CountUpStat key={stat.label} {...stat} />)}
        </motion.div>
      </div>

      <div className="capabilities-group">
        <div className="capabilities-subhead">
          <span>Core strengths</span>
          <h3>Where I bring the most value across the stack.</h3>
        </div>
        <motion.div
          className="strength-grid"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {strengths.map(({ title, description, icon: Icon }) => (
            <motion.article key={title} className="strength-card" variants={fadeUp} whileHover={{ y: -6 }}>
              <div className="strength-icon"><Icon size={18} strokeWidth={1.7} /></div>
              <h4>{title}</h4>
              <p>{description}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}