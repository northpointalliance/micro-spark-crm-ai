import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EditContactDialog } from "@/components/EditContactDialog";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "@/hooks/use-toast";
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

type Contact = Tables<"contacts">;

export default function Contacts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "lead",
  });

  const fetchContacts = async () => {
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Error loading contacts", description: error.message, variant: "destructive" });
    } else {
      setContacts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      searchTerm === "" ||
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === null || contact.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.name || !newContact.email) return;
    const { error } = await supabase.from("contacts").insert({
      name: newContact.name,
      email: newContact.email,
      phone: newContact.phone || null,
      company: newContact.company || null,
      status: newContact.status,
    });
    if (error) {
      toast({ title: "Error adding contact", description: error.message, variant: "destructive" });
    } else {
      setNewContact({ name: "", email: "", phone: "", company: "", status: "lead" });
      setIsAddOpen(false);
      fetchContacts();
    }
  };

  const handleDeleteContact = async (id: string) => {
    const { error } = await supabase.from("contacts").delete().eq("id", id);
    if (error) {
      toast({ title: "Error deleting contact", description: error.message, variant: "destructive" });
    } else {
      fetchContacts();
    }
  };

  const handleSaveContact = async (updated: Contact) => {
    const { error } = await supabase
      .from("contacts")
      .update({
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        company: updated.company,
        status: updated.status,
      })
      .eq("id", updated.id);
    if (error) {
      toast({ title: "Error updating contact", description: error.message, variant: "destructive" });
    } else {
      fetchContacts();
    }
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
                <Input id="new-name" value={newContact.name} onChange={(e) => setNewContact({ ...newContact, name: e.target.value })} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-email">Email *</Label>
                <Input id="new-email" type="email" value={newContact.email} onChange={(e) => setNewContact({ ...newContact, email: e.target.value })} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-phone">Phone</Label>
                <Input id="new-phone" type="tel" value={newContact.phone} onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-company">Company</Label>
                <Input id="new-company" value={newContact.company} onChange={(e) => setNewContact({ ...newContact, company: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-status">Status</Label>
                <Select value={newContact.status} onValueChange={(value) => setNewContact({ ...newContact, status: value })}>
                  <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
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
          <CardTitle>All Contacts ({contacts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search contacts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusFilter || ""} onValueChange={(value) => setStatusFilter(value === "all" ? null : value)}>
              <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Filter by status" /></SelectTrigger>
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

          {loading ? (
            <div className="text-center py-10"><p className="text-muted-foreground">Loading contacts...</p></div>
          ) : (
            <div className="space-y-2">
              {filteredContacts.length === 0 ? (
                <div className="text-center py-10"><p className="text-muted-foreground">No contacts found</p></div>
              ) : (
                filteredContacts.map((contact) => (
                  <ContactCard key={contact.id} contact={contact} onSave={handleSaveContact} onDelete={handleDeleteContact} />
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ContactCard({ contact, onSave, onDelete }: { contact: Contact; onSave: (c: Contact) => void; onDelete: (id: string) => void }) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-crm-blue-light text-crm-blue">
              {contact.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <h3 className="font-medium">{contact.name}</h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-muted-foreground">
              <span>{contact.email}</span>
              {contact.company && <span className="hidden sm:inline">• {contact.company}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <EditContactDialog contact={contact} onSave={onSave} />
          <Badge variant="outline" className={
            contact.status === "customer" ? "bg-green-50 text-green-700 hover:bg-green-50"
              : contact.status === "prospect" ? "bg-blue-50 text-blue-700 hover:bg-blue-50"
              : contact.status === "lead" ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-50"
              : "bg-gray-50 text-gray-700 hover:bg-gray-50"
          }>
            {contact.status}
          </Badge>
        </div>
      </div>

      {(contact.phone || contact.tags || contact.category) && (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {contact.phone && (
            <div className="flex items-center text-sm">
              <Phone className="h-3 w-3 text-muted-foreground mr-1" />
              <span>{contact.phone}</span>
            </div>
          )}
          {contact.category && (
            <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded">{contact.category}</span>
          )}
          {contact.platform && (
            <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded">{contact.platform}</span>
          )}
          {contact.tags && contact.tags.length > 0 && contact.tags.map((tag) => (
            <span key={tag} className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded">{tag}</span>
          ))}
        </div>
      )}

      {contact.notes && (
        <p className="mt-2 text-xs text-muted-foreground truncate">{contact.notes}</p>
      )}

      <div className="mt-3 pt-3 border-t flex justify-between items-center">
        <div className="text-xs text-muted-foreground">
          {contact.website && <a href={`https://${contact.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{contact.website}</a>}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost"><Mail className="h-4 w-4" /></Button>
          <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700" onClick={() => onDelete(contact.id)}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
