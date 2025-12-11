import React from 'react';
import { Download, Eye, BarChart3, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GeneratedImage {
  id: string;
  url: string;
  class_label?: string;
  quality_score?: number;
}

interface QualityMetrics {
  fid_score: number;
  lpips: number;
  ssim: number;
  diversity: number;
}

interface GeneratedResultsProps {
  images: GeneratedImage[];
  metrics?: QualityMetrics;
  isLoading?: boolean;
}

export const GeneratedResults: React.FC<GeneratedResultsProps> = ({
  images,
  metrics,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="glass rounded-xl p-8">
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <Sparkles className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="text-center">
            <p className="text-foreground font-medium">Generating synthetic images...</p>
            <p className="text-sm text-muted-foreground mt-1">Processing in latent space</p>
          </div>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="glass rounded-xl p-8">
        <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <p className="text-foreground font-medium">No images generated yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Upload images and click generate to start
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quality Metrics */}
      {metrics && (
        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Quality Metrics</h3>
              <p className="text-sm text-muted-foreground">Synthetic image evaluation</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label="FID Score" value={metrics.fid_score} lower />
            <MetricCard label="LPIPS" value={metrics.lpips} lower />
            <MetricCard label="SSIM" value={metrics.ssim} />
            <MetricCard label="Diversity" value={metrics.diversity} />
          </div>
        </div>
      )}

      {/* Generated Images Grid */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Generated Images</h3>
              <p className="text-sm text-muted-foreground">{images.length} synthetic samples</p>
            </div>
          </div>
          
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="group relative rounded-lg overflow-hidden bg-secondary aspect-square animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <img
                src={image.url}
                alt={`Generated ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="flex items-center justify-between">
                    {image.class_label && (
                      <span className="text-xs font-mono bg-primary/20 text-primary px-2 py-1 rounded">
                        {image.class_label}
                      </span>
                    )}
                    <div className="flex gap-2">
                      <button className="p-1.5 rounded-lg bg-secondary/80 hover:bg-secondary transition-colors">
                        <Eye className="w-4 h-4 text-foreground" />
                      </button>
                      <button className="p-1.5 rounded-lg bg-secondary/80 hover:bg-secondary transition-colors">
                        <Download className="w-4 h-4 text-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {image.quality_score !== undefined && (
                <div className="absolute top-2 right-2">
                  <span className="text-xs font-mono bg-background/80 backdrop-blur-sm text-primary px-2 py-1 rounded">
                    {(image.quality_score * 100).toFixed(0)}%
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ label: string; value: number; lower?: boolean }> = ({
  label,
  value,
  lower,
}) => {
  const isGood = lower ? value < 50 : value > 0.7;
  
  return (
    <div className="bg-secondary/50 rounded-lg p-4">
      <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className={`text-2xl font-mono font-semibold mt-1 ${isGood ? 'text-primary' : 'text-foreground'}`}>
        {value.toFixed(2)}
      </p>
    </div>
  );
};
