import { useState } from 'react';
import { Search, Menu, X, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
  onTabChange?: (tab: string) => void;
  activeTab?: string;
  userAvatar?: string;
}

const navItems = [
  { id: 'collection', label: 'Collection' },
  { id: 'artists', label: 'Artists' },
  { id: 'moodboards', label: 'Moodboards' },
  { id: 'archive', label: 'Archive' },
];

export function Navigation({ onSearch, searchQuery = '', onTabChange, activeTab = 'collection', userAvatar }: NavigationProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(localSearch);
    setIsSearchOpen(false);
  };

  const handleTabClick = (tabId: string) => {
    onTabChange?.(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => handleTabClick('collection')}
            className="flex items-center gap-2"
          >
            <span className="font-semibold text-xl text-gray-900 tracking-tight">
              ArtVault
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.id 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className={`flex items-center transition-all duration-300 ${isSearchOpen ? 'w-64' : 'w-auto'}`}>
              {isSearchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full">
                  <Input
                    type="text"
                    placeholder="Search artworks, artists..."
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    className="h-9 text-sm"
                    autoFocus
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    variant="ghost" 
                    className="h-9 w-9 shrink-0"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button 
                    type="button" 
                    size="icon" 
                    variant="ghost" 
                    className="h-9 w-9 shrink-0"
                    onClick={() => {
                      setIsSearchOpen(false);
                      setLocalSearch('');
                      onSearch?.('');
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="h-4 w-4 text-gray-500" />
                </Button>
              )}
            </div>

            {/* User Avatar */}
            <button
              onClick={() => handleTabClick('profile')}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors overflow-hidden"
            >
              {userAvatar ? (
                <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="h-4 w-4 text-gray-500" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden h-9 w-9"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`px-4 py-3 text-left text-sm font-medium rounded-lg transition-colors ${
                    activeTab === item.id 
                      ? 'bg-indigo-50 text-indigo-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
