
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, AlertCircle, Check } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Email() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold tracking-tight">Email Integration</h1>
      
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Connect Your Gmail Account</CardTitle>
          <CardDescription>
            Link your Gmail account to send and receive emails directly from MicroCRM
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="default" className="bg-yellow-50 text-yellow-800 border-yellow-200">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Not Connected</AlertTitle>
            <AlertDescription>
              Your Gmail account is not yet connected to MicroCRM. Connect your account to start sending and receiving emails.
            </AlertDescription>
          </Alert>
          
          <div className="flex justify-center py-6">
            <div className="bg-gray-100 rounded-full p-6">
              <Mail className="h-12 w-12 text-crm-blue" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-center">Benefits of connecting Gmail:</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Send emails directly from MicroCRM</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>View your email history alongside contact records</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Schedule emails to be sent later</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Use AI to draft email responses</span>
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button className="bg-crm-blue hover:bg-crm-blue-dark">
            <Mail className="mr-2 h-4 w-4" />
            Connect Gmail
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Email Settings</CardTitle>
          <CardDescription>
            Configure your email preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-gray-500 py-8">
          Connect your Gmail account to access email settings
        </CardContent>
      </Card>
    </div>
  );
}
