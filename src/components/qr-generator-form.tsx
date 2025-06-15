
"use client";

import { useState } from 'react';
import type { FormEvent } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Download, Link as LinkIcon, AlertCircle } from 'lucide-react';

const API_BASE_URL = 'https://qrcode-microservice.onrender.com';

export function QrGeneratorForm() {
  const [url, setUrl] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!url.trim()) {
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please enter a valid URL to generate a QR code.",
        duration: 5000,
      });
      return;
    }

    let validatedUrl = url;
    try {
      // Basic URL validation with protocol addition
      if (!/^https?:\/\//i.test(url)) {
        validatedUrl = `https://${url}`;
      }
      // Test if it's a valid URL structure
      new URL(validatedUrl);
    } catch (_) {
      toast({
        variant: "destructive",
        title: "Invalid URL Format",
        description: "Please enter a URL in a valid format (e.g., https://example.com).",
        duration: 5000,
      });
      return;
    }

    setIsLoading(true);
    setQrCodeUrl(null);

    try {
      const response = await fetch(`${API_BASE_URL}/generate_qr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ url: validatedUrl }),
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData && errorData.detail) {
             // Handle cases where the error might be in errorData.detail
            errorMessage = typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail);
          }
        } catch (e) {
          // If parsing errorData fails, use the statusText or a generic message
          errorMessage = response.statusText || "An unknown error occurred while processing the request.";
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (data && data.file_url) {
        setQrCodeUrl(`${API_BASE_URL}${data.file_url}`);
        setUrl(''); // Clear input after successful generation
        toast({
            title: "QR Code Generated!",
            description: "Your QR code is ready to be downloaded.",
            duration: 3000,
        });
      } else {
        throw new Error("QR code URL not found in response. The API might have changed.");
      }
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "QR Generation Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-xl rounded-xl border-border/60 bg-card/80 backdrop-blur-sm">
      <CardHeader className="p-6 sm:p-8">
        <CardTitle className="text-center text-2xl sm:text-3xl font-headline font-semibold text-primary">Generate Your QR Code</CardTitle>
        <CardDescription className="text-center text-foreground/70 pt-1 text-sm sm:text-base">
          Paste a URL below to create your custom QR code instantly.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 sm:p-8 pt-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative space-y-2">
            <label htmlFor="url-input" className="sr-only">Enter URL</label>
            <div className="relative flex items-center">
              <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground peer-focus-within:text-primary transition-colors" />
              <Input
                id="url-input"
                type="url" 
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="text-base h-12 pl-11 pr-4 w-full focus:ring-primary focus:border-primary hover:border-primary/70 transition-colors peer rounded-lg shadow-sm border-border/50 focus:shadow-md"
                aria-label="URL to encode"
                aria-describedby="url-helper-text url-error-text"
                aria-invalid={!url.trim() ? undefined : (!/^https?:\/\/.*/i.test(url) && !/^[^:]+:\/\//i.test(`https://${url}`)) || !isValidHttpUrl(url) ? "true" : "false"}
              />
            </div>
            <p id="url-helper-text" className="text-xs text-muted-foreground px-1">
              Enter the full URL, e.g., https://yourwebsite.com
            </p>
          </div>
          <Button
            type="submit"
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-3 h-12 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent active:scale-[1.00]"
            disabled={isLoading}
            aria-live="polite" // Already polite for loading state
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate QR Code'
            )}
          </Button>
        </form>
        
        {qrCodeUrl && !isLoading && (
          <div 
            className="mt-8 flex flex-col items-center p-4 sm:p-6 rounded-xl bg-muted/40 shadow-inner"
            aria-live="polite" 
            aria-atomic="true"
          >
            <p className="text-md text-primary font-medium mb-4">Your QR Code is Ready!</p>
            <div className="p-2 bg-white rounded-lg inline-block shadow-lg w-full max-w-[180px] sm:max-w-[220px] md:max-w-[250px] mx-auto aspect-square">
              <Image
                src={qrCodeUrl}
                alt="Generated QR Code for the entered URL"
                width={250} 
                height={250}
                className="rounded-md w-full h-auto object-contain" 
                priority 
                unoptimized={process.env.NODE_ENV === 'development'} // Useful for external dynamic images
              />
            </div>
             <a
              href={qrCodeUrl}
              download={`qr-code-${new URL(qrCodeUrl).pathname.split('/').pop()?.split('.')[0] || 'generated'}.png`}
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-150 ease-in-out hover:shadow-md transform hover:scale-105 active:scale-100"
              aria-label="Download the generated QR Code image"
            >
              <Download className="mr-2 h-5 w-5" />
              Download QR
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper function for basic URL validation (client-side convenience)
function isValidHttpUrl(string: string) {
  let url;
  try {
    // Add protocol if missing for the URL constructor to work
    const toValidate = (!/^https?:\/\//i.test(string)) ? `https://${string}` : string;
    url = new URL(toValidate);
  } catch (_) {
    return false;  
  }
  return url.protocol === "http:" || url.protocol === "https:";
}
