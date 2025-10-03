import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MapPin, Search, Plus, QrCode } from 'lucide-react';

export default function JobSites() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for demonstration
  const jobSites = [
    {
      id: '1',
      name: 'Oak Street Residential',
      address: '1234 Oak Street, Springfield, IL',
      status: 'active',
      workersOnSite: 3,
      qrCode: 'QR-OAK-001'
    },
    {
      id: '2',
      name: 'Downtown HVAC Install',
      address: '567 Main Ave, Springfield, IL',
      status: 'active',
      workersOnSite: 5,
      qrCode: 'QR-DWN-002'
    },
    {
      id: '3',
      name: 'Park Ridge Landscaping',
      address: '890 Park Ridge Dr, Springfield, IL',
      status: 'active',
      workersOnSite: 2,
      qrCode: 'QR-PRK-003'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Sites</h1>
          <p className="text-muted-foreground">Manage all active job locations</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Job Site
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search job sites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {jobSites.map((site) => (
          <Card key={site.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{site.name}</CardTitle>
                <Badge variant={site.status === 'active' ? 'default' : 'secondary'}>
                  {site.status}
                </Badge>
              </div>
              <CardDescription className="flex items-start">
                <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                {site.address}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Workers on site:</span>
                <span className="font-semibold">{site.workersOnSite}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <QrCode className="h-4 w-4 mr-1" />
                  View QR
                </Button>
                <Button size="sm" className="flex-1">
                  Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
