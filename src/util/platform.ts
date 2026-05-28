/**
 * iOS Safari detection (not iOS Chrome/Firefox, which use WebKit but
 * advertise themselves with CriOS / FxiOS tokens).
 *
 * The print → PDF flow on iOS Safari requires the user to pinch-out on the
 * print preview, then share → save to files; explain this in a modal before
 * triggering window.print().
 */
export function isIOSSafari(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isWebKit = /WebKit/.test(ua);
  const isWrappedBrowser = /CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
  return isIOS && isWebKit && !isWrappedBrowser;
}
