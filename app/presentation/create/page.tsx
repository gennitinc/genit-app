"use client";

import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthenticatedContext";
import withAuth from "@/helper/hoc/withAuth";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
      <div className='flex min-h-screen items-center justify-center'>
        <Loader2 className='h-6 w-6 animate-spin' />
      </div>
    );
  }

  return (
    <div className='bg-background min-h-screen'>
      <div className='container mx-auto max-w-6xl px-4 py-8'>
        {/* Header */}
        <div className='mb-8 flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Button variant='ghost' size='icon' onClick={() => router.back()}>
              <ArrowLeft className='h-4 w-4' />
            </Button>
            <div>
              <h1 className='text-2xl font-bold'>Presentation Studio</h1>
              <p className='text-muted-foreground text-sm'>
                {presentationData.prompt}
              </p>
            </div>
          </div>
        </div>

        {/* Outline Section */}
        <div className='bg-card mb-6 rounded-lg border p-6'>
          <h2 className='mb-4 text-lg font-semibold'>Outline</h2>
          <div className='space-y-3'>
            {generatedOutline.map((slide, index) => (
              <div
                key={index}
                className='hover:bg-muted/50 rounded-lg border p-4 transition-colors'
              >
                <div className='flex items-start gap-3'>
                  <div className='bg-primary/10 text-primary flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-medium'>
                    {index + 1}
                  </div>
                  <div className='flex-1'>
                    <h3 className='mb-2 font-medium'>{slide.title}</h3>
                    <ul className='text-muted-foreground space-y-1 text-sm'>
                      {slide.content.map((point, i) => (
                        <li key={i} className='flex items-start gap-2'>
                          <span className='bg-muted-foreground mt-1.5 h-1 w-1 flex-shrink-0 rounded-full' />
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
        <div className='bg-card mb-6 rounded-lg border p-6'>
          <h2 className='mb-4 text-lg font-semibold'>Configuration</h2>
          <div className='grid grid-cols-2 gap-4 text-sm md:grid-cols-4'>
            <div>
              <p className='text-muted-foreground'>Slides</p>
              <p className='font-medium'>
                {presentationData.config.numberOfSlides}
              </p>
            </div>
            <div>
              <p className='text-muted-foreground'>Text Amount</p>
              <p className='font-medium capitalize'>
                {presentationData.config.textAmount}
              </p>
            </div>
            <div>
              <p className='text-muted-foreground'>Image Style</p>
              <p className='font-medium capitalize'>
                {presentationData.config.imageStyle}
              </p>
            </div>
            <div>
              <p className='text-muted-foreground'>Orientation</p>
              <p className='font-medium'>
                {presentationData.orientation || "Default"}
              </p>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className='flex justify-end'>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || generatedOutline.length === 0}
            size='lg'
            className='min-w-[200px]'
          >
            {isGenerating ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className='mr-2 h-4 w-4' />
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
