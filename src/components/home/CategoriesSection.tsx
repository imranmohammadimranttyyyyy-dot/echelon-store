import { Link } from 'react-router-dom';
import { Shirt, Monitor, PenTool, Bot, Cog, Footprints } from 'lucide-react';

const categories = [
  {
    name: 'Clothing',
    slug: 'clothing',
    icon: Shirt,
    description: 'Fashion essentials',
    color: 'from-rose-500/20 to-rose-600/20',
  },
  {
    name: 'Shoes',
    slug: 'shoes',
    icon: Footprints,
    description: 'Step in style',
    color: 'from-amber-500/20 to-amber-600/20',
  },
  {
    name: 'Electronics',
    slug: 'electronics',
    icon: Monitor,
    description: 'Latest tech',
    color: 'from-blue-500/20 to-blue-600/20',
  },
  {
    name: 'Writing Tools',
    slug: 'writing-tools',
    icon: PenTool,
    description: 'Premium pens',
    color: 'from-emerald-500/20 to-emerald-600/20',
  },
  {
    name: 'AI Robots',
    slug: 'ai-robots',
    icon: Bot,
    description: 'Smart companions',
    color: 'from-violet-500/20 to-violet-600/20',
  },
  {
    name: 'Machines',
    slug: 'machines',
    icon: Cog,
    description: 'Power tools',
    color: 'from-slate-500/20 to-slate-600/20',
  },
];

export function CategoriesSection() {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container">
        <div className="text-center mb-12 space-y-4">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle mx-auto">
            Browse through our diverse collection of products
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              to={`/products?category=${category.slug}`}
              className="group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`category-card bg-gradient-to-br ${category.color}`}>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <category.icon className="w-8 h-8 mb-3 text-foreground transition-transform duration-300 group-hover:scale-110" />
                  <h3 className="font-semibold text-foreground">{category.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {category.description}
                  </p>
                </div>
                <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-colors duration-300 rounded-xl" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
