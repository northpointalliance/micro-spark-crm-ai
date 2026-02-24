import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockContacts, Contact } from "@/data/mockData";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EditContactDialog } from "@/components/EditContactDialog";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Trash, Mail, Phone } from "lucide-react";

export default function Contacts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newContact, setNewContact] = useState<Partial<Contact>>({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "lead",
  });

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      searchTerm === "" ||
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.company &&
        contact.company.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === null || contact.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.name || !newContact.email) return;
    const contact: Contact = {
      id: `contact-${Date.now()}`,
      name: newContact.name,
      email: newContact.email,
      phone: newContact.phone || undefined,
      company: newContact.company || undefined,
      status: (newContact.status as Contact["status"]) || "lead",
    };
    setContacts([contact, ...contacts]);
    setNewContact({ name: "", email: "", phone: "", company: "", status: "lead" });
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Contacts</h1>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-crm-blue hover:bg-crm-blue-dark">
              <Plus className="mr-2 h-4 w-4" /> Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddContact} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="new-name">Name *</Label>
                <Input
                  id="new-name"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-email">Email *</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-phone">Phone</Label>
                <Input
                  id="new-phone"
                  type="tel"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-company">Company</Label>
                <Input
                  id="new-company"
                  value={newContact.company}
                  onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-status">Status</Label>
                <Select
                  value={newContact.status}
                  onValueChange={(value: Contact["status"]) => setNewContact({ ...newContact, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="prospect">Prospect</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end">
                <Button type="submit">Add Contact</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilter || ""}
              onValueChange={(value) => setStatusFilter(value === "all" ? null : value)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="all">All Contacts</SelectItem>
                  <SelectItem value="lead">Leads</SelectItem>
                  <SelectItem value="prospect">Prospects</SelectItem>
                  <SelectItem value="customer">Customers</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            {filteredContacts.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No contacts found</p>
              </div>
            ) : (
              filteredContacts.map((contact) => (
                <ContactCard key={contact.id} contact={contact} />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ContactCard({ contact }: { contact: Contact }) {
  const handleSave = (updatedContact: Contact) => {
    console.log('Contact updated:', updatedContact);
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-crm-blue-light text-crm-blue">
              {contact.name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <h3 className="font-medium">{contact.name}</h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-gray-500">
              <span>{contact.email}</span>
              {contact.company && (
                <span className="hidden sm:inline">• {contact.company}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <EditContactDialog contact={contact} onSave={handleSave} />
          <Badge
            variant="outline"
            className={
              contact.status === "customer"
                ? "bg-green-50 text-green-700 hover:bg-green-50"
                : contact.status === "prospect"
                ? "bg-blue-50 text-blue-700 hover:bg-blue-50"
                : contact.status === "lead"
                ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-50"
                : "bg-gray-50 text-gray-700 hover:bg-gray-50"
            }
          >
            {contact.status}
          </Badge>
        </div>
      </div>

      {(contact.phone || contact.tags) && (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {contact.phone && (
            <div className="flex items-center text-sm">
              <Phone className="h-3 w-3 text-gray-400 mr-1" />
              <span>{contact.phone}</span>
            </div>
          )}
          {contact.tags && contact.tags.length > 0 && (
            <div className="flex gap-2">
              {contact.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-3 pt-3 border-t flex justify-between items-center">
        <div className="text-xs text-gray-500">
          {contact.lastContact
            ? `Last contacted: ${new Date(
                contact.lastContact
              ).toLocaleDateString()}`
            : "No previous contact"}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost">
            <Mail className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700">
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
