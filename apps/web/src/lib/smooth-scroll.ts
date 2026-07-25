/**
 * Smooth scroll to an element by ID
 * @param elementId - The ID of the element to scroll to
 * @param duration - The duration of the scroll animation in milliseconds (default: 800ms)
 */
export function smoothScrollToId(elementId: string, duration: number = 800) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const targetPosition = element.getBoundingClientRect().top + window.scrollY;
  const startPosition = window.scrollY;
  const distance = targetPosition - startPosition;
  let start: number | null = null;

  // Use requestAnimationFrame for smooth animation
  const animation = (currentTime: number) => {
    if (start === null) start = currentTime;
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function: easeInOutCubic for natural motion
    const easeProgress =
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    window.scrollTo(0, startPosition + distance * easeProgress);

    if (progress < 1) {
      requestAnimationFrame(animation);
    }
  };

  requestAnimationFrame(animation);
}
