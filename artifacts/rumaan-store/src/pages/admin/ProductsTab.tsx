import { useState } from "react";
import { useGetProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, useGetCategories } from "@workspace/api-client-react";
import { Button, Input, Modal, Textarea, Badge } from "@/components/ui";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { formatPKR } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function ProductsTab() {
  const { data: products, refetch } = useGetProducts();
  const { data: categories } = useGetCategories();
  const { toast } = useToast();
  
  const createProd = useCreateProduct();
  const updateProd = useUpdateProduct();
  const deleteProd = useDeleteProduct();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [form, setForm] = useState({
    name: "", description: "", price: 0, imageUrl: "", categoryId: 0, whatsappNumber: "", featured: false, inStock: true
  });

  const handleOpenNew = () => {
    setEditingId(null);
    setForm({ name: "", description: "", price: 0, imageUrl: "", categoryId: categories?.[0]?.id || 0, whatsappNumber: "+923001234567", featured: false, inStock: true });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: any) => {
    setEditingId(p.id);
    setForm({ ...p });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateProd.mutateAsync({ id: editingId, data: form });
        toast({ title: "Product updated" });
      } else {
        await createProd.mutateAsync({ data: form });
        toast({ title: "Product created" });
      }
      setIsModalOpen(false);
      refetch();
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure?")) {
      await deleteProd.mutateAsync({ id });
      refetch();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-display font-bold">Manage Products</h1>
        <Button onClick={handleOpenNew}><Plus className="w-4 h-4 mr-2" /> Add Product</Button>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products?.map(p => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img src={p.imageUrl} className="w-10 h-10 rounded-md object-cover bg-muted" />
                    <span className="font-medium">{p.name}</span>
                  </td>
                  <td className="p-4">{p.categoryName}</td>
                  <td className="p-4">{formatPKR(p.price)}</td>
                  <td className="p-4">
                    <Badge variant={p.inStock ? "success" : "destructive"}>{p.inStock ? "In Stock" : "Out of Stock"}</Badge>
                    {p.featured && <Badge variant="default" className="ml-2">Featured</Badge>}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(p)}><Edit2 className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(p.id)}><Trash2 className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Product" : "New Product"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Name</label>
            <Input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Price (PKR)</label>
              <Input type="number" required value={form.price} onChange={e => setForm({...form, price: parseInt(e.target.value)})} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Category</label>
              <select 
                className="flex h-12 w-full rounded-xl border-2 border-input bg-background px-4 py-2 text-sm"
                value={form.categoryId} 
                onChange={e => setForm({...form, categoryId: parseInt(e.target.value)})}
              >
                {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Image URL</label>
            <Input required value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">WhatsApp Number</label>
            <Input required value={form.whatsappNumber} onChange={e => setForm({...form, whatsappNumber: e.target.value})} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Description</label>
            <Textarea required value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>
          <div className="flex gap-6">
             <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.inStock} onChange={e => setForm({...form, inStock: e.target.checked})} className="w-4 h-4 rounded text-primary" />
                In Stock
             </label>
             <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} className="w-4 h-4 rounded text-primary" />
                Featured Product
             </label>
          </div>
          <Button type="submit" className="w-full mt-4" isLoading={createProd.isPending || updateProd.isPending}>Save Product</Button>
        </form>
      </Modal>
    </div>
  );
}
