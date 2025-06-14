"use client";

import { useState } from 'react';
import type { FormEvent } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Download } from 'lucide-react';

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
        description: "Please enter a valid URL.",
      });
      return;
    }

    setIsLoading(true);
    setQrCodeUrl(null);

    try {
      const response = await fetch('https://qr-api.onrender.com/generate_qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        // Try to parse error message from backend, otherwise use generic message
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          // Failed to parse JSON, use status text or generic message
          errorMessage = response.statusText || "An unknown error occurred while processing the request.";
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (data && data.file_url) {
        setQrCodeUrl(`https://qr-api.onrender.com${data.file_url}`);
      } else {
        throw new Error("QR code URL not found in response.");
      }
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to generate QR code",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="text-center text-3xl font-headline font-semibold text-primary">Generate Your QR Code</CardTitle>
        <CardDescription className="text-center text-foreground/70">
          Enter a URL below to create a custom QR code instantly.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="url-input" className="sr-only">Enter URL</label>
            <Input
              id="url-input"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="text-base h-12 px-4 focus:ring-primary focus:border-primary"
              aria-label="URL to encode"
              aria-describedby="url-helper-text"
            />
            <p id="url-helper-text" className="text-xs text-muted-foreground px-1">
              e.g., https://www.yourwebsite.com
            </p>
          </div>
          <Button
            type="submit"
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-3 h-12 font-medium rounded-md shadow-md transition-all duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
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
          <div className="mt-8 flex flex-col items-center p-6 border border-dashed border-primary/30 rounded-lg bg-primary/5 shadow-inner">
            <p className="text-md text-primary font-semibold mb-3">Your QR Code is ready!</p>
            <div className="p-2 bg-white rounded-md inline-block shadow-lg">
              <Image
                src={qrCodeUrl}
                alt="Generated QR Code"
                width={220} 
                height={220}
                className="rounded-sm" 
                priority 
              />
            </div>
             <a
              href={qrCodeUrl}
              download="qr-code.png"
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-150"
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
