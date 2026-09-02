export function createYoutubeTimeline<T extends { durationSeconds: number }>(
  scenes: T[]
) {
  let cursor = 0;
  return scenes.map((scene) => {
    const start = cursor;
    cursor += Math.max(1, scene.durationSeconds || 1);
    return { scene, start, end: cursor };
  });
}
