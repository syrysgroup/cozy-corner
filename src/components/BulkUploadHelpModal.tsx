import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  HelpCircle, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  Download,
  BookOpen,
  Table,
  Image,
  MapPin,
  Shield,
  Zap
} from 'lucide-react';
import { downloadHTMLGuide, downloadTextGuide } from '@/lib/pdfGuideGenerator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const BulkUploadHelpModal = () => {
  const [activeTab, setActiveTab] = useState('quickstart');

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <HelpCircle className="h-4 w-4" />
          Help & Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <BookOpen className="h-5 w-5 text-primary" />
            Bulk Upload Help Center
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="quickstart" className="text-xs sm:text-sm">
              <Zap className="h-3 w-3 mr-1 hidden sm:inline" />
              Quick Start
            </TabsTrigger>
            <TabsTrigger value="fields" className="text-xs sm:text-sm">
              <Table className="h-3 w-3 mr-1 hidden sm:inline" />
              Fields
            </TabsTrigger>
            <TabsTrigger value="faq" className="text-xs sm:text-sm">
              <HelpCircle className="h-3 w-3 mr-1 hidden sm:inline" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="download" className="text-xs sm:text-sm">
              <Download className="h-3 w-3 mr-1 hidden sm:inline" />
              PDF Guide
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[55vh] pr-4">
            {/* Quick Start Tab */}
            <TabsContent value="quickstart" className="space-y-6">
              <section>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  5-Step Import Process
                </h3>
                <div className="space-y-4">
                  {[
                    { step: 1, title: 'Download Template', desc: 'Get the CSV or Excel template with all required columns and example data.' },
                    { step: 2, title: 'Fill Your Data', desc: 'Delete example rows and enter your listing information. Save in CSV or XLSX format.' },
                    { step: 3, title: 'Upload & Validate', desc: 'Drag your file to the upload area. We\'ll check for errors automatically.' },
                    { step: 4, title: 'Review Preview', desc: 'See which rows are valid, have warnings, or errors. Fix issues if needed.' },
                    { step: 5, title: 'Confirm Import', desc: 'Click Import to create your listings. Track progress in real-time.' },
                  ].map(({ step, title, desc }) => (
                    <div key={step} className="flex gap-3 items-start">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                        {step}
                      </div>
                      <div>
                        <p className="font-medium">{title}</p>
                        <p className="text-sm text-muted-foreground">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  System Limits
                </h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center p-2 bg-background rounded">
                    <div className="font-bold text-lg">10 MB</div>
                    <div className="text-muted-foreground">Max file size</div>
                  </div>
                  <div className="text-center p-2 bg-background rounded">
                    <div className="font-bold text-lg">1,000</div>
                    <div className="text-muted-foreground">Max rows</div>
                  </div>
                  <div className="text-center p-2 bg-background rounded">
                    <div className="font-bold text-lg">10/day</div>
                    <div className="text-muted-foreground">Import limit</div>
                  </div>
                </div>
              </section>

              <section>
                <h4 className="font-semibold mb-2">Validation Status Icons</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3 p-2 rounded bg-green-500/10 border border-green-500/20">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <span className="font-medium">Valid</span>
                      <span className="text-muted-foreground ml-2">Row will be imported successfully</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded bg-yellow-500/10 border border-yellow-500/20">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <span className="font-medium">Warning</span>
                      <span className="text-muted-foreground ml-2">Minor issues, will still import</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded bg-red-500/10 border border-red-500/20">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <div>
                      <span className="font-medium">Error</span>
                      <span className="text-muted-foreground ml-2">Row will be skipped, fix required</span>
                    </div>
                  </div>
                </div>
              </section>
            </TabsContent>

            {/* Fields Tab */}
            <TabsContent value="fields" className="space-y-6">
              <section>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-red-600">
                  <Table className="h-5 w-5" />
                  Required Fields
                </h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-3 font-medium">Field</th>
                        <th className="text-left p-3 font-medium">Description</th>
                        <th className="text-left p-3 font-medium">Example</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr><td className="p-3"><code className="bg-muted px-1 rounded">title_en</code></td><td className="p-3 text-muted-foreground">English title (max 200 chars)</td><td className="p-3">Beautiful 3BR Apartment</td></tr>
                      <tr><td className="p-3"><code className="bg-muted px-1 rounded">title_fr</code></td><td className="p-3 text-muted-foreground">French title (max 200 chars)</td><td className="p-3">Bel appartement 3 chambres</td></tr>
                      <tr><td className="p-3"><code className="bg-muted px-1 rounded">listing_type</code></td><td className="p-3 text-muted-foreground">sale, rent, student, shared, co_ownership, auction, ppp</td><td className="p-3">rent</td></tr>
                      <tr><td className="p-3"><code className="bg-muted px-1 rounded">price</code></td><td className="p-3 text-muted-foreground">Price in CAD (numbers only)</td><td className="p-3">1500</td></tr>
                      <tr><td className="p-3"><code className="bg-muted px-1 rounded">address_text</code></td><td className="p-3 text-muted-foreground">Street address (max 500 chars)</td><td className="p-3">123 Main Street</td></tr>
                      <tr><td className="p-3"><code className="bg-muted px-1 rounded">city</code></td><td className="p-3 text-muted-foreground">City name (max 100 chars)</td><td className="p-3">Toronto</td></tr>
                      <tr><td className="p-3"><code className="bg-muted px-1 rounded">province</code></td><td className="p-3 text-muted-foreground">2-letter code</td><td className="p-3">ON</td></tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-green-600">
                  <Table className="h-5 w-5" />
                  Optional Fields
                </h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-3 font-medium">Field</th>
                        <th className="text-left p-3 font-medium">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr><td className="p-3"><code className="bg-muted px-1 rounded">description_en</code></td><td className="p-3 text-muted-foreground">Detailed English description</td></tr>
                      <tr><td className="p-3"><code className="bg-muted px-1 rounded">description_fr</code></td><td className="p-3 text-muted-foreground">Detailed French description</td></tr>
                      <tr><td className="p-3"><code className="bg-muted px-1 rounded">bedrooms</code></td><td className="p-3 text-muted-foreground">Number of bedrooms (0-99)</td></tr>
                      <tr><td className="p-3"><code className="bg-muted px-1 rounded">bathrooms</code></td><td className="p-3 text-muted-foreground">Number of bathrooms (0-99)</td></tr>
                      <tr><td className="p-3"><code className="bg-muted px-1 rounded">property_size</code></td><td className="p-3 text-muted-foreground">Square footage</td></tr>
                      <tr><td className="p-3"><code className="bg-muted px-1 rounded">lot_size</code></td><td className="p-3 text-muted-foreground">Lot size in sq ft</td></tr>
                      <tr><td className="p-3"><code className="bg-muted px-1 rounded">rent_frequency</code></td><td className="p-3 text-muted-foreground">monthly, weekly, yearly</td></tr>
                      <tr><td className="p-3"><code className="bg-muted px-1 rounded">image_urls</code></td><td className="p-3 text-muted-foreground">Comma-separated URLs (max 20)</td></tr>
                      <tr><td className="p-3"><code className="bg-muted px-1 rounded">amenities</code></td><td className="p-3 text-muted-foreground">Comma-separated list</td></tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Image className="h-4 w-4 text-blue-600" />
                  Image URL Format
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Separate multiple image URLs with commas (no spaces):
                </p>
                <code className="block bg-background p-2 rounded text-xs overflow-x-auto">
                  https://example.com/img1.jpg,https://example.com/img2.png
                </code>
                <ul className="text-sm text-muted-foreground mt-3 space-y-1">
                  <li>• Must start with http:// or https://</li>
                  <li>• Supported: .jpg, .jpeg, .png, .gif, .webp</li>
                  <li>• Images must be publicly accessible</li>
                  <li>• Maximum 20 images per listing</li>
                </ul>
              </section>

              <section className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-amber-600" />
                  Province Codes
                </h4>
                <div className="grid grid-cols-4 gap-2 text-sm">
                  {['ON', 'QC', 'BC', 'AB', 'MB', 'SK', 'NS', 'NB', 'NL', 'PE', 'NT', 'YT', 'NU'].map(code => (
                    <code key={code} className="bg-background px-2 py-1 rounded text-center">{code}</code>
                  ))}
                </div>
              </section>
            </TabsContent>

            {/* FAQ Tab */}
            <TabsContent value="faq" className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="format">
                  <AccordionTrigger className="text-left">
                    Which file format should I use - CSV or Excel?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <strong>Excel (.xlsx)</strong> is recommended for beginners as it includes:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>An "Instructions" sheet with detailed guidance</li>
                      <li>A "Valid Values" sheet listing all accepted options</li>
                      <li>Better handling of special characters and accents</li>
                    </ul>
                    <p className="mt-2"><strong>CSV</strong> is simpler and works well if you're comfortable with the format or exporting from other systems.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="errors">
                  <AccordionTrigger className="text-left">
                    Why is my file showing validation errors?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Common causes:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li><strong>Missing required fields:</strong> Ensure title_en, title_fr, listing_type, price, address_text, city, and province are filled</li>
                      <li><strong>Invalid listing_type:</strong> Must be one of: sale, rent, student, shared, co_ownership, auction, ppp</li>
                      <li><strong>Price format:</strong> Use numbers only (no $ or commas)</li>
                      <li><strong>Province code:</strong> Use 2-letter codes (ON, QC, BC, etc.)</li>
                      <li><strong>Image URLs:</strong> Must start with http:// or https://</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="draft">
                  <AccordionTrigger className="text-left">
                    What's the difference between draft and published?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <p><strong>Draft listings</strong> are only visible to you in your dashboard. They won't appear in search results or be visible to other users. This is recommended for initial imports so you can review and edit before going live.</p>
                    <p className="mt-2"><strong>Published listings</strong> are immediately visible to all users and appear in search results.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="geocoding">
                  <AccordionTrigger className="text-left">
                    What happens if geocoding fails?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <p>Geocoding converts addresses to map coordinates. If it fails:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>The listing is still created successfully</li>
                      <li>It won't appear on map views initially</li>
                      <li>You can edit the listing later and update the address</li>
                      <li>Common causes: incomplete addresses, new developments, rural areas</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="limits">
                  <AccordionTrigger className="text-left">
                    What are the import limits?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <ul className="list-disc list-inside space-y-1">
                      <li><strong>File size:</strong> Maximum 10 MB per file</li>
                      <li><strong>Row count:</strong> Maximum 1,000 listings per file</li>
                      <li><strong>Daily imports:</strong> Maximum 10 imports per day (resets at midnight UTC)</li>
                      <li><strong>Images per listing:</strong> Maximum 20 image URLs</li>
                    </ul>
                    <p className="mt-2">Administrators are exempt from the daily import limit.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="images">
                  <AccordionTrigger className="text-left">
                    How do I add images to my listings?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <p>Add image URLs in the <code className="bg-muted px-1 rounded">image_urls</code> column:</p>
                    <ol className="list-decimal list-inside mt-2 space-y-1">
                      <li>Host your images on a public server (cloud storage, your website, etc.)</li>
                      <li>Get the direct URL to each image (should end in .jpg, .png, etc.)</li>
                      <li>Separate multiple URLs with commas: <code className="bg-muted px-1 rounded text-xs">url1.jpg,url2.png,url3.webp</code></li>
                      <li>Ensure images are publicly accessible (no login required)</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="edit">
                  <AccordionTrigger className="text-left">
                    Can I edit listings after import?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <p>Yes! All imported listings can be fully edited:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Go to Dashboard → My Properties</li>
                      <li>Click on any listing to open the editor</li>
                      <li>Make changes and save</li>
                      <li>Change status from draft to published when ready</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="retry">
                  <AccordionTrigger className="text-left">
                    Can I retry failed rows without re-uploading everything?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <p>Yes! In your Import History:</p>
                    <ol className="list-decimal list-inside mt-2 space-y-1">
                      <li>Find the import with failed rows</li>
                      <li>Click "Retry" to open the retry dialog</li>
                      <li>Review and edit the failed rows</li>
                      <li>Submit to retry just those specific rows</li>
                    </ol>
                    <p className="mt-2">This saves time when only a few rows had issues.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="bilingual">
                  <AccordionTrigger className="text-left">
                    Do I need both English and French titles?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <p>Yes, both <code className="bg-muted px-1 rounded">title_en</code> and <code className="bg-muted px-1 rounded">title_fr</code> are required. This ensures your listings are accessible to both English and French-speaking users.</p>
                    <p className="mt-2">If you don't have a translation, you can use the same text for both fields initially and update later.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="special">
                  <AccordionTrigger className="text-left">
                    How do I handle special characters and accents?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <p>For best results with French accents (é, è, ê, ç, etc.):</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Use the Excel (.xlsx) format - it handles encoding automatically</li>
                      <li>For CSV files, ensure your file is saved with UTF-8 encoding</li>
                      <li>If accents appear incorrectly, try re-saving as "CSV UTF-8" from Excel</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            {/* Download Tab */}
            <TabsContent value="download" className="space-y-6">
              <section className="text-center py-8">
                <FileText className="h-16 w-16 mx-auto text-primary mb-4" />
                <h3 className="font-semibold text-xl mb-2">Download Complete Guide</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Get the full bulk upload documentation as a printable file for offline reference.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={downloadHTMLGuide} size="lg" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download & Print as PDF
                  </Button>
                  <Button onClick={downloadTextGuide} variant="outline" size="lg" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Download Text Version
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground mt-4">
                  The PDF option opens a print dialog - select "Save as PDF" in your browser to save the file.
                </p>
              </section>

              <section className="bg-muted/50 rounded-lg p-6">
                <h4 className="font-semibold mb-3">What's in the Guide?</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {[
                    'Complete field reference',
                    'Step-by-step instructions',
                    'Common errors & solutions',
                    'Image hosting tips',
                    'Best practices',
                    'Troubleshooting guide',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
