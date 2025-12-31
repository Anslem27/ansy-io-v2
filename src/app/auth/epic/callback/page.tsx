import { Suspense } from 'react';
import CallbackHandler from './CallbackHandler';

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <h1 className="text-2xl font-bold">Loading...</h1>
        </div>
      </div>
    </div>
  );
}

export default function EpicAuthCallback() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CallbackHandler />
    </Suspense>
  );
}
