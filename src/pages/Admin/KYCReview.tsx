import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function KYCReview() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState('');

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('kyc_documents')
        .select(`
          *,
          profiles:user_id (first_name, last_name, role)
        `)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error: any) {
      toast.error('Error fetching documents: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const updateDocumentStatus = async (docId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('kyc_documents')
        .update({
          status,
          admin_notes: adminNotes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', docId);

      if (error) throw error;

      // If all documents for this user are approved, update their profile
      const userDocs = documents.filter(d => d.user_id === selectedDoc.user_id);
      const allApproved = userDocs.every(d => 
        d.id === docId ? status === 'approved' : d.status === 'approved'
      );

      if (allApproved && status === 'approved') {
        await supabase
          .from('profiles')
          .update({
            kyc_status: 'approved',
            kyc_level: 'tier1',
          })
          .eq('id', selectedDoc.user_id);
      }

      toast.success(`Document ${status}`);
      setSelectedDoc(null);
      setAdminNotes('');
      fetchDocuments();
    } catch (error: any) {
      toast.error('Error updating document: ' + error.message);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const pendingDocs = documents.filter(d => d.status === 'pending');
  const reviewedDocs = documents.filter(d => d.status !== 'pending');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-8 w-8" />
            KYC Document Review
          </h1>
          <p className="text-muted-foreground">Review and approve user verification documents</p>
        </div>

        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">
              Pending ({pendingDocs.length})
            </TabsTrigger>
            <TabsTrigger value="reviewed">
              Reviewed ({reviewedDocs.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {loading ? (
              <Card>
                <CardContent className="py-8 text-center">Loading...</CardContent>
              </Card>
            ) : pendingDocs.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No pending documents to review
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pendingDocs.map((doc) => (
                  <Card key={doc.id} className="cursor-pointer hover:border-primary" onClick={() => setSelectedDoc(doc)}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between text-base">
                        <span>{doc.document_type.replace('_', ' ').toUpperCase()}</span>
                        {getStatusBadge(doc.status)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">User: </span>
                          {doc.profiles?.first_name} {doc.profiles?.last_name}
                        </div>
                        <div>
                          <span className="font-medium">Role: </span>
                          {doc.profiles?.role || 'Not set'}
                        </div>
                        <div>
                          <span className="font-medium">Uploaded: </span>
                          {new Date(doc.uploaded_at).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviewed">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {reviewedDocs.map((doc) => (
                <Card key={doc.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-base">
                      <span>{doc.document_type.replace('_', ' ').toUpperCase()}</span>
                      {getStatusBadge(doc.status)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">User: </span>
                        {doc.profiles?.first_name} {doc.profiles?.last_name}
                      </div>
                      {doc.admin_notes && (
                        <div>
                          <span className="font-medium">Notes: </span>
                          <p className="text-muted-foreground">{doc.admin_notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Document Review Modal */}
        {selectedDoc && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Review Document</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>User</Label>
                      <p className="text-sm">{selectedDoc.profiles?.first_name} {selectedDoc.profiles?.last_name}</p>
                    </div>
                    <div>
                      <Label>Document Type</Label>
                      <p className="text-sm">{selectedDoc.document_type.replace('_', ' ').toUpperCase()}</p>
                    </div>
                  </div>

                  <div>
                    <Label>Document</Label>
                    <div className="mt-2 border rounded-lg p-4">
                      <img 
                        src={selectedDoc.file_url} 
                        alt="KYC Document" 
                        className="w-full h-auto max-h-96 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML = '<p class="text-muted-foreground">Unable to preview document</p>';
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="adminNotes">Admin Notes</Label>
                    <Textarea
                      id="adminNotes"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add notes about this document..."
                      rows={4}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedDoc(null);
                      setAdminNotes('');
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => updateDocumentStatus(selectedDoc.id, 'rejected')}
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => updateDocumentStatus(selectedDoc.id, 'approved')}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
