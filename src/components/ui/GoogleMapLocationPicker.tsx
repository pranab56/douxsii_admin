import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FiMapPin, FiLoader, FiX } from 'react-icons/fi';

declare global {
    interface Window {
        google: any;
    }
}

interface GoogleMapLocationPickerProps {
    address: string;
    setAddress: (addr: string) => void;
    latitude: string;
    longitude: string;
    onLocationChange: (lat: string, lng: string, newAddress?: string) => void;
}

interface SuggestionItem {
    id: string;
    title: string;
    subtitle?: string;
    fullText: string;
    lat?: number;
    lng?: number;
    placeId?: string;
}

export const GoogleMapLocationPicker: React.FC<GoogleMapLocationPickerProps> = ({
    address,
    setAddress,
    latitude,
    longitude,
    onLocationChange,
}) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markerInstanceRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
    const [isUserTyping, setIsUserTyping] = useState(false);

    // Initial Coordinates
    const currentLat = parseFloat(latitude) || 23.7666;
    const currentLng = parseFloat(longitude) || 90.4175;

    // 1. Dynamically Load Google Maps JS Script with Places Library
    useEffect(() => {
        if (window.google?.maps) {
            setIsMapLoaded(true);
            return;
        }

        const existingScript = document.getElementById('google-maps-script');
        if (existingScript) {
            const checkGoogle = setInterval(() => {
                if (window.google?.maps) {
                    setIsMapLoaded(true);
                    clearInterval(checkGoogle);
                }
            }, 200);
            return () => clearInterval(checkGoogle);
        }

        const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';
        const script = document.createElement('script');
        script.id = 'google-maps-script';
        script.src = `https://maps.googleapis.com/maps/api/js?libraries=places${apiKey ? `&key=${apiKey}` : ''}`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
            if (window.google?.maps) {
                setIsMapLoaded(true);
            }
        };
        document.head.appendChild(script);
    }, []);

    // 2. Format concise human-readable address from reverse-geocoding data
    const formatCleanAddress = (data: any): string => {
        if (!data) return '';
        const addr = data.address || {};
        let placeName = data.name || '';
        if (placeName.includes('Jame Mosjid')) placeName = placeName.replace(/ Jame Mosjid/i, '');
        if (placeName.includes('Mosque')) placeName = placeName.replace(/ Mosque/i, '');

        const road = addr.road || '';
        const neighborhood = addr.neighbourhood || addr.quarter || '';
        const suburb = addr.suburb || '';
        const city = addr.city || addr.town || addr.city_district || 'Dhaka';

        const parts: string[] = [];
        if (placeName) parts.push(placeName);
        else if (road) parts.push(road);

        if (suburb && !parts.includes(suburb)) parts.push(suburb);
        else if (neighborhood && !parts.includes(neighborhood)) parts.push(neighborhood);

        if (city && !parts.includes(city)) parts.push(city);

        if (parts.length > 0) {
            return parts.join(', ');
        }

        // Fallback: take first 3 comma-separated tokens
        return (data.display_name || '').split(',').slice(0, 3).map((s: string) => s.trim()).join(', ');
    };

    // 3. Reverse Geocode (when map clicked or marker dragged)
    const reverseGeocode = useCallback(
        async (lat: number, lng: number) => {
            setIsReverseGeocoding(true);
            try {
                // If Google Geocoder is available and returns a clean address:
                if (window.google?.maps?.Geocoder) {
                    try {
                        const geocoder = new window.google.maps.Geocoder();
                        const gRes = await new Promise<any>((resolve, reject) => {
                            geocoder.geocode({ location: { lat, lng } }, (results: any, status: string) => {
                                if (status === 'OK' && results && results[0]) {
                                    resolve(results[0].formatted_address);
                                } else {
                                    reject(status);
                                }
                            });
                        });
                        if (gRes) {
                            // Extract concise address from Google results
                            const shortGoogleAddress = gRes.split(',').slice(0, 3).map((s: string) => s.trim()).join(', ');
                            setIsUserTyping(false);
                            setAddress(shortGoogleAddress);
                            onLocationChange(lat.toFixed(6), lng.toFixed(6), shortGoogleAddress);
                            setIsReverseGeocoding(false);
                            return;
                        }
                    } catch {
                        // Fallback to OSM reverse geocoding
                    }
                }

                // Free reverse geocode
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
                    { headers: { 'Accept-Language': 'en' } }
                );
                if (response.ok) {
                    const data = await response.json();
                    const cleanAddr = formatCleanAddress(data);
                    if (cleanAddr) {
                        setIsUserTyping(false);
                        setAddress(cleanAddr);
                        onLocationChange(lat.toFixed(6), lng.toFixed(6), cleanAddr);
                        setIsReverseGeocoding(false);
                        return;
                    }
                }
            } catch (err) {
                console.error('Reverse geocoding error:', err);
            } finally {
                setIsReverseGeocoding(false);
            }

            onLocationChange(lat.toFixed(6), lng.toFixed(6));
        },
        [onLocationChange, setAddress]
    );

    // 4. Initialize Google Map
    useEffect(() => {
        if (!isMapLoaded || !mapRef.current || mapInstanceRef.current) return;

        try {
            const initialPos = { lat: currentLat, lng: currentLng };

            const map = new window.google.maps.Map(mapRef.current, {
                center: initialPos,
                zoom: 15,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
                zoomControl: true,
                styles: [
                    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
                    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
                    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
                    {
                        featureType: 'administrative.locality',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#d59563' }],
                    },
                    {
                        featureType: 'poi',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#d59563' }],
                    },
                    {
                        featureType: 'poi.park',
                        elementType: 'geometry',
                        stylers: [{ color: '#263c3f' }],
                    },
                    {
                        featureType: 'road',
                        elementType: 'geometry',
                        stylers: [{ color: '#38414e' }],
                    },
                    {
                        featureType: 'road',
                        elementType: 'geometry.stroke',
                        stylers: [{ color: '#212a37' }],
                    },
                    {
                        featureType: 'road',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#9ca5b3' }],
                    },
                    {
                        featureType: 'road.highway',
                        elementType: 'geometry',
                        stylers: [{ color: '#746855' }],
                    },
                    {
                        featureType: 'water',
                        elementType: 'geometry',
                        stylers: [{ color: '#17263c' }],
                    },
                ],
            });

            // Draggable Marker
            const marker = new window.google.maps.Marker({
                position: initialPos,
                map,
                draggable: true,
                title: 'Shop Location (Drag to adjust)',
                animation: window.google.maps.Animation.DROP,
            });

            // Click Map -> Move Marker & Reverse Geocode
            map.addListener('click', (e: any) => {
                const lat = e.latLng.lat();
                const lng = e.latLng.lng();
                marker.setPosition({ lat, lng });
                reverseGeocode(lat, lng);
            });

            // Drag Marker -> Reverse Geocode
            marker.addListener('dragend', () => {
                const pos = marker.getPosition();
                const lat = pos.lat();
                const lng = pos.lng();
                reverseGeocode(lat, lng);
            });

            mapInstanceRef.current = map;
            markerInstanceRef.current = marker;
        } catch (err) {
            console.error('Failed to initialize Google Map:', err);
        }
    }, [isMapLoaded, currentLat, currentLng, reverseGeocode]);

    // 5. Keep Map & Marker in sync if coordinates are updated from props
    useEffect(() => {
        if (!mapInstanceRef.current || !markerInstanceRef.current) return;
        const targetPos = { lat: currentLat, lng: currentLng };
        const currentMarkerPos = markerInstanceRef.current.getPosition();
        if (
            !currentMarkerPos ||
            Math.abs(currentMarkerPos.lat() - currentLat) > 0.0001 ||
            Math.abs(currentMarkerPos.lng() - currentLng) > 0.0001
        ) {
            markerInstanceRef.current.setPosition(targetPos);
            mapInstanceRef.current.panTo(targetPos);
        }
    }, [currentLat, currentLng]);

    // 6. Free Autocomplete Fallback helper (handles "Ulonbazar" -> "Ulon Bazar, Rampura, Dhaka")
    const fetchFreeSuggestions = async (query: string): Promise<SuggestionItem[]> => {
        const terms = [query];
        // If word contains "bazar" without space, e.g. "ulonbazar" -> also search "ulon bazar"
        if (/bazar/i.test(query) && !/ bazar/i.test(query)) {
            terms.push(query.replace(/bazar/i, ' bazar'));
        }
        if (/para/i.test(query) && !/ para/i.test(query)) {
            terms.push(query.replace(/para/i, ' para'));
        }

        const itemsMap = new Map<string, SuggestionItem>();

        for (const term of terms) {
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                        term
                    )}&limit=6&addressdetails=1`,
                    { headers: { 'Accept-Language': 'en' } }
                );
                if (res.ok) {
                    const data = await res.json();
                    data.forEach((item: any) => {
                        const addr = item.address || {};
                        let mainTitle = item.name || '';
                        if (mainTitle.includes('Jame Mosjid')) mainTitle = mainTitle.replace(/ Jame Mosjid/i, '');
                        if (mainTitle.includes('Mosque')) mainTitle = mainTitle.replace(/ Mosque/i, '');
                        if (!mainTitle) {
                            mainTitle = addr.road || addr.suburb || addr.neighbourhood || item.display_name.split(',')[0];
                        }

                        const area = addr.suburb || addr.quarter || addr.neighbourhood || addr.city_district || '';
                        const city = addr.city || addr.town || 'Dhaka';

                        const parts = [mainTitle];
                        if (area && area.toLowerCase() !== mainTitle.toLowerCase()) parts.push(area);
                        if (city && city.toLowerCase() !== area.toLowerCase()) parts.push(city);

                        const formattedFull = parts.join(', ');
                        const subtitle = [area, city, addr.country || 'Bangladesh'].filter(Boolean).join(', ');

                        if (!itemsMap.has(formattedFull)) {
                            itemsMap.set(formattedFull, {
                                id: String(item.place_id),
                                title: mainTitle,
                                subtitle,
                                fullText: formattedFull,
                                lat: parseFloat(item.lat),
                                lng: parseFloat(item.lon),
                            });
                        }
                    });
                }
            } catch (err) {
                console.error('Free suggestions fetch error:', err);
            }
        }

        return Array.from(itemsMap.values());
    };

    // 7. Auto-search Keystroke Suggestions (Debounced 300ms)
    useEffect(() => {
        if (!isUserTyping) return;

        const query = address.trim();
        if (!query || query.length < 2) {
            setSuggestions([]);
            setShowDropdown(false);
            setIsSearching(false);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);

            // Attempt 1: Try Google Places AutocompleteService
            if (window.google?.maps?.places?.AutocompleteService) {
                try {
                    const service = new window.google.maps.places.AutocompleteService();
                    service.getPlacePredictions(
                        { input: query },
                        async (predictions: any[], status: any) => {
                            if (
                                status === window.google.maps.places.PlacesServiceStatus.OK &&
                                predictions &&
                                predictions.length > 0
                            ) {
                                const googleItems: SuggestionItem[] = predictions.map((p) => {
                                    const mainText = p.structured_formatting?.main_text || p.description.split(',')[0];
                                    const secondaryText = p.structured_formatting?.secondary_text || '';
                                    // Short, clean address: e.g. "Ulon Bazar, Rampura, Dhaka"
                                    const cleanParts = [mainText, ...secondaryText.split(',').slice(0, 2).map((s: string) => s.trim())];
                                    const cleanFullText = Array.from(new Set(cleanParts)).join(', ');

                                    return {
                                        id: p.place_id,
                                        title: mainText,
                                        subtitle: secondaryText,
                                        fullText: cleanFullText || p.description,
                                        placeId: p.place_id,
                                    };
                                });

                                setSuggestions(googleItems);
                                setShowDropdown(true);
                                setIsSearching(false);
                                return;
                            }

                            // If Google returns zero results or error, run free search fallback
                            const fallbackItems = await fetchFreeSuggestions(query);
                            setSuggestions(fallbackItems);
                            setShowDropdown(fallbackItems.length > 0);
                            setIsSearching(false);
                        }
                    );
                    return;
                } catch {
                    // Fall through to free search
                }
            }

            // Attempt 2: Free Search Fallback
            const fallbackItems = await fetchFreeSuggestions(query);
            setSuggestions(fallbackItems);
            setShowDropdown(fallbackItems.length > 0);
            setIsSearching(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [address, isUserTyping]);

    // Close suggestions on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 8. Apply selected location to map and form
    const applyLocation = (lat: number, lng: number, formattedAddress: string) => {
        setIsUserTyping(false);
        setAddress(formattedAddress);

        if (mapInstanceRef.current && markerInstanceRef.current) {
            const pos = { lat, lng };
            mapInstanceRef.current.panTo(pos);
            mapInstanceRef.current.setZoom(16);
            markerInstanceRef.current.setPosition(pos);
        }

        onLocationChange(lat.toFixed(6), lng.toFixed(6), formattedAddress);
        setSuggestions([]);
        setShowDropdown(false);
    };

    // When an autosuggestion item is clicked
    const handleSelectSuggestion = (item: SuggestionItem) => {
        // If Google placeId is present, resolve its coordinates
        if (item.placeId && window.google?.maps?.Geocoder) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ placeId: item.placeId }, (results: any, status: any) => {
                if (status === 'OK' && results && results[0]) {
                    const loc = results[0].geometry.location;
                    applyLocation(loc.lat(), loc.lng(), item.fullText || item.title);
                } else if (item.lat && item.lng) {
                    applyLocation(item.lat, item.lng, item.fullText || item.title);
                }
            });
            return;
        }

        // Direct lat/lng from suggestion
        if (item.lat && item.lng) {
            applyLocation(item.lat, item.lng, item.fullText || item.title);
        }
    };

    return (
        <div ref={containerRef} className="space-y-3">
            {/* Location / Address Search Input with Real-time Suggestions */}
            <div className="relative">
                <label className="block text-xs font-semibold text-white/80 mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                        <FiMapPin size={13} className="text-[#ff4b72]" />
                        <span>Location / Address <span className="text-red-400">*</span></span>
                    </span>
                    <span className="text-[11px] text-white/40 font-normal">
                        Type location name to get suggestions
                    </span>
                </label>

                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search location (e.g. Ulonbazar, Dhanmondi, Gulshan)..."
                        value={address}
                        onChange={(e) => {
                            setIsUserTyping(true);
                            setAddress(e.target.value);
                        }}
                        onFocus={() => {
                            if (suggestions.length > 0) setShowDropdown(true);
                        }}
                        required
                        className="w-full h-11 pl-10 pr-9 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#ff4b72] transition-colors"
                    />

                    <FiMapPin className="absolute left-3.5 top-3.5 text-white/40" size={16} />

                    {/* Loader or Clear Button inside input */}
                    <div className="absolute right-3 top-3.5 flex items-center">
                        {isSearching ? (
                            <FiLoader className="animate-spin text-[#ff4b72]" size={16} />
                        ) : address ? (
                            <button
                                type="button"
                                onClick={() => {
                                    setAddress('');
                                    setSuggestions([]);
                                    setShowDropdown(false);
                                }}
                                className="text-white/40 hover:text-white p-0 bg-transparent border-0 cursor-pointer"
                            >
                                <FiX size={15} />
                            </button>
                        ) : null}
                    </div>
                </div>

                {/* Real-time Location Suggestions Dropdown */}
                {showDropdown && suggestions.length > 0 && (
                    <div
                        className="absolute top-full left-0 right-0 z-50 mt-1.5 rounded-xl overflow-hidden border border-white/15 shadow-2xl max-h-64 overflow-y-auto"
                        style={{ background: '#1e0005', backdropFilter: 'blur(20px)' }}
                    >
                        <div className="px-3.5 py-1.5 bg-white/5 border-b border-white/10 text-[10px] uppercase font-bold tracking-wider text-[#ff4b72]">
                            Relevant Location Suggestions
                        </div>
                        {suggestions.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => handleSelectSuggestion(item)}
                                className="p-3 text-xs text-white/80 hover:bg-[#ff4b72]/15 hover:text-white cursor-pointer transition-colors border-b border-white/5 last:border-b-0 flex items-start gap-3"
                            >
                                <div className="w-7 h-7 rounded-lg bg-[#ff4b72]/15 flex items-center justify-center shrink-0 mt-0.5 text-[#ff4b72]">
                                    <FiMapPin size={14} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <span className="font-semibold text-white block text-sm leading-snug">
                                        {item.title}
                                    </span>
                                    {item.subtitle && (
                                        <span className="text-[11px] text-white/50 block mt-0.5 truncate">
                                            {item.subtitle}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Google Map Display Area */}
            <div
                className="relative w-full h-[240px] rounded-2xl overflow-hidden border border-white/10 shadow-inner"
                style={{ background: '#17263c' }}
            >
                <div ref={mapRef} className="w-full h-full" />

                {(!isMapLoaded || isReverseGeocoding) && (
                    <div className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-white text-[11px] flex items-center gap-1.5 border border-white/10 shadow-lg">
                        <FiLoader className="animate-spin text-[#ff4b72]" size={12} />
                        <span>{isReverseGeocoding ? 'Detecting location...' : 'Loading Google Map...'}</span>
                    </div>
                )}

                {/* Map Floating Tip Badge */}
                <div className="absolute bottom-2 left-2 right-2 sm:right-auto px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white/70 text-[11px] flex items-center gap-1.5 border border-white/10 pointer-events-none">
                    <FiMapPin className="text-[#ff4b72]" size={12} />
                    <span>Select suggestion above or drag pin on map</span>
                </div>
            </div>

            {/* Selected Coordinates Status Badge */}
            <div className="flex items-center justify-between text-[11px] px-1 text-white/60">
                <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 font-mono text-white/80">
                        Lat: {currentLat.toFixed(6)}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 font-mono text-white/80">
                        Lng: {currentLng.toFixed(6)}
                    </span>
                </div>
                <span className="text-white/40 hidden sm:inline">Coordinates auto-synced to form</span>
            </div>
        </div>
    );
};

export default GoogleMapLocationPicker;
