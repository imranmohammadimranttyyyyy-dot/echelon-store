import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-display text-2xl font-bold">LUXE</h3>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Premium quality products for the modern lifestyle. Discover our curated
              collection of clothing, electronics, and more.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?category=clothing" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                  Clothing
                </Link>
              </li>
              <li>
                <Link to="/products?category=electronics" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/products?category=ai-robots" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                  AI & Robots
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>123 Commerce Street, NY 10001</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>support@luxestore.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center text-sm text-primary-foreground/50">
          <p>© {new Date().getFullYear()} LUXE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
