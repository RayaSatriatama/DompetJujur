# LLM Roasting Feature Design

## Purpose
To provide an interactive, slightly sarcastic "roasting" experience when users decide to proceed with an impulsive purchase after the 90-second pause. This creates a memorable and engaging UX.

## User Flow
1. User completes the 90-second pause.
2. User clicks "Tetap Beli" on the decision page.
3. The system records the purchase as `completed_purchased`.
4. User is redirected to `/pause/[id]/roast`.
5. The roasting message is streamed word-by-word on the screen using Vercel AI SDK.
6. User clicks "Kembali ke Beranda" after reading to return to `/home`.

## Architecture & Integration
### 1. Dependencies
- `@ai-sdk/openai`: Custom provider configuration for OpenRouter.
- `ai`: Vercel AI SDK for `useCompletion` or `streamText`.

### 2. Backend (API Route)
- **Path**: `app/api/roast/route.ts`
- **Method**: POST
- **Input Payload**: `{ pauseId, itemName, itemPrice, intentDescription }`
- **Logic**:
  - Validates the environment variables (`OPENROUTER_API_KEY` and `LLM_MODEL`).
  - Configures the OpenAI provider with OpenRouter's baseURL (`https://openrouter.ai/api/v1`).
  - Prepares the system prompt with the item context to generate a sarcastic roasting message (max 3 sentences).
  - Streams the response back to the client using `streamText` and `toDataStreamResponse()`.

### 3. Frontend (UI)
- **Page**: `app/(app)/pause/[id]/roast/page.tsx` (Server Component)
  - Fetches the pause session detail using `getPauseSessionById` to retrieve the `item_name`, `item_price`, and `intent_description`.
  - Passes these details to the `RoastStream` Client Component.
- **Component**: `RoastStream.tsx` (Client Component)
  - Uses `useCompletion` from `ai/react` to initiate the streaming request to `/api/roast`.
  - Automatically triggers the API call on mount.
  - Displays the streamed text.
  - Displays a "Kembali ke Beranda" button (perhaps disabled or faded until the stream is complete, to encourage reading).

### 4. Updates to Existing Modules
- **`modules/pause/actions.ts`**: Update the redirect logic inside `completePauseAction` when `decision === 'buy'` to redirect to `/pause/${id}/roast` instead of `/home`.

## Error Handling
- If the AI stream fails (due to timeout or missing API keys), the UI should display a generic fallback message: "Koneksi ke AI terputus. Anggap saja ini teguran dari alam semesta. Uangmu tetap berkurang."
- The "Kembali ke Beranda" button must always be available to prevent users from getting stuck.

## Out of Scope
- Voice synthesis for roasting (text only).
- Storing the generated roasting text into the database (it's ephemeral).
