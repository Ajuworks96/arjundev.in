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

  // 5. Seed Default Milestones
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

  // 8. Seed Course Platform (Learn with Arjun)
  // Delete existing learning records to ensure fresh seed
  await prisma.quiz.deleteMany();
  await prisma.download.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();

  console.log("Seeding Learn courses...");

  // COURSE 1: Website Basics
  const c1 = await prisma.course.create({
    data: {
      title: "Website Basics",
      slug: "website-basics",
      description: "വെബ് ഡെവലപ്‌മെന്റ് പഠിക്കാൻ ആഗ്രഹിക്കുന്ന ഒരു തുടക്കക്കാരൻ അറിഞ്ഞിരിക്കേണ്ട ഏറ്റവും അടിസ്ഥാനപരമായ കാര്യങ്ങൾ ലളിതമായ മലയാളത്തിൽ.",
      duration: "3 Hours",
      difficulty: "Beginner",
      orderIndex: 0,
    }
  });

  const m1 = await prisma.module.create({
    data: {
      title: "അടിസ്ഥാന തത്വങ്ങൾ (Foundations)",
      description: "ഇന്റർനെറ്റും വെബ്‌സൈറ്റും എങ്ങനെ പ്രവർത്തിക്കുന്നു എന്ന് നമുക്ക് ലളിതമായി മനസ്സിലാക്കാം.",
      orderIndex: 0,
      courseId: c1.id
    }
  });

  const c1Lessons = [
    {
      title: "Website എന്താണ്?",
      slug: "what-is-website",
      introMalayalam: "ഹായ്, ഞാൻ അർജുൻ. ഇന്നത്തെ ഫസ്റ്റ് ലെസ്സണിൽ നമുക്ക് വെബ്‌സൈറ്റ് എന്നാൽ എന്താണെന്ന് വളരെ ലളിതമായി മനസ്സിലാക്കാം.",
      explanation: "ഒരു വെബ്‌സൈറ്റ് എന്നത് ഇന്റർനെറ്റിലൂടെ ആർക്കും കാണാൻ കഴിയുന്ന ഡിജിറ്റൽ പേജുകളുടെ കൂട്ടമാണ്. ഇത് നിങ്ങളുടെ ഉല്പന്നങ്ങൾ കാണിക്കാനും ആളുകളുമായി ആശയവിനിമയം നടത്താനും ഉള്ള ഡിജിറ്റൽ പ്ലാറ്റ്‌ഫോമാണ്.",
      realLifeExample: "നമ്മുടെ നാട്ടിലെ ഒരു വലിയ ലൈബ്രറിയിലെ ഒരു ബുക്ക് പോലെയാണ് ഒരു വെബ്‌സൈറ്റ്. ലൈബ്രറിയിലെ വിലാസം (Shelf number) വെബ്‌സൈറ്റിന്റെ ലിങ്കും, ബുക്കിനകത്തെ വിവരങ്ങൾ വെബ്‌പേജുകളുമാണ്.",
      visualConcept: "📁 Website (Folder) ──> 📄 HTML File (Page) ──> 🖼️ Media Assets",
      practicalDemo: "1. ബ്രൗസർ തുറന്ന് 'google.com' എന്ന് ടൈപ്പ് ചെയ്യുക. \n2. റൈറ്റ് ക്ലിക്ക് ചെയ്ത് 'Inspect' തിരഞ്ഞെടുക്കുക.",
      summary: "• വെബ്‌സൈറ്റ് എന്നത് കോഡുകൾ ചേർത്തുവെച്ച ഡിജിറ്റൽ ഫയലാണ്.\n• ഇന്റർനെറ്റിലൂടെ ഇതിലെ ഡാറ്റ ആർക്കും ആക്സസ് ചെയ്യാം.",
      miniChallenge: "നിങ്ങൾക്ക് ഏറ്റവും ഇഷ്ടമുള്ള 3 വെബ്‌സൈറ്റുകൾ സന്ദർശിച്ച് അവയുടെ പേര് നോട്ട് ചെയ്തു വെക്കുക.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      quizQuestion: "ഒരു വെബ്‌സൈറ്റ് എന്നാൽ എന്താണ്?",
      quizOptions: ["ഇന്റർനെറ്റിൽ കാണുന്ന വെബ് പേജുകളുടെ കൂട്ടം", "ഒരു വിമാന ടിക്കറ്റ്", "ഒരു കമ്പ്യൂട്ടർ മൗസ്"],
      quizAnswerIndex: 0
    },
    {
      title: "Internet എന്താണ്?",
      slug: "what-is-internet",
      introMalayalam: "ഹായ്, ഞാൻ അർജുൻ. ഇന്റർനെറ്റ് എന്നാൽ എന്താണെന്നും അത് എങ്ങനെ പ്രവർത്തിക്കുന്നു എന്നും ഇന്നത്തെ ലെസ്സണിലൂടെ നോക്കാം.",
      explanation: "ലോകമെമ്പാടുമുള്ള കോടിക്കണക്കിന് കമ്പ്യൂട്ടറുകളെയും മൊബൈലുകളെയും തമ്മിൽ വയറുകളിലൂടെയും സാറ്റലൈറ്റുകളിലൂടെയും കണക്റ്റ് ചെയ്തിരിക്കുന്ന വലിയ നെറ്റ്‌വർക്ക് ആണ് ഇന്റർനെറ്റ്.",
      realLifeExample: "നമ്മുടെ നാട്ടിലെ എല്ലാ റോഡുകളും തമ്മിൽ ബന്ധിപ്പിച്ച് ഒരു വലിയ റോഡ് നെറ്റ്‌വർക്ക് ഉള്ളത് പോലെയാണ് ഇന്റർനെറ്റ്. ഇന്റർനെറ്റിലൂടെ കമ്പ്യൂട്ടറുകൾ തമ്മിൽ വിവരങ്ങൾ കൈമാറുന്നു.",
      visualConcept: "💻 Computer A <───(Internet Lines)───> 🖥️ Computer B (Server)",
      practicalDemo: "1. നിങ്ങളുടെ ഫോണിലെ ഇന്റർനെറ്റ് ഓഫ് ചെയ്യുക.\n2. ഗൂഗിൾ തുറന്നു നോക്കുക, കണക്റ്റിവിറ്റി ഇല്ലെന്ന് കാണാം.",
      summary: "• ഇന്റർനെറ്റ് കമ്പ്യൂട്ടറുകളുടെ ആഗോള നെറ്റ്‌വർക്ക് ആണ്.\n• ഡാറ്റ കൈമാറ്റം ചെയ്യാൻ ഇത് സഹായിക്കുന്നു.",
      miniChallenge: "നിങ്ങളുടെ ഇന്റർനെറ്റ് സ്പീഡ് നോക്കാൻ fast.com സന്ദർശിക്കുക.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      quizQuestion: "കമ്പ്യൂട്ടറുകളെ തമ്മിൽ ബന്ധിപ്പിക്കുന്ന നെറ്റ്‌വർക്ക് ആണ് ഇന്റർനെറ്റ്. ശരിയോ തെറ്റോ?",
      quizOptions: ["ശരി", "തെറ്റ്"],
      quizAnswerIndex: 0
    },
    {
      title: "Browser എന്താണ്?",
      slug: "what-is-browser",
      introMalayalam: "ഹായ്, ഞാൻ അർജുൻ. ഗൂഗിൾ ക്രോം പോലെയുള്ള ബ്രൗസറുകളെ പറ്റി ഇന്ന് സംസാരിക്കാം.",
      explanation: "ഇന്റർനെറ്റിലെ വെബ് ഫയലുകളെയും വെബ്‌സൈറ്റുകളെയും ആളുകൾക്ക് കാണാൻ പറ്റുന്ന രീതിയിൽ മാറ്റി തരുന്ന സോഫ്റ്റ്‌വെയർ ആപ്ലിക്കേഷനാണ് ബ്രൗസർ (Browser). ഉദാഹരണത്തിന്: Chrome, Safari, Firefox.",
      realLifeExample: "നമ്മുടെ ടിവിയിലെ ചാനലുകൾ കാണാൻ ഡിഷ് ആന്റിനയും സെറ്റപ്പ് ബോക്സും വേണം. അതുപോലെ വെബ്‌സൈറ്റിലെ കോഡ് വായിച്ചു കാണിക്കാൻ ഒരു ബ്രൗസർ വേണം.",
      visualConcept: "👩 User ──[Input URL]──> 🌐 Browser ──[Render HTML]──> Visual Page",
      practicalDemo: "1. Google Chrome അല്ലെങ്കിൽ Safari തുറക്കുക.\n2. മുകളിലുള്ള അഡ്രസ്സ് ബാറിൽ arjundev.in എന്ന് അടിക്കുക.",
      summary: "• ബ്രൗസർ കോഡിനെ സുന്ദരമായ ഡിസൈൻ ആക്കി മാറ്റുന്നു.\n• വെബ് ആക്സസ് ചെയ്യാനുള്ള പ്രധാന ആപ്പാണ് ഇത്.",
      miniChallenge: "നിങ്ങൾ ഉപയോഗിക്കുന്ന ബ്രൗസറിന്റെ പേര് കണ്ടെത്തുക.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      quizQuestion: "താഴെ പറയുന്നവയിൽ ബ്രൗസർ ഏതാണ്?",
      quizOptions: ["Google Chrome", "YouTube App", "Windows OS"],
      quizAnswerIndex: 0
    },
    {
      title: "Domain എന്താണ്?",
      slug: "what-is-domain",
      introMalayalam: "ഹായ്, ഞാൻ അർജുൻ. ഇന്നത്തെ ലെസ്സണിൽ ഡൊമൈൻ എന്താണെന്ന് മനസ്സിലാക്കാം.",
      explanation: "നിങ്ങളുടെ വെബ്‌സൈറ്റിലേക്ക് ആളുകൾക്ക് സന്ദർശിക്കാൻ നൽകുന്ന പേരാണ് ഡൊമൈൻ. ഉദാഹരണത്തിന്: arjundev.in, google.com.",
      realLifeExample: "നിങ്ങളുടെ സുഹൃത്തിന് നിങ്ങളുടെ വീട്ടിലേക്ക് വരണമെങ്കിൽ വിലാസം വേണം. ആ വീട്ടുപേര് പോലെയാണ് വെബ്‌സൈറ്റിലേക്ക് വരാനുള്ള ഡൊമൈൻ പേര്.",
      visualConcept: "arjundev.in (Domain Name) ──[Translates to]──> 192.168.1.1 (IP Address)",
      practicalDemo: "1. domain.com അല്ലെങ്കിൽ godaddy.com സന്ദർശിക്കുക.\n2. നിങ്ങൾക്ക് ഇഷ്ടമുള്ള ഒരു പേര് ടൈപ്പ് ചെയ്ത് അവൈലബിൾ ആണോ എന്ന് സെർച്ച് ചെയ്യുക.",
      summary: "• ഡൊമൈൻ എന്നത് വെബ്‌സൈറ്റിന്റെ പേരാണ്.\n• ഇത് വാർഷികമായി വാടകയ്ക്ക് എടുക്കുന്ന ഒന്നാണ്.",
      miniChallenge: "നിങ്ങൾക്ക് ഒരു ബിസിനസ്സ് ഉണ്ടെങ്കിൽ അതിന് അനുയോജ്യമായ ഡൊമൈൻ പേര് കണ്ടെത്തുക.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      quizQuestion: "ഡൊമൈൻ എന്നാൽ വെബ്‌സൈറ്റിന്റെ പേരാണ്. ശരിയോ തെറ്റോ?",
      quizOptions: ["ശരി", "തെറ്റ്"],
      quizAnswerIndex: 0
    },
    {
      title: "Hosting എന്താണ്?",
      slug: "what-is-hosting",
      introMalayalam: "ഹായ്, ഞാൻ അർജുൻ. ഇന്നത്തെ ലെസ്സണിൽ ഹോസ്റ്റിങ് എന്താണെന്ന് ലളിതമായി മനസ്സിലാക്കാം.",
      explanation: "വെബ്‌സൈറ്റിലെ ഫയലുകളും ഫോട്ടോകളും വീഡിയോകളും സ്റ്റോർ ചെയ്തു സൂക്ഷിക്കുന്ന വലിയ കമ്പ്യൂട്ടറുകളാണ് സെർവറുകൾ. ഈ സെർവറുകളിൽ സ്ഥലം വാടകയ്ക്ക് എടുക്കുന്നതിനെയാണ് ഹോസ്റ്റിംഗ് എന്ന് പറയുന്നത്.",
      realLifeExample: "നിങ്ങൾ ഒരു ബിസിനസ്സ് തുടങ്ങുമ്പോൾ കടമുറി വാടകയ്ക്ക് എടുക്കും. ആ കടമുറി പോലെയാണ് നിങ്ങളുടെ വെബ് ഫയലുകൾ സൂക്ഷിക്കാൻ എടുക്കുന്ന ഹോസ്റ്റിംഗ് സ്ഥലം.",
      visualConcept: "📁 Website Files ──[Uploaded to]──> 🖥️ Web Hosting Server (Always Online)",
      practicalDemo: "1. hostinger.in സന്ദർശിക്കുക.\n2. അതിലെ ഹോസ്റ്റിംഗ് പ്ലാനുകൾ പരിശോധിക്കുക.",
      summary: "• ഹോസ്റ്റിംഗ് എന്നാൽ സെർവറിലെ സ്റ്റോറേജ് സ്പേസ് ആണ്.\n• ഇത് വെബ്‌സൈറ്റിനെ എപ്പോഴും ലൈവ് ആക്കി നിർത്തുന്നു.",
      miniChallenge: "Shared Hosting-ഉം Cloud Hosting-ഉം തമ്മിലുള്ള വില വ്യത്യാസം പരിശോധിക്കുക.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      quizQuestion: "വെബ്‌സൈറ്റ് ഫയലുകൾ സൂക്ഷിക്കുന്ന ഓൺലൈൻ സ്റ്റോറേജിനെ പറയുന്ന പേര്?",
      quizOptions: ["Hosting", "Domain", "Browser"],
      quizAnswerIndex: 0
    },
    {
      title: "Website എങ്ങനെ Live ആകുന്നു?",
      slug: "how-website-goes-live",
      introMalayalam: "ഹായ്, ഞാൻ അർജുൻ. ഇന്നത്തെ ലെസ്സണിൽ ഒരു വെബ്‌സൈറ്റ് ലോകത്തിന് മുൻപിൽ ലൈവ് ആകുന്നത് എങ്ങനെ എന്ന് നോക്കാം.",
      explanation: "നിങ്ങൾ ഉണ്ടാക്കിയ ഫയലുകൾ ഹോസ്റ്റിംഗിലേക്ക് അപ്‌ലോഡ് ചെയ്യുകയും, അതിലേക്ക് ഡൊമൈൻ പേര് കണക്റ്റ് ചെയ്യുകയും ചെയ്യുമ്പോൾ വെബ്‌സൈറ്റ് ലോകത്ത് എവിടെയുള്ളവർക്കും ലൈവ് ആയി കാണാൻ സാധിക്കുന്നു.",
      realLifeExample: "ഒരു കടമുറി വാടകയ്ക്ക് എടുത്ത് (Hosting) സാധനങ്ങൾ വെച്ച്, അതിന് പുറത്ത് ബോർഡ് (Domain) തൂക്കുന്നത് പോലെയാണ് വെബ്‌സൈറ്റ് ലൈവ് ആക്കുന്നത്.",
      visualConcept: "Domain + Hosting + Web Files = Live Website 🚀",
      practicalDemo: "1. ഫയലുകൾ FTP വഴി അപ്‌ലോഡ് ചെയ്യുന്നത് എങ്ങനെയെന്ന് സെർച്ച് ചെയ്തു നോക്കുക.",
      summary: "• ഡൊമൈനും ഹോസ്റ്റിംഗും തമ്മിൽ ലിങ്ക് ചെയ്യണം.\n• ഫയലുകൾ സെർവറിൽ അപ്‌ലോഡ് ചെയ്യുമ്പോൾ സൈറ്റ് ലൈവ് ആകും.",
      miniChallenge: "നിങ്ങളുടെ വെബ്‌സൈറ്റ് നിർമ്മിച്ചാൽ ആദ്യം ആർക്കാണ് കാണിച്ചു കൊടുക്കുക എന്ന് ചിന്തിക്കുക.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      quizQuestion: "വെബ്‌സൈറ്റ് ലൈവ് ആകാൻ എന്തൊക്കെ വേണം?",
      quizOptions: ["ഡൊമൈനും ഹോസ്റ്റിംഗും ഫയലുകളും", "ഫോൺ കണക്ഷൻ മാത്രം", "കമ്പ്യൂട്ടർ മൗസ് മാത്രം"],
      quizAnswerIndex: 0
    },
    {
      title: "Static Website",
      slug: "static-website",
      introMalayalam: "ഹായ്, ഞാൻ അർജുൻ. സ്റ്റാറ്റിക് വെബ്‌സൈറ്റുകളെ പറ്റി മനസ്സിലാക്കാം.",
      explanation: "എല്ലാ യൂസർമാർക്കും ഒരേ വിവരങ്ങൾ മാത്രം സ്ഥിരമായി കാണിക്കുന്ന ലളിതമായ വെബ്‌സൈറ്റുകളാണ് സ്റ്റാറ്റിക് വെബ്‌സൈറ്റുകൾ. HTML, CSS എന്നിവ ഉപയോഗിച്ചാണ് ഇത് സാധാരണയായി ചെയ്യുന്നത്.",
      realLifeExample: "ഒരു കടയിൽ കൊടുക്കുന്ന പ്രിന്റ് ചെയ്ത ബ്രോഷർ പോലെയാണ് സ്റ്റാറ്റിക് വെബ്‌സൈറ്റ്. അതിലെ വിവരങ്ങൾ എളുപ്പത്തിൽ മാറ്റി എഴുതാൻ കഴിയില്ല.",
      visualConcept: "Browser ──[Request]──> Server ──[Returns Static HTML]──> Displayed directly",
      practicalDemo: "1. ഏതെങ്കിലും ഒരു ലളിതമായ വൺ-പേജ് കമ്പനി പ്രൊഫൈൽ സൈറ്റ് സന്ദർശിക്കുക.",
      summary: "• എല്ലാ ആളുകൾക്കും ഒരേ ഡാറ്റ കാണിക്കുന്നു.\n• ലോഡ് ചെയ്യാൻ വളരെ വേഗതയുള്ളതാണ്.",
      miniChallenge: "ഒരു സ്റ്റാറ്റിക് വെബ്‌സൈറ്റിന്റെ ഗുണങ്ങൾ എന്തൊക്കെയാണെന്ന് കണ്ടെത്തുക.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      quizQuestion: "എല്ലാവർക്കും ഒരേ വിവരങ്ങൾ നൽകുന്ന വെബ്‌സൈറ്റുകൾ ഏതാണ്?",
      quizOptions: ["Static Website", "Dynamic Website", "E-Commerce Site"],
      quizAnswerIndex: 0
    },
    {
      title: "Dynamic Website",
      slug: "dynamic-website",
      introMalayalam: "ഹായ്, ഞാൻ അർജുൻ. ഡൈനാമിക് വെബ്‌സൈറ്റുകളെ പറ്റി മനസ്സിലാക്കാം.",
      explanation: "ലോഗിൻ ചെയ്യുന്ന ആൾക്ക് അനുസരിച്ചോ സമയത്തിന് അനുസരിച്ചോ വിവരങ്ങൾ മാറിക്കൊണ്ടിരിക്കുന്ന വെബ്‌സൈറ്റുകളാണ് ഡൈനാമിക് വെബ്‌സൈറ്റുകൾ. ഉദാഹരണത്തിന്: Facebook, Amazon.",
      realLifeExample: "ഒരു ബാങ്കിലെ പാസ്ബുക്ക് പ്രിന്റിങ് കൗണ്ടർ പോലെയാണ് ഡൈനാമിക് വെബ്‌സൈറ്റ്. ആരുടെ പാസ്ബുക്ക് വെക്കുന്നുവോ അവരുടെ വിവരങ്ങൾ കാണിക്കുന്നു.",
      visualConcept: "Browser ──> Server ──> Queries Database ──> Renders Custom Page ──> User",
      practicalDemo: "1. ഫേസ്ബുക്കിൽ ലോഗിൻ ചെയ്യുക. നിങ്ങളുടെ ഫീഡ് മറ്റൊരാളുടേതിൽ നിന്നും വ്യത്യസ്തമായിരിക്കും.",
      summary: "• ഡാറ്റാബേസ് ഉപയോഗിക്കുന്നു.\n• യൂസർമാർക്ക് കസ്റ്റമൈസ്ഡ് വിവരങ്ങൾ ലഭിക്കുന്നു.",
      miniChallenge: "നിങ്ങൾ ദിവസവും ഉപയോഗിക്കുന്ന ഡൈനാമിക് വെബ്‌സൈറ്റുകൾ ലിസ്റ്റ് ചെയ്യുക.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      quizQuestion: "യൂസറിന് അനുസരിച്ച് ഡാറ്റ മാറുന്ന സൈറ്റുകൾ?",
      quizOptions: ["Dynamic Website", "Static Website", "None"],
      quizAnswerIndex: 0
    },
    {
      title: "CMS എന്താണ്?",
      slug: "what-is-cms",
      introMalayalam: "ഹായ്, ഞാൻ അർജുൻ. കോഡിങ് അറിയാത്തവർക്ക് വെബ്‌സൈറ്റ് മാനേജ് ചെയ്യാൻ സഹായിക്കുന്ന CMS-നെ പറ്റി പഠിക്കാം.",
      explanation: "Content Management System (CMS) എന്നാൽ വെബ്‌സൈറ്റിലെ ഫോട്ടോകളും ടെക്സ്റ്റുകളും കോഡിങ് ഇല്ലാതെ എളുപ്പത്തിൽ മാറ്റാൻ സഹായിക്കുന്ന സോഫ്റ്റ്‌വെയർ പ്ലാറ്റ്‌ഫോം ആണ്.",
      realLifeExample: "നിങ്ങളുടെ ഫോണിലെ ഫോട്ടോ ഗാലറി പോലെയാണ് CMS. പുതിയ ഫോട്ടോ ആഡ് ചെയ്യാനും ഡിലീറ്റ് ചെയ്യാനും നിങ്ങൾക്ക് കോഡിങ് ആവശ്യമില്ല, വെറുതെ ബട്ടൺ ക്ലിക്ക് ചെയ്താൽ മതി.",
      visualConcept: "User ──[CMS Admin Panel]──> Database ──> Live Web Design Panel",
      practicalDemo: "1. ഗൂഗിളിൽ പ്രശസ്തമായ CMS ലിസ്റ്റുകൾ സെർച്ച് ചെയ്യുക.",
      summary: "• കോഡിങ് ആവശ്യമില്ല.\n• വേഗത്തിൽ അപ്‌ഡേറ്റുകൾ വരുത്താം.",
      miniChallenge: "ഏതെങ്കിലും ഒരു ഫ്രീ CMS ട്രൈ ചെയ്തു നോക്കുക.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      quizQuestion: "CMS-ന്റെ പൂർണ്ണരൂപം എന്ത്?",
      quizOptions: ["Content Management System", "Computer Media Software", "Control Monitor System"],
      quizAnswerIndex: 0
    },
    {
      title: "WordPress എന്താണ്?",
      slug: "what-is-wordpress-concept",
      introMalayalam: "ഹായ്, ഞാൻ അർജുൻ. ഇന്ന് നമുക്ക് ലോകത്തിലെ ഏറ്റവും പ്രശസ്തമായ വേർഡ്പ്രെസ്സ് പ്ലാറ്റ്‌ഫോമിനെ പറ്റി പഠിക്കാം.",
      explanation: "ലോകത്തിലെ 40 ശതമാനത്തിലധികം വെബ്‌സൈറ്റുകൾ നിർമ്മിക്കാൻ ഉപയോഗിക്കുന്ന ഏറ്റവും ഫ്ലെക്സിബിൾ ആയ ഒരു ഓപ്പൺ സോഴ്സ് CMS ആണ് വേർഡ്പ്രെസ്സ് (WordPress).",
      realLifeExample: "റെഡിമെയ്ഡ് വീടുകൾ ഉണ്ടാക്കാൻ ഉപയോഗിക്കുന്ന ലെഗോ ബ്ലോക്കുകൾ (Lego block) പോലെയാണ് വേർഡ്പ്രെസ്സ്. ബ്ലോക്കുകൾ യോജിപ്പിച്ച് എന്ത് ഡിസൈനും ഉണ്ടാക്കാം.",
      visualConcept: "WordPress = Dashboard + Themes (Design) + Plugins (Functionality)",
      practicalDemo: "1. wordpress.org സന്ദർശിച്ച് ഫീച്ചറുകൾ കാണുക.",
      summary: "• വേർഡ്പ്രെസ്സ് പൂർണ്ണമായും സൌജന്യമാണ്.\n• ബ്ലോഗുകൾ, ബിസിനസ്സ് വെബ്‌സൈറ്റുകൾ എന്നിവ എളുപ്പത്തിൽ ഉണ്ടാക്കാം.",
      miniChallenge: "വേർഡ്പ്രെസ്സ് ഉപയോഗിച്ച് ഉണ്ടാക്കിയ പ്രമുഖ സൈറ്റുകൾ കണ്ടെത്തുക.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      quizQuestion: "ലോകത്തിലെ ഏറ്റവും കൂടുതൽ വെബ്‌സൈറ്റുകൾ നിർമ്മിക്കാൻ ഉപയോഗിക്കുന്ന CMS?",
      quizOptions: ["WordPress", "Wix", "Shopify"],
      quizAnswerIndex: 0
    },
    {
      title: "Shopify എന്താണ്?",
      slug: "what-is-shopify-concept",
      introMalayalam: "ഹായ്, ഞാൻ അർജുൻ. ഓൺലൈൻ സ്റ്റോറുകൾ ഉണ്ടാക്കാൻ സഹായിക്കുന്ന ഷോപ്പിഫൈയെ പറ്റി മനസ്സിലാക്കാം.",
      explanation: "ഒരു ഓൺലൈൻ ഇ-കൊമേഴ്‌സ് സ്റ്റോർ തുടങ്ങി സാധനങ്ങൾ വിൽക്കാൻ വളരെ എളുപ്പത്തിൽ സഹായിക്കുന്ന ക്ലൗഡ് പ്ലാറ്റ്‌ഫോമാണ് ഷോപ്പിഫൈ (Shopify).",
      realLifeExample: "ഒരു വലിയ ഷോപ്പിംഗ് മാളിൽ റെഡിമെയ്ഡ് കടമുറി വാടകയ്ക്ക് എടുക്കുന്നതുപോലെയാണ് ഷോപ്പിഫൈ. പ്ലംബിങ്ങും ഇലക്ട്രിസിറ്റിയും എല്ലാം അവർ നോക്കിക്കോളും, നമ്മൾ സാധനങ്ങൾ മാത്രം വിറ്റാൽ മതി.",
      visualConcept: "Shopify Shop = Products Catalog + Payment Integrations + Order Tracking 📦",
      practicalDemo: "1. shopify.com സന്ദർശിക്കുക.\n2. ട്രയൽ അക്കൗണ്ട് എങ്ങനെ തുടങ്ങാം എന്ന് നോക്കുക.",
      summary: "• ഇ-കൊമേഴ്‌സ് സ്റ്റോറുകൾക്ക് അനുയോജ്യമാണ്.\n• സുരക്ഷയും പേയ്മെന്റും ഷോപ്പിഫൈ ഹാൻഡിൽ ചെയ്യുന്നു.",
      miniChallenge: "ഷോപ്പിഫൈ സ്റ്റോറിന്റെ സബ്സ്ക്രിപ്ഷൻ പ്ലാനുകൾ നോക്കുക.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      quizQuestion: "ഓൺലൈൻ ഷോപ്പ് നിർമ്മിക്കാൻ സഹായിക്കുന്ന പ്രമുഖ പ്ലാറ്റ്‌ഫോം?",
      quizOptions: ["Shopify", "Safari", "Slack"],
      quizAnswerIndex: 0
    },
    {
      title: "Recap",
      slug: "basics-recap",
      introMalayalam: "ഹായ്, ഞാൻ അർജുൻ. നമ്മൾ പഠിച്ച കാര്യങ്ങൾ ഒന്ന് റീക്യാപ്പ് ചെയ്യാം.",
      explanation: "വെബ്‌സൈറ്റ് നിർമ്മാണത്തിന്റെ അടിസ്ഥാനം മുതൽ CMS, വേർഡ്പ്രെസ്സ്, ഷോപ്പിഫൈ വരെയുള്ള കാര്യങ്ങൾ ലളിതമായി നമ്മൾ പഠിച്ചു കഴിഞ്ഞു. ഇനി നമുക്ക് ഇവ പ്രാക്ടിക്കൽ ആയി ചെയ്തു തുടങ്ങാം.",
      realLifeExample: "നിങ്ങൾ ഡ്രൈവിങ് തിയറി ക്ലാസ്സ് പൂർത്തിയാക്കിയത് പോലെയാണ് ഇത്. ഇനി നമുക്ക് നേരിട്ട് വണ്ടിയോടിച്ചു പഠിക്കാം!",
      visualConcept: "Theory Done ──> Next Level: Live Admin Panels 🛠️",
      practicalDemo: "1. അടുത്ത ലെവലിലേക്ക് പോകാൻ താഴെയുള്ള ബട്ടൺ ക്ലിക്ക് ചെയ്യുക.",
      summary: "• എല്ലാ ടോപ്പിക്കുകളും മനസ്സിലാക്കി.\n• പ്രാക്ടിക്കൽ ചെയ്യാനുള്ള ആത്മവിശ്വാസം നേടി.",
      miniChallenge: "നിങ്ങൾ മനസ്സിലാക്കിയ വിവരങ്ങൾ മറ്റൊരാൾക്ക് പറഞ്ഞു കൊടുക്കുക.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      quizQuestion: "വെബ് തിയറി നിങ്ങൾ വിജയകരമായി പൂർത്തിയാക്കിയോ?",
      quizOptions: ["അതെ!", "ഇല്ല, ഒന്നുകൂടി വായിക്കണം"],
      quizAnswerIndex: 0
    }
  ];

  let order = 0;
  for (const les of c1Lessons) {
    const l = await prisma.lesson.create({
      data: {
        title: les.title,
        slug: les.slug,
        introMalayalam: les.introMalayalam,
        explanation: les.explanation,
        realLifeExample: les.realLifeExample,
        visualConcept: les.visualConcept,
        practicalDemo: les.practicalDemo,
        summary: les.summary,
        miniChallenge: les.miniChallenge,
        videoUrl: les.videoUrl,
        durationMinutes: 10,
        orderIndex: order++,
        moduleId: m1.id
      }
    });

    await prisma.quiz.create({
      data: {
        question: les.quizQuestion,
        options: les.quizOptions,
        answerIndex: les.quizAnswerIndex,
        lessonId: l.id
      }
    });
  }

  // COURSE 2: WordPress Malayalam
  const c2 = await prisma.course.create({
    data: {
      title: "WordPress Malayalam",
      slug: "wordpress-malayalam",
      description: "വേർഡ്പ്രെസ്സ് ഉപയോഗിച്ച് ഡൊമൈൻ കണക്ട് ചെയ്യാനും കസ്റ്റം വെബ് ഡിസൈനുകൾ ഉണ്ടാക്കാനും വളരെ എളുപ്പത്തിൽ മലയാളത്തിൽ പഠിക്കാം.",
      duration: "6 Hours",
      difficulty: "Beginner",
      orderIndex: 1,
    }
  });

  const m2 = await prisma.module.create({
    data: {
      title: "Introduction & Setup",
      description: "വേർഡ്പ്രെസ്സ് എങ്ങനെ ഇൻസ്റ്റാൾ ചെയ്യണമെന്നും ഡാഷ്‌ബോർഡ് എങ്ങനെ ഉപയോഗിക്കണമെന്നും പഠിക്കാം.",
      orderIndex: 0,
      courseId: c2.id
    }
  });

  const c2Lessons = [
    {
      title: "WordPress എന്താണ്?",
      slug: "what-is-wordpress",
      introMalayalam: "ഹായ്, ഞാൻ അർജുൻ. ഇന്നത്തെ ലെസ്സണിൽ നമുക്ക് വേർഡ്പ്രെസ്സ് എന്നാൽ എന്താണെന്ന് പ്രായോഗികമായി മനസ്സിലാക്കാം.",
      explanation: "കോഡിങ് അറിയാത്തവർക്ക് പോലും എളുപ്പത്തിൽ വെബ്‌സൈറ്റ് നിർമ്മിക്കാൻ സഹായിക്കുന്ന ലോകത്തിലെ ഏറ്റവും വലിയ ഫ്രീ വെബ്‌സൈറ്റ് ബിൽഡർ സിസ്റ്റം ആണ് വേർഡ്പ്രെസ്സ്.",
      realLifeExample: "വീട് നിർമ്മിക്കാൻ റെഡിമെയ്ഡ് കട്ടകൾ അടുക്കി വെക്കുന്നത് പോലെയാണ് വേർഡ്പ്രെസ്സിൽ പേജുകൾ ഡിസൈൻ ചെയ്യുന്നത്.",
      visualConcept: "WordPress Site = Core System + Theme Design + Custom Plugins",
      practicalDemo: "1. wordpress.org സന്ദർശിക്കുക.\n2. ഡൗൺലോഡ് ബട്ടൺ എവിടെയാണെന്ന് നോക്കുക.",
      summary: "• ലോകത്തിലെ മുൻനിര വെബ്‌സൈറ്റ് പ്ലാറ്റ്‌ഫോമാണ് ഇത്.\n• തികച്ചും സൗജന്യമാണ്.",
      miniChallenge: "വേർഡ്പ്രെസ്സ് ഉപയോഗിച്ച് നിങ്ങൾക്ക് എന്ത് തരം വെബ്‌സൈറ്റാണ് നിർമ്മിക്കേണ്ടത് എന്ന് നോട്ട് ചെയ്യുക.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      quizQuestion: "വേർഡ്പ്രെസ്സ് ഒരു കോഡിങ് ഭാഷയാണോ?",
      quizOptions: ["അല്ല, അതൊരു CMS ആണ്", "അതെ, ജാവസ്ക്രിപ്റ്റ് പോലെയാണ്", "ഒരു ബ്രൗസർ ആണ്"],
      quizAnswerIndex: 0
    },
    {
      title: "WordPress Dashboard",
      slug: "wordpress-dashboard-walkthrough",
      introMalayalam: "ഹായ്, ഞാൻ അർജുൻ. വേർഡ്പ്രെസ്സ് അഡ്മിൻ ഡാഷ്‌ബോർഡ് നമുക്ക് പരിചയപ്പെടാം.",
      explanation: "ലോഗിൻ ചെയ്ത ശേഷം നിങ്ങൾക്ക് സൈറ്റ് നിയന്ത്രിക്കാൻ ലഭിക്കുന്ന കൺട്രോൾ പാനൽ ആണ് ഡാഷ്‌ബോർഡ്. ഇവിടെ നിന്നാണ് നിങ്ങൾ പേജുകൾ ക്രിയേറ്റ് ചെയ്യുന്നതും പോസ്റ്റുകൾ ഇടുന്നതും.",
      realLifeExample: "കാറിന്റെ ഡ്രൈവിങ് സീറ്റിലിരുന്നാൽ സ്പീഡോമീറ്ററും സ്റ്റിയറിംഗും കാണുന്നത് പോലെയാണ് വേർഡ്പ്രെസ്സ് വെബ്‌സൈറ്റിന്റെ ഡാഷ്‌ബോർഡ് കൺട്രോൾ പാനൽ.",
      visualConcept: "WP Admin ──> Sidebar Navigation ──> Add Pages / Install Plugins",
      practicalDemo: "1. http://localhost:3000/learn/practice സന്ദർശിച്ച് വേർഡ്പ്രെസ്സ് സിമുലേറ്റർ റൺ ചെയ്യുക.",
      summary: "• ഡാഷ്‌ബോർഡ് വഴിയാണ് കൺട്രോൾ ചെയ്യുന്നത്.\n• പ്ലഗിനുകൾ ഇൻസ്റ്റാൾ ചെയ്യാൻ ഇത് സഹായിക്കുന്നു.",
      miniChallenge: "സിമുലേറ്ററിൽ പ്ലഗിൻ ആക്റ്റിവേറ്റ് ചെയ്യുക.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      quizQuestion: "വേർഡ്പ്രെസ്സ് നിയന്ത്രിക്കാൻ ഉപയോഗിക്കുന്ന കൺട്രോൾ പാനൽ?",
      quizOptions: ["Dashboard (അഡ്മിൻ പാനൽ)", "ഹോസ്റ്റിംഗ് പാനൽ", "ഡൊമൈൻ റെജിസ്ട്രാർ"],
      quizAnswerIndex: 0
    }
  ];

  order = 0;
  for (const les of c2Lessons) {
    const l = await prisma.lesson.create({
      data: {
        title: les.title,
        slug: les.slug,
        introMalayalam: les.introMalayalam,
        explanation: les.explanation,
        realLifeExample: les.realLifeExample,
        visualConcept: les.visualConcept,
        practicalDemo: les.practicalDemo,
        summary: les.summary,
        miniChallenge: les.miniChallenge,
        videoUrl: les.videoUrl,
        durationMinutes: 12,
        orderIndex: order++,
        moduleId: m2.id
      }
    });

    await prisma.quiz.create({
      data: {
        question: les.quizQuestion,
        options: les.quizOptions,
        answerIndex: les.quizAnswerIndex,
        lessonId: l.id
      }
    });
  }

  // COURSE 3: Shopify Malayalam
  const c3 = await prisma.course.create({
    data: {
      title: "Shopify Malayalam",
      slug: "shopify-malayalam",
      description: "ഷോപ്പിഫൈ ഉപയോഗിച്ച് പ്രൊഫഷണൽ ഇ-കൊമേഴ്‌സ് സ്റ്റോർ തുടങ്ങി സാധനങ്ങൾ വിൽക്കാൻ വളരെ എളുപ്പത്തിൽ മലയാളത്തിൽ പഠിക്കാം.",
      duration: "5 Hours",
      difficulty: "Beginner",
      orderIndex: 2,
    }
  });

  const m3 = await prisma.module.create({
    data: {
      title: "Store Creation Basics",
      description: "Shopify ഉപയോഗിച്ച് ഓൺലൈൻ സ്റ്റോർ നിർമ്മിക്കുന്നതിന്റെ അടിസ്ഥാന വിവരങ്ങൾ പഠിക്കാം.",
      orderIndex: 0,
      courseId: c3.id
    }
  });

  const c3Lessons = [
    {
      title: "Shopify എന്താണ്?",
      slug: "what-is-shopify",
      introMalayalam: "ഹായ്, ഞാൻ അർജുൻ. ഷോപ്പിഫൈ എന്താണെന്നും ഇ-കൊമേഴ്‌സ് ആവശ്യങ്ങൾക്ക് അത് എങ്ങനെ ഉപയോഗിക്കാമെന്നും ഇന്ന് പഠിക്കാം.",
      explanation: "കോഡിങ് അറിയാതെ തന്നെ പെയ്മെന്റ് ഗേറ്റ്‌വേകളും പ്രൊഡക്റ്റ് കാറ്റലോഗും സജ്ജമാക്കി സാധനങ്ങൾ വിൽക്കാൻ സഹായിക്കുന്ന ലോകോത്തര പ്ലാറ്റ്‌ഫോമാണ് ഷോപ്പിഫൈ.",
      realLifeExample: "ഷോപ്പിംഗ് മാളുകളിൽ വാടകയ്ക്ക് ലഭിക്കുന്ന സജ്ജീകരിച്ച കടമുറി പോലെയാണ് ഷോപ്പിഫൈ. പ്രൊഡക്റ്റുകൾ വെക്കുക, വിൽക്കുക!",
      visualConcept: "Shopify Store = Active Products + Payment Method + Custom Domain Name",
      practicalDemo: "1. http://localhost:3000/learn/practice സന്ദർശിച്ച് ഷോപ്പിഫൈ സിമുലേറ്റർ റൺ ചെയ്തു നോക്കുക.",
      summary: "• ഓൺലൈൻ സ്റ്റോറുകൾ ഉണ്ടാക്കാൻ ഏറ്റവും അനുയോജ്യമാണ്.\n• പെയ്മെന്റ് സുരക്ഷ ഷോപ്പിഫൈ ഉറപ്പാക്കുന്നു.",
      miniChallenge: "ഷോപ്പിഫൈ സിമുലേറ്ററിൽ നിങ്ങളുടെ ആദ്യ പ്രൊഡക്റ്റ് വിജയകരമായി ആഡ് ചെയ്യുക.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      quizQuestion: "ഷോപ്പിഫൈ എന്തിന് വേണ്ടിയാണ് ഉപയോഗിക്കുന്നത്?",
      quizOptions: ["ഓൺലൈൻ ഇ-കൊമേഴ്‌സ് കടകൾ നിർമ്മിക്കാൻ", "ഗെയിമുകൾ കളിക്കാൻ", "ഇമെയിൽ അയക്കാൻ"],
      quizAnswerIndex: 0
    },
    {
      title: "Shopify Dashboard",
      slug: "shopify-dashboard-walkthrough",
      introMalayalam: "ഹായ്, ഞാൻ അർജുൻ. ഷോപ്പിഫൈ അഡ്മിൻ കൺട്രോൾ പാനൽ നമുക്ക് പരിശോധിക്കാം.",
      explanation: "ഷോപ്പിഫൈയിൽ സാധനങ്ങൾ ആഡ് ചെയ്യാനും ഓർഡറുകൾ ട്രാക്ക് ചെയ്യാനും ഉപയോഗിക്കുന്ന യൂസർ ഫ്രണ്ട്ലി അഡ്മിൻ പാനലാണിത്.",
      realLifeExample: "ഒരു വലിയ സൂപ്പർമാർക്കറ്റിലെ മാനേജരുടെ ഓഫീസ് ക്യാബിൻ പോലെയാണ് ഷോപ്പിഫൈ അഡ്മിൻ ഡാഷ്‌ബോർഡ്.",
      visualConcept: "Shopify Admin Panel ──> Products ──> Collections ──> Settings ──> Domains",
      practicalDemo: "1. ഷോപ്പിഫൈ സിമുലേറ്ററിൽ ഉല്പന്നത്തിന്റെ വില സെറ്റ് ചെയ്തു നോക്കുക.",
      summary: "• ഓർഡറുകൾ ട്രാക്ക് ചെയ്യാൻ സഹായിക്കുന്നു.\n• വളരെ പെട്ടെന്ന് പ്രൊഡക്റ്റുകൾ മാറ്റാം.",
      miniChallenge: "ഷോപ്പിഫൈ പാനലിൽ ഒരു കളക്ഷൻ ലിസ്റ്റ് കൺസെപ്റ്റ് ആലോചിക്കുക.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      quizQuestion: "ഷോപ്പിഫൈ ഡാഷ്‌ബോർഡിൽ ഓർഡറുകൾ ട്രാക്ക് ചെയ്യാൻ സാധിക്കുമോ?",
      quizOptions: ["സാധിക്കും", "ഇല്ല, അതിന് വേറെ സൈറ്റ് വേണം"],
      quizAnswerIndex: 0
    }
  ];

  order = 0;
  for (const les of c3Lessons) {
    const l = await prisma.lesson.create({
      data: {
        title: les.title,
        slug: les.slug,
        introMalayalam: les.introMalayalam,
        explanation: les.explanation,
        realLifeExample: les.realLifeExample,
        visualConcept: les.visualConcept,
        practicalDemo: les.practicalDemo,
        summary: les.summary,
        miniChallenge: les.miniChallenge,
        videoUrl: les.videoUrl,
        durationMinutes: 10,
        orderIndex: order++,
        moduleId: m3.id
      }
    });

    await prisma.quiz.create({
      data: {
        question: les.quizQuestion,
        options: les.quizOptions,
        answerIndex: les.quizAnswerIndex,
        lessonId: l.id
      }
    });
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
