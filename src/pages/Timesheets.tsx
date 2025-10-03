import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, Download, FileText } from 'lucide-react';

export default function Timesheets() {
  const [selectedPeriod, setSelectedPeriod] = useState('current-week');

  // Mock data
  const timeEntries = [
    {
      id: '1',
      date: '2025-01-20',
      jobSite: 'Oak Street Residential',
      checkIn: '08:00 AM',
      checkOut: '04:30 PM',
      breakTime: '0.5 hrs',
      totalHours: '8.0 hrs',
      status: 'approved'
    },
    {
      id: '2',
      date: '2025-01-19',
      jobSite: 'Downtown HVAC Install',
      checkIn: '07:30 AM',
      checkOut: '05:00 PM',
      breakTime: '1.0 hrs',
      totalHours: '8.5 hrs',
      status: 'approved'
    },
    {
      id: '3',
      date: '2025-01-18',
      jobSite: 'Park Ridge Landscaping',
      checkIn: '08:00 AM',
      checkOut: '03:45 PM',
      breakTime: '0.5 hrs',
      totalHours: '7.25 hrs',
      status: 'pending'
    }
  ];

  const weeklyTotal = timeEntries.reduce((sum, entry) => {
    return sum + parseFloat(entry.totalHours);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Timesheets</h1>
          <p className="text-muted-foreground">View and manage your work hours</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Select Period
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {weeklyTotal.toFixed(1)} hrs
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              3 days worked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Overtime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              0.0 hrs
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              No overtime this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Approved:</span>
                <span className="font-semibold">2</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pending:</span>
                <span className="font-semibold">1</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Time Entries</CardTitle>
          <CardDescription>Detailed breakdown of your work hours</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Job Site</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Break</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timeEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">
                    {new Date(entry.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{entry.jobSite}</TableCell>
                  <TableCell>{entry.checkIn}</TableCell>
                  <TableCell>{entry.checkOut}</TableCell>
                  <TableCell>{entry.breakTime}</TableCell>
                  <TableCell className="font-semibold">{entry.totalHours}</TableCell>
                  <TableCell>
                    <Badge variant={entry.status === 'approved' ? 'default' : 'secondary'}>
                      {entry.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
