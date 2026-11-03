export type UseCase = {
  slug: string;
  name: string;
  title: string;
  description: string;
  intro: string;
  appHref: string;
  appLabel: string;
  steps: { title: string; description: string }[];
  details: { title: string; description: string }[];
  examples: string[];
  faq: { question: string; answer: string }[];
  related: string[];
};

export const useCases: UseCase[] = [
  {
    slug: "graphic-design",
    name: "Graphic Design",
    title: "Social graphics, ads, and banners without opening a design tool",
    description:
      "Describe what you need in chat and Genit produces on-brand graphics in the sizes each channel expects.",
    intro:
      "Most small teams don't need a new design tool. They need a launch graphic by Thursday and a version of it for every channel. In Genit you ask for it in plain words. Your saved brand profile supplies the colors, fonts, and logo, so the first draft already looks like you.",
    appHref: "/chat",
    appLabel: "Start a design in chat",
    steps: [
      {
        title: "Ask for the asset",
        description:
          "For example: \"An Instagram post and a LinkedIn banner announcing our spring sale, 20% off.\"",
      },
      {
        title: "Edit by replying",
        description:
          "Change the headline, swap the photo, or try a darker background by saying so in the same conversation.",
      },
      {
        title: "Use it",
        description:
          "Download the files, save them to your library, or send them straight to a scheduled post.",
      },
    ],
    details: [
      {
        title: "Your brand by default",
        description:
          "Genit reads your brand profile, so you don't have to repeat hex codes or upload the logo every time.",
      },
      {
        title: "Channel sizes",
        description:
          "Ask for square, portrait, story, or banner formats and get each one laid out for that size, not just cropped.",
      },
      {
        title: "Image editing",
        description:
          "Change angles, retouch product shots, or replace backgrounds with the image tools in the apps section.",
      },
      {
        title: "Saved automatically",
        description:
          "Everything you generate lands in your media library for reuse later.",
      },
    ],
    examples: [
      "Weekly promo graphics for a restaurant",
      "Product announcement cards for a SaaS launch",
      "Event flyers and speaker cards",
      "Quote graphics for a personal brand",
    ],
    faq: [
      {
        question: "Do I need design experience?",
        answer:
          "No. You describe the result you want and refine it by replying. If you do have a designer, they can use Genit for first drafts and size variations.",
      },
      {
        question: "Can I upload my own photos?",
        answer:
          "Yes. Attach product photos or reference images in chat and Genit will work them into the design.",
      },
    ],
    related: ["social-publishing", "digital-asset-library", "ai-video-creation"],
  },
  {
    slug: "ai-video-creation",
    name: "AI Video Creation",
    title: "Short marketing videos from a prompt or a single image",
    description:
      "Generate product clips, ads, and social videos from text or an image, in the aspect ratio each platform needs.",
    intro:
      "Video gets the reach, but producing it every week is the part most teams skip. Genit's video tool turns a written prompt or a still image into a short clip. You pick the model, the aspect ratio, and the length, then iterate until it's right.",
    appHref: "/apps/video-generation?mode=ai-video-gen",
    appLabel: "Open the video tool",
    steps: [
      {
        title: "Start from text or an image",
        description:
          "Write a prompt, or upload a product shot and describe how it should move.",
      },
      {
        title: "Choose the format",
        description:
          "Pick vertical for Reels and TikTok, square for feeds, or widescreen for YouTube.",
      },
      {
        title: "Generate and refine",
        description:
          "Compare takes, adjust the prompt, and keep the version you like.",
      },
    ],
    details: [
      {
        title: "Text-to-video and image-to-video",
        description:
          "Use a description alone, or animate an image you already have.",
      },
      {
        title: "Several video models",
        description:
          "Switch between the available models, including Veo and Kling, depending on the look you want.",
      },
      {
        title: "Voiceover",
        description:
          "Add narration with the text-to-speech tool and pair it with your clip.",
      },
      {
        title: "Ready to post",
        description:
          "Finished videos go to your library and can be scheduled like any other post.",
      },
    ],
    examples: [
      "A 6-second product reveal for an online store",
      "Animated versions of existing ad images",
      "Short explainer clips for a new feature",
      "Background loops for landing pages",
    ],
    faq: [
      {
        question: "How long can videos be?",
        answer:
          "Clips are short, which suits ads and social posts. Available durations depend on the model you choose.",
      },
      {
        question: "Does video generation use credits?",
        answer:
          "Yes. Video costs more credits than images. The pricing page lists what each plan includes.",
      },
    ],
    related: ["graphic-design", "social-publishing", "content-calendar"],
  },
  {
    slug: "unified-inbox",
    name: "Unified Inbox",
    title: "Email, WhatsApp, and social DMs in one inbox",
    description:
      "Read and reply to Gmail, Outlook, WhatsApp, Instagram, Messenger, and Telegram conversations from one place.",
    intro:
      "Customers message you wherever they found you. Checking five apps means some messages get missed. Genit's inbox puts connected email and messaging accounts in a single list, with the contact's details beside each thread, and can draft replies using your brand voice.",
    appHref: "/visuals/inbox",
    appLabel: "Open the inbox",
    steps: [
      {
        title: "Connect your accounts",
        description:
          "Sign in to the email and messaging accounts you want to bring in. You can add more later.",
      },
      {
        title: "Work from one list",
        description:
          "New messages from every connected channel appear together, newest first.",
      },
      {
        title: "Reply, or let Genit draft",
        description:
          "Write the reply yourself or ask for a draft, then edit and send it from the same screen.",
      },
    ],
    details: [
      {
        title: "Email",
        description: "Gmail and Outlook threads, with quoted history kept tidy.",
      },
      {
        title: "Messaging apps",
        description:
          "WhatsApp Business, Messenger, Instagram DMs, and Telegram, depending on what you connect.",
      },
      {
        title: "WhatsApp calls",
        description:
          "Place and take WhatsApp Business calls without leaving the inbox.",
      },
      {
        title: "Contact details",
        description:
          "See who you're talking to and their previous conversations next to the thread.",
      },
    ],
    examples: [
      "A shop answering order questions from Instagram and WhatsApp",
      "An agency handling client email alongside social DMs",
      "A founder replying to leads from a campaign",
    ],
    faq: [
      {
        question: "Will Genit send replies without me?",
        answer:
          "Not unless you set it up to. By default Genit drafts and you decide what gets sent.",
      },
      {
        question: "Which channels are supported?",
        answer:
          "Gmail, Outlook, WhatsApp Business, Instagram, Messenger, and Telegram. What you can do on each depends on that platform's API and the permissions you grant.",
      },
    ],
    related: ["ai-chat-agents", "ad-campaigns", "marketing-automation"],
  },
  {
    slug: "ai-chat-agents",
    name: "AI Chat Agents",
    title: "A chat assistant that does the marketing work, not just the writing",
    description:
      "Ask Genit for a plan, a post, a report, or an email sequence and it uses your brand profile and connected apps to get it done.",
    intro:
      "A normal chatbot gives you text to copy somewhere else. Genit's agents can use the tools you've connected: create the graphic, put the post on the calendar, pull data from a spreadsheet, or draft the campaign. You approve anything that goes out.",
    appHref: "/chat",
    appLabel: "Open chat",
    steps: [
      {
        title: "Say what you want done",
        description:
          "For example: \"Plan two weeks of LinkedIn posts for our new pricing and schedule the first three.\"",
      },
      {
        title: "Watch the steps",
        description:
          "The agent shows each action it takes, such as research, drafting, image generation, and scheduling.",
      },
      {
        title: "Approve and finish",
        description:
          "Review anything that publishes or sends before it happens.",
      },
    ],
    details: [
      {
        title: "Knows your brand",
        description:
          "Your brand profile is loaded into every conversation, so you don't have to re-explain who you are.",
      },
      {
        title: "Uses your apps",
        description:
          "Connected tools such as Google Drive, Sheets, Calendar, and social accounts are available to the agent.",
      },
      {
        title: "Files as output",
        description:
          "Ask for documents, slide decks, spreadsheets, or reports and get real files back.",
      },
      {
        title: "Voice input",
        description: "Speak your request instead of typing it.",
      },
    ],
    examples: [
      "\"Write and design a launch announcement for every channel.\"",
      "\"Summarize last month's post performance into a short report.\"",
      "\"Turn this blog post into five social posts.\"",
      "\"Draft a three-email welcome sequence.\"",
    ],
    faq: [
      {
        question: "How is this different from ChatGPT?",
        answer:
          "Genit keeps your brand context, connects to your marketing accounts, and can carry out the work: design, schedule, send, and file it. A general chatbot stops at the text.",
      },
      {
        question: "Can I see what the agent did?",
        answer:
          "Yes. Each run lists the tools it used and what it produced.",
      },
    ],
    related: ["marketing-automation", "graphic-design", "apps-and-plugins"],
  },
  {
    slug: "team-management",
    name: "Team & Organization Management",
    title: "Organizations, teams, and workspaces for everyone involved",
    description:
      "Invite colleagues or clients by email, group them into teams, and keep each brand's work in its own workspace.",
    intro:
      "Once more than one person is involved, you need to know who can see what. Genit has organizations at the top, teams inside them, and workspaces for each brand or project. Agencies can keep client work separate; in-house teams can share one brand profile.",
    appHref: "/chat",
    appLabel: "Go to your workspace",
    steps: [
      {
        title: "Create an organization",
        description:
          "Your company or agency. Billing and members live here.",
      },
      {
        title: "Add teams and workspaces",
        description:
          "Split work by department, client, or brand. Each workspace has its own brand profile and assets.",
      },
      {
        title: "Invite people",
        description:
          "Send an email invitation. They join the organization when they accept.",
      },
    ],
    details: [
      {
        title: "Switch in one click",
        description:
          "Move between organizations and workspaces from the account menu.",
      },
      {
        title: "Separate brand context",
        description:
          "Each workspace keeps its own brand profile, so agents don't mix up clients.",
      },
      {
        title: "Shared billing",
        description:
          "One subscription at the organization level covers its members.",
      },
      {
        title: "Email invitations",
        description:
          "Invitees can sign in or create an account straight from the invite link.",
      },
    ],
    examples: [
      "An agency with one workspace per client",
      "A company with separate teams for social and paid ads",
      "A freelancer sharing a workspace with one client",
    ],
    faq: [
      {
        question: "Can I belong to more than one organization?",
        answer:
          "Yes. You can switch between them from the account menu.",
      },
      {
        question: "Do invited members need their own plan?",
        answer:
          "Members work under the organization's plan. See pricing for seat limits on each plan.",
      },
    ],
    related: ["digital-asset-library", "ai-chat-agents", "unified-inbox"],
  },
  {
    slug: "apps-and-plugins",
    name: "1,500+ External Apps & Plugins",
    title: "Connect the apps you already use",
    description:
      "Link Google Workspace, social accounts, CRMs, stores, and over a thousand other apps so Genit's agents and automations can work with them.",
    intro:
      "An assistant that can't reach your tools ends up asking you to copy and paste. Genit has native connections for the main marketing channels and a plugin catalog that covers a long tail of business apps. Connect once and the app is available in chat and in automations.",
    appHref: "/plugins",
    appLabel: "Browse plugins",
    steps: [
      {
        title: "Find the app",
        description:
          "Search the catalog for the tool you use, such as HubSpot, Shopify, Notion, or Slack.",
      },
      {
        title: "Authorize it",
        description:
          "Sign in with that app and grant the permissions it asks for. You can disconnect at any time.",
      },
      {
        title: "Use it anywhere",
        description:
          "Ask the chat agent to use it, or add it as a step in an automation.",
      },
    ],
    details: [
      {
        title: "Google Workspace",
        description: "Calendar, Drive, Docs, Sheets, Slides, Forms, and Meet.",
      },
      {
        title: "Social and ads",
        description:
          "Facebook, Instagram, LinkedIn, X, TikTok, YouTube, and Pinterest.",
      },
      {
        title: "Messaging and email",
        description: "Gmail, Outlook, WhatsApp, Telegram, and Slack.",
      },
      {
        title: "Everything else",
        description:
          "CRMs, e-commerce, project management, and storage apps through the plugin catalog.",
      },
    ],
    examples: [
      "Pull new Shopify products into a weekly promo post",
      "Log campaign leads to a Google Sheet",
      "Post a Slack message when a scheduled post goes live",
    ],
    faq: [
      {
        question: "Can I disconnect an app?",
        answer:
          "Yes, from the integrations page. Genit loses access as soon as you do.",
      },
      {
        question: "What can Genit do in each app?",
        answer:
          "It depends on the app's API and the permissions you grant. The plugin page lists the available actions for each one.",
      },
    ],
    related: ["marketing-automation", "ai-chat-agents", "unified-inbox"],
  },
  {
    slug: "marketing-automation",
    name: "Marketing Automation",
    title: "Automate the marketing tasks you repeat every week",
    description:
      "Build workflows with triggers, conditions, AI steps, and connected apps, or describe one in chat and let Genit build it.",
    intro:
      "If you do the same thing every Monday, it should run on its own. Genit's automation builder chains a trigger, such as a schedule, a webhook, or an event in a connected app, to the steps that follow: an AI prompt, a condition, an API call, a post. Start from a template or ask the agent to build it for you.",
    appHref: "/visuals/automation",
    appLabel: "Open automations",
    steps: [
      {
        title: "Pick a trigger",
        description:
          "A schedule, an incoming webhook, or an event in a connected app.",
      },
      {
        title: "Add the steps",
        description:
          "AI prompts, conditions, transforms, API calls, and actions in apps like YouTube, Instagram, or email.",
      },
      {
        title: "Activate it",
        description:
          "Turn it on, watch its run status, and pause it whenever you need to.",
      },
    ],
    details: [
      {
        title: "Visual builder",
        description: "See the whole workflow as connected steps on one canvas.",
      },
      {
        title: "Build from chat",
        description:
          "Describe the workflow in a sentence and Genit lays out the steps for you to check.",
      },
      {
        title: "Templates",
        description:
          "Start from examples such as a lead nurture sequence or a YouTube-to-social repurposer.",
      },
      {
        title: "Run status",
        description:
          "See which automations are active, when they last ran, and pause any of them.",
      },
    ],
    examples: [
      "Turn each new YouTube upload into clips and posts",
      "Send a follow-up email when a lead fills a form",
      "Post a weekly roundup every Friday at 9am",
    ],
    faq: [
      {
        question: "Do I need to code?",
        answer:
          "No. The builder is visual, and you can describe the workflow in chat. There is an API call step if you do want to reach a custom endpoint.",
      },
      {
        question: "Can automations publish without approval?",
        answer:
          "Only if you build them that way. You decide which steps run on their own.",
      },
    ],
    related: ["apps-and-plugins", "social-publishing", "ad-campaigns"],
  },
  {
    slug: "ad-campaigns",
    name: "Ad Campaigns",
    title: "Plan a campaign, create the content, and run the outreach",
    description:
      "Keep a campaign's plan, creative, outreach messages, and results together, from first brief to final report.",
    intro:
      "A campaign usually lives in a doc, a design folder, a sending tool, and a spreadsheet of results. In Genit it's one page. The overview holds the goal and audience, the content tab holds the creative, the outreach tab sends messages to imported recipients, and the performance tab shows what happened.",
    appHref: "/visuals/campaigns",
    appLabel: "Open campaigns",
    steps: [
      {
        title: "Set up the campaign",
        description:
          "Give it a goal, an audience, and dates. Genit can draft the plan from a short brief.",
      },
      {
        title: "Create content and messages",
        description:
          "Generate the visuals and copy, and write the outreach sequence.",
      },
      {
        title: "Launch and track",
        description:
          "Import recipients, pick a sending account, launch, and watch delivery and replies.",
      },
    ],
    details: [
      {
        title: "Outreach on several channels",
        description:
          "Send through connected email, WhatsApp, Instagram, Messenger, or Telegram accounts.",
      },
      {
        title: "Recipient management",
        description:
          "Import lists, see who was delivered or replied, and suppress anyone who opts out.",
      },
      {
        title: "Pause anytime",
        description: "Stop outreach mid-campaign and pick up later.",
      },
      {
        title: "Performance",
        description:
          "See delivery, replies, and engagement in one view and use it to plan the next round.",
      },
    ],
    examples: [
      "A product launch with social creative and an email sequence",
      "A WhatsApp re-engagement campaign for past customers",
      "A seasonal promotion across Instagram and email",
    ],
    faq: [
      {
        question: "Can I use my own contact list?",
        answer:
          "Yes. Import recipients you have permission to contact. Opt-outs can be suppressed so they aren't messaged again.",
      },
      {
        question: "Does Genit run paid ads?",
        answer:
          "Genit connects to supported ad platforms. Which actions are available depends on the platform and your account permissions.",
      },
    ],
    related: ["unified-inbox", "content-calendar", "marketing-automation"],
  },
  {
    slug: "content-calendar",
    name: "Content Calendar",
    title: "See everything that's going out, and when",
    description:
      "Scheduled posts and brand events on one calendar, synced with Google Calendar if you want.",
    intro:
      "A calendar answers the questions that come up every week: what's posting tomorrow, is there a gap before the launch, what's clashing with the holiday. Genit shows scheduled posts and brand events together, and you can drag things to new dates.",
    appHref: "/visuals/calendar",
    appLabel: "Open the calendar",
    steps: [
      {
        title: "Connect Google Calendar (optional)",
        description:
          "Bring your existing schedule in so marketing dates sit next to everything else.",
      },
      {
        title: "Add posts and events",
        description:
          "Scheduled posts appear automatically. Add launches, sales, and other brand events yourself.",
      },
      {
        title: "Move things around",
        description: "Drag an item to a new day to reschedule it.",
      },
    ],
    details: [
      {
        title: "Posts and events together",
        description:
          "Social posts and brand events in the same month, week, or day view.",
      },
      {
        title: "Google Calendar sync",
        description: "Connect your Google account to see your existing calendar.",
      },
      {
        title: "Drag to reschedule",
        description: "Change a date without opening the post.",
      },
      {
        title: "Plan from chat",
        description:
          "Ask the agent for a month of content and it can fill the calendar for you to review.",
      },
    ],
    examples: [
      "Planning a month of posts around a product launch",
      "Spotting empty weeks in a posting schedule",
      "Coordinating a team's campaign dates",
    ],
    faq: [
      {
        question: "Do I have to use Google Calendar?",
        answer: "No. The calendar works on its own; Google sync is optional.",
      },
      {
        question: "Does moving an event change the post time?",
        answer:
          "Yes. Rescheduling a post on the calendar updates when it publishes.",
      },
    ],
    related: ["social-publishing", "ad-campaigns", "graphic-design"],
  },
  {
    slug: "social-publishing",
    name: "Social Publishing",
    title: "Write, schedule, and track posts for every channel",
    description:
      "Create a post once, adapt it for Instagram, Facebook, LinkedIn, X, TikTok, and YouTube, and see how it performed.",
    intro:
      "Posting the same idea to six platforms means six slightly different captions, sizes, and upload screens. Genit's posts workspace lets you write once, adjust per channel, schedule, and then see impressions, engagement, and comments for each post afterwards.",
    appHref: "/visuals/posts",
    appLabel: "Open posts",
    steps: [
      {
        title: "Create the post",
        description:
          "Write the caption yourself or ask Genit to improve it, and attach media from your library.",
      },
      {
        title: "Pick channels and time",
        description:
          "Choose connected accounts and when it should go out.",
      },
      {
        title: "Check the results",
        description:
          "See impressions, engagement, and comments once it's live.",
      },
    ],
    details: [
      {
        title: "Multi-platform",
        description:
          "Instagram, Facebook, LinkedIn, X, TikTok, YouTube, and Pinterest through connected accounts.",
      },
      {
        title: "AI caption help",
        description: "Generate or rewrite captions in your brand voice.",
      },
      {
        title: "Post analytics",
        description:
          "Impressions and engagement per post, with a breakdown by platform.",
      },
      {
        title: "Comments",
        description: "Read and reply to comments on published posts.",
      },
    ],
    examples: [
      "A weekly posting routine for a small business",
      "Cross-posting a video to Reels, Shorts, and TikTok",
      "Comparing which platform drives the most engagement",
    ],
    faq: [
      {
        question: "Can Genit post directly to my accounts?",
        answer:
          "Yes, once connected. Each platform's API limits what can be published, for example certain post types on some networks.",
      },
      {
        question: "Can I edit a scheduled post?",
        answer: "Yes, any time before it publishes.",
      },
    ],
    related: ["content-calendar", "graphic-design", "ai-video-creation"],
  },
  {
    slug: "digital-asset-library",
    name: "Digital Asset Library",
    title: "Every image and video you've made or uploaded, in one place",
    description:
      "Generated and uploaded media is stored in a searchable library you can filter, preview, download, and reuse.",
    intro:
      "Generated assets are easy to lose in chat history and download folders. Genit saves everything you create or upload to a media library, with file details like dimensions and duration, so the graphic from last month's campaign is easy to find again.",
    appHref: "/visuals/library",
    appLabel: "Open the library",
    steps: [
      {
        title: "Create or upload",
        description:
          "Anything you generate in Genit is saved automatically. Upload your own files too.",
      },
      {
        title: "Find it later",
        description: "Filter by type and sort by date to find what you need.",
      },
      {
        title: "Reuse it",
        description:
          "Attach it to a post, use it in a design, or download the original.",
      },
    ],
    details: [
      {
        title: "Images and video",
        description: "Both generated and uploaded media in one gallery.",
      },
      {
        title: "File details",
        description: "Dimensions, duration, and date added for each item.",
      },
      {
        title: "Bulk actions",
        description: "Select several items to download or delete at once.",
      },
      {
        title: "Per workspace",
        description:
          "Each workspace keeps its own library, so client assets stay separate.",
      },
    ],
    examples: [
      "Reusing last season's product shots in a new campaign",
      "Collecting all assets for a launch in one place",
      "Handing a client their finished files",
    ],
    faq: [
      {
        question: "Is there a storage limit?",
        answer: "Storage depends on your plan. See the pricing page for details.",
      },
      {
        question: "Can I download the original files?",
        answer: "Yes, individually or several at once.",
      },
    ],
    related: ["graphic-design", "social-publishing", "team-management"],
  },
];

export function getUseCase(slug: string) {
  return useCases.find((useCase) => useCase.slug === slug);
}
