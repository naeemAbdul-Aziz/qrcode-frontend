import { QrGeneratorForm } from '@/components/qr-generator-form';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 py-12 sm:p-8 md:p-12 bg-gradient-to-br from-background to-secondary">
      <div className="w-full max-w-xl mx-auto">
        <header className="mb-8 sm:mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold text-primary tracking-tight">
            QR Code Generator
          </h1>
          <p className="mt-4 text-md sm:text-lg text-foreground/80 max-w-md mx-auto">
            Enter any URL to generate a QR code instantly. Simple, fast, and free.
          </p>
        </header>
        <QrGeneratorForm />
        <footer className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Powered by Next.js & ShadCN UI.
          </p>
        </footer>
      </div>
    </main>
  );
}
