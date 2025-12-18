import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';
import { Package, Plus, Trash2, Clock, CheckCircle, XCircle, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  discount_price: string;
  stock: string;
  category_id: string;
  images: string[];
}

const initialFormData: ProductFormData = {
  name: '',
  description: '',
  price: '',
  discount_price: '',
  stock: '1',
  category_id: '',
  images: [''],
};

export default function SellProduct() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  // Fetch user's products
  const { data: myProducts, isLoading: productsLoading } = useQuery({
    queryKey: ['my-products', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Create product mutation
  const createMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const { error } = await supabase.from('products').insert({
        name: data.name,
        slug: `${slug}-${Date.now()}`,
        description: data.description,
        price: parseFloat(data.price),
        discount_price: data.discount_price ? parseFloat(data.discount_price) : null,
        stock: parseInt(data.stock),
        category_id: data.category_id || null,
        images: data.images.filter(img => img.trim() !== ''),
        user_id: user?.id,
        status: 'pending',
        is_active: true,
        is_featured: false,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-products'] });
      toast.success('Product submitted for review!');
      handleDialogClose();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Update product mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProductFormData }) => {
      const { error } = await supabase
        .from('products')
        .update({
          name: data.name,
          description: data.description,
          price: parseFloat(data.price),
          discount_price: data.discount_price ? parseFloat(data.discount_price) : null,
          stock: parseInt(data.stock),
          category_id: data.category_id || null,
          images: data.images.filter(img => img.trim() !== ''),
          status: 'pending', // Reset to pending when edited
        })
        .eq('id', id)
        .eq('user_id', user?.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-products'] });
      toast.success('Product updated and resubmitted for review!');
      handleDialogClose();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-products'] });
      toast.success('Product deleted!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingProductId(null);
    setFormData(initialFormData);
  };

  const handleEdit = (product: any) => {
    setEditingProductId(product.id);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      discount_price: product.discount_price?.toString() || '',
      stock: product.stock.toString(),
      category_id: product.category_id || '',
      images: product.images?.length > 0 ? product.images : [''],
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProductId) {
      updateMutation.mutate({ id: editingProductId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const addImageField = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const updateImageUrl = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => (i === index ? value : img)),
    }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3" /> Pending Review</Badge>;
      case 'approved':
        return <Badge variant="default" className="gap-1 bg-green-600"><CheckCircle className="w-3 h-3" /> Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" /> Rejected</Badge>;
      default:
        return null;
    }
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="container py-12 text-center">Loading...</div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="container py-12">
          <Card className="max-w-md mx-auto text-center">
            <CardHeader>
              <CardTitle>Sign In Required</CardTitle>
              <CardDescription>
                You need to be signed in to sell products.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/auth')}>Sign In</Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8 max-w-5xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Sell Your Products</h1>
            <p className="text-muted-foreground mt-1">
              List your products on our marketplace
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Add Product
          </Button>
        </div>

        {/* Info Card */}
        <Card className="mb-8 bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Package className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold">How it works</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Submit your product for review. Once approved by our admin team, it will be visible to all customers on the marketplace. You'll be notified about the status of your submissions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* My Products List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">My Products</h2>
          {productsLoading ? (
            <p className="text-muted-foreground">Loading your products...</p>
          ) : myProducts && myProducts.length > 0 ? (
            <div className="grid gap-4">
              {myProducts.map((product: any) => (
                <Card key={product.id}>
                  <CardContent className="flex flex-col sm:flex-row gap-4 p-4">
                    <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{product.name}</h3>
                        {getStatusBadge(product.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                        {product.description || 'No description'}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="font-medium">₹{product.price}</span>
                        <span className="text-muted-foreground">Stock: {product.stock}</span>
                        <span className="text-muted-foreground">
                          Category: {product.categories?.name || 'None'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 sm:flex-col">
                      {product.status !== 'approved' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product)}
                          className="gap-1"
                        >
                          <Edit className="w-3 h-3" /> Edit
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteMutation.mutate(product.id)}
                        className="gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  You haven't listed any products yet. Click "Add Product" to get started!
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Add/Edit Product Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProductId ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
              <DialogDescription>
                {editingProductId
                  ? 'Update your product details. It will be resubmitted for review.'
                  : 'Fill in the details to list your product.'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your product"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount_price">Discount Price (₹)</Label>
                  <Input
                    id="discount_price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.discount_price}
                    onChange={(e) => setFormData(prev => ({ ...prev, discount_price: e.target.value }))}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="1"
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Product Images (URLs)</Label>
                <div className="space-y-2">
                  {formData.images.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={url}
                        onChange={(e) => updateImageUrl(index, e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                      {formData.images.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeImageField(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addImageField}
                    className="gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Another Image
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDialogClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? 'Submitting...'
                    : editingProductId
                    ? 'Update & Resubmit'
                    : 'Submit for Review'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
