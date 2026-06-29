import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding started...");

  // 1. Seed Admin User
  const adminEmail = "admin@arjundev.in";
  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: "Arjun",
        role: "SuperAdmin",
      },
    });
    console.log("Created admin user: admin@arjundev.in / admin123");
  }

  // 2. Seed Singleton Profile
  await prisma.profile.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      name: "Arjun",
      tagline: "Web Developer by Profession, Mentor by Passion",
      about: "Helping aspirants find their footing in tech without needing formal degrees, empowering them to start coding and building public portfolios.",
      biography: "I wasn't born into tech. I began my journey as an ITI student, worked as a cashier, and managed digital platforms as a marketing manager before teaching myself coding. I spent nights debugging, learning WordPress and Javascript architectures, and eventually building full-scale custom web applications.",
      journeyIntro: "My career has been a non-linear path, driven by curiosity and visual problem-solving. Each milestone laid a unique block for my understanding of engineering, user experience, and growth marketing.",
      mission: "To break down the walls of entry in web engineering by providing hands-on, practical mentorship based on shipping real products.",
      vision: "Build a community of self-taught builders who write clean code, document their progress publicly, and command agency over their careers.",
      socialLinks: {
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        youtube: "https://youtube.com",
        instagram: "https://instagram.com",
      },
      availability: "Available for custom builds and mentorship",
      avatarUrl: "/arjun_photo.jpg",
      coverUrl: "",
    },
  });
  console.log("Profile settings initialized.");

  // 3. Seed Singleton Hero Settings
  await prisma.heroSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      headline: "Build Websites.",
      animatedText: "Build Websites.,Develop Careers.,Ship Products.,Solve Problems.",
      subtitle: "Helping aspiring developers, business owners, and startup founders master WordPress, Shopify, and modern web development through hands-on learning.",
      ctaPrimary: "Explore My Journey",
      ctaPrimaryUrl: "/journey",
      ctaSecondary: "Work With Me",
      ctaSecondaryUrl: "/contact",
      bgSettings: {
        accentGlow: "#ffff3f",
        showGrid: true,
      },
    },
  });
  console.log("Hero settings initialized.");

  // 4. Seed Singleton CMS Config
  await prisma.cmsConfig.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      provider: "Local",
      apiUrl: "",
      apiKey: "",
    },
  });
  console.log("CMS configuration initialized.");

  // 5. Seed Default Milestones (Career timeline)
  const milestoneCount = await prisma.milestone.count();
  if (milestoneCount === 0) {
    const milestones = [
      {
        role: "ITI Student",
        organization: "Technical Institute",
        period: "Foundation Years",
        description: "Studied fundamental mechanics, diagnostics, and system operations. Built practical discipline, hands-on trouble-shooting mindsets, and manual labor integrity.",
        lessons: ["Every system has a logical structure.", "Hands-on diagnostic thinking starts here."],
        achievements: ["Scored top ranks in practical certifications.", "Developed discipline for complex system repair."],
        technologies: ["Engineering Graphics", "Diagnostic Tools"],
        mindset: "Uncertain about tech, but curious about mechanisms and structures.",
        orderIndex: 0,
      },
      {
        role: "Supermarket Cashier",
        organization: "Retail Chain",
        period: "Human Interface",
        description: "Stood on the front lines of customer service. Processed transactions, managed inventory metrics, and dealt with hundreds of unique human personalities daily.",
        lessons: ["Patience is the foundation of customer experience.", "Speed and accuracy are non-negotiable."],
        achievements: ["Awarded star cashier of the month for zero-variance registers.", "Mastered high-pressure multitasking."],
        technologies: ["POS Terminal Systems", "Inventory Tracking"],
        mindset: "Striving for financial survival while observing user flow and human psychology.",
        orderIndex: 1,
      },
      {
        role: "Marketing Manager",
        organization: "Digital Agency",
        period: "Growth & Strategy",
        description: "Led digital marketing initiatives, constructed optimized landing pages, and managed lead-gen conversion metrics. Leveraged web metrics to shape organic brand growth.",
        lessons: ["A beautiful site is useless if it doesn't convert.", "Branding is telling a consistent story."],
        achievements: ["Boosted client organic leads by 120% using content loops.", "Designed high-converting sales funnels."],
        technologies: ["WordPress Basics", "SEO Tools", "Google Analytics"],
        mindset: "Bridged design, communication, and basic HTML. Realizing that the web is a branding canvas.",
        orderIndex: 2,
      },
      {
        role: "Web Developer",
        organization: "Freelance / Agency",
        period: "Self-Taught Execution",
        description: "Began coding full-time. Customizing WordPress themes via PHP OOP, scripting custom JS interactions, and executing complex layouts from Figma mocks.",
        lessons: ["Code is a tool for business outcomes, not just syntactical art.", "API reading beats tutorial watching."],
        achievements: ["Shipped 30+ client websites in 12 months.", "Automated redundant template configs into reusable components."],
        technologies: ["WordPress (Custom OOP)", "Shopify Liquid", "Vanilla JavaScript", "PHP"],
        mindset: "Immersed in lines of code, solving client bottlenecks, and mastering developer operations.",
        orderIndex: 3,
      },
      {
        role: "Head of Development",
        organization: "Web Agency",
        period: "Leadership & Scale",
        description: "Directed dev resources, architected Next.js e-commerce engines, and established clean versioning repositories. Scaled systems and mentored junior coders.",
        lessons: ["Leading means building leadership in others.", "Architecture choices impact years of maintenance."],
        achievements: ["Reduced layout load times by 40% globally.", "Introduced continuous integration hooks and visual lint checks."],
        technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Git workflows"],
        mindset: "Bridging business requirements, clean architectures, and developer training.",
        orderIndex: 4,
      },
      {
        role: "Developer & Mentor",
        organization: "arjundev.in",
        period: "Brand & Legacy",
        description: "Launched public mentoring portals. Building high-end client platforms while teaching aspirants modern web engineering and Shopify OOP designs.",
        lessons: ["The best way to master a concept is to teach it to someone else.", "A strong personal brand is the ultimate leverage."],
        achievements: ["Mentored 1000+ students on digital skills.", "Launched Velvetbyte custom templates shop."],
        technologies: ["Next.js 16", "PostgreSQL", "Tailwind v4", "Mentorship Modules"],
        mindset: "Empowering developers to own their narrative, ship production code, and gain absolute career agency.",
        orderIndex: 5,
      },
    ];

    for (const milestone of milestones) {
      await prisma.milestone.create({ data: milestone });
    }
    console.log("Seeded career milestones.");
  }

  // 6. Seed Default Statistics
  const statCount = await prisma.statistic.count();
  if (statCount === 0) {
    const stats = [
      { value: "1000+", label: "Students Mentored", orderIndex: 0 },
      { value: "75+", label: "Projects Shipped", orderIndex: 1 },
      { value: "5+ Years", label: "Real Experience", orderIndex: 2 },
    ];
    for (const stat of stats) {
      await prisma.statistic.create({ data: stat });
    }
    console.log("Seeded statistics.");
  }

  // 7. Seed Default FAQ
  const faqCount = await prisma.faq.count();
  if (faqCount === 0) {
    const faqs = [
      { question: "Is this mentorship program suitable for complete beginners?", answer: "Yes! The program is designed specifically to help beginners transition from zero knowledge to shipping real-world WordPress, Shopify, and React/Next.js projects.", category: "General", orderIndex: 0 },
      { question: "Do I need a formal college degree to start?", answer: "Absolutely not. The curriculum is entirely project-focused, teaching you practical web development skills that companies actually hire for.", category: "General", orderIndex: 1 },
      { question: "How long does it take to complete the roadmap?", answer: "Most students dedicate 10-15 hours a week and successfully ship their capstone portfolios in 3 to 6 months.", category: "Curriculum", orderIndex: 2 },
    ];
    for (const faq of faqs) {
      await prisma.faq.create({ data: faq });
    }
    console.log("Seeded FAQs.");
  }

  console.log("Seeding complete successfully.");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
