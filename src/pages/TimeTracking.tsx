import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Camera, QrCode, Wifi, WifiOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export default function TimeTracking() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [activeSession, setActiveSession] = useState<any>(null);
  const [todayHours, setTodayHours] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleScanQR = () => {
    toast({
      title: "QR Scanner",
      description: "QR code scanning functionality will open your camera",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Time Clock</h1>
          <p className="text-muted-foreground">Track your work hours at job sites</p>
        </div>
        <Badge variant={isOnline ? "default" : "secondary"} className="text-sm">
          {isOnline ? (
            <>
              <Wifi className="mr-1 h-4 w-4" />
              Online
            </>
          ) : (
            <>
              <WifiOff className="mr-1 h-4 w-4" />
              Offline
            </>
          )}
        </Badge>
      </div>

      <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="text-6xl font-bold text-primary">
              {formatTime(currentTime)}
            </div>
            <div className="text-lg text-muted-foreground">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today's Hours</CardTitle>
            <CardDescription>Total time worked today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">
              {todayHours.toFixed(1)} hrs
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Status</CardTitle>
            <CardDescription>Your current work session</CardDescription>
          </CardHeader>
          <CardContent>
            {activeSession ? (
              <div className="space-y-2">
                <Badge className="bg-accent">Clocked In</Badge>
                <p className="text-sm text-muted-foreground">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  {activeSession.job_site}
                </p>
              </div>
            ) : (
              <div className="text-muted-foreground">Not clocked in</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Check in or out of job sites</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            size="lg" 
            className="w-full"
            onClick={handleScanQR}
          >
            <QrCode className="mr-2 h-5 w-5" />
            Scan QR Code to Check In
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="w-full"
          >
            <Camera className="mr-2 h-5 w-5" />
            Take Photo Proof
          </Button>

          {activeSession && (
            <Button 
              size="lg" 
              variant="destructive" 
              className="w-full"
            >
              <Clock className="mr-2 h-5 w-5" />
              Check Out
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
