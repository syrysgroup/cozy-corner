import { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import { Language, useTranslation } from '@/lib/i18n';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type DocumentType = 'id' | 'address_proof' | 'selfie';

export default function KYC() {
  const [lang] = useState<Language>('en');
  const t = useTranslation(lang);
  const { user, profile, refreshProfile } = useAuth();
  const [documents, setDocuments] = useState<any[]>([]);
  const [uploading, setUploading] = useState<Record<DocumentType, boolean>>({
    id: false,
    address_proof: false,
    selfie: false,
  });
  
  const fileInputRefs = {
    id: useRef<HTMLInputElement>(null),
    address_proof: useRef<HTMLInputElement>(null),
    selfie: useRef<HTMLInputElement>(null),
  };

  useEffect(() => {
    fetchDocuments();
  }, [user]);

  const fetchDocuments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('kyc_documents')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setDocuments(data || []);
    } catch (error: any) {
      console.error('Error fetching documents:', error);
    }
  };

  const getDocumentStatus = (type: DocumentType) => {
    const doc = documents.find(d => d.document_type === type);
    return doc?.status || 'pending';
  };

  const handleFileUpload = async (type: DocumentType, file: File) => {
    if (!user) return;

    try {
      setUploading({ ...uploading, [type]: true });

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${type}_${Date.now()}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('kyc-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('kyc-documents')
        .getPublicUrl(fileName);

      // Save document record
      const { error: dbError } = await supabase
        .from('kyc_documents')
        .insert({
          user_id: user.id,
          document_type: type,
          file_url: publicUrl,
          status: 'pending',
        });

      if (dbError) throw dbError;

      toast.success('Document uploaded successfully');
      fetchDocuments();
      await refreshProfile();
    } catch (error: any) {
      toast.error('Error uploading document: ' + error.message);
    } finally {
      setUploading({ ...uploading, [type]: false });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            {t.kyc.approved}
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            {t.kyc.rejected}
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            {t.kyc.pending}
          </Badge>
        );
    }
  };

  const renderUploadCard = (
    type: DocumentType,
    title: string,
    description: string
  ) => {
    const status = getDocumentStatus(type);
    const isUploading = uploading[type];
    const doc = documents.find(d => d.document_type === type);

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{title}</CardTitle>
            {getStatusBadge(status)}
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {doc ? (
            <div className="space-y-4">
              <div className="border rounded-lg p-4 flex items-center gap-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Document uploaded</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(doc.uploaded_at).toLocaleDateString()}
                  </p>
                  {doc.admin_notes && (
                    <p className="text-xs text-orange-500 mt-1">{doc.admin_notes}</p>
                  )}
                </div>
              </div>
              {status === 'rejected' && (
                <Button 
                  onClick={() => fileInputRefs[type].current?.click()}
                  disabled={isUploading}
                  variant="outline"
                  className="w-full"
                >
                  Upload New Document
                </Button>
              )}
            </div>
          ) : (
            <div 
              className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
              onClick={() => fileInputRefs[type].current?.click()}
            >
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, PDF up to 10MB
              </p>
              <Button className="mt-4" variant="outline" disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Choose File'}
              </Button>
            </div>
          )}
          <input
            ref={fileInputRefs[type]}
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(type, file);
            }}
          />
        </CardContent>
      </Card>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t.kyc.title}</h1>
          <p className="text-muted-foreground">{t.kyc.subtitle}</p>
          
          {profile && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm font-medium">Current Status:</span>
              {getStatusBadge(profile.kyc_status)}
              <Badge variant="outline">{profile.kyc_level}</Badge>
            </div>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {renderUploadCard(
            'id',
            t.kyc.uploadId,
            'Government-issued ID (Passport, Driver\'s License, or National ID)'
          )}
          
          {renderUploadCard(
            'address_proof',
            t.kyc.uploadAddress,
            'Recent utility bill, bank statement, or rental agreement'
          )}
        </div>

        <div className="grid gap-6">
          {renderUploadCard(
            'selfie',
            'Upload Selfie',
            'A clear selfie photo for identity verification'
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t.kyc.status}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">ID Document</span>
                {getStatusBadge(getDocumentStatus('id'))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Proof of Address</span>
                {getStatusBadge(getDocumentStatus('address_proof'))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Selfie</span>
                {getStatusBadge(getDocumentStatus('selfie'))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
