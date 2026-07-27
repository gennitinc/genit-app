const SPLINE_URL =
  "https://my.spline.design/genkubgreetingrobot-ojzcjWInavuKpZSt2luvgvjl/";

const fallbackHtml = `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <style>html,body,iframe{width:100%;height:100%;margin:0;border:0;overflow:hidden;background:transparent}</style>
  </head>
  <body>
    <iframe title="Interactive 3D robot" src="${SPLINE_URL}" allow="fullscreen" onload="parent.postMessage({type:'spline-robot-ready'},'*')"></iframe>
  </body>
</html>`;

function fallbackResponse() {
  return new Response(fallbackHtml, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export async function GET() {
  let response: Response;
  try {
    response = await fetch(SPLINE_URL, {
      next: { revalidate: 86_400 },
      signal: AbortSignal.timeout(8_000),
    });
  } catch {
    return fallbackResponse();
  }

  if (!response.ok) {
    return fallbackResponse();
  }

  const html = (await response.text())
    .replace(
      "</head>",
      `<style>html,body,canvas{background:#fff!important}@media(prefers-color-scheme:dark){html,body,canvas{background:#000!important}}.spline-watermark{display:none!important}</style>
       <script>addEventListener("wheel",event=>{event.stopImmediatePropagation();parent.scrollBy({top:event.deltaY})},{capture:true,passive:true})</script></head>`
    )
    .replace(
      "const onLoad = () => {",
      `const onLoad = () => {
        const syncBackground = () => {
          const dark = parent.document.documentElement.classList.contains("dark");
          const color = dark ? "#000000" : "#ffffff";
          app._renderer?.setBackgroundDisabled(false);
          app.setBackgroundColor(color);
          document.documentElement.style.setProperty("background", color, "important");
          document.body.style.setProperty("background", color, "important");
          canvas.style.setProperty("background", color, "important");
        };
        syncBackground();
        new MutationObserver(syncBackground).observe(parent.document.documentElement, {
          attributes: true,
          attributeFilter: ["class"],
        });
        parent.postMessage({ type: "spline-robot-ready" }, "*");`
    );

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
