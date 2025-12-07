import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HelpCircle, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export const BulkUploadHelpModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <HelpCircle className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Bulk Upload Help</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Quick Start */}
            <section>
              <h3 className="font-semibold text-lg mb-2">Quick Start</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Download the CSV or Excel template</li>
                <li>Fill in your listing data (delete the example rows first)</li>
                <li>Upload the file and review the preview</li>
                <li>Confirm the import to create your listings</li>
              </ol>
            </section>

            {/* Required Fields */}
            <section>
              <h3 className="font-semibold text-lg mb-2">Required Fields</h3>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-3 gap-2 font-medium text-muted-foreground">
                  <span>Field</span>
                  <span className="col-span-2">Description</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <code className="text-xs bg-muted px-1 rounded">title_en</code>
                  <span className="col-span-2 text-muted-foreground">English title (max 200 characters)</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <code className="text-xs bg-muted px-1 rounded">title_fr</code>
                  <span className="col-span-2 text-muted-foreground">French title (max 200 characters)</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <code className="text-xs bg-muted px-1 rounded">listing_type</code>
                  <span className="col-span-2 text-muted-foreground">sale, rent, student, or commercial</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <code className="text-xs bg-muted px-1 rounded">price</code>
                  <span className="col-span-2 text-muted-foreground">Numeric value in CAD (no symbols)</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <code className="text-xs bg-muted px-1 rounded">address_text</code>
                  <span className="col-span-2 text-muted-foreground">Street address</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <code className="text-xs bg-muted px-1 rounded">city</code>
                  <span className="col-span-2 text-muted-foreground">City name</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <code className="text-xs bg-muted px-1 rounded">province</code>
                  <span className="col-span-2 text-muted-foreground">Two-letter code (ON, QC, BC, AB...)</span>
                </div>
              </div>
            </section>

            {/* Image URLs */}
            <section>
              <h3 className="font-semibold text-lg mb-2">Image URLs</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Add multiple image URLs separated by commas:</p>
                <code className="block bg-muted p-2 rounded text-xs">
                  https://example.com/img1.jpg,https://example.com/img2.jpg
                </code>
                <p className="mt-2">Requirements:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Must start with http:// or https://</li>
                  <li>Supported formats: .jpg, .jpeg, .png, .gif, .webp</li>
                  <li>Images must be publicly accessible</li>
                </ul>
              </div>
            </section>

            {/* Status Icons */}
            <section>
              <h3 className="font-semibold text-lg mb-2">Validation Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Valid</span>
                  <span className="text-muted-foreground">- Row will be imported</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium">Warning</span>
                  <span className="text-muted-foreground">- Minor issues, will still import</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="font-medium">Error</span>
                  <span className="text-muted-foreground">- Row will be skipped</span>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section>
              <h3 className="font-semibold text-lg mb-2">Frequently Asked Questions</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-medium">Why is my CSV showing errors?</p>
                  <p className="text-muted-foreground">
                    Check that all required fields are filled in, listing_type is valid (sale/rent/student/commercial),
                    price is a number, and province is a valid 2-letter code.
                  </p>
                </div>
                <div>
                  <p className="font-medium">What's the difference between "draft" and "published"?</p>
                  <p className="text-muted-foreground">
                    Draft listings are only visible to you and won't appear in search results.
                    Published listings are visible to all users.
                  </p>
                </div>
                <div>
                  <p className="font-medium">What if geocoding fails?</p>
                  <p className="text-muted-foreground">
                    The listing will still be imported without map coordinates. You can update
                    the address later in the listing editor.
                  </p>
                </div>
                <div>
                  <p className="font-medium">What are the limits?</p>
                  <p className="text-muted-foreground">
                    Maximum 1000 rows per file, 10MB file size, and 10 imports per day.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
