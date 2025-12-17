"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/AuthenticatedContext";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import withAuth from "@/helper/hoc/withAuth";

interface PresentationData {
  prompt: string;
  config: {
    numberOfSlides: number;
    textAmount: "minimal" | "concise" | "detailed" | "extensive";
    theme: string;
    imageStyle: string;
    outline: Array<{ title: string; content: string[] }>;
  };
  orientation: string | null;
  customSize: { width: string; height: string } | null;
}

function PresentationStudioPage() {
  const router = useRouter();
  const { user } = useUserContext();
  const { toast } = useToast();
  const [presentationData, setPresentationData] =
    useState<PresentationData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutline, setGeneratedOutline] = useState<
    Array<{ title: string; content: string[] }>
  >([]);

  useEffect(() => {
    // Load presentation data from sessionStorage
    const stored = sessionStorage.getItem("presentationData");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setPresentationData(data);
        // Generate outline based on prompt
        generateOutline(data.prompt, data.config.numberOfSlides);
      } catch (error) {
        console.error("Error parsing presentation data:", error);
        toast({
          title: "Error",
          description: "Failed to load presentation data",
          variant: "destructive",
        });
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [router, toast]);

  const generateOutline = async (prompt: string, numberOfSlides: number) => {
    // This would call an AI service to generate the outline
    // For now, we'll create a placeholder outline
    const outline: Array<{ title: string; content: string[] }> = [];
    
    for (let i = 1; i <= numberOfSlides; i++) {
      outline.push({
        title: `Slide ${i}`,
        content: [
          `Content point 1 for slide ${i}`,
          `Content point 2 for slide ${i}`,
        ],
      });
    }
    
    setGeneratedOutline(outline);
  };

  const handleGenerate = async () => {
    if (!presentationData || !user) return;

    setIsGenerating(true);

    try {
      // Create presentation project
      // This would be a separate API endpoint for presentation projects
      const projectData = {
        title: presentationData.prompt,
        type: "presentation",
        config: presentationData.config,
        orientation: presentationData.orientation,
        customSize: presentationData.customSize,
        outline: generatedOutline,
        userId: user._id,
        userName: user.username || user.email,
      };

      // TODO: Call API to create presentation project
      
      // For now, simulate navigation
      toast({
        title: "Presentation Created",
        description: "Your presentation is being generated...",
      });

      // Navigate to presentation editor
      // router.push(`/presentation/${response.data.project._id}`);
      
      // Clear sessionStorage
      sessionStorage.removeItem("presentationData");
    } catch (error: any) {
      console.error("Failed to create presentation:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create presentation",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!presentationData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Presentation Studio</h1>
              <p className="text-sm text-muted-foreground">
                {presentationData.prompt}
              </p>
            </div>
          </div>
        </div>

        {/* Outline Section */}
        <div className="bg-card rounded-lg border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Outline</h2>
          <div className="space-y-3">
            {generatedOutline.map((slide, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-2">{slide.title}</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {slide.content.map((point, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Configuration Summary */}
        <div className="bg-card rounded-lg border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Configuration</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Slides</p>
              <p className="font-medium">{presentationData.config.numberOfSlides}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Text Amount</p>
              <p className="font-medium capitalize">
                {presentationData.config.textAmount}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Image Style</p>
              <p className="font-medium capitalize">
                {presentationData.config.imageStyle}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Orientation</p>
              <p className="font-medium">
                {presentationData.orientation || "Default"}
              </p>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || generatedOutline.length === 0}
            size="lg"
            className="min-w-[200px]"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Presentation
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default withAuth(PresentationStudioPage);

