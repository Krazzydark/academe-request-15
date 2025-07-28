import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  CreditCard, 
  DollarSign, 
  Download,
  Mail,
  Phone,
  CheckCircle,
  Clock,
  User,
  FileText,
  Smartphone
} from "lucide-react";
import { StudentData, SelectedDocument } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";

interface PaymentInformationProps {
  studentData: StudentData;
  selectedDocuments: SelectedDocument[];
  onSubmit: () => void;
  onBack: () => void;
}

const PaymentInformation = ({ studentData, selectedDocuments, onSubmit, onBack }: PaymentInformationProps) => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const { toast } = useToast();

  const getTotalAmount = () => {
    return selectedDocuments.reduce((total, doc) => total + (doc.fee * doc.copies), 0);
  };

  const getProcessingTime = () => {
    const hasTranscript = selectedDocuments.some(doc => doc.name.includes("Transcript"));
    const hasDiploma = selectedDocuments.some(doc => doc.name.includes("Diploma"));
    
    if (hasTranscript || hasDiploma) {
      return "5-7 business days";
    }
    return "2-3 business days";
  };

  const generateReferenceNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `DOC-${timestamp}-${random}`;
  };

  const handleSubmit = async () => {
    if (!paymentMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method to proceed.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate submission process
    setTimeout(() => {
      const refNumber = generateReferenceNumber();
      setReferenceNumber(refNumber);
      setIsSubmitted(true);
      setIsSubmitting(false);
      onSubmit();
    }, 3000);
  };

  const handleDownloadSummary = () => {
    // In a real application, this would generate and download a PDF
    toast({
      title: "Download Started",
      description: "Your request summary is being downloaded.",
    });
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto w-16 h-16 bg-success rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-8 h-8 text-success-foreground" />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-success mb-2">Request Submitted Successfully!</h2>
          <p className="text-muted-foreground mb-4">
            Your document request has been processed and submitted.
          </p>
        </div>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-lg">Request Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reference Number:</span>
              <span className="font-mono font-medium">{referenceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Amount:</span>
              <span className="font-medium">${getTotalAmount()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Processing Time:</span>
              <span className="font-medium">{getProcessingTime()}</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <Button onClick={handleDownloadSummary} variant="outline" className="w-full max-w-md">
            <Download className="w-4 h-4 mr-2" />
            Download Request Summary
          </Button>
          
          <Alert className="max-w-md mx-auto">
            <Mail className="h-4 w-4" />
            <AlertDescription>
              A confirmation email with tracking details has been sent to {studentData.email}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <CreditCard className="h-16 w-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Payment Information</h2>
        <p className="text-muted-foreground">
          Review your request and complete the payment process
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Student Information Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Student Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-medium">{studentData.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Student ID</p>
                <p className="font-medium font-mono">{studentData.studentId}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Course</p>
                <p className="font-medium">{studentData.course}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Year</p>
                <p className="font-medium">{studentData.yearGraduated}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{studentData.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Contact</p>
                <p className="font-medium">{studentData.contactNumber}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Document Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedDocuments.map((doc, index) => (
                <div key={doc.id}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{doc.name}</p>
                        <Badge variant="secondary">{doc.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Purpose: {doc.purpose}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {doc.copies} {doc.copies === 1 ? 'copy' : 'copies'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${doc.fee * doc.copies}</p>
                      <p className="text-sm text-muted-foreground">
                        ${doc.fee} × {doc.copies}
                      </p>
                    </div>
                  </div>
                  {index < selectedDocuments.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
              
              <Separator />
              
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total Amount:</span>
                <span className="text-primary">${getTotalAmount()}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Expected processing time: {getProcessingTime()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Payment Method
            </CardTitle>
            <CardDescription>
              Choose your preferred payment method
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-accent/50">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5" />
                      <div>
                        <p className="font-medium">Cash Payment</p>
                        <p className="text-sm text-muted-foreground">
                          Pay at the Registrar's Office upon document pickup
                        </p>
                      </div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-accent/50">
                  <RadioGroupItem value="gcash" id="gcash" />
                  <Label htmlFor="gcash" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5" />
                      <div>
                        <p className="font-medium">GCash</p>
                        <p className="text-sm text-muted-foreground">
                          Secure mobile payment via GCash
                        </p>
                      </div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-accent/50">
                  <RadioGroupItem value="bank" id="bank" />
                  <Label htmlFor="bank" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5" />
                      <div>
                        <p className="font-medium">Bank Transfer</p>
                        <p className="text-sm text-muted-foreground">
                          Direct bank transfer to university account
                        </p>
                      </div>
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>

            {paymentMethod === "gcash" && (
              <Alert className="mt-4">
                <Smartphone className="h-4 w-4" />
                <AlertDescription>
                  You will be redirected to GCash payment portal after submitting your request.
                </AlertDescription>
              </Alert>
            )}

            {paymentMethod === "bank" && (
              <Alert className="mt-4">
                <CreditCard className="h-4 w-4" />
                <AlertDescription>
                  Bank transfer details will be provided via email after submitting your request.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="flex items-center gap-2"
            disabled={!paymentMethod || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Submit Request
                <CheckCircle className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentInformation;