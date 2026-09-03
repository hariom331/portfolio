import type { SiteContent } from "./types";

/**
 * All page copy lives here.
 *
 * Source of truth for every claim below is the master resume in
 * `analysis/11-resume-rewritten.md`. If the resume and this file disagree, the
 * resume wins — fix this file, do not fix the resume to match the site.
 *
 * Rule: no number appears here that has not been measured. Placeholders are
 * marked TODO and left unrendered rather than filled with a plausible guess.
 */
export const site: SiteContent = {
  name: "Hariom Joshi",
  role: "Cloud & Backend Engineer",
  tagline: "AWS · CloudFormation · Java · Spring Boot",
  location: "Hyderabad, India",

  // TODO: replace once the domain is registered. Used for canonical + OG URLs.
  url: "https://hariomjoshi.dev",

  email: "hariomjoshi331@gmail.com",

  links: [
    // `public/resume.pdf` is a copy of the master PDF. Re-copy it whenever the
    // LaTeX source is rebuilt — nothing syncs the two automatically.
    {
      label: "Resume",
      href: "/resume.pdf",
      kind: "resume",
      srLabel: "Resume (PDF)",
    },
    { label: "GitHub", href: "https://github.com/hariom331", kind: "github" },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/in/hariomjoshi",
      kind: "linkedin",
    },
    {
      label: "Email",
      href: "mailto:hariomjoshi331@gmail.com",
      kind: "email",
    },
  ],

  // Kept in sync with the resume summary by hand. Deliberately not computed
  // from a start date: two sources deriving tenure differently is worse than
  // one string edited twice a year.
  positioning:
    "Cloud and backend engineer with 2.8 years at Deloitte, owning the AWS infrastructure for a " +
    "COBOL-mainframe-to-cloud modernisation programme at a Fortune 500 US investment management " +
    "client. I own roughly 80% of the AWS resource estate across three environments — " +
    "CloudFormation IaC, GitHub Actions CI/CD, ECS Fargate, Aurora, Redshift and DMS migrations — " +
    "and build the Java 17 and Python services that replace the migrated mainframe workloads.",

  credentials:
    "700+ DSA problems solved · CodeChef 4★ · All India Rank 28 of 50,000+ in the PrepSAT " +
    "Hackathon · AWS Certified Cloud Practitioner",

  /**
   * The hero tiles. Every figure below appears in the master resume and came
   * from measured work — none is rounded up for effect, and none is invented.
   */
  highlights: [
    {
      value: "~80%",
      count: { prefix: "~", to: 80, suffix: "%" },
      label: "of the AWS estate",
      context: "owned across dev, UAT and production",
    },
    {
      value: "<2 min",
      count: { prefix: "<", to: 2, suffix: " min" },
      label: "EC2 provisioning",
      context: "down from 15–20 minutes",
    },
    {
      value: "30–40",
      count: { prefix: "30–", to: 40, suffix: "" },
      label: "CI/CD pipelines",
      context: "authored on GitHub Actions",
    },
    {
      value: "500K",
      count: { prefix: "", to: 500, suffix: "K" },
      label: "records per peak run",
      context: "on the migrated batch workloads",
    },
  ],

  /**
   * Feeds the skill cloud. `weight` is editorial prominence, 1-3 — what he
   * wants a reader to see first, not a proficiency claim.
   */
  stack: [
    {
      label: "Cloud & Infrastructure",
      items: [
        { name: "AWS", weight: 3 },
        { name: "CloudFormation", weight: 3 },
        { name: "ECS Fargate", weight: 3 },
        { name: "Lambda", weight: 2 },
        { name: "Step Functions", weight: 2 },
        { name: "S3", weight: 2 },
        { name: "IAM", weight: 2 },
        { name: "KMS", weight: 1 },
        { name: "VPC", weight: 1 },
        { name: "AWS DMS", weight: 2 },
        { name: "Storage Gateway", weight: 1 },
        { name: "Secrets Manager", weight: 1 },
      ],
    },
    {
      label: "Data",
      items: [
        { name: "Aurora", weight: 3 },
        { name: "Redshift", weight: 2 },
        { name: "PostgreSQL", weight: 2 },
        { name: "MySQL", weight: 1 },
        { name: "DB2", weight: 1 },
        { name: "Spring Data JPA", weight: 1 },
      ],
    },
    {
      label: "Languages",
      items: [
        { name: "Java 17", weight: 3 },
        { name: "Python", weight: 2 },
        { name: "SQL", weight: 2 },
        { name: "Shell", weight: 1 },
      ],
    },
    {
      label: "Backend",
      items: [
        { name: "Spring Boot", weight: 3 },
        { name: "REST APIs", weight: 2 },
        { name: "Microservices", weight: 2 },
        { name: "Maven", weight: 1 },
        { name: "JUnit", weight: 1 },
      ],
    },
    {
      label: "DevOps & Tooling",
      items: [
        { name: "GitHub Actions", weight: 3 },
        { name: "Docker", weight: 2 },
        { name: "JFrog Artifactory", weight: 1 },
        { name: "Bamboo", weight: 1 },
        { name: "Splunk", weight: 1 },
        { name: "Control-M", weight: 1 },
        { name: "ServiceNow", weight: 1 },
      ],
    },
  ],

  /**
   * Not built yet. The Flagship section is skipped entirely while this is null.
   *
   * Planned: the Terraform multi-environment platform plus the batch migration
   * pipeline it deploys, as one system (`analysis/12-project-shortlist-cloud-lane.md`).
   * Fill this in only when the thing is live and the numbers are measured.
   */
  flagship: null,

  /**
   * Two, maximum. Repo names below are the real ones from the GitHub audit in
   * `analysis/17-github-cleanup-plan.md` — check them before publishing, and
   * add `demo` / `docs` / `video` / `writeup` links only once those artefacts
   * actually exist. A button that leads nowhere is worse than no button.
   */
  projects: [
    {
      name: "spender-guardian",
      stack: ["Java", "Docker", "GitHub Actions", "AWS"],
      description:
        "AWS cost-visibility tooling. Currently a skeleton — five commits, core flow only. " +
        "Do not publish this card until the repo has a real README stating honestly what does " +
        "and does not run.",
      links: [
        {
          label: "GitHub",
          href: "https://github.com/hariom331/spender-guardian-repo.mono",
          kind: "github",
        },
      ],
    },
    {
      name: "Infant Emotion Detection",
      stack: ["Python", "CNN", "REST APIs"],
      description:
        "Real-time emotion detection over audio and image input using a CNN, reaching 97% " +
        "classification accuracy, with REST APIs triggering downstream actions on detected state.",
      links: [
        {
          label: "GitHub",
          href: "https://github.com/hariom331/infant-emotion-detection",
          kind: "github",
        },
      ],
    },
  ],

  experience: [
    {
      company: "Deloitte",
      title: "Software Engineer (Senior Analyst)",
      period: "Jan 2024 – Present",
      location: "Hyderabad, India",
      context:
        "Cloud modernisation programme for a Fortune 500 US investment management client — " +
        "migrating COBOL mainframe batch workloads to Java and Python on AWS. 20-engineer engagement.",
      bullets: [
        "Own ~80% of the AWS resource estate across dev, UAT and production — EC2, ECS Fargate, " +
          "Lambda, S3, Aurora, Redshift, KMS, Secrets Manager, Step Functions and Storage Gateway.",
        "Cut EC2 provisioning from 15–20 minutes to under 2 minutes by profiling and removing " +
          "non-essential userdata bootstrap commands, shortening every job-execution cycle in the " +
          "environment.",
        "Migrated 5–6 COBOL mainframe modules to Java 17 / Spring Boot on ECS Fargate and Python " +
          "on Lambda, supporting batch jobs that process 200,000–500,000 customer records per peak run.",
      ],
      tech: [
        "AWS",
        "CloudFormation",
        "ECS Fargate",
        "Lambda",
        "Aurora",
        "Redshift",
        "AWS DMS",
        "GitHub Actions",
        "Java 17",
        "Spring Boot",
        "Python",
        "Docker",
      ],
    },
  ],
};
