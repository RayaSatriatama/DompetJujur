'use client';

import { useCompletion } from '@ai-sdk/react';
import { useEffect, useState, useRef } from 'react';

interface ReflectionStreamProps {
  outcome: string;
  reflectionCode: string;
  fallbackText: React.ReactNode;
}

export function ReflectionStream({ outcome, reflectionCode, fallbackText }: ReflectionStreamProps) {
  const [hasError, setHasError] = useState(false);

  const { completion, isLoading, complete } = useCompletion({
    api: '/api/ai/summary',
    onError: (error) => {
      console.error('AI Stream Error:', error);
      setHasError(true);
    },
  });

  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    // Start generating automatically on mount
    complete('', {
      body: { outcome, reflectionCode }
    }).catch(() => {
      setHasError(true);
    });
  }, [complete, outcome, reflectionCode]);

  // If streaming failed, show the fallback text
  if (hasError) {
    return (
      <>
        {fallbackText}
      </>
    );
  }

  // Determine if it's still generating but no text yet
  if (isLoading && !completion) {
    return (
      <div className="flex items-center space-x-2 animate-pulse text-muted-foreground mt-4">
        <div className="w-1.5 h-1.5 bg-primary/40 rounded-full"></div>
        <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animation-delay-200"></div>
        <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animation-delay-400"></div>
        <span className="text-sm">Menyiapkan catatan...</span>
      </div>
    );
  }

  // Show the streamed text or fallbackText if empty
  const textContent = completion || null;

  if (!textContent) {
    return <div className="text-sm lg:text-base text-foreground leading-relaxed pt-2">{fallbackText}</div>;
  }

  return (
    <p className="text-sm lg:text-base text-foreground leading-relaxed pt-2">
      {textContent}
      {isLoading && (
        <span className="inline-block w-1.5 h-4 ml-1 bg-primary/60 animate-pulse align-middle"></span>
      )}
    </p>
  );
}
