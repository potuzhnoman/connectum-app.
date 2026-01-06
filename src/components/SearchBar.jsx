import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';

/**
 * Google-style SearchBar with inline autocomplete
 * Features: debounced search, keyboard navigation, inline suggestions
 */
const SearchBar = ({ supabase, onSearch, onResultClick }) => {
  // State
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  // Refs
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Derived: inline suggestion (first result that starts with query)
  const inlineSuggestion = results[0]?.text?.toLowerCase().startsWith(query.toLowerCase()) 
    ? results[0].text 
    : null;

  // Search function
  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim() || !supabase) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('id, text, author_name, category')
        .or(`text.ilike.%${searchQuery}%,author_name.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`)
        .limit(5);

      if (error) throw error;
      setResults(data || []);
      setIsOpen(true);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (query.trim()) {
      debounceTimerRef.current = setTimeout(() => {
        performSearch(query);
      }, 300);
    } else {
      setResults([]);
      setIsOpen(false);
      setIsLoading(false);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, supabase]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Highlight matches in text
  const highlightMatch = (text, query) => {
    if (!query.trim()) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="bg-yellow-400/30 text-yellow-200 rounded px-0.5">
          {part}
        </mark>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' && query.trim()) {
        // Execute search
        onSearch?.(query);
        setIsOpen(false);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > -1 ? prev - 1 : -1);
        break;
      
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultClick(results[selectedIndex]);
        } else if (query.trim()) {
          onSearch?.(query);
          setIsOpen(false);
        }
        break;
      
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
      
      case 'Tab':
        if (inlineSuggestion && selectedIndex === -1) {
          e.preventDefault();
          setQuery(inlineSuggestion);
          setSelectedIndex(0);
        }
        break;
      
      default:
        break;
    }
  };

  // Handle result click
  const handleResultClick = (result) => {
    setQuery(result.text);
    setIsOpen(false);
    onSearch?.(result.text);
    onResultClick?.(result);
  };

  // Handle input change
  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setSelectedIndex(-1);
    if (!e.target.value.trim()) {
      onSearch?.(''); // Clear search
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-8">
      {/* Search Input Container */}
      <div className="relative">
        {/* Search Icon */}
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none z-10" />
        
        {/* Inline Suggestion (Ghost Text) */}
        {inlineSuggestion && query && selectedIndex === -1 && (
          <div className="absolute left-0 top-0 w-full h-full pointer-events-none">
            <div className="w-full h-full px-4 py-3 pl-10 flex items-center">
              <span className="text-white opacity-0">{query}</span>
              <span className="text-slate-600">
                {inlineSuggestion.slice(query.length)}
              </span>
            </div>
          </div>
        )}
        
        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder="Search questions, authors, categories..."
          className="w-full bg-slate-900/40 border border-cyan-500/30 rounded-xl px-4 py-3 pl-10 pr-10 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 focus:outline-none transition-all relative z-20 bg-transparent"
        />
        
        {/* Loading Spinner */}
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 w-5 h-5 animate-spin z-10" />
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-scale-in"
        >
          {/* Results List */}
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {results.map((result, index) => (
              <div
                key={result.id}
                onClick={() => handleResultClick(result)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`px-4 py-3 cursor-pointer border-b border-white/5 last:border-0 transition-colors ${
                  selectedIndex === index 
                    ? 'bg-cyan-500/20 border-cyan-400/30' 
                    : 'hover:bg-cyan-500/10'
                }`}
              >
                {/* Question Text */}
                <div className="text-sm text-white font-medium mb-1 line-clamp-2">
                  {highlightMatch(result.text, query)}
                </div>
                
                {/* Metadata */}
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  {result.author_name && (
                    <>
                      <span className="text-cyan-400">{result.author_name}</span>
                      <span>•</span>
                    </>
                  )}
                  {result.category && (
                    <span className="px-2 py-0.5 bg-slate-800/50 rounded text-slate-300">
                      {result.category}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Status Bar */}
          <div className="px-4 py-2 bg-slate-950/50 text-xs text-slate-500 border-t border-white/5 flex items-center justify-between">
            <span>
              Found <strong className="text-cyan-400">{results.length}</strong> question{results.length !== 1 ? 's' : ''}
            </span>
            <span className="text-[10px] text-slate-600">
              ↑↓ Navigate • ⏎ Select • ⎋ Close
            </span>
          </div>
        </div>
      )}

      {/* No Results Message */}
      {isOpen && !isLoading && query.trim() && results.length === 0 && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-scale-in"
        >
          <div className="px-4 py-6 text-center">
            <p className="text-slate-400 text-sm mb-1">No results found</p>
            <p className="text-slate-600 text-xs">Try different keywords</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;









