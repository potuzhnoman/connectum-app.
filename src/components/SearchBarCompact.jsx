import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';

/**
 * Compact SearchBar for Navbar (StackOverflow-style)
 * Features: debounced search, dropdown with results, highlight matches
 */
const SearchBarCompact = ({ supabase, onSearch, onResultClick }) => {
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
      onSearch?.('');
    }
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Search Input Container */}
      <div className="relative">
        {/* Search Icon */}
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 pointer-events-none z-10" />
        
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
          placeholder="Search..."
          className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 pl-9 pr-9 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 focus:outline-none transition-all"
        />
        
        {/* Loading Spinner */}
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 w-4 h-4 animate-spin z-10" />
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl overflow-hidden z-50 animate-scale-in"
        >
          {/* Results List */}
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
            {results.map((result, index) => (
              <div
                key={result.id}
                onClick={() => handleResultClick(result)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`px-3 py-2 cursor-pointer border-b border-white/5 last:border-0 transition-colors ${
                  selectedIndex === index 
                    ? 'bg-cyan-500/20 border-cyan-400/30' 
                    : 'hover:bg-cyan-500/10'
                }`}
              >
                {/* Question Text */}
                <div className="text-xs text-white font-medium mb-0.5 line-clamp-1">
                  {highlightMatch(result.text, query)}
                </div>
                
                {/* Metadata */}
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  {result.author_name && (
                    <>
                      <span className="text-cyan-400">{result.author_name}</span>
                      {result.category && <span>•</span>}
                    </>
                  )}
                  {result.category && (
                    <span className="px-1.5 py-0.5 bg-slate-800/50 rounded text-slate-300">
                      {result.category}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Status Bar */}
          <div className="px-3 py-1.5 bg-slate-950/50 text-[10px] text-slate-500 border-t border-white/5 flex items-center justify-between">
            <span>
              {results.length} result{results.length !== 1 ? 's' : ''}
            </span>
            <span className="text-slate-600">
              ⏎ Select
            </span>
          </div>
        </div>
      )}

      {/* No Results Message */}
      {isOpen && !isLoading && query.trim() && results.length === 0 && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl overflow-hidden z-50 animate-scale-in"
        >
          <div className="px-3 py-4 text-center">
            <p className="text-slate-400 text-xs">No results</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBarCompact;







