import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { mockTemplates, mockMessages, mockContacts } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MessageSquare, Send, Clock, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function Messages() {
  const [messageContent, setMessageContent] = useState('');
  const [messageSubject, setMessageSubject] = useState('');
  const [selectedContact, setSelectedContact] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const { toast } = useToast();

  const applyTemplate = () => {
    if (!selectedTemplate) {
      toast({
        title: "Error",
        description: "Please select a template first",
        variant: "destructive",
      });
      return;
    }

    const template = mockTemplates.find(t => t.id === selectedTemplate);
    
    if (template) {
      setMessageSubject(template.subject.replace('{{company}}', 'Your Company'));
      setMessageContent(template.content
        .replace('{{name}}', selectedContact ? 
          mockContacts.find(c => c.id === selectedContact)?.name || 'Customer' : 'Customer')
        .replace('{{topic}}', 'our services')
        .replace('{{event}}', 'the conference')
        .replace('{{user}}', 'Me')
      );
      
      toast({
        title: "Template Applied",
        description: "The template has been applied to your message",
      });
    }
  };
  
  const generateWithAI = () => {
    // In a real app, this would call an AI service
    const aiResponses = [
      "I noticed you recently viewed our premium service offerings. I'd love to answer any questions you might have about how our solutions could benefit your specific needs.",
      "Following up on our conversation about streamlining your customer engagement. Our platform could help you save up to 5 hours per week on routine communications while maintaining that personal touch.",
      "Thank you for your interest in our services. Based on what you shared about your business challenges, I think our starter package would be a perfect fit to address your immediate needs while staying within budget."
    ];
    
    const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
    
    setMessageContent(randomResponse);
    
    toast({
      title: "AI Content Generated",
      description: "Your message has been created with AI assistance",
    });
  };
  
  const sendMessage = () => {
    if (!messageContent || !messageSubject || !selectedContact) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Message Sent",
      description: "Your message has been sent successfully",
    });
    
    // Reset form
    setMessageContent('');
    setMessageSubject('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold tracking-tight">Messaging Center</h1>
      
      <Tabs defaultValue="compose">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="compose" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>New Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Select value={selectedContact} onValueChange={setSelectedContact}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select recipient" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockContacts.map(contact => (
                      <SelectItem key={contact.id} value={contact.id}>
                        {contact.name} ({contact.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Input
                  placeholder="Subject"
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Textarea 
                  placeholder="Type your message here..."
                  className="min-h-[200px]"
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center pt-2">
                <div className="flex gap-3">
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Use template" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTemplates.map(template => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" onClick={applyTemplate}>
                    Apply
                  </Button>
                </div>
                
                <div className="flex gap-3 w-full sm:w-auto">
                  <Button 
                    className="flex-1 sm:flex-auto"
                    variant="outline" 
                    onClick={generateWithAI}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate with AI
                  </Button>
                  
                  <Button 
                    className="flex-1 sm:flex-auto bg-crm-blue hover:bg-crm-blue-dark" 
                    onClick={sendMessage}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Send
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sent" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Sent Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockMessages
                  .filter(msg => msg.status === 'sent')
                  .map(message => {
                    const contact = mockContacts.find(c => c.id === message.contactId);
                    
                    return (
                      <div key={message.id} className="border-b pb-4 last:border-b-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                          <div>
                            <h3 className="font-medium">{message.subject}</h3>
                            <p className="text-sm text-gray-500">To: {contact?.name}</p>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 sm:mt-0">
                            {format(new Date(message.date), "MMM d, yyyy")}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{message.content}</p>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="ghost">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            View
                          </Button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Message Templates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockTemplates.map(template => (
                <div key={template.id} className="border rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                    <h3 className="font-medium">{template.name}</h3>
                    <Badge variant="outline">{template.category}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{template.subject}</p>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{template.content}</p>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm" className="bg-crm-blue hover:bg-crm-blue-dark">Use</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <div className="flex justify-center">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Template
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
