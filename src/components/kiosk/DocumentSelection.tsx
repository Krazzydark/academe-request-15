import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  FileText, 
  GraduationCap, 
  DollarSign, 
  CreditCard,
  Trash2,
  Edit,
  Plus,
  Award,
  Receipt
} from "lucide-react";
import { SelectedDocument } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";

interface DocumentSelectionProps {
  onSubmit: (documents: SelectedDocument[]) => void;
  onBack: () => void;
}

const DocumentSelection = ({ onSubmit, onBack }: DocumentSelectionProps) => {
  const [selectedDocuments, setSelectedDocuments] = useState<SelectedDocument[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const documentCategories = {
    academic: {
      title: "Academic Records",
      icon: GraduationCap,
      documents: [
        { id: "transcript", name: "Transcript of Records", fee: 150 },
        { id: "enrollment", name: "Certificate of Enrollment", fee: 50 },
        { id: "graduation", name: "Certificate of Graduation", fee: 100 },
        { id: "diploma", name: "Diploma (Certified Copy)", fee: 200 }
      ]
    },
    financial: {
      title: "Financial Documents",
      icon: DollarSign,
      documents: [
        { id: "receipt", name: "Official Receipt (Copy)", fee: 25 }
      ]
    },
    certifications: {
      title: "Certifications",
      icon: Award,
      documents: [
        { id: "good-moral", name: "Certificate of Good Moral", fee: 75 },
        { id: "completion", name: "Certificate of Completion", fee: 50 },
        { id: "honor", name: "Certificate with Honors", fee: 100 }
      ]
    }
  };

  const purposeOptions = [
    "Employment",
    "Scholarship Application",
    "Graduate School Application", 
    "Transfer to Another Institution",
    "Visa Application",
    "Personal Records",
    "Other"
  ];

  const [newDocument, setNewDocument] = useState({
    documentId: "",
    category: "",
    copies: 1,
    purpose: ""
  });

  const handleAddDocument = () => {
    if (!newDocument.documentId || !newDocument.purpose) {
      toast({
        title: "Missing Information",
        description: "Please select a document and specify the purpose.",
        variant: "destructive"
      });
      return;
    }

    const categoryData = Object.values(documentCategories).find(cat => 
      cat.documents.some(doc => doc.id === newDocument.documentId)
    );
    
    const docData = categoryData?.documents.find(doc => doc.id === newDocument.documentId);
    
    if (!docData) return;

    const document: SelectedDocument = {
      id: `${newDocument.documentId}-${Date.now()}`,
      name: docData.name,
      category: categoryData?.title || "",
      copies: newDocument.copies,
      purpose: newDocument.purpose,
      fee: docData.fee
    };

    if (editingIndex !== null) {
      const updated = [...selectedDocuments];
      updated[editingIndex] = document;
      setSelectedDocuments(updated);
      setEditingIndex(null);
    } else {
      setSelectedDocuments([...selectedDocuments, document]);
    }

    setNewDocument({ documentId: "", category: "", copies: 1, purpose: "" });
    setShowAddForm(false);
    
    toast({
      title: "Document Added",
      description: `${docData.name} has been added to your request.`,
    });
  };

  const handleEditDocument = (index: number) => {
    const doc = selectedDocuments[index];
    const categoryData = Object.values(documentCategories).find(cat => 
      cat.documents.some(d => d.name === doc.name)
    );
    const docData = categoryData?.documents.find(d => d.name === doc.name);
    
    setNewDocument({
      documentId: docData?.id || "",
      category: categoryData?.title || "",
      copies: doc.copies,
      purpose: doc.purpose
    });
    setEditingIndex(index);
    setShowAddForm(true);
  };

  const handleRemoveDocument = (index: number) => {
    const updated = selectedDocuments.filter((_, i) => i !== index);
    setSelectedDocuments(updated);
    toast({
      title: "Document Removed",
      description: "The document has been removed from your request.",
    });
  };

  const getTotalAmount = () => {
    return selectedDocuments.reduce((total, doc) => total + (doc.fee * doc.copies), 0);
  };

  const handleSubmit = () => {
    if (selectedDocuments.length === 0) {
      toast({
        title: "No Documents Selected",
        description: "Please select at least one document to continue.",
        variant: "destructive"
      });
      return;
    }
    onSubmit(selectedDocuments);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <FileText className="h-16 w-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Document Selection</h2>
        <p className="text-muted-foreground">
          Choose the documents you need and specify the purpose for each
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Available Documents */}
        {!showAddForm && (
          <div className="space-y-4">
            {Object.entries(documentCategories).map(([key, category]) => {
              const Icon = category.icon;
              return (
                <Card key={key}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="w-5 h-5" />
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {category.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Processing fee: ${doc.fee}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setNewDocument({
                                documentId: doc.id,
                                category: category.title,
                                copies: 1,
                                purpose: ""
                              });
                              setShowAddForm(true);
                            }}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Add/Edit Document Form */}
        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingIndex !== null ? "Edit Document" : "Add Document"}
              </CardTitle>
              <CardDescription>
                Specify the number of copies and purpose for your document request
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Document Type</Label>
                  <Select
                    value={newDocument.documentId}
                    onValueChange={(value) => setNewDocument(prev => ({ ...prev, documentId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a document" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(documentCategories).map(([catKey, category]) => (
                        <div key={catKey}>
                          <div className="px-2 py-1 text-sm font-medium text-muted-foreground">
                            {category.title}
                          </div>
                          {category.documents.map((doc) => (
                            <SelectItem key={doc.id} value={doc.id}>
                              {doc.name} (${doc.fee})
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Number of Copies</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={newDocument.copies}
                    onChange={(e) => setNewDocument(prev => ({ 
                      ...prev, 
                      copies: Math.max(1, parseInt(e.target.value) || 1)
                    }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Purpose</Label>
                <Select
                  value={newDocument.purpose}
                  onValueChange={(value) => setNewDocument(prev => ({ ...prev, purpose: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select the purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    {purposeOptions.map((purpose) => (
                      <SelectItem key={purpose} value={purpose}>
                        {purpose}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleAddDocument}>
                  {editingIndex !== null ? "Update Document" : "Add to Request"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingIndex(null);
                    setNewDocument({ documentId: "", category: "", copies: 1, purpose: "" });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Selected Documents Summary */}
        {selectedDocuments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                Request Summary
              </CardTitle>
              <CardDescription>
                Review your selected documents before proceeding
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedDocuments.map((doc, index) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{doc.name}</p>
                        <Badge variant="secondary">{doc.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Purpose: {doc.purpose}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {doc.copies} {doc.copies === 1 ? 'copy' : 'copies'} × ${doc.fee} = ${doc.fee * doc.copies}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditDocument(index)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveDocument(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total Amount:</span>
                    <span className="text-primary">${getTotalAmount()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedDocuments.length === 0 && !showAddForm && (
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              No documents selected yet. Browse the available documents above and click "Add" to include them in your request.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="flex items-center gap-2"
            disabled={selectedDocuments.length === 0}
          >
            Continue to Payment
            <CreditCard className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentSelection;