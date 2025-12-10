import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Eye, MapPin, Bed, Bath, Maximize } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { BulkEditDialog } from '@/components/BulkEditDialog';
import { BulkDeleteDialog } from '@/components/BulkDeleteDialog';
import { ExportListingsDropdown } from '@/components/ExportListingsDropdown';

interface Listing {
  id: string;
  title_en: string;
  title_fr: string;
  price: number;
  listing_type: string;
  city: string;
  province: string;
  country: string;
  address_text: string;
  image_urls: string[] | null;
  bedrooms: number | null;
  bathrooms: number | null;
  property_size: number | null;
  lot_size: number | null;
  unit_count: number | null;
  description_en: string | null;
  description_fr: string | null;
  amenities: string[] | null;
  rent_frequency: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function DashboardProperties() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkEditOpen, setBulkEditOpen] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  useEffect(() => {
    fetchListings();
  }, [user]);

  const fetchListings = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch listings');
      return;
    }

    setListings(data || []);
    setLoading(false);
    setSelectedIds([]);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', deleteId);

    if (error) {
      toast.error('Failed to delete listing');
      return;
    }

    toast.success('Listing deleted successfully');
    setListings(listings.filter(l => l.id !== deleteId));
    setDeleteId(null);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === listings.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(listings.map(l => l.id));
    }
  };

  const stats = {
    total: listings.length,
    published: listings.filter(l => l.status === 'published').length,
    draft: listings.filter(l => l.status === 'draft').length,
  };

  const hasSelection = selectedIds.length > 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Properties</h1>
            <p className="text-muted-foreground">Manage your property listings</p>
          </div>
          <div className="flex gap-2">
            <ExportListingsDropdown 
              listings={listings} 
              selectedIds={hasSelection ? selectedIds : undefined}
            />
            <Button onClick={() => navigate('/listings/create')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm text-muted-foreground">Total Listings</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.published}</div>
              <p className="text-sm text-muted-foreground">Published</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.draft}</div>
              <p className="text-sm text-muted-foreground">Drafts</p>
            </CardContent>
          </Card>
        </div>

        {/* Bulk Actions Bar */}
        {listings.length > 0 && (
          <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
            <div className="flex items-center gap-3">
              <Checkbox 
                checked={selectedIds.length === listings.length && listings.length > 0}
                onCheckedChange={toggleSelectAll}
              />
              <span className="text-sm text-muted-foreground">
                {selectedIds.length > 0 
                  ? `${selectedIds.length} of ${listings.length} selected`
                  : 'Select all'}
              </span>
            </div>
            {hasSelection && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setBulkEditOpen(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Selected
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => setBulkDeleteOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            )}
          </div>
        )}

        {loading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Loading...</p>
            </CardContent>
          </Card>
        ) : listings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No properties listed yet</p>
              <Button onClick={() => navigate('/listings/create')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Listing
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map(listing => (
              <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <div className="absolute top-2 left-2 z-10">
                    <Checkbox 
                      checked={selectedIds.includes(listing.id)}
                      onCheckedChange={() => toggleSelect(listing.id)}
                      className="bg-background"
                    />
                  </div>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={listing.image_urls?.[0] || '/placeholder.svg'}
                      alt={listing.title_en}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-2 left-10">
                      {listing.listing_type}
                    </Badge>
                    {listing.status !== 'published' && (
                      <Badge variant="secondary" className="absolute top-2 right-2">
                        {listing.status}
                      </Badge>
                    )}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-xl font-bold mb-2 line-clamp-1">{listing.title_en}</h3>
                  <p className="text-2xl font-bold text-primary mb-2">
                    ${listing.price.toLocaleString()}
                  </p>
                  <div className="flex items-center text-muted-foreground text-sm mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{listing.city}, {listing.province}</span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    {listing.bedrooms && (
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        <span>{listing.bedrooms}</span>
                      </div>
                    )}
                    {listing.bathrooms && (
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        <span>{listing.bathrooms}</span>
                      </div>
                    )}
                    {listing.property_size && (
                      <div className="flex items-center">
                        <Maximize className="h-4 w-4 mr-1" />
                        <span>{listing.property_size} sqft</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <div className="p-4 pt-0 flex gap-2">
                  <Link to={`/properties/${listing.id}`} className="flex-1">
                    <Button variant="default" className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </Link>
                  <Button variant="outline" size="icon" onClick={() => navigate(`/listings/edit/${listing.id}`)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => setDeleteId(listing.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Single Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Listing</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this listing? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Edit Dialog */}
      <BulkEditDialog 
        open={bulkEditOpen}
        onOpenChange={setBulkEditOpen}
        selectedIds={selectedIds}
        onSuccess={fetchListings}
      />

      {/* Bulk Delete Dialog */}
      <BulkDeleteDialog 
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        selectedIds={selectedIds}
        onSuccess={fetchListings}
      />
    </DashboardLayout>
  );
}
