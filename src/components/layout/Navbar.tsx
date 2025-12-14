import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, Search, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCartStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const categories = [
  { name: 'Clothing', slug: 'clothing' },
  { name: 'Shoes', slug: 'shoes' },
  { name: 'Electronics', slug: 'electronics' },
  { name: 'Writing Tools', slug: 'writing-tools' },
  { name: 'AI Robots', slug: 'ai-robots' },
  { name: 'Machines', slug: 'machines' },
];

export function Navbar() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-display text-2xl font-bold tracking-tight">LUXE</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/products" className="nav-link text-sm font-medium">
            All Products
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger className="nav-link text-sm font-medium flex items-center gap-1">
              Categories <ChevronDown className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-48">
              {categories.map((cat) => (
                <DropdownMenuItem key={cat.slug} asChild>
                  <Link to={`/products?category=${cat.slug}`}>{cat.name}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="w-5 h-5" />
          </Button>

          {/* Cart */}
          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/account">My Account</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/orders">My Orders</Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/admin">Admin Panel</Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
          )}

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-6 mt-8">
                <Link
                  to="/products"
                  className="text-lg font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  All Products
                </Link>
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Categories
                  </p>
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/products?category=${cat.slug}`}
                      className="block text-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-lg font-medium text-accent"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
