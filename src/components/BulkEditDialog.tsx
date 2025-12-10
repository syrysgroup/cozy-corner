import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BulkEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIds: string[];
  onSuccess: () => void;
}

export function BulkEditDialog({ open, onOpenChange, selectedIds, onSuccess }: BulkEditDialogProps) {
  const [loading, setLoading] = useState(false);
  const [editStatus, setEditStatus] = useState(false);
  const [editPrice, setEditPrice] = useState(false);
  const [editListingType, setEditListingType] = useState(false);
  
  const [status, setStatus] = useState<string>('');
  const [priceAdjustment, setPriceAdjustment] = useState<string>('');
  const [priceAdjustmentType, setPriceAdjustmentType] = useState<'fixed' | 'percent'>('percent');
  const [listingType, setListingType] = useState<string>('');

  const handleSubmit = async () => {
    if (!editStatus && !editPrice && !editListingType) {
      toast.error('Please select at least one field to edit');
      return;
    }

    setLoading(true);
    try {
      const updates: Record<string, unknown> = {};
      
      if (editStatus && status) {
        updates.status = status;
      }
      
      if (editListingType && listingType) {
        updates.listing_type = listingType;
      }

      // Handle price adjustment
      if (editPrice && priceAdjustment) {
        const adjustment = parseFloat(priceAdjustment);
        if (isNaN(adjustment)) {
          toast.error('Invalid price adjustment value');
          setLoading(false);
          return;
        }

        // For price adjustments, we need to update each listing individually
        for (const id of selectedIds) {
          const { data: listing } = await supabase
            .from('listings')
            .select('price')
            .eq('id', id)
            .single();

          if (listing) {
            let newPrice = listing.price;
            if (priceAdjustmentType === 'percent') {
              newPrice = listing.price * (1 + adjustment / 100);
            } else {
              newPrice = listing.price + adjustment;
            }
            
            await supabase
              .from('listings')
              .update({ ...updates, price: Math.max(0, Math.round(newPrice)) })
              .eq('id', id);
          }
        }
      } else if (Object.keys(updates).length > 0) {
        // Bulk update without price adjustment
        const { error } = await supabase
          .from('listings')
          .update(updates)
          .in('id', selectedIds);

        if (error) throw error;
      }

      toast.success(`Successfully updated ${selectedIds.length} listings`);
      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Bulk edit error:', error);
      toast.error('Failed to update listings');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditStatus(false);
    setEditPrice(false);
    setEditListingType(false);
    setStatus('');
    setPriceAdjustment('');
    setListingType('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bulk Edit Listings</DialogTitle>
          <DialogDescription>
            Edit {selectedIds.length} selected listing{selectedIds.length !== 1 ? 's' : ''}.
            Select the fields you want to update.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Status */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="edit-status" 
                checked={editStatus}
                onCheckedChange={(checked) => setEditStatus(!!checked)}
              />
              <Label htmlFor="edit-status">Update Status</Label>
            </div>
            {editStatus && (
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Listing Type */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="edit-type" 
                checked={editListingType}
                onCheckedChange={(checked) => setEditListingType(!!checked)}
              />
              <Label htmlFor="edit-type">Update Listing Type</Label>
            </div>
            {editListingType && (
              <Select value={listingType} onValueChange={setListingType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select listing type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">Sale</SelectItem>
                  <SelectItem value="rent">Rent</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="shared">Shared</SelectItem>
                  <SelectItem value="co_ownership">Co-ownership</SelectItem>
                  <SelectItem value="auction">Auction</SelectItem>
                  <SelectItem value="ppp">PPP</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Price Adjustment */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="edit-price" 
                checked={editPrice}
                onCheckedChange={(checked) => setEditPrice(!!checked)}
              />
              <Label htmlFor="edit-price">Adjust Price</Label>
            </div>
            {editPrice && (
              <div className="flex gap-2">
                <Select value={priceAdjustmentType} onValueChange={(v) => setPriceAdjustmentType(v as 'fixed' | 'percent')}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percent">Percent (%)</SelectItem>
                    <SelectItem value="fixed">Fixed ($)</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder={priceAdjustmentType === 'percent' ? 'e.g. 5 or -10' : 'e.g. 1000 or -500'}
                  value={priceAdjustment}
                  onChange={(e) => setPriceAdjustment(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Updating...' : 'Update Listings'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
