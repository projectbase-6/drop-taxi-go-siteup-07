import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { MapPin, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  className?: string;
}
interface Suggestion {
  place_id: string;
  description: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
}
const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  value,
  onChange,
  placeholder,
  disabled = false,
  className = ''
}) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) && !inputRef.current?.contains(event.target as Node)) {
        setShowSuggestions(false);
        setError(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // Clear timeout on unmount
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);
  const fetchSuggestions = async (input: string) => {
    if (input.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching suggestions for:', input);

      // Using Google Places API via edge function to keep API key secure
      const {
        data,
        error
      } = await supabase.functions.invoke('places-autocomplete', {
        body: {
          input,
          region: 'in'
        }
      });
      console.log('Places API response:', {
        data,
        error
      });
      if (error) {
        console.error('Error calling places-autocomplete function:', error);
        setError('Failed to fetch location suggestions. Please try again.');
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      if (data && data.predictions && data.predictions.length > 0) {
        setSuggestions(data.predictions);
        setShowSuggestions(true);
        console.log('Set suggestions:', data.predictions.length);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
        if (input.length >= 2) {
          setError('No locations found. Please try a different search term.');
        }
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setError('Network error. Please check your connection and try again.');
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoading(false);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Clear previous timeout
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce API calls
    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(newValue);
    }, 300);
  };
  const handleSuggestionClick = (suggestion: Suggestion) => {
    onChange(suggestion.description);
    setShowSuggestions(false);
    setSuggestions([]);
  };
  return <div className="relative">
      <div className="relative">
        <Input ref={inputRef} value={value} onChange={handleInputChange} placeholder={placeholder} disabled={disabled} className={`pl-10 ${className}`} autoComplete="off" />
        
        {loading && <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />}
      </div>

      {error && <div className="absolute z-[9999] w-full mt-1 bg-destructive/10 border border-destructive/20 rounded-lg p-3">
          <div className="text-sm text-destructive">{error}</div>
        </div>}

      {showSuggestions && suggestions.length > 0 && <div ref={suggestionsRef} className="absolute z-[9999] w-full min-w-[400px] mt-1 bg-background border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => <div key={suggestion.place_id || index} className="px-4 py-3 hover:bg-muted cursor-pointer text-sm text-foreground border-b border-border last:border-b-0 flex items-start space-x-3" onClick={() => handleSuggestionClick(suggestion)}>
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                {suggestion.structured_formatting ? <>
                    <div className="font-medium text-foreground">
                      {suggestion.structured_formatting.main_text}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {suggestion.structured_formatting.secondary_text}
                    </div>
                  </> : <div className="font-medium text-foreground">{suggestion.description}</div>}
              </div>
            </div>)}
        </div>}
    </div>;
};
export default LocationAutocomplete;