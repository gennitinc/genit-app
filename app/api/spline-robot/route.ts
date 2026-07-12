const SPLINE_URL =
  "https://my.spline.design/genkubgreetingrobot-ojzcjWInavuKpZSt2luvgvjl/";

export async function GET() {
  const response = await fetch(SPLINE_URL, { next: { revalidate: 86_400 } });

  if (!response.ok) {
    return new Response("Unable to load the 3D scene", { status: 502 });
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
        });`
    );

  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
