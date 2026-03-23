/**
 * Calculate the distance between two coordinates in meters
 */
export const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number => {
    const R = 6371e3; // Earth radius in meters
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
        Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};

/**
 * Formats distance for display
 */
export const formatDistance = (meters: number): string => {
    if (meters < 1000) return `${Math.round(meters)} m`;
    return `${(meters / 1000).toFixed(1)} km`;
};
/**
 * Distance between a point and a line segment
 * Returns [distanceInMeters, pointOnSegment]
 */
export const pointToSegmentDistance = (
    pLat: number, pLng: number,
    s1Lat: number, s1Lng: number,
    s2Lat: number, s2Lng: number
): [number, { lat: number, lng: number }] => {
    // Simplistic projection for small distances (Cartesian approx)
    // For 30m accuracy, this is fine.
    const x = pLng, y = pLat;
    const x1 = s1Lng, y1 = s1Lat;
    const x2 = s2Lng, y2 = s2Lat;

    const dx = x2 - x1;
    const dy = y2 - y1;

    if (dx === 0 && dy === 0) {
        return [calculateDistance(pLat, pLng, s1Lat, s1Lng), { lat: s1Lat, lng: s1Lng }];
    }

    let t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy);
    t = Math.max(0, Math.min(1, t));

    const closestLat = y1 + t * dy;
    const closestLng = x1 + t * dx;

    return [calculateDistance(pLat, pLng, closestLat, closestLng), { lat: closestLat, lng: closestLng }];
};

/**
 * Finds the nearest point on a polyline and its index
 */
export const pointToPolylineDistance = (
    lat: number, lng: number,
    polyline: [number, number][] // [[lat, lng], ...]
): { distance: number, index: number, point: { lat: number, lng: number } } => {
    let minDistance = Infinity;
    let nearestIndex = 0;
    let nearestPoint = { lat: 0, lng: 0 };

    for (let i = 0; i < polyline.length - 1; i++) {
        const [d, p] = pointToSegmentDistance(
            lat, lng,
            polyline[i][0], polyline[i][1],
            polyline[i+1][0], polyline[i+1][1]
        );
        if (d < minDistance) {
            minDistance = d;
            nearestIndex = i;
            nearestPoint = p;
        }
    }

    return { distance: minDistance, index: nearestIndex, point: nearestPoint };
};
