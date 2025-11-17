import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Language, useTranslation } from '@/lib/i18n';

export default function KYC() {
  const [lang] = useState<Language>('en');
  const t = useTranslation(lang);
  const [idStatus, setIdStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [addressStatus, setAddressStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t.kyc.title}</h1>
          <p className="text-muted-foreground">{t.kyc.subtitle}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t.kyc.uploadId}</CardTitle>
                {getStatusBadge(idStatus)}
              </div>
              <CardDescription>
                Government-issued ID (Passport, Driver's License, or National ID)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  {t.kyc.dragDrop}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t.kyc.supportedFormats}
                </p>
                <Button className="mt-4" variant="outline">
                  {t.kyc.uploadButton}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t.kyc.uploadAddress}</CardTitle>
                {getStatusBadge(addressStatus)}
              </div>
              <CardDescription>
                Recent utility bill, bank statement, or rental agreement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  {t.kyc.dragDrop}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t.kyc.supportedFormats}
                </p>
                <Button className="mt-4" variant="outline">
                  {t.kyc.uploadButton}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t.kyc.status}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">ID Document</span>
                {getStatusBadge(idStatus)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Proof of Address</span>
                {getStatusBadge(addressStatus)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
