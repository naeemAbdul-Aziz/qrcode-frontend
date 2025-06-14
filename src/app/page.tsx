import { QrGeneratorForm } from '@/components/qr-generator-form';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-background selection:bg-primary/20 selection:text-primary">
      <div className="w-full max-w-lg mx-auto">
        <header className="mb-8 sm:mb-10 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-extrabold text-primary tracking-tight">
            QR Swift
          </h1>
          <p className="mt-3 text-md sm:text-lg text-foreground/80 max-w-md mx-auto">
            Instantly generate and download QR codes for your URLs with ease.
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
