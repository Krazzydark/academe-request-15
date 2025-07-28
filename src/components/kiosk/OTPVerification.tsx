import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Mail, Phone, RefreshCw, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OTPVerificationProps {
  onVerified: (data: { studentId: string; contact: string; isEmail: boolean }) => void;
}

const OTPVerification = ({ onVerified }: OTPVerificationProps) => {
  const [step, setStep] = useState<'contact' | 'otp'>('contact');
  const [contactMethod, setContactMethod] = useState<'email' | 'mobile'>('email');
  const [studentId, setStudentId] = useState('');
  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const { toast } = useToast();

  const handleSendOTP = async () => {
    if (!studentId || !contact) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate OTP sending
    setTimeout(() => {
      setOtpSent(true);
      setStep('otp');
      setTimeLeft(300); // 5 minutes
      setIsLoading(false);
      
      // Start countdown timer
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      toast({
        title: "OTP Sent",
        description: `A 6-digit verification code has been sent to your ${contactMethod}.`,
      });
    }, 2000);
  };

  const handleVerifyOTP = () => {
    if (otp.length !== 6) {
      setOtpError('Please enter a complete 6-digit code.');
      return;
    }

    // Simulate OTP verification (in real app, this would call an API)
    if (otp === '123456') {
      onVerified({ 
        studentId, 
        contact, 
        isEmail: contactMethod === 'email' 
      });
    } else {
      setOtpError('Invalid OTP. Please try again.');
    }
  };

  const handleResendOTP = () => {
    setOtp('');
    setOtpError('');
    handleSendOTP();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (step === 'contact') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Identity Verification</h2>
          <p className="text-muted-foreground">
            Enter your Student ID and contact information to receive a verification code
          </p>
        </div>

        <div className="max-w-md mx-auto space-y-4">
          <div className="space-y-2">
            <Label htmlFor="studentId">Student ID *</Label>
            <Input
              id="studentId"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Enter your Student ID"
              className="text-center font-mono"
            />
          </div>

          <Tabs value={contactMethod} onValueChange={(value) => setContactMethod(value as 'email' | 'mobile')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="mobile" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Mobile
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="student@university.edu"
              />
            </TabsContent>

            <TabsContent value="mobile" className="space-y-2">
              <Label htmlFor="mobile">Mobile Number *</Label>
              <Input
                id="mobile"
                type="tel"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </TabsContent>
          </Tabs>

          <Button 
            onClick={handleSendOTP} 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
            Send Verification Code
          </Button>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              For security purposes, we'll send a 6-digit verification code to confirm your identity.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-success mr-2" />
          <Badge variant="secondary" className="px-3 py-1">
            Code Sent
          </Badge>
        </div>
        <h2 className="text-2xl font-bold mb-2">Enter Verification Code</h2>
        <p className="text-muted-foreground">
          We've sent a 6-digit code to your {contactMethod === 'email' ? 'email' : 'mobile number'}
        </p>
        <p className="text-sm font-medium text-primary mt-1">{contact}</p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">Verification Code</Label>
          <Input
            id="otp"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
              setOtpError('');
            }}
            placeholder="Enter 6-digit code"
            className="text-center font-mono text-lg tracking-wider"
            maxLength={6}
          />
          {otpError && (
            <p className="text-sm text-destructive">{otpError}</p>
          )}
        </div>

        <Button 
          onClick={handleVerifyOTP} 
          className="w-full"
          disabled={otp.length !== 6}
        >
          Verify Code
        </Button>

        <div className="text-center space-y-2">
          {timeLeft > 0 ? (
            <p className="text-sm text-muted-foreground">
              Code expires in {formatTime(timeLeft)}
            </p>
          ) : (
            <Button 
              variant="outline" 
              onClick={handleResendOTP}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
              Resend Code
            </Button>
          )}
        </div>

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            For demo purposes, use code: <strong>123456</strong>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default OTPVerification;