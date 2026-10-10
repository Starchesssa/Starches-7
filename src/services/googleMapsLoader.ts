/// <reference types="@types/google.maps" />
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyAJSRi8e3Skf5VJYDwN7Efn7XJW97nm8ys';

let googlePromise: Promise<typeof google> | null = null;

export const loadGoogleMaps = (): Promise<typeof google> => {
  if (typeof window !== 'undefined' && window.google?.maps) {
    return Promise.resolve(window.google);
  }

  if (!googlePromise) {
    setOptions({
      key: API_KEY,
      v: 'weekly',
      libraries: ['places'],
    });

    // Quick timeout promise to avoid freezing UI if network latency is high
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Google Maps script load timeout')), 4000)
    );

    const loaderPromise = importLibrary('maps').then(() => {
      return window.google;
    });

    googlePromise = Promise.race([loaderPromise, timeoutPromise]).catch((err) => {
      // Allow retry on subsequent calls if first timed out
      googlePromise = null;
      throw err;
    });
  }

  return googlePromise;
};

// Bolt Food & Uber Eats inspired High-Contrast Map Styling:
// - Thick black/dark borders on primary highways and arterials
// - Clean high-contrast road fills
// - Prominently visible POI icons: Hospitals, Shops, Restaurants, Transit, Schools
// - Crisp pastel water and greenery
export const MAP_STYLES_LIGHT: google.maps.MapTypeStyle[] = [
  // Background landscape
  { elementType: 'geometry', stylers: [{ color: '#f4f5f7' }] },

  // Administrative borders: Bold dark boundaries (city & district borders)
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#090a0f', weight: 2 }] },
  { featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{ color: '#000000', weight: 2.8 }] },
  { featureType: 'administrative.province', elementType: 'geometry.stroke', stylers: [{ color: '#18181b', weight: 2.2 }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#111827' }, { weight: 'bold' }] },
  { featureType: 'administrative.neighborhood', elementType: 'labels.text.fill', stylers: [{ color: '#374151' }] },

  // Highways & Freeways: Thick Black Borders with Crisp Fill (Bolt Food style)
  { featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#090a0f', weight: 3.5 }] },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#111827' }] },

  // Arterial Roads: Prominent Dark Borders
  { featureType: 'road.arterial', elementType: 'geometry.fill', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road.arterial', elementType: 'geometry.stroke', stylers: [{ color: '#18181b', weight: 2.5 }] },
  { featureType: 'road.arterial', elementType: 'labels.text.fill', stylers: [{ color: '#1f2937' }] },

  // Local streets: Clean crisp outlines
  { featureType: 'road.local', elementType: 'geometry.fill', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road.local', elementType: 'geometry.stroke', stylers: [{ color: '#4b5563', weight: 1.2 }] },
  { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: '#4b5563' }] },

  // Water: Clean vibrant ocean/bay blue
  { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#93c5fd' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#1e40af' }] },

  // Parks: Fresh green
  { featureType: 'poi.park', elementType: 'geometry.fill', stylers: [{ color: '#bbf7d0' }] },
  { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#166534' }] },

  // POI Icons: Turn ON icons for Hospitals, Shops, Restaurants, Schools & Transit!
  { featureType: 'poi', elementType: 'labels.icon', stylers: [{ visibility: 'on' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#111827' }] },
  { featureType: 'poi.medical', elementType: 'labels.icon', stylers: [{ visibility: 'on' }] },
  { featureType: 'poi.medical', elementType: 'labels.text.fill', stylers: [{ color: '#dc2626' }] },
  { featureType: 'poi.business', elementType: 'labels.icon', stylers: [{ visibility: 'on' }] },
  { featureType: 'poi.business', elementType: 'labels.text.fill', stylers: [{ color: '#d97706' }] },
  { featureType: 'poi.school', elementType: 'labels.icon', stylers: [{ visibility: 'on' }] },
  { featureType: 'transit', elementType: 'labels.icon', stylers: [{ visibility: 'on' }] },
  { featureType: 'transit.station', elementType: 'labels.icon', stylers: [{ visibility: 'on' }] },
  { featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{ color: '#059669' }] },
];

export const MAP_STYLES_DARK: google.maps.MapTypeStyle[] = [
  // Background dark asphalt
  { elementType: 'geometry', stylers: [{ color: '#0f172a' }] },

  // Administrative borders: High contrast
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#000000', weight: 2.2 }] },
  { featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{ color: '#000000', weight: 3 }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#f3f4f6' }] },

  // Roads: Deep asphalt fills with solid black borders
  { featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{ color: '#1e293b' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#000000', weight: 3.5 }] },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#e2e8f0' }] },

  { featureType: 'road.arterial', elementType: 'geometry.fill', stylers: [{ color: '#1e293b' }] },
  { featureType: 'road.arterial', elementType: 'geometry.stroke', stylers: [{ color: '#000000', weight: 2.5 }] },
  { featureType: 'road.arterial', elementType: 'labels.text.fill', stylers: [{ color: '#cbd5e1' }] },

  { featureType: 'road.local', elementType: 'geometry.fill', stylers: [{ color: '#0f172a' }] },
  { featureType: 'road.local', elementType: 'geometry.stroke', stylers: [{ color: '#020617', weight: 1.5 }] },
  { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },

  // Water: Deep dark blue
  { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#030712' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#38bdf8' }] },

  // Parks: Deep dark forest green
  { featureType: 'poi.park', elementType: 'geometry.fill', stylers: [{ color: '#064e3b' }] },

  // Visible icons in Dark Mode
  { featureType: 'poi', elementType: 'labels.icon', stylers: [{ visibility: 'on' }] },
  { featureType: 'poi.medical', elementType: 'labels.icon', stylers: [{ visibility: 'on' }] },
  { featureType: 'poi.business', elementType: 'labels.icon', stylers: [{ visibility: 'on' }] },
  { featureType: 'transit', elementType: 'labels.icon', stylers: [{ visibility: 'on' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#cbd5e1' }] },
];
