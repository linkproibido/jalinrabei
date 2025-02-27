import { useEffect, useRef } from 'react';

interface AdConfig {
  siteId: number;
  minBid: number;
  popundersPerIP: string;
  delayBetween: number;
  default: boolean;
  defaultPerDay: number;
  topmostLayer: string;
}

// Lazy load ads only when needed
const lazyLoadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject();
    document.head.appendChild(script);
  });
};

export function usePopUnderAd(config: Partial<AdConfig> = {}) {
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    // Only load ads if not in prerender/SSR mode
    if (typeof window === 'undefined' || navigator.userAgent.includes('prerender')) {
      return;
    }

    const defaultConfig: AdConfig = {
      siteId: 5277720,
      minBid: 0.001,
      popundersPerIP: "5,1",
      delayBetween: 0,
      default: false,
      defaultPerDay: 0,
      topmostLayer: "auto"
    };

    const mergedConfig = { ...defaultConfig, ...config };
    const uniqueId = `popads_${Date.now()}`;

    try {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.setAttribute('data-cfasync', 'false');
      scriptRef.current = script;
      
      script.text = `
        (function(){
          var w = window;
          var id = "${uniqueId}";
          var config = ${JSON.stringify(mergedConfig)};
          var urls = [
            "d3d3LmRpc3BsYXl2ZXJ0aXNpbmcuY29tL3BuYW5vYmFyLm1pbi5jc3M=",
            "ZDNtem9rdHk5NTFjNXcuY2xvdWRmcm9udC5uZXQvSy9wdHVybi5taW4uanM="
          ];
          
          var index = -1;
          var scriptEl, timeoutId;
          
          function loadNext() {
            clearTimeout(timeoutId);
            index++;
            
            if (urls[index] && Date.now() < 1766462546000) {
              scriptEl = w.document.createElement("script");
              scriptEl.type = "text/javascript";
              scriptEl.async = true;
              scriptEl.crossOrigin = "anonymous";
              scriptEl.src = "https://" + atob(urls[index]);
              
              scriptEl.onerror = loadNext;
              scriptEl.onload = function() {
                clearTimeout(timeoutId);
                if (!w[id]) loadNext();
              };
              
              timeoutId = setTimeout(loadNext, 5000);
              document.head.appendChild(scriptEl);
            }
          }
          
          if (!w[id]) {
            try {
              Object.freeze(w[id] = config);
            } catch(e) {
              console.error('Failed to freeze ad config:', e);
            }
            loadNext();
          }
        })();
      `;

      // Delay ad loading until after page load for better performance
      if (document.readyState === 'complete') {
        document.head.appendChild(script);
      } else {
        window.addEventListener('load', () => {
          document.head.appendChild(script);
        }, { once: true });
      }

      return () => {
        if (scriptRef.current?.parentNode) {
          scriptRef.current.parentNode.removeChild(scriptRef.current);
        }
      };
    } catch (error) {
      console.error('Error initializing pop-under ad:', error);
    }
  }, [config]);
}

export function useInterstitialAd(spotId: string) {
  const resourcesRef = useRef<{
    link?: HTMLLinkElement;
    script?: HTMLScriptElement;
    adScript?: HTMLScriptElement;
  }>({});

  useEffect(() => {
    // Only load ads if not in prerender/SSR mode
    if (typeof window === 'undefined' || navigator.userAgent.includes('prerender')) {
      return;
    }

    let isActive = true;

    const loadInterstitialAd = async () => {
      try {
        // Delay ad loading until after page load for better performance
        if (document.readyState !== 'complete') {
          await new Promise(resolve => {
            window.addEventListener('load', resolve, { once: true });
          });
        }

        if (!isActive) return;

        // Load CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '//cdn.tsyndicate.com/sdk/v1/interstitial.ts.css';
        document.head.appendChild(link);
        resourcesRef.current.link = link;

        // Load JS
        const script = document.createElement('script');
        script.src = '//cdn.tsyndicate.com/sdk/v1/interstitial.ts.js';
        script.async = true;
        
        const scriptPromise = new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });

        document.body.appendChild(script);
        resourcesRef.current.script = script;
        
        await scriptPromise;
        
        if (!isActive) return;

        // Initialize ad
        const adScript = document.createElement('script');
        adScript.text = `
          InterstitialTsAd({
            spot: "${spotId}",
            extid: "{extid}",
          });
        `;
        document.body.appendChild(adScript);
        resourcesRef.current.adScript = adScript;
      } catch (error) {
        console.error('Error loading interstitial ad:', error);
      }
    };

    // Delay ad loading for better initial page performance
    const timer = setTimeout(loadInterstitialAd, 2000);

    return () => {
      isActive = false;
      clearTimeout(timer);
      
      const { link, script, adScript } = resourcesRef.current;
      link?.parentNode?.removeChild(link);
      script?.parentNode?.removeChild(script);
      adScript?.parentNode?.removeChild(adScript);
    };
  }, [spotId]);
}

export function BannerAd({ width = 300, height = 100 }) {
  return (
    <div className="flex justify-center">
      <iframe
        width={width}
        height={height}
        frameBorder="0"
        scrolling="no"
        src="//tsyndicate.com/iframes2/22b5c57017c648a3a31ea68fe745fb3b.html?extid={extid}"
        className="mx-auto"
        title="Advertisement"
        loading="lazy"
      />
    </div>
  );
}