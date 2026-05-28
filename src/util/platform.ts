/**
 * iOS Safari detection — includes iPadOS 13+ which advertises itself as
 * Macintosh and is only distinguishable via `navigator.maxTouchPoints`.
 *
 * Excludes WebKit-wrapped third-party browsers on iOS (Chrome/Firefox/Edge/Opera).
 */
export function isIOSSafari(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;

  const isClassicIOS = /iPad|iPhone|iPod/.test(ua);
  const isIPadOSAsMac =
    /Mac/.test(ua) && typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 1;
  const isIOS = isClassicIOS || isIPadOSAsMac;

  const isWebKit = /WebKit/.test(ua);
  const isWrappedBrowser = /CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);

  return isIOS && isWebKit && !isWrappedBrowser;
}
