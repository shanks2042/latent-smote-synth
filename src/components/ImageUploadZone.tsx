import React, { useCallback, useState } from 'react';
import { Upload, Image, X, FileImage } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadZoneProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
}

export const ImageUploadZone: React.FC<ImageUploadZoneProps> = ({
  files,
  onFilesChange,
  maxFiles = 10,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    );
    
    const newFiles = [...files, ...droppedFiles].slice(0, maxFiles);
    onFilesChange(newFiles);
  }, [files, maxFiles, onFilesChange]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(file =>
        file.type.startsWith('image/')
      );
      const newFiles = [...files, ...selectedFiles].slice(0, maxFiles);
      onFilesChange(newFiles);
    }
  }, [files, maxFiles, onFilesChange]);

  const removeFile = useCallback((index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  }, [files, onFilesChange]);

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "upload-zone relative rounded-xl p-8 text-center cursor-pointer transition-all duration-300",
          isDragging && "upload-zone-active"
        )}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="flex flex-col items-center gap-4">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300",
            isDragging ? "bg-primary/20 scale-110" : "bg-secondary"
          )}>
            <Upload className={cn(
              "w-8 h-8 transition-colors duration-300",
              isDragging ? "text-primary" : "text-muted-foreground"
            )} />
          </div>
          
          <div>
            <p className="text-foreground font-medium">
              Drop your images here
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or click to browse • Max {maxFiles} files
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <FileImage className="w-4 h-4" />
            <span>PNG, JPG, WEBP supported</span>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {files.map((file, index) => (
            <div
              key={index}
              className="relative group rounded-lg overflow-hidden bg-secondary aspect-square animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <button
                  onClick={() => removeFile(index)}
                  className="p-2 rounded-full bg-destructive/20 hover:bg-destructive/40 transition-colors"
                >
                  <X className="w-5 h-5 text-destructive" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-background/90 to-transparent">
                <p className="text-xs text-foreground truncate font-mono">
                  {file.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
