// JSON Schema for Presentation State
export interface PresentationBlock {
  id: string;
  type:
    | "text"
    | "heading"
    | "image"
    | "list"
    | "quote"
    | "code"
    | "divider"
    | "shape"
    | "icon"
    | "chart";
  content: string | RichTextContent;
  position: { x: number; y: number; width: number; height: number };
  style?: BlockStyle;
  order: number;
  iconName?: string; // For icon type blocks
  chartData?: {
    chartType: string;
    chartData: any;
    config?: any;
  }; // For chart type blocks
}

export interface RichTextContent {
  type: "doc";
  content: Array<{
    type: string;
    content?: any[];
    attrs?: Record<string, any>;
    text?: string;
  }>;
}

export interface BlockStyle {
  fontSize?: number | string;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  textAlign?: "left" | "center" | "right" | "justify";
  padding?: number;
  borderRadius?: number;
  border?: string;
}

export interface Slide {
  id: string;
  title: string;
  blocks: PresentationBlock[];
  background?: {
    color?: string;
    image?: string;
    gradient?: string;
  };
  layout:
    | "default"
    | "title-only"
    | "two-column"
    | "image-left"
    | "image-right"
    | "centered";
  order: number;
  theme?: string;
}

export interface PresentationProject {
  _id: string;
  title: string;
  slides: Slide[];
  theme?: string;
  textAmount?: string;
  imageStyle?: string;
  createdAt?: string;
  updatedAt?: string;
}
