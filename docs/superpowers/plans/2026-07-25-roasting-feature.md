# Roasting Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement an interactive AI roasting screen using Vercel AI SDK and OpenRouter when users click "Tetap Beli".

**Architecture:** We will use `streamText` from `@ai-sdk/openai` in a Next.js App Router API route to stream a custom prompt response to a Client Component (`useCompletion`).

**Tech Stack:** Next.js 15 App Router, React, Tailwind CSS, Vercel AI SDK, OpenRouter.

## Global Constraints
- Use OpenRouter base URL (`https://openrouter.ai/api/v1`)
- Rely on `@ai-sdk/openai` with custom fetch/baseURL.

---

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

**Interfaces:**
- Consumes: N/A
- Produces: `ai` and `@ai-sdk/openai` packages in `node_modules`

- [ ] **Step 1: Install Vercel AI SDK packages**
```bash
npm install ai @ai-sdk/openai
```

- [ ] **Step 2: Verify installation**
```bash
npm ls ai @ai-sdk/openai
```

- [ ] **Step 3: Commit**
```bash
git add package.json package-lock.json
git commit -m "chore: add vercel ai sdk dependencies"
```

---

### Task 2: Implement API Route for Streaming

**Files:**
- Create: `app/api/roast/route.ts`

**Interfaces:**
- Consumes: `OPENROUTER_API_KEY` and `LLM_MODEL` from `.env.local`
- Produces: API endpoint `POST /api/roast` accepting `{ item_name, item_price, intent_description }`

- [ ] **Step 1: Write the API route code**
```typescript
import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

// Create a custom provider for OpenRouter
const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { item_name, item_price, intent_description } = await req.json();

    const systemPrompt = `Kamu adalah asisten keuangan yang sangat sarkastik, tajam, namun lucu. 
Pengguna baru saja memaksa membeli barang impulsif ini meskipun sudah diminta jeda 90 detik.
Barang: ${item_name}
Harga: Rp ${item_price}
Alasan: ${intent_description}

Tugasmu: Berikan 'roasting' (sindiran keras) sepanjang maksimal 3 kalimat agar dia merasa sedikit bersalah tapi terhibur. Jangan gunakan emoji. Gunakan bahasa Indonesia gaul/kasual.`;

    const modelName = process.env.LLM_MODEL || 'deepseek/deepseek-v4-flash';

    const result = streamText({
      model: openrouter(modelName),
      system: systemPrompt,
      messages: [
        { role: 'user', content: 'Roast saya sekarang!' }
      ],
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('API Error:', error);
    return new Response('Error connecting to AI', { status: 500 });
  }
}
```

- [ ] **Step 2: Commit**
```bash
git add app/api/roast/route.ts
git commit -m "feat(api): add streaming roast api route"
```

---

### Task 3: Implement Client UI Component (RoastStream)

**Files:**
- Create: `app/(app)/pause/[id]/roast/RoastStream.tsx`

**Interfaces:**
- Consumes: `/api/roast` endpoint
- Produces: `<RoastStream />` component

- [ ] **Step 1: Create the component code**
```typescript
'use client';

import { useCompletion } from 'ai/react';
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
        <h2 className="text-2xl font-bold text-destructive">Momen Hening...</h2>
        <p className="text-muted-foreground text-sm">Pembelianmu tercatat, tapi AI punya pesan untukmu:</p>
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
          <Button size="lg" className="w-full sm:w-auto">
            Akhiri Penderitaan (Kembali ke Beranda)
          </Button>
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**
```bash
git add app/\(app\)/pause/\[id\]/roast/RoastStream.tsx
git commit -m "feat(ui): add RoastStream client component"
```

---

### Task 4: Implement Server Page for Roasting

**Files:**
- Create: `app/(app)/pause/[id]/roast/page.tsx`

**Interfaces:**
- Consumes: `getPauseSessionById` from `modules/pause/queries`, `<RoastStream />`
- Produces: Route `/pause/[id]/roast`

- [ ] **Step 1: Write the server component code**
```typescript
import { notFound } from 'next/navigation';
import { getPauseSessionById } from '@/modules/pause/queries';
import { RoastStream } from './RoastStream';

export default async function RoastPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const session = await getPauseSessionById(resolvedParams.id);

  if (!session) {
    notFound();
  }

  // Fallback to empty string if some fields are missing
  const itemName = session.item_name || 'Barang Misterius';
  const itemPrice = session.item_price || 0;
  const intentDesc = session.intent_description || 'Hanya lapar mata';

  return (
    <div className="container py-12 flex-1 flex flex-col">
      <RoastStream 
        pauseId={session.id}
        itemName={itemName}
        itemPrice={itemPrice}
        intentDescription={intentDesc}
      />
    </div>
  );
}
```

- [ ] **Step 2: Commit**
```bash
git add app/\(app\)/pause/\[id\]/roast/page.tsx
git commit -m "feat(ui): add server page for roasting"
```

---

### Task 5: Update Redirection Logic

**Files:**
- Modify: `modules/pause/actions.ts:completePauseAction`

**Interfaces:**
- Consumes: `completePauseAction`
- Produces: Redirect to `/pause/${id}/roast` on buy decision

- [ ] **Step 1: Modify `completePauseAction`**
Modify `modules/pause/actions.ts` around line 170.
Change the redirect when `data.decision === 'buy'`.
```typescript
// Replace this:
if (data.decision === 'buy') {
  redirect('/home');
} else {
  redirect('/home');
}

// With this:
if (data.decision === 'buy') {
  redirect(`/pause/${id}/roast`);
} else {
  redirect('/home');
}
```

- [ ] **Step 2: Run type check**
```bash
npm run typecheck
```

- [ ] **Step 3: Commit**
```bash
git add modules/pause/actions.ts
git commit -m "feat(pause): redirect to roast screen on buy decision"
```
