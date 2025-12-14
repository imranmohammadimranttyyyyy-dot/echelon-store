import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroBanner from '@/assets/hero-banner.jpg';

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBanner}
          alt="Fashion collection"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="container relative z-10">
        <div className="max-w-2xl space-y-6 animate-fade-up">
          <p className="text-accent font-medium tracking-widest uppercase text-sm">
            New Collection 2024
          </p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight tracking-tight">
            Discover
            <br />
            <span className="text-accent">Premium</span> Style
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
            Explore our curated collection of clothing, electronics, AI robots, and
            more. Quality meets innovation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link to="/products">
              <Button className="btn-hero">
                Shop Now
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/products?featured=true">
              <Button variant="outline" className="btn-outline-hero">
                View Featured
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        <div className="w-8 h-1 bg-accent rounded-full" />
        <div className="w-2 h-1 bg-muted-foreground/30 rounded-full" />
        <div className="w-2 h-1 bg-muted-foreground/30 rounded-full" />
      </div>
    </section>
  );
}
