
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { countByStatus, mockActivities, mockContacts, mockMessages } from "@/data/mockData";
import { Users, MessageCircle, Mail, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function Dashboard() {
  // Get counts
  const stats = countByStatus();
  
  // Recent contacts (last 5)
  const recentContacts = [...mockContacts].sort((a, b) => {
    const dateA = a.lastContact ? new Date(a.lastContact).getTime() : 0;
    const dateB = b.lastContact ? new Date(b.lastContact).getTime() : 0;
    return dateB - dateA;
  }).slice(0, 5);
  
  // Recent activities (last 5)
  const recentActivities = [...mockActivities].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  }).slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="text-sm text-gray-500">
          {format(new Date(), "EEEE, MMMM d, yyyy")}
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockContacts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all categories
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.customer}</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <span>+2.5% from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">New Leads</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lead}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Require follow-up
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Messages Sent</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{
              mockMessages.filter(m => m.status === 'sent').length
            }</div>
            <p className="text-xs text-muted-foreground mt-1">
              This month
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Contacts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Contacts</CardTitle>
              <CardDescription>Recent contact activity</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/contacts">
                View all
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentContacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-crm-blue-light text-crm-blue">
                        {contact.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{contact.name}</p>
                      <p className="text-xs text-muted-foreground">{contact.email}</p>
                    </div>
                  </div>
                  <Badge 
                    variant="outline"
                    className={
                      contact.status === 'customer' ? 'bg-green-50 text-green-700 hover:bg-green-50' :
                      contact.status === 'prospect' ? 'bg-blue-50 text-blue-700 hover:bg-blue-50' :
                      contact.status === 'lead' ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-50' :
                      'bg-gray-50 text-gray-700 hover:bg-gray-50'
                    }
                  >
                    {contact.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent interactions</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const contact = mockContacts.find(c => c.id === activity.contactId);
                
                return (
                  <div key={activity.id} className="flex items-start gap-4">
                    <div className="mt-1">
                      {activity.type === 'email' && <Mail className="h-4 w-4 text-blue-500" />}
                      {activity.type === 'call' && <Users className="h-4 w-4 text-green-500" />}
                      {activity.type === 'meeting' && <Calendar className="h-4 w-4 text-purple-500" />}
                      {activity.type === 'note' && <MessageCircle className="h-4 w-4 text-yellow-500" />}
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">{contact?.name}</span>
                        <span className="text-gray-500"> - {activity.description}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(activity.date), "MMM d, h:mm a")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* AI Assistant Card */}
      <Card className="bg-gradient-to-r from-crm-blue-light to-white">
        <CardHeader>
          <CardTitle>AI Assistant</CardTitle>
          <CardDescription>Let AI help you craft the perfect message</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">
              Try prompts like:
            </p>
            <div className="mt-2 space-y-2">
              <Button variant="outline" size="sm" className="mr-2">
                "Draft a follow-up email to a lead"
              </Button>
              <Button variant="outline" size="sm">
                "Create a meeting proposal"
              </Button>
            </div>
          </div>
          <Button className="bg-crm-blue hover:bg-crm-blue-dark">
            Open AI Message Writer
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
