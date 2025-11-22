import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Camera, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Loader2,
  MapPin,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const resultsRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setResults(null); // Reset results when new image is selected
      toast.success("Image loaded successfully");
    } else {
      toast.error("Please select a valid image file");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // const handleAnalyze = async () => {
  //   if (!selectedFile) {
  //     toast.error("Please select an image first");
  //     return;
  //   }

  //   setIsAnalyzing(true);
    
  //   // TODO: Replace mock with Axios POST to localhost:8000
  //   // Simulate API call with 2-second delay
  //   await new Promise(resolve => setTimeout(resolve, 2000));
    
  //   // Mock response - High Risk case to demonstrate all features
  //   const mockResult = {
  //     success: true,
  //     diagnosis: "Risk of Melanoma Detected",
  //     confidence: 94.2,
  //     severity: "high"
  //   };
    
  //   setResults(mockResult);
  //   setIsAnalyzing(false);
    
  //   // Scroll to results
  //   setTimeout(() => {
  //     resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  //   }, 100);
  // };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }

    setIsAnalyzing(true);
    setResults(null);

    try {
      const formData = new FormData();
      // 'file' matches the parameter in your Python main.py
      formData.append("file", selectedFile);

      console.log("📤 Sending to Backend...");
      
      // Ensure backend is running on Port 8000
      const response = await axios.post("http://10.100.5.204:8000/scan", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = response.data;
      console.log("📥 Received:", data);

      if (data.success) {
        setResults({
          success: true,
          diagnosis: data.diagnosis,
          confidence: data.confidence,
          severity: data.severity, 
        });

        toast.success("Analysis Complete");

        // Auto-scroll to results
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      } else {
        throw new Error("Backend reported failure");
      }

    } catch (error) {
      console.error("Scan Error:", error);
      toast.error("Connection Failed. Is the Backend running?");
    } finally {
      setIsAnalyzing(false);
    }
  };


  const scrollToScanner = () => {
    document.getElementById("scanner")?.scrollIntoView({ behavior: "smooth" });
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case "high":
        return {
          bg: "bg-rose-50",
          border: "border-rose-500",
          text: "text-rose-700",
          icon: AlertTriangle,
          label: "High Risk Detected"
        };
      case "medium":
        return {
          bg: "bg-amber-50",
          border: "border-amber-500",
          text: "text-amber-700",
          icon: AlertTriangle,
          label: "Medium Risk"
        };
      case "low":
      default:
        return {
          bg: "bg-emerald-50",
          border: "border-emerald-500",
          text: "text-emerald-700",
          icon: CheckCircle,
          label: "Likely Benign"
        };
    }
  };

  const words = ["Dermatoscopic Analysis", "Early Cancer Detection", "Real-Time Risk Assessment"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 3000); // Change every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    // <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5">
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-slate-100 bg-[length:400%_400%]"
      animate={{
        backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
      }}
      transition={{ 
        duration: 20, 
        repeat: Infinity, 
        ease: "linear" 
      }}
    >
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-8">
        <nav className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-2">
            <Activity className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">DermaAI</span>
          </div>
        </nav>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }} 
        
        className="max-w-4xl mx-auto text-center space-y-6 py-20">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-4">
            Clinical-Grade Technology
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold text-foreground leading-normal py-4 transition-all duration-300">
            Your Personal AI-Powered
            <br />
            
            {/* Container Height: Adjusted relative to font size (em) to prevent jumping */}
            <span className="block pb-2 relative h-[1.5em] w-full overflow-hidden"> 
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                  transition={{ 
                    duration: 1.0,
                    ease: "easeInOut"
                  }}
                  // Flex Center ensures it stays in the middle on mobile
                  className="absolute inset-0 w-full flex justify-center items-center bg-gradient-to-r from-primary to-teal-400 bg-clip-text text-transparent whitespace-nowrap px-1"
                >
                  {words[index]}
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Clinical-grade screening powered by MobileNetV2. 
            Get instant AI analysis of suspicious skin lesions.
          </p>
          <Button 
            size="lg" 
            onClick={scrollToScanner}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
          >
            Start Assessment
          </Button>
        </motion.div>
      </header>

      {/* Smart Scanner Section */}
      <section id="scanner" className="container mx-auto px-4 py-16">
        <Card className="max-w-3xl mx-auto backdrop-blur-sm bg-card/80 border-glass-border shadow-xl">
          <CardContent className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-foreground">Lesion Scanner</h2>
              <p className="text-muted-foreground">Upload or capture an image of the skin lesion</p>
            </div>

            {/* Image Preview */}
            {previewUrl ? (
              <div className="relative rounded-lg overflow-hidden border-2 border-primary/30 aspect-video bg-muted">
                <img 
                  src={previewUrl} 
                  alt="Lesion preview" 
                  className="w-full h-full object-cover"
                />
                {/* Scanning Grid Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent pointer-events-none">
                  {/* <div className="w-full h-1 bg-primary/50 animate-scan shadow-lg shadow-primary/50" /> */}
                  {isAnalyzing && (
                    <motion.div
                      className="w-full bg-gradient-to-b from-teal-500/10 via-teal-500/30 to-teal-500/10 border-b-2 border-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.5)]"
                      initial={{ top: "-10%" }}
                      animate={{ top: "110%" }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 1.5, 
                        ease: "linear" 
                      }}
                      style={{ position: "absolute", height: "15%" }} 
                    />
                  )}
                </div>
              </div>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-glass-border hover:border-primary/50 rounded-lg p-12 text-center cursor-pointer transition-all bg-glass/30 backdrop-blur-sm hover:bg-glass/50"
              >
                <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium text-foreground mb-2">
                  Drop image here or click to browse
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports: JPG, PNG, WEBP
                </p>
              </div>
            )}

            {/* Input Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files[0])}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => handleFileSelect(e.target.files[0])}
                className="hidden"
              />
              
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
              
              <Button
                variant="outline"
                onClick={() => cameraInputRef.current?.click()}
                className="w-full border-2"
              >
                <Camera className="w-4 h-4 mr-2" />
                Use Camera
              </Button>
            </div>

            {/* Analyze Button */}
            <Button
              onClick={handleAnalyze}
              disabled={!selectedFile || isAnalyzing}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-14 text-lg font-semibold shadow-lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Activity className="w-5 h-5 mr-2" />
                  Analyze Lesion
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Analysis Results Section */}
      {results && (
        <motion.section ref={resultsRef} 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="container mx-auto px-4 py-16 animate-fade-in">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Main Result Card */}
            <Card className={`${getSeverityColor(results.severity).bg} border-2 ${getSeverityColor(results.severity).border} backdrop-blur-sm shadow-xl`}>
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  {(() => {
                    const IconComponent = getSeverityColor(results.severity).icon;
                    return <IconComponent className={`w-12 h-12 ${getSeverityColor(results.severity).text} flex-shrink-0`} />;
                  })()}
                  <div className="flex-1 space-y-4">
                    <div>
                      <p className={`text-sm font-semibold uppercase tracking-wide ${getSeverityColor(results.severity).text} mb-2`}>
                        {getSeverityColor(results.severity).label}
                      </p>
                      <h3 className="text-2xl font-bold text-foreground">
                        {results.diagnosis}
                      </h3>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">Confidence Level</span>
                        <span className="font-bold text-foreground">{results.confidence}%</span>
                      </div>
                      <Progress value={results.confidence} className="h-3" />
                    </div>

                    {results.severity === "high" && (
                      <div className="bg-white/60 rounded-lg p-4 mt-4">
                        <p className="text-sm font-medium text-rose-900">
                          ⚠️ Immediate Action Recommended: Please consult a dermatologist as soon as possible for professional evaluation.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Find Dermatologists Section - Only for high/medium severity */}
            {(results.severity === "high" || results.severity === "medium") && (
              <Card className="backdrop-blur-sm bg-card/80 border-glass-border shadow-xl">
                <CardContent className="p-8 space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-6 h-6 text-primary" />
                    <h3 className="text-2xl font-bold text-foreground">
                      Find Dermatologists Near You
                    </h3>
                  </div>
                  
                  <div className="rounded-lg overflow-hidden border-2 border-glass-border shadow-lg">
                    <iframe
                      src="https://www.google.com/maps?q=dermatologists+near+me&output=embed"
                      width="100%"
                      height="450"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Dermatologists near you"
                    />
                  </div>
                  
                  <Button
                    variant="outline"
                    className="w-full border-2"
                    onClick={() => window.open("https://www.google.com/maps/search/dermatologists+near+me", "_blank")}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open in Google Maps App
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </motion.section>
      )}

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 mt-20 border-t border-border">
        <div className="text-center text-sm text-muted-foreground">
          <p className="mb-2">
            <strong>Medical Disclaimer:</strong> DermaAI is a screening tool and not a substitute for professional medical advice.
          </p>
          <p>
            Always consult with a qualified healthcare provider for proper diagnosis and treatment.
          </p>
        </div>
      </footer>
    </motion.div>
  );
};

export default Index;
