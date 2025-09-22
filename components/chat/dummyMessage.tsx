// demo-messages.ts

export interface AttachedFile {
  id: string;
  name: string;
  type: string;
  filePath: string;
  status: "uploaded" | "generated";
}

export interface MessagePart {
  type: "text";
  text: string; // Markdown for AI text, plain text for user
}

export interface GenerationItem {
  id: string;
  name: string;
  type: string;
  filePath: string;
  status: "generated";
}

export interface GenerationGroup {
  id: string;
  title: string;
  timestamp: Date;
  isLatest: boolean;
  isViewing: boolean;
  isCollapsed: boolean;
  items: GenerationItem[];
}

export interface DemoMessage {
  id: string;
  role: "user" | "assistant";
  type: "user" | "ai";
  totalTime?: number;
  versionId?: string;
  metadata?: Record<string, any>;
  parts: MessagePart[];
  attachedFiles?: AttachedFile[]; // only for user
  generationGroups?: GenerationGroup[]; // only for assistant
}

export const demoMessages: DemoMessage[] = [
  {
    id: "msg-1",
    role: "user",
    type: "user",
    parts: [
      {
        type: "text",
        text:
          "Explain the difference between streaming and non-streaming AI responses.",
      },
    ],
    attachedFiles: [
      {
        id: "file-1",
        name: "notes.pdf",
        type: "application/pdf",
        filePath: "https://example.com/files/notes.pdf",
        status: "uploaded",
      },
    ],
  },
  {
    id: "msg-2",
    role: "assistant",
    type: "ai",
    totalTime: 2450,
    versionId: "v1",
    metadata: { isStreaming: false },
    parts: [
      {
        type: "text",
        text: `new text`,
      },
    ],
    generationGroups: [
      {
        id: "v1",
        title: "Version 1",
        timestamp: new Date("2024-01-15T10:30:00Z"),
        isLatest: true,
        isViewing: false,
        isCollapsed: false,
        items: [
          {
            id: "v1-item1",
            name: "streaming-diagram.png",
            type: "image/png",
            filePath:
              "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
            status: "generated",
          },
        ],
      },
    ],
  },
  {
    id: "msg-3",
    role: "user",
    type: "user",
    parts: [
      {
        type: "text",
        text:
          "Write me a friendly email to reschedule a meeting with a client.",
      },
    ],
    attachedFiles: [],
  },
  {
    id: "msg-4",
    role: "assistant",
    type: "ai",
    totalTime: 1870,
    versionId: "v2",
    metadata: { isStreaming: false },
    parts: [
      {
        type: "text",
        text: `Hi **[Client Name]**,

I hope you're doing well! Something has come up and I'll need to reschedule our meeting.  
Would next **Wednesday at 2 PM** work for you?

Thanks for your understanding,  
**[Your Name]**`,
      },
    ],
    generationGroups: [
      {
        id: "v2",
        title: "Version 2",
        timestamp: new Date("2024-01-15T11:15:00Z"),
        isLatest: true,
        isViewing: false,
        isCollapsed: false,
        items: [
          {
            id: "v2-item1",
            name: "email-template.png",
            type: "image/png",
            filePath:
              "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&h=600&fit=crop",
            status: "generated",
          },
        ],
      },
    ],
  },
  {
    id: "msg-5",
    role: "user",
    type: "user",
    parts: [
      {
        type: "text",
        text: "Give me three slogan ideas for eco-friendly water bottles.",
      },
    ],
    attachedFiles: [
      {
        id: "file-eco1",
        name: "bottle-photo.jpg",
        type: "image/jpeg",
        filePath: "https://example.com/files/bottle-photo.jpg",
        status: "uploaded",
      },
    ],
  },
  {
    id: "msg-6",
    role: "assistant",
    type: "ai",
    totalTime: 940,
    versionId: "v3",
    metadata: { isStreaming: false },
    parts: [
      {
        type: "text",
        text: `1. **Sip Smart, Save the Planet**  
2. **Hydrate. Reuse. Repeat.**  
3. **Drink Green, Live Clean**`,
      },
    ],
    generationGroups: [
      {
        id: "v3",
        title: "Version 3",
        timestamp: new Date("2024-01-15T14:22:00Z"),
        isLatest: true,
        isViewing: false,
        isCollapsed: false,
        items: [
          {
            id: "v3-item1",
            name: "eco-slogans-banner.png",
            type: "image/png",
            filePath:
              "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop",
            status: "generated",
          },
        ],
      },
    ],
  },
  {
    id: "msg-7",
    role: "user",
    type: "user",
    parts: [
      {
        type: "text",
        text:
          "Summarize these team notes:\n- Marketing will finalize designs by Friday\n- Dev team is testing new features\n- Launch date is September 15",
      },
    ],
    attachedFiles: [],
  },
  {
    id: "msg-8",
    role: "assistant",
    type: "ai",
    totalTime: 640,
    versionId: "v4",
    metadata: { isStreaming: false },
    parts: [
      {
        type: "text",
        text:
          "Marketing will finalize designs by **Friday**, development is testing new features, and the product launches on **September 15**.",
      },
    ],
    generationGroups: [
      {
        id: "v4",
        title: "Version 4",
        timestamp: new Date("2024-01-15T16:45:00Z"),
        isLatest: true,
        isViewing: false,
        isCollapsed: false,
        items: [
          {
            id: "v4-item1",
            name: "team-summary-infographic.png",
            type: "image/png",
            filePath:
              "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
            status: "generated",
          },
        ],
      },
    ],
  },
  {
    id: "msg-9",
    role: "user",
    type: "user",
    parts: [
      {
        type: "text",
        text: "What's the weather in Lagos right now?",
      },
    ],
    attachedFiles: [],
  },
  {
    id: "msg-10",
    role: "assistant",
    type: "ai",
    totalTime: 450,
    versionId: "v5",
    metadata: { isStreaming: false },
    parts: [
      {
        type: "text",
        text: `Here's a quick look at **Lagos** weather right now:`,
      },
    ],
    generationGroups: [
      {
        id: "v5",
        title: "Version 5",
        timestamp: new Date("2024-01-15T18:30:00Z"),
        isLatest: true,
        isViewing: false,
        isCollapsed: false,
        items: [
          {
            id: "v5-item1",
            name: "lagos-weather.png",
            type: "image/png",
            filePath:
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
            status: "generated",
          },
        ],
      },
    ],
  },
  {
    id: "msg-11",
    role: "user",
    type: "user",
    parts: [
      {
        type: "text",
        text:
          "Create a short video showing how to make a perfect cup of coffee",
      },
    ],
    attachedFiles: [
      {
        id: "file-coffee",
        name: "beans.png",
        type: "image/png",
        filePath: "https://example.com/files/beans.png",
        status: "uploaded",
      },
    ],
  },
  {
    id: "msg-12",
    role: "assistant",
    type: "ai",
    totalTime: 1200,
    versionId: "v6",
    metadata: { isStreaming: false },
    parts: [
      {
        type: "text",
        text: `I've created a **step-by-step** video tutorial for making the perfect cup of coffee.  
It walks through everything from choosing beans to the final pour.`,
      },
    ],
    generationGroups: [
      {
        id: "v6",
        title: "Version 6",
        timestamp: new Date("2024-01-15T19:15:00Z"),
        isLatest: true,
        isViewing: false,
        isCollapsed: false,
        items: [
          {
            id: "v6-item1",
            name: "coffee-tutorial.mp4",
            type: "video/mp4",
            filePath:
              "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            status: "generated",
          },
        ],
      },
    ],
  },
];
