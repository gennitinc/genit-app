export type MarketingCapability = {
  slug: string;
  name: string;
  eyebrow: string;
  title: string;
  description: string;
  summary: string;
  outcomes: string[];
  workflow: { title: string; description: string }[];
  features: { title: string; description: string }[];
  faq: { question: string; answer: string }[];
};

export const marketingCapabilities: MarketingCapability[] = [
  {
    slug: "ai-marketing-agents",
    name: "AI Marketing Agents",
    eyebrow: "Plan, decide, and act",
    title: "Autonomous AI marketing agents that execute real work",
    description:
      "Give Genit a marketing goal and its AI agents can research, plan, create, and take approved actions across your connected business tools.",
    summary:
      "Genit is an AI marketing execution platform, not only a content generator. Its agents turn a goal into coordinated work: learning your brand, preparing a plan, creating the assets, and using connected tools to move the campaign forward.",
    outcomes: [
      "Turn plain-language goals into multi-step marketing plans",
      "Create campaign copy, visuals, videos, documents, and reports",
      "Use connected social, email, advertising, calendar, and workspace tools",
      "Keep people in control of consequential external actions",
    ],
    workflow: [
      {
        title: "Describe the outcome",
        description:
          "Ask for a launch, campaign, content plan, lead workflow, report, or other marketing result in natural language.",
      },
      {
        title: "Let agents coordinate",
        description:
          "Genit breaks the goal into steps and combines brand context, research, creation tools, and connected apps.",
      },
      {
        title: "Review and execute",
        description:
          "Approve important actions, then let Genit publish, schedule, send, organize, or report from the same conversation.",
      },
    ],
    features: [
      {
        title: "Brand-aware execution",
        description:
          "Agents can use your saved brand identity, voice, audience, products, and goals as working context.",
      },
      {
        title: "Multi-step agent runs",
        description:
          "A task can include research, planning, creation, tool use, and a final deliverable instead of stopping at a draft.",
      },
      {
        title: "Human approval",
        description:
          "Keep oversight over high-impact actions while automating repetitive execution.",
      },
      {
        title: "One conversational workspace",
        description:
          "Plan and act without rebuilding the same context in a separate tool for every step.",
      },
    ],
    faq: [
      {
        question: "What is an autonomous AI marketing agent?",
        answer:
          "It is software that can interpret a marketing goal, plan the work, use tools, and complete multiple steps with defined controls instead of producing only a text response.",
      },
      {
        question: "Is Genit only an AI design tool?",
        answer:
          "No. Design generation is one capability inside Genit. The platform also supports marketing planning, workflows, social publishing, inbox management, campaigns, connected apps, documents, and reporting.",
      },
      {
        question: "Can I approve actions before an agent publishes?",
        answer:
          "Yes. Genit is designed to keep users in control of consequential actions while allowing routine work to be automated.",
      },
    ],
  },
  {
    slug: "marketing-automation",
    name: "Marketing Automation",
    eyebrow: "From trigger to outcome",
    title: "AI marketing automation built around your real workflow",
    description:
      "Build multi-step marketing automations with triggers, logic, AI actions, schedules, webhooks, and connected apps in Genit.",
    summary:
      "Genit combines a visual workflow builder with AI agents. Teams can connect events and business tools, add decisions and AI-generated work, schedule recurring execution, and inspect the flow in one workspace.",
    outcomes: [
      "Build event-driven and scheduled marketing workflows",
      "Combine deterministic logic with AI-generated decisions and content",
      "Connect social, email, ads, calendars, files, and business apps",
      "Run repeatable processes without copying data between tools",
    ],
    workflow: [
      {
        title: "Choose a trigger",
        description:
          "Start from a schedule, webhook, connected-app event, or manual request.",
      },
      {
        title: "Connect the steps",
        description:
          "Add actions, branches, AI tasks, delays, and tool connections to match the way your team works.",
      },
      {
        title: "Run with visibility",
        description:
          "Execute the automation and keep the workflow available for review and improvement.",
      },
    ],
    features: [
      {
        title: "Visual workflow builder",
        description:
          "See triggers, decisions, AI work, and actions as one connected process.",
      },
      {
        title: "Natural-language building",
        description:
          "Ask a Genit agent to help construct the automation instead of wiring every step manually.",
      },
      {
        title: "Schedules and webhooks",
        description:
          "Run workflows at a set time or when an external system sends an event.",
      },
      {
        title: "Connected app actions",
        description:
          "Move work into the tools where your audience, campaigns, and team already operate.",
      },
    ],
    faq: [
      {
        question: "How is Genit different from general workflow automation?",
        answer:
          "Genit is centered on marketing execution and combines brand context, creative generation, publishing, campaign work, and communications in the same agent workspace.",
      },
      {
        question: "Can Genit run scheduled automations?",
        answer:
          "Yes. Workflows can include scheduled execution as well as event and webhook triggers.",
      },
      {
        question: "Do I need to code?",
        answer:
          "No for common workflows. Genit provides visual and conversational ways to build automations, while connected tools handle the underlying actions.",
      },
    ],
  },
  {
    slug: "social-media-management",
    name: "Social Media Management",
    eyebrow: "Create once, run every channel",
    title: "AI social media management from idea to published post",
    description:
      "Create, adapt, schedule, publish, and monitor social content across connected channels from one Genit workspace.",
    summary:
      "Genit brings social planning, brand-aware content creation, a publishing calendar, connected accounts, and performance views together. Agents can help turn one campaign idea into channel-specific posts instead of leaving your team with disconnected drafts.",
    outcomes: [
      "Generate channel-specific copy, images, and video",
      "Plan and schedule content in a shared calendar",
      "Publish through connected social accounts",
      "Track posts and engagement from a unified workspace",
    ],
    workflow: [
      {
        title: "Start with the campaign",
        description:
          "Give Genit the product, offer, audience, goal, and timing—or use the brand context already in your workspace.",
      },
      {
        title: "Adapt by channel",
        description:
          "Create suitable formats and copy for platforms such as Instagram, Facebook, LinkedIn, X, TikTok, YouTube, and Pinterest.",
      },
      {
        title: "Schedule and manage",
        description:
          "Review posts, place them on the calendar, publish through connected accounts, and monitor results.",
      },
    ],
    features: [
      {
        title: "Multi-platform publishing",
        description:
          "Manage supported social destinations without rebuilding every post from scratch.",
      },
      {
        title: "Content calendar",
        description:
          "Organize upcoming work and coordinate publishing dates from one schedule.",
      },
      {
        title: "Brand-consistent creation",
        description:
          "Use saved brand voice and visual identity when generating each variation.",
      },
      {
        title: "Post performance",
        description:
          "Bring publishing activity and available engagement signals into the same operating view.",
      },
    ],
    faq: [
      {
        question: "Can Genit publish social posts?",
        answer:
          "Yes. Genit supports publishing and scheduling through connected social accounts, subject to each platform's permissions and API availability.",
      },
      {
        question: "Does Genit create both copy and visuals?",
        answer:
          "Yes. Genit can create marketing copy, images, and video, then adapt the output for different social channels.",
      },
      {
        question: "Which social platforms does Genit connect to?",
        answer:
          "The integration catalog includes major social platforms such as Facebook, Instagram, LinkedIn, X, TikTok, YouTube, and Pinterest, with capabilities depending on each platform connection.",
      },
    ],
  },
  {
    slug: "content-creation",
    name: "Content Creation",
    eyebrow: "Every format, one brand",
    title: "AI content creation connected to marketing execution",
    description:
      "Generate on-brand copy, images, video, voice, presentations, documents, and campaign assets—and put them to work in Genit.",
    summary:
      "Creative generation is part of Genit's broader marketing system. Create an asset with your brand context, keep it in the shared library, adapt it for channels, and continue into scheduling, publishing, email, campaigns, or reporting.",
    outcomes: [
      "Create copy, images, video, voice, and business documents",
      "Apply brand identity and tone across formats",
      "Store and reuse assets in a central library",
      "Move directly from creation into distribution",
    ],
    workflow: [
      {
        title: "Load your brand",
        description:
          "Scan a website or define your identity, voice, audience, and product context.",
      },
      {
        title: "Create the campaign assets",
        description:
          "Generate the formats the campaign needs, from social visuals and videos to copy, presentations, and reports.",
      },
      {
        title: "Activate the content",
        description:
          "Reuse, resize, schedule, publish, send, or attach the work to a larger automation.",
      },
    ],
    features: [
      {
        title: "Image and video generation",
        description:
          "Produce visual assets and motion content from a prompt or campaign brief.",
      },
      {
        title: "Voice and audio",
        description:
          "Turn spoken ideas into prompts and support audio-oriented creative workflows.",
      },
      {
        title: "Documents and presentations",
        description:
          "Create campaign briefs, research reports, PDFs, spreadsheets, and slide decks.",
      },
      {
        title: "Digital asset library",
        description:
          "Keep generated and uploaded files organized for future campaigns.",
      },
    ],
    faq: [
      {
        question: "What content can Genit create?",
        answer:
          "Genit supports marketing copy, images, video, voice-assisted prompts, documents, reports, spreadsheets, presentations, and brand assets.",
      },
      {
        question: "Can Genit keep content on brand?",
        answer:
          "Yes. A brand profile can provide visual identity, voice, product, and audience context for generated work.",
      },
      {
        question: "What happens after content is generated?",
        answer:
          "You can keep working in Genit to organize, adapt, schedule, publish, email, or use the asset in an automated workflow.",
      },
    ],
  },
  {
    slug: "campaign-management",
    name: "Campaign Management",
    eyebrow: "Plan through performance",
    title: "AI campaign management for coordinated growth",
    description:
      "Plan campaigns, define audiences and funnels, create assets, coordinate outbound work, and turn performance into next actions.",
    summary:
      "Genit helps teams move from a campaign goal to an executable plan. Its marketing agents can create campaign structures, work with approved lead data, prepare outbound sequences, generate creative, and produce attribution and optimization reports.",
    outcomes: [
      "Build campaign plans with audiences, funnels, calendars, and KPIs",
      "Prepare coordinated creative and outbound sequences",
      "Work across supported advertising, email, and social tools",
      "Review attribution and recommended optimizations",
    ],
    workflow: [
      {
        title: "Set the goal and audience",
        description:
          "Define the offer, ideal customer, channel, budget, timing, and measurable outcome.",
      },
      {
        title: "Build the campaign",
        description:
          "Generate the plan, messages, visual assets, calendar, and channel actions needed to launch.",
      },
      {
        title: "Measure and improve",
        description:
          "Bring campaign data into reports and use the findings to guide the next iteration.",
      },
    ],
    features: [
      {
        title: "Go-to-market planning",
        description:
          "Create a structured funnel, campaign calendar, KPI plan, and default outreach sequence.",
      },
      {
        title: "Outbound workflows",
        description:
          "Use supplied or approved lead data to prepare compliant campaign outreach.",
      },
      {
        title: "Advertising connections",
        description:
          "Work with supported ad platforms and keep campaign actions tied to the wider plan.",
      },
      {
        title: "Attribution reports",
        description:
          "Generate campaign reporting that connects execution to measurable results.",
      },
    ],
    faq: [
      {
        question: "Can Genit plan a complete marketing campaign?",
        answer:
          "Yes. Genit can structure the audience, funnel, content calendar, KPIs, creative brief, and channel work for a campaign.",
      },
      {
        question: "Does Genit support outbound campaigns?",
        answer:
          "Yes. Genit includes workflows for approved lead lists, outreach scheduling, attribution, optimization, and campaign reports.",
      },
      {
        question: "Can Genit manage ads?",
        answer:
          "Genit connects with supported advertising platforms. Available actions depend on the account connection, permissions, and each platform's API.",
      },
    ],
  },
  {
    slug: "unified-inbox",
    name: "Unified Inbox",
    eyebrow: "Every conversation, one place",
    title: "A unified inbox for social, email, and business messages",
    description:
      "Bring supported DMs, mentions, and email conversations into Genit so people and AI agents can respond with shared context.",
    summary:
      "Genit's inbox reduces the cost of switching between communication tools. Connect supported email, social, and messaging accounts, view conversations together, and let authorized agents help manage repetitive customer communication.",
    outcomes: [
      "Centralize conversations from supported channels",
      "Reply without changing apps for every message",
      "Use brand and campaign context while responding",
      "Combine human judgment with agent assistance",
    ],
    workflow: [
      {
        title: "Connect communication channels",
        description:
          "Authorize the email, social, and messaging accounts your team uses.",
      },
      {
        title: "Work from one queue",
        description:
          "Read and manage available conversations in a unified operating view.",
      },
      {
        title: "Respond with context",
        description:
          "Draft or send responses using the relevant brand, campaign, and conversation history.",
      },
    ],
    features: [
      {
        title: "Social conversations",
        description:
          "Manage supported direct messages and mentions from connected social accounts.",
      },
      {
        title: "Email inboxes",
        description:
          "Work with connected Gmail and Outlook conversations alongside other channels.",
      },
      {
        title: "Messaging apps",
        description:
          "Support business conversations across available WhatsApp, Messenger, Telegram, and Slack connections.",
      },
      {
        title: "Agent-assisted replies",
        description:
          "Let an authorized agent help draft or handle routine communication while your team retains control.",
      },
    ],
    faq: [
      {
        question: "What is a unified marketing inbox?",
        answer:
          "It is a single workspace for conversations that would otherwise be split across social, email, and messaging accounts.",
      },
      {
        question: "Can AI agents reply to messages?",
        answer:
          "Genit can assist with replies and use connected tools when authorized. Exact actions depend on the channel, permissions, and your approval settings.",
      },
      {
        question: "Which inboxes can I connect?",
        answer:
          "Genit's catalog includes Gmail, Outlook, Instagram, LinkedIn, X, WhatsApp Business, Messenger, Telegram Business, and Slack, with channel-specific availability.",
      },
    ],
  },
  {
    slug: "brand-intelligence",
    name: "Brand Intelligence",
    eyebrow: "One URL becomes working context",
    title: "Turn your website into an AI-ready brand brain",
    description:
      "Give Genit a URL to capture brand identity, voice, products, audience, and visual cues that agents can use across marketing work.",
    summary:
      "A brand profile keeps AI output from starting cold. Genit can use your website and saved guidance to build reusable context for content, campaigns, customer communication, visual creation, and team workflows.",
    outcomes: [
      "Capture visual identity and tone from an existing website",
      "Create reusable context for every agent and campaign",
      "Keep messages and assets more consistent across channels",
      "Update brand guidance in one shared workspace",
    ],
    workflow: [
      {
        title: "Add your website",
        description:
          "Start with the public source that already explains your product and presents your brand.",
      },
      {
        title: "Review the brand profile",
        description:
          "Confirm the identity, voice, audience, products, goals, and visual cues Genit should use.",
      },
      {
        title: "Apply it everywhere",
        description:
          "Use the same context in agent runs, content, campaign planning, designs, documents, and replies.",
      },
    ],
    features: [
      {
        title: "Website brand scan",
        description:
          "Use a company URL as the starting point for a structured brand profile.",
      },
      {
        title: "Voice and messaging",
        description:
          "Give agents consistent language, positioning, audience, and tone guidance.",
      },
      {
        title: "Visual identity",
        description:
          "Carry colors, typography, logos, and design direction into generated assets.",
      },
      {
        title: "Shared brand context",
        description:
          "Make the brand profile available across creation and execution workflows.",
      },
    ],
    faq: [
      {
        question: "What does Genit learn from a website?",
        answer:
          "Genit can use public brand signals such as visual identity, messaging, products, audience cues, and tone as the basis for a reusable profile.",
      },
      {
        question: "Can I edit the generated brand profile?",
        answer:
          "Yes. The profile is working context for your workspace and should be reviewed and refined by your team.",
      },
      {
        question: "Where is brand context used?",
        answer:
          "It can guide agent work, campaigns, copy, visual assets, documents, and customer communication inside Genit.",
      },
    ],
  },
  {
    slug: "marketing-integrations",
    name: "Marketing Integrations",
    eyebrow: "Connect the stack you already use",
    title: "Marketing integrations that let AI agents take action",
    description:
      "Connect Genit to social, email, advertising, calendar, storage, productivity, commerce, CRM, and other business tools.",
    summary:
      "Integrations turn an AI answer into useful execution. Genit combines native marketing connections with a broad plugin catalog so agents and workflows can operate across the tools where your data, team, and customers already live.",
    outcomes: [
      "Connect marketing channels and business systems",
      "Let authorized agents use tools from one conversation",
      "Move content and data between workflow steps",
      "Reduce manual handoffs across your marketing stack",
    ],
    workflow: [
      {
        title: "Choose an app",
        description:
          "Find the social, email, ads, calendar, storage, CRM, commerce, or productivity tool you need.",
      },
      {
        title: "Authorize the connection",
        description:
          "Sign in and grant only the permissions required for the actions you want Genit to perform.",
      },
      {
        title: "Use it in agents and workflows",
        description:
          "Ask Genit to work with the connected app or add it as an action in an automation.",
      },
    ],
    features: [
      {
        title: "Marketing channels",
        description:
          "Connect major social, advertising, email, and messaging platforms.",
      },
      {
        title: "Google Workspace",
        description:
          "Work with Calendar, Drive, Sheets, Slides, Docs, Forms, and Meet.",
      },
      {
        title: "Plugin catalog",
        description:
          "Extend Genit into additional business tools without turning every connection into a custom project.",
      },
      {
        title: "Permission-aware actions",
        description:
          "Connections use the authorization and capabilities made available by each provider.",
      },
    ],
    faq: [
      {
        question: "Why do AI agents need integrations?",
        answer:
          "Without tools, an agent can only recommend or draft. Integrations let an authorized agent read relevant information and take actions in the systems where work happens.",
      },
      {
        question: "How many apps does Genit support?",
        answer:
          "Genit provides native marketing connections plus a plugin catalog covering more than 1,000 business apps. Specific actions vary by provider.",
      },
      {
        question: "Do integrations work with automations?",
        answer:
          "Yes. Connected apps can be used by agents and as steps in marketing workflows.",
      },
    ],
  },
];

export function getMarketingCapability(slug: string) {
  return marketingCapabilities.find((capability) => capability.slug === slug);
}
