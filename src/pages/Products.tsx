import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/products/ProductCard';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', category],
    queryFn: async () => {
      let query = supabase.from('products').select('*, categories(name, slug)').eq('is_active', true);
      if (category) {
        query = query.eq('categories.slug', category);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data?.filter(p => !category || p.categories?.slug === category);
    },
  });

  return (
    <Layout>
      <div className="container py-12">
        <h1 className="font-display text-3xl md:text-4xl font-semibold mb-2">
          {category ? category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'All Products'}
        </h1>
        <p className="text-muted-foreground mb-8">{products?.length || 0} products</p>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[3/4] rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                slug={product.slug}
                price={Number(product.price)}
                discountPrice={product.discount_price ? Number(product.discount_price) : null}
                image={product.images?.[0]}
                category={product.categories?.name}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No products found</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
