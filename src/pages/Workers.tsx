import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Plus, UserPlus } from 'lucide-react';
import { useState } from 'react';

export default function Workers() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const workers = [
    {
      id: '1',
      name: 'John Martinez',
      role: 'worker',
      phone: '555-0101',
      status: 'on-site',
      currentSite: 'Oak Street Residential',
      hoursToday: 6.5
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      role: 'supervisor',
      phone: '555-0102',
      status: 'on-site',
      currentSite: 'Downtown HVAC Install',
      hoursToday: 7.0
    },
    {
      id: '3',
      name: 'Mike Chen',
      role: 'worker',
      phone: '555-0103',
      status: 'off-duty',
      currentSite: null,
      hoursToday: 0
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-site':
        return 'default';
      case 'off-duty':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workers</h1>
          <p className="text-muted-foreground">Manage your field service team</p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Worker
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search workers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {workers.map((worker) => (
          <Card key={worker.id}>
            <CardHeader>
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(worker.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{worker.name}</CardTitle>
                  <CardDescription className="capitalize">{worker.role}</CardDescription>
                </div>
                <Badge variant={getStatusColor(worker.status)}>
                  {worker.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-medium">{worker.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hours Today:</span>
                  <span className="font-semibold text-primary">
                    {worker.hoursToday} hrs
                  </span>
                </div>
                {worker.currentSite && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">Current Site:</p>
                    <p className="text-sm font-medium">{worker.currentSite}</p>
                  </div>
                )}
              </div>
              <Button variant="outline" size="sm" className="w-full">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
