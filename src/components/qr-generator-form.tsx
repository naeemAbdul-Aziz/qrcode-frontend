
"use client";

import { useState } from 'react';
import type { FormEvent } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Download, Link as LinkIcon } from 'lucide-react';

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
      });
      return;
    }

    let validatedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      validatedUrl = `https://${url}`;
    }


    setIsLoading(true);
    setQrCodeUrl(null);

    try {
      const response = await fetch(`${API_BASE_URL}/generate_qr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: validatedUrl }),
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          errorMessage = response.statusText || "An unknown error occurred while processing the request.";
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (data && data.file_url) {
        setQrCodeUrl(`${API_BASE_URL}${data.file_url}`);
        setUrl(''); // Clear input after successful generation
      } else {
        throw new Error("QR code URL not found in response.");
      }
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "QR Generation Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-lg rounded-xl">
      <CardHeader className="p-6 sm:p-8">
        <CardTitle className="text-center text-2xl sm:text-3xl font-headline font-semibold text-primary">Generate Your QR Code</CardTitle>
        <CardDescription className="text-center text-foreground/70 pt-1">
          Paste a URL below to create your custom QR code.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 sm:p-8 pt-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative space-y-2">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground peer-focus:text-primary transform -mt-2.5" />
            <label htmlFor="url-input" className="sr-only">Enter URL</label>
            <Input
              id="url-input"
              type="text" // Changed to text to allow URLs without http/https for easier UX
              placeholder="www.example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="text-base h-12 px-10 focus:ring-primary focus:border-primary hover:border-primary/70 transition-colors peer"
              aria-label="URL to encode"
              aria-describedby="url-helper-text"
            />
            <p id="url-helper-text" className="text-xs text-muted-foreground px-1">
              Enter the full URL, e.g., https://yourwebsite.com
            </p>
          </div>
          <Button
            type="submit"
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-3 h-12 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
            disabled={isLoading}
            aria-live="polite"
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
          <div className="mt-8 flex flex-col items-center p-4 sm:p-6 rounded-xl bg-muted/30 shadow-inner">
            <p className="text-md text-primary font-medium mb-4">Your QR Code is Ready!</p>
            <div className="p-2 bg-white rounded-lg inline-block shadow-lg w-full max-w-[180px] sm:max-w-[220px] mx-auto">
              <Image
                src={qrCodeUrl}
                alt="Generated QR Code"
                width={220} 
                height={220}
                className="rounded-md w-full h-auto" 
                priority 
              />
            </div>
             <a
              href={qrCodeUrl}
              download="qr-code.png"
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-150 ease-in-out hover:shadow-md transform hover:scale-105"
              aria-label="Download QR Code"
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
