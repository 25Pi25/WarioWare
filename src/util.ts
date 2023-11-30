export const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));
export const delayF = (frames = 1) => new Promise<void>(resolve => {
  function checkFrames() {
    if (!--frames) resolve();
    else requestAnimationFrame(checkFrames);
  }
  requestAnimationFrame(checkFrames);
});