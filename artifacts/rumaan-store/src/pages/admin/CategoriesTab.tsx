import { useState } from "react";
import { useGetCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@workspace/api-client-react";
import { Button, Input, Modal, Textarea, Badge } from "@/components/ui";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CategoriesTab() {
  const { data: categories, refetch } = useGetCategories();
  const { toast } = useToast();
  
  const createCat = useCreateCategory();
  const updateCat = useUpdateCategory();
  const deleteCat = useDeleteCategory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [form, setForm] = useState({
    name: "", slug: "", description: "", imageUrl: "", allowOnlinePurchase: true, showPrices: true
  });

  const handleOpenNew = () => {
    setEditingId(null);
    setForm({ name: "", slug: "", description: "", imageUrl: "", allowOnlinePurchase: true, showPrices: true });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: any) => {
    setEditingId(c.id);
    setForm({ ...c });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateCat.mutateAsync({ id: editingId, data: form });
        toast({ title: "Category updated" });
      } else {
        await createCat.mutateAsync({ data: form });
        toast({ title: "Category created" });
      }
      setIsModalOpen(false);
      refetch();
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure? This might affect products.")) {
      await deleteCat.mutateAsync({ id });
      refetch();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-display font-bold">Manage Categories</h1>
        <Button onClick={handleOpenNew}><Plus className="w-4 h-4 mr-2" /> Add Category</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories?.map(c => (
          <div key={c.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col">
            <div className="h-32 bg-muted relative">
              <img src={c.imageUrl} className="w-full h-full object-cover" />
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-display font-bold text-lg">{c.name}</h3>
                <Badge variant="outline">{c.productCount} Items</Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{c.description}</p>
              <div className="mt-auto flex justify-end gap-2 border-t border-border pt-4">
                <Button variant="outline" size="sm" onClick={() => handleOpenEdit(c)}>Edit</Button>
                <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => handleDelete(c.id)}>Delete</Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Category" : "New Category"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Name</label>
              <Input required value={form.name} onChange={e => {
                const name = e.target.value;
                setForm({...form, name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-')});
              }} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Slug</label>
              <Input required value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Image URL</label>
            <Input required value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Description</label>
            <Textarea required value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>
          <div className="flex gap-6">
             <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.allowOnlinePurchase} onChange={e => setForm({...form, allowOnlinePurchase: e.target.checked})} className="w-4 h-4 rounded text-primary" />
                Allow Buy Buttons
             </label>
             <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.showPrices} onChange={e => setForm({...form, showPrices: e.target.checked})} className="w-4 h-4 rounded text-primary" />
                Show Prices
             </label>
          </div>
          <Button type="submit" className="w-full mt-4" isLoading={createCat.isPending || updateCat.isPending}>Save Category</Button>
        </form>
      </Modal>
    </div>
  );
}
