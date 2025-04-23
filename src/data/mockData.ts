
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'lead' | 'prospect' | 'customer' | 'inactive';
  lastContact?: string;
  notes?: string;
  tags?: string[];
  avatar?: string;
}

export interface Message {
  id: string;
  contactId: string;
  subject: string;
  content: string;
  date: string;
  type: 'email' | 'sms' | 'note';
  status: 'draft' | 'sent' | 'scheduled';
}

export interface Activity {
  id: string;
  contactId: string;
  type: 'email' | 'note' | 'call' | 'meeting';
  description: string;
  date: string;
}

export interface Template {
  id: string;
  name: string;
  subject: string;
  content: string;
  category: 'followup' | 'introduction' | 'proposal' | 'other';
}

// Mock Contacts
export const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    phone: '555-123-4567',
    company: 'ABC Corp',
    status: 'customer',
    lastContact: '2023-04-20T08:30:00',
    notes: 'Interested in our premium plan',
    tags: ['retail', 'loyal'],
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '555-987-6543',
    company: 'XYZ Inc',
    status: 'lead',
    lastContact: '2023-04-18T14:20:00',
    notes: 'Follow up about pricing',
    tags: ['manufacturing'],
  },
  {
    id: '3',
    name: 'Maria Garcia',
    email: 'mgarcia@business.co',
    phone: '555-555-5555',
    company: 'Local Shop',
    status: 'prospect',
    lastContact: '2023-04-15T11:00:00',
    tags: ['retail', 'new'],
  },
  {
    id: '4',
    name: 'Robert Chen',
    email: 'robert@chenconsulting.com',
    phone: '555-222-3333',
    company: 'Chen Consulting',
    status: 'customer',
    lastContact: '2023-04-19T09:15:00',
    notes: 'Renewed annual contract',
    tags: ['consulting', 'loyal'],
  },
  {
    id: '5',
    name: 'Sarah Johnson',
    email: 'sjohnson@acme.org',
    status: 'inactive',
    lastContact: '2023-03-10T16:45:00',
    notes: 'No response to last 3 emails',
  },
];

// Mock Messages
export const mockMessages: Message[] = [
  {
    id: '1',
    contactId: '1',
    subject: 'Follow up on our conversation',
    content: 'Hi Jane, I wanted to follow up on our conversation from last week about the premium plan. Are you still interested in upgrading?',
    date: '2023-04-20T08:30:00',
    type: 'email',
    status: 'sent',
  },
  {
    id: '2',
    contactId: '2',
    subject: 'Pricing information',
    content: 'Hello John, As promised, I\'m sending over our pricing information for the services we discussed yesterday.',
    date: '2023-04-18T14:20:00',
    type: 'email',
    status: 'sent',
  },
  {
    id: '3',
    contactId: '3',
    subject: 'Introduction to our services',
    content: 'Hi Maria, Thank you for your interest in our services. I\'d love to schedule a call to discuss how we can help your business.',
    date: '2023-04-17T11:00:00',
    type: 'email',
    status: 'draft',
  },
  {
    id: '4',
    contactId: '4',
    subject: 'Thank you for renewing',
    content: 'Robert, Thank you for renewing your annual contract with us. We look forward to another great year working together.',
    date: '2023-04-19T09:15:00',
    type: 'email',
    status: 'scheduled',
  },
];

// Mock Activities
export const mockActivities: Activity[] = [
  {
    id: '1',
    contactId: '1',
    type: 'email',
    description: 'Sent follow-up email about premium plan',
    date: '2023-04-20T08:30:00',
  },
  {
    id: '2',
    contactId: '2',
    type: 'call',
    description: 'Discussed pricing options',
    date: '2023-04-18T14:20:00',
  },
  {
    id: '3',
    contactId: '3',
    type: 'note',
    description: 'Added notes about their specific retail needs',
    date: '2023-04-15T11:00:00',
  },
  {
    id: '4',
    contactId: '4',
    type: 'meeting',
    description: 'Annual review meeting',
    date: '2023-04-19T09:15:00',
  },
];

// Mock Templates
export const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Initial Follow-up',
    subject: 'Following up on our conversation',
    content: 'Hi {{name}},\n\nI wanted to follow up on our recent conversation about {{topic}}. Do you have any questions I can help with?\n\nBest regards,\n{{user}}',
    category: 'followup',
  },
  {
    id: '2',
    name: 'Introduction Email',
    subject: 'Nice to meet you - {{company}}',
    content: 'Hi {{name}},\n\nIt was great meeting you at {{event}}. I\'d love to continue our conversation about {{topic}}.\n\nBest regards,\n{{user}}',
    category: 'introduction',
  },
  {
    id: '3',
    name: 'Proposal Follow-up',
    subject: 'Regarding our proposal',
    content: 'Dear {{name}},\n\nI'm writing to follow up on the proposal we sent last week. I\'d be happy to answer any questions or provide additional information.\n\nBest regards,\n{{user}}',
    category: 'proposal',
  },
];

// Helper functions for data retrieval
export const getContactById = (id: string): Contact | undefined => {
  return mockContacts.find(contact => contact.id === id);
};

export const getContactMessages = (contactId: string): Message[] => {
  return mockMessages.filter(message => message.contactId === contactId);
};

export const getContactActivities = (contactId: string): Activity[] => {
  return mockActivities.filter(activity => activity.contactId === contactId);
};

export const getContactsByStatus = (status: Contact['status']): Contact[] => {
  return mockContacts.filter(contact => contact.status === status);
};

export const countByStatus = (): Record<Contact['status'], number> => {
  const counts: Record<Contact['status'], number> = {
    lead: 0,
    prospect: 0,
    customer: 0,
    inactive: 0,
  };
  
  mockContacts.forEach(contact => {
    counts[contact.status]++;
  });
  
  return counts;
};
