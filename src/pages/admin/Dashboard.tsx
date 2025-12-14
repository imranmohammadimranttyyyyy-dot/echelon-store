import { useQuery } from '@tanstack/react-query';
import { Package, FolderTree, ShoppingCart, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from './AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [products, categories, orders] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('categories').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id, total_amount, status'),
      ]);

      const totalRevenue = orders.data?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
      const pendingOrders = orders.data?.filter(o => o.status === 'pending').length || 0;

      return {
        products: products.count || 0,
        categories: categories.count || 0,
        orders: orders.data?.length || 0,
        revenue: totalRevenue,
        pendingOrders,
      };
    },
  });

  const { data: recentOrders } = useQuery({
    queryKey: ['recent-orders'],
    queryFn: async () => {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      return data || [];
    },
  });

  const statCards = [
    { 
      label: 'Total Products', 
      value: stats?.products || 0, 
      icon: Package,
      color: 'bg-blue-500/10 text-blue-600'
    },
    { 
      label: 'Categories', 
      value: stats?.categories || 0, 
      icon: FolderTree,
      color: 'bg-purple-500/10 text-purple-600'
    },
    { 
      label: 'Total Orders', 
      value: stats?.orders || 0, 
      icon: ShoppingCart,
      color: 'bg-green-500/10 text-green-600'
    },
    { 
      label: 'Revenue', 
      value: `$${(stats?.revenue || 0).toLocaleString()}`, 
      icon: TrendingUp,
      color: 'bg-accent/10 text-accent'
    },
  ];

  return (
    <AdminLayout title="Dashboard" description="Overview of your store">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.label} className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders && recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${order.total_amount.toFixed(2)}</p>
                    <span className={`badge-status ${
                      order.status === 'pending' ? 'badge-pending' :
                      order.status === 'shipped' ? 'badge-shipped' :
                      order.status === 'delivered' ? 'badge-delivered' :
                      'badge-cancelled'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No orders yet</p>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
