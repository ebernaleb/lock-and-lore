'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Height clipped from the bottom of the OTC iframe to hide the grey footer padding.
 *
 * The OTC hosted page includes a grey-background footer area at the bottom of every
 * step. The size varies by step -- the review/final step (step 5) has the largest
 * grey area. We clip generously to cover the worst case.
 *
 * How it works:
 *   - The iframe element gets the FULL height reported by OTC via postMessage.
 *   - The container div gets overflow:hidden + maxHeight = fullHeight - CLIP.
 *   - This renders all iframe content correctly but hides the grey bottom region.
 */
const IFRAME_BOTTOM_CLIP_PX = 0;

/**
 * OTCBookingEmbed
 *
 * Renders the Off The Couch hosted booking iframe for Lock & Lore.
 *
 * The embed communicates via postMessage for:
 *   - Dynamic height adjustment (no scroll inside iframe)
 *   - Scroll-to-top when steps change
 *   - Google Analytics events (page_view, add_to_cart, begin_checkout, purchase, success)
 *
 * The iframe src includes any query string parameters from the current page URL,
 * allowing deep-linking to specific games or dates.
 */
export default function OTCBookingEmbed() {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  // iframeHeight stores the FULL height from OTC (not clipped)
  const [iframeHeight, setIframeHeight] = useState<number>(1800);
  const [isLoading, setIsLoading] = useState(true);
  const [hasReceivedHeight, setHasReceivedHeight] = useState(false);
  const mountedRef = useRef(false);
  const hasReceivedHeightRef = useRef(false);

  /**
   * Find the Y position of the container element (used for scroll-to-top).
   */
  const findPosY = useCallback((element: HTMLElement | null): number => {
    let top = 0;
    if (!element) return top;

    if (element.offsetParent) {
      let el: HTMLElement | null = element;
      while (el && el.offsetParent) {
        top += el.offsetTop;
        el = el.offsetParent as HTMLElement;
      }
    } else if ('y' in element) {
      top += (element as unknown as { y: number }).y;
    }
    return top;
  }, []);

  /**
   * Insert Google Analytics script if an ID is provided by the iframe.
   */
  const insertGoogleAnalyticsScript = useCallback((id: string) => {
    if (!id) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    win.dataLayer = win.dataLayer || [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function gtag(...args: any[]) {
      win.dataLayer.push(args);
    }

    if (!win.gtag) {
      const script = document.createElement('script');
      script.async = true;
      script.onload = () => {
        win.gtag = gtag;
        gtag('js', new Date());
        gtag('config', id);
      };
      script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
      document.head.appendChild(script);
    }

    gtag('event', 'page_view');
  }, []);

  useEffect(() => {
    // Prevent double-mounting in React 18 StrictMode
    if (mountedRef.current) return;
    mountedRef.current = true;

    // Build the iframe src with current page query params
    const queryString = window.location.search;
    const iframeSrc = `https://offthecouch.io/book/lockandlore${queryString}`;

    // Create the iframe element
    const iframe = document.createElement('iframe');
    iframe.src = iframeSrc;
    iframe.width = '100%';
    iframe.allow = 'payment';
    iframe.scrolling = 'no';
    iframe.title = 'Lock & Lore Booking';
    iframe.style.border = 'none';
    iframe.style.display = 'block';
    iframe.style.overflow = 'hidden';
    iframe.style.height = `${iframeHeight}px`;
    iframe.style.minHeight = '1200px';
    iframe.style.borderRadius = '16px';
    iframe.style.backgroundColor = 'transparent';

    // Mark loaded when iframe content is ready
    iframe.addEventListener('load', () => {
      setIsLoading(false);

      // Show iframe after a short delay to allow height update to arrive
      setTimeout(() => {
        if (!hasReceivedHeightRef.current) {
          console.log('Showing iframe with default height (height update not received yet)');
          setHasReceivedHeight(true);
          hasReceivedHeightRef.current = true;
        }
      }, 300);
    });

    iframeRef.current = iframe;

    // Append to the container
    if (containerRef.current) {
      containerRef.current.appendChild(iframe);
    }

    // Listen for postMessage events from the OTC iframe
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleMessage = (event: MessageEvent<any>) => {
      if (event.origin !== 'https://offthecouch.io') return;

      const { data } = event;

      // Dynamic height adjustment
      //
      // Strategy: give the iframe its FULL reported height so all content
      // renders properly inside it, but let the container (overflow:hidden)
      // clip the bottom grey-padding region. The container maxHeight is set
      // to (fullHeight - IFRAME_BOTTOM_CLIP_PX) in the render below.
      if (data.action === 'updateHeight' && typeof data.height === 'number') {
        const fullHeight = Math.max(data.height, 800);
        console.log(
          'OTC iframe height update:',
          data.height,
          '| iframe set to',
          fullHeight,
          '| container clips bottom',
          IFRAME_BOTTOM_CLIP_PX,
          'px → visible',
          fullHeight - IFRAME_BOTTOM_CLIP_PX,
        );
        setIframeHeight(fullHeight);
        setHasReceivedHeight(true);
        hasReceivedHeightRef.current = true;
        if (iframeRef.current) {
          iframeRef.current.style.height = `${fullHeight}px`;
          iframeRef.current.style.minHeight = `${fullHeight}px`;
        }
      }

      // Scroll-to-top when user navigates between booking steps
      if (data.action === 'scrollToTop') {
        const scrollTop = findPosY(containerRef.current);
        window.scrollTo({
          top: Math.max(0, scrollTop - 30),
          behavior: 'smooth',
        });
      }

      // Google Analytics event forwarding
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const win = window as any;

      switch (data.eventType) {
        case 'page_view':
          insertGoogleAnalyticsScript(data.id);
          break;
        case 'add_to_cart':
          if (win.gtag) {
            win.gtag('event', 'add_to_cart', {
              currency: data.currency,
              value: data.eventValue,
            });
          }
          break;
        case 'begin_checkout':
          if (win.gtag) {
            win.gtag('event', 'begin_checkout', {
              currency: data.currency,
              value: data.eventValue,
            });
          }
          break;
        case 'purchase':
          if (win.gtag) {
            win.gtag('event', 'purchase', {
              currency: data.currency,
              value: data.eventValue,
            });
          }
          break;
        case 'success':
          if (win.gtag) {
            win.gtag('event', 'success', {
              currency: data.currency,
              value: data.eventValue,
            });
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
      // Clean up the iframe on unmount (but not in StrictMode double-mount)
      if (iframeRef.current && containerRef.current && containerRef.current.contains(iframeRef.current)) {
        try {
          containerRef.current.removeChild(iframeRef.current);
        } catch {
          // Already removed
        }
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="w-full -mt-12">
      {/* Loading skeleton -- shown while iframe loads */}
      {isLoading && (
        <div className="w-full bg-black pb-12 pt-16 animate-pulse">
          {/* Logo */}
          <div className="flex justify-center pt-8 pb-6">
            <div className="w-48 h-24 bg-neutral-800/60 rounded-lg" />
          </div>

          {/* Progress Stepper */}
          <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="relative flex items-center justify-between">
              {/* Progress Line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-neutral-700 -translate-y-1/2" />

              {/* Steps */}
              {[...Array(5)].map((_, i) => (
                <div key={i} className="relative flex flex-col items-center gap-3 z-10">
                  <div className={`w-12 h-12 rounded-full ${i === 0 ? 'bg-yellow-500/80' : 'bg-neutral-700'} flex items-center justify-center`}>
                    <div className="w-6 h-6 bg-neutral-600 rounded" />
                  </div>
                  <div className="absolute -bottom-8 whitespace-nowrap">
                    <div className="h-3 w-20 bg-neutral-700 rounded mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Date Picker Section */}
          <div className="max-w-5xl mx-auto px-4 pt-16 pb-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-8 w-32 bg-neutral-700 rounded" />
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="h-10 w-32 bg-neutral-700 rounded" />
              <div className="h-10 w-48 bg-neutral-700 rounded-lg" />
              <div className="h-10 w-32 bg-neutral-700 rounded" />
            </div>
          </div>

          {/* Room Cards */}
          <div className="max-w-6xl mx-auto px-4 pt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-neutral-900/80 rounded-lg overflow-hidden">
                {/* Room Image */}
                <div className="h-48 bg-neutral-800/60" />

                {/* Room Info */}
                <div className="p-4 space-y-4">
                  <div className="h-6 w-3/4 bg-neutral-700 rounded" />
                  <div className="space-y-2">
                    <div className="h-4 w-2/3 bg-neutral-700 rounded" />
                    <div className="h-4 w-1/2 bg-neutral-700 rounded" />
                  </div>

                  {/* Time Slots */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="h-10 bg-neutral-800 rounded border border-yellow-600/50" />
                    <div className="h-10 bg-neutral-800 rounded border border-yellow-600/50" />
                    <div className="h-10 bg-neutral-800 rounded border border-yellow-600/50" />
                    <div className="h-10 bg-neutral-800 rounded border border-yellow-600/50" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-neutral-500 text-sm font-semibold tracking-wider uppercase mt-12">
            Loading booking system...
          </p>
        </div>
      )}

      {/* Iframe container -- overflow:hidden clips the grey footer region */}
      <div
        ref={containerRef}
        id="otcContainer"
        className={`w-full transition-opacity duration-700 overflow-hidden ${
          !hasReceivedHeight ? 'opacity-0 h-0' : 'opacity-100'
        }`}
        style={{
          minHeight: !hasReceivedHeight ? 0 : undefined,
          // Container is shorter than the iframe by IFRAME_BOTTOM_CLIP_PX,
          // so the grey footer at the bottom of the OTC page is hidden.
          maxHeight: iframeHeight
            ? `${iframeHeight - IFRAME_BOTTOM_CLIP_PX}px`
            : undefined,
        }}
      />
    </div>
  );
}
