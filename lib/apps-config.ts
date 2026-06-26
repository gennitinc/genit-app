export interface AppBadge {
  text: string;
  bgColor: string;
  textColor: string;
}

export interface AppCardProps {
  id: string;
  href: string;
  title: string;
  description: string;
  type: "video" | "image" | "audio";
  imageSrc: string;
  videoSrc?: string;
  posterSrc?: string;
  badge?: AppBadge;
}

export interface AppSection {
  title: string;
  description: string;
  href: string;
  apps: AppCardProps[];
}

export const APP_SECTIONS: AppSection[] = [
  {
    title: "General Agents",
    description: "Premium visual styles and sophisticated effects",
    href: "/apps/enhance-style",
    apps: [
      {
        id: "design-chat",
        href: "/chat",
        title: "Agentic Chat",
        description: "Transform perspective and camera angles with precision",
        type: "image",
        imageSrc:
          "https://cdn.dribbble.com/users/4874/screenshots/3252414/interncomms-final.gif?utm_source=Pinterest&utm_medium=organic",
      },
      // {
      //   id: "workflow",
      //   href: "/apps/workflow",
      //   title: "AI Workflow",
      //   description: "Automate your creative process with AI nodes",
      //   type: "image",
      //   imageSrc:
      //     "https://i.pinimg.com/1200x/2e/29/24/2e29246282d5e2cc89abedaef9dc4fcd.jpg",
      //   badge: {
      //     text: "New",
      //     bgColor: "rgb(16, 185, 129)", // Emerald 500
      //     textColor: "rgb(255, 255, 255)",
      //   },
      // },
      {
        id: "angles-reshape",
        href: "/apps/angles-reshape",
        title: "Angle Reshape",
        description: "Transform perspective and camera angles with precision",
        type: "image",
        imageSrc:
          "https://i.pinimg.com/736x/1d/e5/29/1de52947cf871b610fb4276053dd137f.jpg",
      },
      {
        id: "video-generation",
        href: "/apps/video-generation",
        title: "Video Generation",
        description: "Kinetic AI storytelling and animation",
        type: "video",
        imageSrc:
          "https://i.pinimg.com/originals/6f/40/25/6f4025f83d11fbb560ed453e98d80104.gif",
      },
      {
        id: "skin-enhancer",
        href: "/apps/skin-enhancer",
        title: "Skin Enhancer",
        description: "Achieve professional, true-to-life skin textures",
        type: "image",
        imageSrc:
          "https://i.pinimg.com/1200x/99/1a/d5/991ad574d9178d31a6c6fde8f407be88.jpg",
      },
      {
        id: "image-generation",
        href: "/apps/image-generation",
        title: "Image Generation",
        description: "Professional AI image creation suite",
        type: "image",
        imageSrc:
          "https://i.pinimg.com/736x/f4/fb/b5/f4fbb53e705d9d641c4f2f4f32cd1527.jpg",
      },
      {
        id: "character",
        href: "/apps/character",
        title: "Character Manager",
        description: "Manage and generate your own custom digital characters",
        type: "image",
        imageSrc:
          "https://i.pinimg.com/736x/eb/76/a4/eb76a46ab920d056b02d203ca95e9a22.jpg",
      },
      {
        id: "image-inpaint",
        href: "/apps/image-inpaint",
        title: "In-Painting",
        description: "Seamlessly remove objects and fill backgrounds with AI",
        type: "image",
        imageSrc:
          "https://imgv3.fotor.com/images/homepage-feature-card/use-fotor-ai-inpainting-tool-to-generate-a-spooted-white-trousers-for-female.jpg",
        badge: {
          text: "Soon",
          bgColor: "rgb(157, 78, 221)",
          textColor: "rgb(255, 255, 255)",
        },
      },
      {
        id: "animation",
        href: "/apps/logo-animation",
        title: "Animation",
        description: "Bring your logo to life with stunning animations",
        type: "image",
        imageSrc:
          "https://i.pinimg.com/originals/46/5b/c4/465bc4bc137942ccd0a2a8ecb96387e8.gif",
        badge: {
          text: "Soon",
          bgColor: "rgb(157, 78, 221)",
          textColor: "rgb(255, 255, 255)",
        },
      },
      {
        id: "face-swap",
        href: "/apps/face-swap",
        title: "Face Swap",
        description: "Swap faces in images and videos with high precision",
        type: "image",
        imageSrc:
          "https://i.pinimg.com/736x/11/a2/41/11a2417bd10628b011dcb9e8792ecf7e.jpg",
        badge: {
          text: "Soon",
          bgColor: "rgb(157, 78, 221)",
          textColor: "rgb(255, 255, 255)",
        },
      },
      {
        id: "relight",
        href: "/apps/relight",
        title: "Glow Control",
        description: "Precision adjustment for lighting, color, and intensity",
        type: "image",
        imageSrc:
          "https://i.pinimg.com/736x/9a/43/11/9a43113d58e58236248dd4ffa7f9559f.jpg",
        badge: {
          text: "Soon",
          bgColor: "rgb(157, 78, 221)",
          textColor: "rgb(255, 255, 255)",
        },
      },
      // {
      //   id: "text-to-speech",
      //   href: "/apps/text-to-speech",
      //   title: "Text to Speech",
      //   description: "Transform text into lifelike AI speech with expressive voices",
      //   type: "audio",
      //   imageSrc:
      //     "https://i.pinimg.com/736x/82/23/c0/8223c0ec6b9242d0832b9b4ed00fb046.jpg",
      //   badge: {
      //     text: "Ready",
      //     bgColor: "rgb(16, 185, 129)",
      //     textColor: "rgb(255, 255, 255)",
      //   },
      // },
    ],
  },
];
