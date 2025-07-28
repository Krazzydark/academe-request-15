import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, FileText, Shield, Phone } from "lucide-react";
import OTPVerification from "@/components/kiosk/OTPVerification";
import StudentInformation from "@/components/kiosk/StudentInformation";
import DocumentSelection from "@/components/kiosk/DocumentSelection";
import PaymentInformation from "@/components/kiosk/PaymentInformation";
import { useToast } from "@/hooks/use-toast";

export interface StudentData {
  studentId: string;
  name: string;
  course: string;
  yearGraduated: string;
  contactNumber: string;
  email: string;
}

export interface SelectedDocument {
  id: string;
  name: string;
  category: string;
  copies: number;
  purpose: string;
  fee: number;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [studentData, setStudentData] = useState<StudentData>({
    studentId: "",
    name: "",
    course: "",
    yearGraduated: "",
    contactNumber: "",
    email: ""
  });
  const [selectedDocuments, setSelectedDocuments] = useState<SelectedDocument[]>([]);
  const { toast } = useToast();

  const steps = [
    { number: 1, title: "OTP Verification", icon: Shield, description: "Verify your identity" },
    { number: 2, title: "Student Information", icon: GraduationCap, description: "Confirm your details" },
    { number: 3, title: "Document Selection", icon: FileText, description: "Choose documents" },
    { number: 4, title: "Payment Information", icon: Phone, description: "Complete your request" }
  ];

  const handleOTPVerified = (data: { studentId: string; contact: string; isEmail: boolean }) => {
    setStudentData(prev => ({
      ...prev,
      studentId: data.studentId,
      [data.isEmail ? 'email' : 'contactNumber']: data.contact
    }));
    setCurrentStep(2);
    toast({
      title: "Verification Successful",
      description: "You can now proceed to the next step.",
    });
  };

  const handleStudentInfoSubmit = (data: StudentData) => {
    setStudentData(data);
    setCurrentStep(3);
  };

  const handleDocumentSelection = (documents: SelectedDocument[]) => {
    setSelectedDocuments(documents);
    setCurrentStep(4);
  };

  const handlePaymentSubmit = () => {
    toast({
      title: "Request Submitted Successfully!",
      description: "Your document request has been processed. You will receive a confirmation email shortly.",
    });
    // Reset the form
    setTimeout(() => {
      setCurrentStep(1);
      setStudentData({
        studentId: "",
        name: "",
        course: "",
        yearGraduated: "",
        contactNumber: "",
        email: ""
      });
      setSelectedDocuments([]);
    }, 3000);
  };

  const getCurrentStepComponent = () => {
    switch (currentStep) {
      case 1:
        return <OTPVerification onVerified={handleOTPVerified} />;
      case 2:
        return (
          <StudentInformation
            initialData={studentData}
            onSubmit={handleStudentInfoSubmit}
            onBack={() => setCurrentStep(1)}
          />
        );
      case 3:
        return (
          <DocumentSelection
            onSubmit={handleDocumentSelection}
            onBack={() => setCurrentStep(2)}
          />
        );
      case 4:
        return (
          <PaymentInformation
            studentData={studentData}
            selectedDocuments={selectedDocuments}
            onSubmit={handlePaymentSubmit}
            onBack={() => setCurrentStep(3)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-academic-blue/5 via-background to-academic-navy/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-primary mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-academic-navy bg-clip-text text-transparent">
              Document Request Kiosk
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Securely request your academic and financial documents in 4 simple steps
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
            {steps.map((step, index) => {
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              const Icon = step.icon;

              return (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center text-center">
                    <div
                      className={`
                        w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300
                        ${isActive 
                          ? 'bg-primary text-primary-foreground shadow-lg scale-110' 
                          : isCompleted 
                            ? 'bg-success text-success-foreground' 
                            : 'bg-muted text-muted-foreground'
                        }
                      `}
                    >
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="mt-2">
                      <p className={`font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                        {step.title}
                      </p>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                    {isActive && (
                      <Badge variant="secondary" className="mt-1">
                        Current Step
                      </Badge>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block w-16 h-0.5 bg-border ml-8" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              {getCurrentStepComponent()}
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Need help? Contact the Registrar's Office at (123) 456-7890</p>
        </div>
      </div>
    </div>
  );
};

export default Index;