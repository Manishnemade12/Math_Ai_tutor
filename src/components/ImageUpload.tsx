
import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { toast } from '../components/ui/use-toast';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  onImageUploaded: (imageData: string, file: File) => void;
  isProcessing: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUploaded, isProcessing }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      const imageData = reader.result as string;
      setPreviewUrl(imageData);
      onImageUploaded(imageData, file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };
  
  const clearImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const triggerFileInput = () => {
    if (isProcessing) {
      toast({
        title: "Please wait",
        description: "I'm still processing your last request",
        variant: "default"
      });
      return;
    }
    
    fileInputRef.current?.click();
  };
  
  return (
    <div className="flex items-end">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
      
      {previewUrl ? (
        <div className="relative">
          <img 
            src={previewUrl} 
            alt="Uploaded math problem" 
            className="max-w-[120px] max-h-[60px] rounded-lg object-contain" 
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={clearImage}
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background border shadow-sm hover:bg-destructive hover:text-destructive-foreground"
            aria-label="Remove image"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <Button
          onClick={triggerFileInput}
          disabled={isProcessing}
          variant="outline"
          size="icon"
          className="mb-[2px]"
          aria-label="Upload image"
        >
          <Upload className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default ImageUpload;
