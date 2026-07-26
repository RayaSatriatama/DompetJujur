'use client';

import { useCompletion } from '@ai-sdk/react';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function RoastStream({
  pauseId,
  itemName,
  itemPrice,
  intentDescription,
}: {
  pauseId: string;
  itemName: string;
  itemPrice: number;
  intentDescription: string;
}) {
  const { completion, complete, isLoading, error } = useCompletion({
    api: '/api/roast',
  });
  
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!hasStarted.current) {
      hasStarted.current = true;
      complete('', {
        body: {
          item_name: itemName,
          item_price: itemPrice,
          intent_description: intentDescription,
        }
      });
    }
  }, [complete, itemName, itemPrice, intentDescription]);

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center min-h-[50vh] text-center space-y-8 p-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Satu pesan terakhir.</h2>
        <p className="text-muted-foreground text-sm">Tarik napas sebentar sambil membaca ini:</p>
      </div>

      <div className="min-h-[120px] bg-muted/50 rounded-lg p-6 w-full relative">
        {error ? (
          <p className="text-red-500 italic">Koneksi ke AI terputus. Anggap saja ini teguran dari alam semesta. Uangmu tetap berkurang.</p>
        ) : (
          <p className="text-lg leading-relaxed text-foreground whitespace-pre-wrap">
            {completion || (isLoading ? 'AI sedang bersiap-siap meroasting...' : '')}
            {isLoading && <span className="inline-block ml-1 w-2 h-4 bg-foreground animate-pulse" />}
          </p>
        )}
      </div>

      <div className={`transition-opacity duration-1000 ${isLoading && !error ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <Link href="/home">
          <Button size="lg" className="w-full sm:w-auto px-8 rounded-xl">
            Kembali ke Beranda
          </Button>
        </Link>
      </div>
    </div>
  );
}
