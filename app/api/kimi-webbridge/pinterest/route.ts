import { NextRequest, NextResponse } from "next/server";

const WEBBRIDGE_URL = "http://127.0.0.1:10086/command";

async function command(
  session: string,
  action: string,
  args: Record<string, unknown> = {}
) {
  const response = await fetch(WEBBRIDGE_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ action, args, session }),
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok)
    throw new Error(`Kimi WebBridge returned ${response.status}`);

  const envelope = await response.json();
  if (envelope?.ok === false) {
    throw new Error(envelope.error?.message || "Kimi WebBridge command failed");
  }
  return envelope.data;
}

export async function POST(request: NextRequest) {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.KIMI_WEBBRIDGE_ENABLED !== "true"
  ) {
    return NextResponse.json(
      { success: false, error: "Kimi WebBridge is not enabled" },
      { status: 404 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const query = String(body.query || "")
    .trim()
    .slice(0, 180);
  const limit = Math.min(Math.max(Number(body.limit) || 12, 1), 30);
  if (!query) {
    return NextResponse.json(
      { success: false, error: "A Pinterest search query is required" },
      { status: 400 }
    );
  }

  const session = `genit-template-grid-${Date.now()}`;
  try {
    await command(session, "navigate", {
      url: `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}&rs=typed`,
      newTab: true,
      group_title: "Genit inspiration search",
    });
    const result = await command(session, "evaluate", {
      code: `(async () => {
        for (let i = 0; i < 5; i++) {
          window.scrollTo(0, document.body.scrollHeight);
          await new Promise(resolve => setTimeout(resolve, 1200));
        }
        const pins = Array.from(document.querySelectorAll('img[src*="pinimg"]'))
          .map((img, index) => {
            const card = img.closest('[data-test-id="pinWrapper"]');
            const link = card?.querySelector('a[href*="/pin/"]');
            let image = img.currentSrc || img.src || img.dataset.src || '';
            image = image.replace(/\\/(?:75x75|236x|474x|564x)\\//, '/736x/');
            const url = link?.href || '';
            const id = url.match(/\\/pin\\/(\\d+)/)?.[1] || image.split('/').pop()?.split('.')[0] || 'pin-' + index;
            return { id, image, alt: img.alt || img.title || 'Pinterest design', url };
          })
          .filter(pin => pin.image.startsWith('http') && pin.url.includes('/pin/'));
        return JSON.stringify(Array.from(new Map(pins.map(pin => [pin.image, pin])).values()).slice(0, ${limit}));
      })()`,
    });

    return NextResponse.json({
      success: true,
      pins: JSON.parse(result.value || "[]"),
      query,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Kimi WebBridge search failed",
      },
      { status: 503 }
    );
  } finally {
    await command(session, "close_session").catch(() => {});
  }
}
