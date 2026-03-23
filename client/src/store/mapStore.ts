import { create } from 'zustand';

export type MapLayer = 'Standard' | 'Satellite' | 'Terrain' | 'Traffic';

export interface MarkerInfo {
    id: string;
    name: string;
    coordinates: [number, number];
}

export interface RouteStep {
    instruction: string;
    distance: number;
    duration: number;
    location: [number, number];
}

export interface RouteInfo {
    distance: number; // in meters
    duration: number; // in seconds
    geometry: any; // GeoJSON LineString
    steps: RouteStep[];
}

interface MapState {
    activeLayer: MapLayer;
    setActiveLayer: (layer: MapLayer) => void;

    userLocation: [number, number] | null;
    setUserLocation: (loc: [number, number] | null) => void;
    isTrackingLocation: boolean;
    setIsTrackingLocation: (tracking: boolean) => void;

    markers: MarkerInfo[];
    addMarker: (marker: MarkerInfo) => void;
    removeMarker: (id: string) => void;

    activeRoute: RouteInfo | null;
    setActiveRoute: (route: RouteInfo | null) => void;

    isNavigating: boolean;
    setIsNavigating: (navigating: boolean) => void;

    destination: [number, number] | null;
    setDestination: (dest: [number, number] | null) => void;

    searchResults: any[];
    setSearchResults: (results: any[]) => void;
}

export const useMapStore = create<MapState>((set) => ({
    activeLayer: 'Standard',
    setActiveLayer: (layer) => set({ activeLayer: layer }),

    userLocation: null,
    setUserLocation: (loc) => set({ userLocation: loc }),
    isTrackingLocation: false,
    setIsTrackingLocation: (tracking) => set({ isTrackingLocation: tracking }),

    markers: [],
    addMarker: (marker) => set((state) => ({ markers: [...state.markers, marker] })),
    removeMarker: (id) => set((state) => ({ markers: state.markers.filter((m) => m.id !== id) })),

    activeRoute: null,
    setActiveRoute: (route) => set({ activeRoute: route }),

    isNavigating: false,
    setIsNavigating: (navigating) => set({ isNavigating: navigating }),

    destination: null,
    setDestination: (dest) => set({ destination: dest }),

    searchResults: [],
    setSearchResults: (results) => set({ searchResults: results }),
}));
