import React, { useState } from 'react';
import { Sparkles, Brain, Layers, ArrowRight, Github, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ImageUploadZone } from '@/components/ImageUploadZone';
import { ParameterControls } from '@/components/ParameterControls';
import { GeneratedResults } from '@/components/GeneratedResults';
import { toast } from '@/hooks/use-toast';

interface SMOTEParameters {
  k_neighbors: number;
  sampling_strategy: string;
  clustering_enabled: boolean;
  outlier_detection: boolean;
  decoder_type: string;
}

interface GeneratedImage {
  id: string;
  url: string;
  class_label?: string;
  quality_score?: number;
}

const Index = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [description, setDescription] = useState('');
  const [parameters, setParameters] = useState<SMOTEParameters>({
    k_neighbors: 5,
    sampling_strategy: 'minority',
    clustering_enabled: true,
    outlier_detection: true,
    decoder_type: 'vae',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleGenerate = async () => {
    if (files.length === 0) {
      toast({
        title: "No images uploaded",
        description: "Please upload at least one image to generate synthetic samples.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    toast({
      title: "Generation Started",
      description: "Processing images through the Gemini API pipeline...",
    });

    try {
      // Convert files to base64
      const imagePromises = files.map(fileToBase64);
      const base64Images = await Promise.all(imagePromises);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-images`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            images: base64Images,
            description,
            parameters,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate images");
      }

      const data = await response.json();
      setGeneratedImages(data.images);

      toast({
        title: "Generation Complete",
        description: `Successfully generated ${data.images.length} synthetic images.`,
      });
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "An error occurred during generation.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background Pattern */}
      <div className="fixed inset-0 grid-pattern opacity-50 pointer-events-none" />
      
      {/* Header */}
      <header className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Layers className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground">SMOTE for Images</h1>
                <p className="text-xs text-muted-foreground font-mono">Powered by Gemini</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <BookOpen className="w-4 h-4 mr-2" />
                Docs
              </Button>
              <Button variant="ghost" size="sm">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-12 border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Latent Space Oversampling</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Synthetic Image Generation</span>
              <br />
              <span className="text-foreground">for Class Imbalance</span>
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Generate high-fidelity synthetic images using constrained SMOTE in the latent embedding space. 
              Leverage deep neural encoders and multiple decoder architectures.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative z-10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Upload & Description */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upload Section */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Input Images</h3>
                    <p className="text-sm text-muted-foreground">Upload your minority class samples</p>
                  </div>
                </div>
                
                <ImageUploadZone
                  files={files}
                  onFilesChange={setFiles}
                  maxFiles={10}
                />
              </div>

              {/* Description Section */}
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Image Description</h3>
                    <p className="text-sm text-muted-foreground">Describe the class or context</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="description" className="text-sm text-muted-foreground">
                    Provide context about the images for better semantic clustering
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="e.g., Medical X-ray images showing rare pneumonia patterns with specific opacity distributions..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[120px] bg-secondary border-border resize-none"
                  />
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || files.length === 0}
                variant="gradient"
                size="lg"
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate Synthetic Images
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>

              {/* Results Section */}
              <GeneratedResults
                images={generatedImages}
                isLoading={isGenerating}
              />
            </div>

            {/* Right Column - Parameters */}
            <div className="space-y-6">
              <ParameterControls
                parameters={parameters}
                onParametersChange={setParameters}
              />

              {/* Info Card */}
              <div className="glass rounded-xl p-6">
                <h4 className="font-semibold text-foreground mb-3">How it works</h4>
                <ol className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center shrink-0">1</span>
                    <span>Images are encoded into latent embeddings using deep neural encoders</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center shrink-0">2</span>
                    <span>ConstrainedSMOTE generates new samples with semantic clustering</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center shrink-0">3</span>
                    <span>Decoder reconstructs synthetic images from latent representations</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center shrink-0">4</span>
                    <span>Quality assessment validates output using FID, LPIPS, SSIM</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>Built with Gemini API • Latent Space SMOTE Framework</p>
            <p className="font-mono">v1.0.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
