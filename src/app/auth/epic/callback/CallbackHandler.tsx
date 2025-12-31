'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function CallbackHandler() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const handleCallback = () => {
      try {
        // Get the authorization code from URL parameters
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error) {
          setStatus('error');
          setErrorMessage(errorDescription || error);
          return;
        }

        if (!code) {
          setStatus('error');
          setErrorMessage('No authorization code received');
          return;
        }

        // Redirect to the Flutter app with the authorization code
        const appScheme = `com.backlog.backlogr://auth/epic?code=${encodeURIComponent(code)}`;

        // Try to redirect to the app
        window.location.href = appScheme;

        setStatus('success');

        // Fallback: close the window after a short delay if app doesn't open
        setTimeout(() => {
          window.close();
        }, 2000);
      } catch (err) {
        setStatus('error');
        setErrorMessage('An unexpected error occurred');
        console.error('Auth callback error:', err);
      }
    };

    handleCallback();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="text-center space-y-4">
          {status === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
              <h1 className="text-2xl font-bold">Authenticating...</h1>
              <p className="text-muted-foreground">
                Redirecting you back to Backlogr
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="text-green-500 text-6xl">✓</div>
              <h1 className="text-2xl font-bold">Success!</h1>
              <p className="text-muted-foreground">
                Opening Backlogr app...
              </p>
              <p className="text-sm text-muted-foreground">
                If the app doesn&apos;t open automatically, you can close this window.
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="text-red-500 text-6xl">✕</div>
              <h1 className="text-2xl font-bold">Authentication Failed</h1>
              <p className="text-muted-foreground">
                {errorMessage}
              </p>
              <button
                onClick={() => window.close()}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Close Window
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
