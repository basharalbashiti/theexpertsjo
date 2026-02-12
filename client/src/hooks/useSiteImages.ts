import { useEffect, useState } from "react";

interface SiteImageData {
  key: string;
  imageUrl: string;
}

let cachedImages: Record<string, string> | null = null;
let fetchPromise: Promise<Record<string, string>> | null = null;
let listeners: Set<(images: Record<string, string>) => void> = new Set();

function fetchSiteImages(): Promise<Record<string, string>> {
  if (cachedImages) return Promise.resolve(cachedImages);
  if (fetchPromise) return fetchPromise;
  fetchPromise = fetch("/api/site-images")
    .then((r) => r.json())
    .then((data: SiteImageData[]) => {
      const map: Record<string, string> = {};
      for (const img of data) {
        map[img.key] = img.imageUrl;
      }
      cachedImages = map;
      return map;
    })
    .catch(() => {
      fetchPromise = null;
      return {} as Record<string, string>;
    });
  return fetchPromise;
}

export function invalidateSiteImages() {
  cachedImages = null;
  fetchPromise = null;
  fetchSiteImages().then((images) => {
    listeners.forEach((fn) => fn(images));
  });
}

export function useSiteImages() {
  const [images, setImages] = useState<Record<string, string>>(cachedImages || {});

  useEffect(() => {
    listeners.add(setImages);
    fetchSiteImages().then(setImages);
    return () => {
      listeners.delete(setImages);
    };
  }, []);

  const getImage = (key: string, fallback: string) => images[key] || fallback;

  return { images, getImage };
}
