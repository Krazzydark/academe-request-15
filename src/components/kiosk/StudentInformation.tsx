import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, GraduationCap, User } from "lucide-react";
import { StudentData } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";

interface StudentInformationProps {
  initialData: StudentData;
  onSubmit: (data: StudentData) => void;
  onBack: () => void;
}

const StudentInformation = ({ initialData, onSubmit, onBack }: StudentInformationProps) => {
  const [formData, setFormData] = useState<StudentData>(initialData);
  const [errors, setErrors] = useState<Partial<StudentData>>({});
  const { toast } = useToast();

  const courses = [
    "Bachelor of Science in Computer Science",
    "Bachelor of Science in Information Technology", 
    "Bachelor of Science in Business Administration",
    "Bachelor of Arts in English",
    "Bachelor of Arts in Psychology",
    "Bachelor of Science in Nursing",
    "Bachelor of Engineering",
    "Master of Business Administration",
    "Master of Science in Computer Science",
    "Doctor of Philosophy"
  ];

  const validateForm = () => {
    const newErrors: Partial<StudentData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.course) {
      newErrors.course = "Course is required";
    }
    if (!formData.yearGraduated.trim()) {
      newErrors.yearGraduated = "Year is required";
    }
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email format is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      toast({
        title: "Information Saved",
        description: "Your student information has been confirmed.",
      });
    }
  };

  const handleInputChange = (field: keyof StudentData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <GraduationCap className="h-16 w-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Student Information</h2>
        <p className="text-muted-foreground">
          Please confirm or update your personal details
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Details
            </CardTitle>
            <CardDescription>
              Ensure all information is accurate and up-to-date
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  value={formData.studentId}
                  disabled
                  className="bg-muted font-mono"
                />
                <p className="text-xs text-muted-foreground">Verified from previous step</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="course">Course/Program *</Label>
              <Select
                value={formData.course}
                onValueChange={(value) => handleInputChange('course', value)}
              >
                <SelectTrigger className={errors.course ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select your course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course} value={course}>
                      {course}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.course && (
                <p className="text-sm text-destructive">{errors.course}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearGraduated">Year Graduated / Last Attended *</Label>
              <Input
                id="yearGraduated"
                value={formData.yearGraduated}
                onChange={(e) => handleInputChange('yearGraduated', e.target.value)}
                placeholder="e.g., 2023, Spring 2022, Currently Enrolled"
                className={errors.yearGraduated ? "border-destructive" : ""}
              />
              {errors.yearGraduated && (
                <p className="text-sm text-destructive">{errors.yearGraduated}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number *</Label>
                <Input
                  id="contactNumber"
                  value={formData.contactNumber}
                  onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className={errors.contactNumber ? "border-destructive" : ""}
                />
                {errors.contactNumber && (
                  <p className="text-sm text-destructive">{errors.contactNumber}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="student@university.edu"
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>
            </div>

            <Alert>
              <User className="h-4 w-4" />
              <AlertDescription>
                This information will be used to process your document request and for communication purposes.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button onClick={handleSubmit} className="flex items-center gap-2">
            Continue
            <GraduationCap className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentInformation;