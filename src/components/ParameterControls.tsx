import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Settings2, Layers, Zap, Shield } from 'lucide-react';

interface SMOTEParameters {
  k_neighbors: number;
  sampling_strategy: string;
  clustering_enabled: boolean;
  outlier_detection: boolean;
  decoder_type: string;
}

interface ParameterControlsProps {
  parameters: SMOTEParameters;
  onParametersChange: (params: SMOTEParameters) => void;
}

export const ParameterControls: React.FC<ParameterControlsProps> = ({
  parameters,
  onParametersChange,
}) => {
  const updateParam = <K extends keyof SMOTEParameters>(
    key: K,
    value: SMOTEParameters[K]
  ) => {
    onParametersChange({ ...parameters, [key]: value });
  };

  return (
    <div className="glass rounded-xl p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
          <Settings2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">SMOTE Parameters</h3>
          <p className="text-sm text-muted-foreground">Configure generation settings</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* K Neighbors */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-foreground flex items-center gap-2">
              <Layers className="w-4 h-4 text-muted-foreground" />
              K Neighbors
            </Label>
            <span className="text-sm font-mono text-primary">{parameters.k_neighbors}</span>
          </div>
          <Slider
            value={[parameters.k_neighbors]}
            onValueChange={([value]) => updateParam('k_neighbors', value)}
            min={1}
            max={15}
            step={1}
            className="w-full"
          />
        </div>

        {/* Sampling Strategy */}
        <div className="space-y-3">
          <Label className="text-sm text-foreground flex items-center gap-2">
            <Zap className="w-4 h-4 text-muted-foreground" />
            Sampling Strategy
          </Label>
          <Select
            value={parameters.sampling_strategy}
            onValueChange={(value) => updateParam('sampling_strategy', value)}
          >
            <SelectTrigger className="bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="minority">Minority Only</SelectItem>
              <SelectItem value="not_majority">Not Majority</SelectItem>
              <SelectItem value="all">All Classes</SelectItem>
              <SelectItem value="auto">Auto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Decoder Type */}
        <div className="space-y-3">
          <Label className="text-sm text-foreground flex items-center gap-2">
            <Shield className="w-4 h-4 text-muted-foreground" />
            Decoder Architecture
          </Label>
          <Select
            value={parameters.decoder_type}
            onValueChange={(value) => updateParam('decoder_type', value)}
          >
            <SelectTrigger className="bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="autoencoder">Autoencoder</SelectItem>
              <SelectItem value="vae">Variational AE</SelectItem>
              <SelectItem value="gan">GAN</SelectItem>
              <SelectItem value="diffusion">Diffusion Model</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Toggle Options */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-foreground">Semantic Clustering</Label>
            <Switch
              checked={parameters.clustering_enabled}
              onCheckedChange={(checked) => updateParam('clustering_enabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm text-foreground">Outlier Detection</Label>
            <Switch
              checked={parameters.outlier_detection}
              onCheckedChange={(checked) => updateParam('outlier_detection', checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
