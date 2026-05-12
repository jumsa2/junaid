import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Upload, 
  Car, 
  Scan, 
  Loader2, 
  CheckCircle2, 
  RefreshCcw, 
  Download,
  AlertCircle,
  FileText
} from "lucide-react";
import { cn } from "../lib/utils";
import { detectLicensePlate, type DetectionResult } from "../services/gemini";

export default function PlateDetector() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setError(null);
    try {
      const detection = await detectLicensePlate(selectedImage);
      setResult(detection);
      
      // Save to server history
      const formData = new FormData();
      if (imageFile) {
        formData.append("image", imageFile);
      }
      formData.append("vehicleNumber", detection.vehicleNumber);
      formData.append("confidence", detection.confidence.toString());

      await fetch("/api/save-detection", {
        method: "POST",
        body: formData,
      });

    } catch (err) {
      console.error(err);
      setError("Failed to extract plate number. Please try a clearer image.");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (result?.boundingBox && canvasRef.current && imageRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = imageRef.current;

      if (ctx) {
        // Adjust canvas size to match displayed image size
        canvas.width = img.clientWidth;
        canvas.height = img.clientHeight;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const { ymin, xmin, ymax, xmax } = result.boundingBox;
        
        // Convert normalized coordinates (0-1000) to pixel coordinates
        const x = (xmin / 1000) * canvas.width;
        const y = (ymin / 1000) * canvas.height;
        const width = ((xmax - xmin) / 1000) * canvas.width;
        const height = ((ymax - ymin) / 1000) * canvas.height;

        ctx.strokeStyle = "#FF6321";
        ctx.lineWidth = 4;
        ctx.strokeRect(x, y, width, height);

        // Add label background
        ctx.fillStyle = "#FF6321";
        ctx.fillRect(x, y - 30, width, 30);

        // Add text
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 14px Inter";
        ctx.fillText(result.vehicleNumber, x + 5, y - 10);
      }
    }
  }, [result]);

  const downloadResult = () => {
    if (!canvasRef.current || !imageRef.current) return;
    
    // Create a temporary canvas to combine image and drawing
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    const img = imageRef.current;
    
    if (tempCtx) {
      tempCanvas.width = img.naturalWidth;
      tempCanvas.height = img.naturalHeight;
      
      tempCtx.drawImage(img, 0, 0);
      
      if (result?.boundingBox) {
        const { ymin, xmin, ymax, xmax } = result.boundingBox;
        const x = (xmin / 1000) * tempCanvas.width;
        const y = (ymin / 1000) * tempCanvas.height;
        const width = ((xmax - xmin) / 1000) * tempCanvas.width;
        const height = ((ymax - ymin) / 1000) * tempCanvas.height;

        tempCtx.strokeStyle = "#FF6321";
        tempCtx.lineWidth = 8;
        tempCtx.strokeRect(x, y, width, height);
        
        tempCtx.fillStyle = "#FF6321";
        tempCtx.fillRect(x, y - 80, width, 80);
        
        tempCtx.fillStyle = "#FFFFFF";
        tempCtx.font = `bold ${Math.max(40, tempCanvas.width / 40)}px Inter`;
        tempCtx.fillText(result.vehicleNumber, x + 20, y - 25);
      }
      
      const link = document.createElement("a");
      link.download = `detected-plate-${result?.vehicleNumber || "unknown"}.png`;
      link.href = tempCanvas.toDataURL();
      link.click();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="grid grid-cols-12 gap-8"
    >
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-xl text-slate-800">Vehicle Analysis</h2>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedImage(null);
                  setResult(null);
                  setError(null);
                }}
                className="px-4 py-2 text-xs font-bold bg-slate-900 text-white rounded-xl hover:opacity-90 transition-opacity"
              >
                New Detection
              </button>
            </div>
          </div>

          <div className={cn(
            "flex-1 bg-slate-50 rounded-2xl relative border-2 border-dashed border-slate-200 flex items-center justify-center min-h-[400px] overflow-hidden transition-all duration-300",
            selectedImage ? "border-indigo-200 bg-white" : ""
          )}>
            {!selectedImage ? (
              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-8 text-center space-y-4">
                <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm">
                  <Upload size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Upload Image</h3>
                  <p className="text-slate-400 text-sm max-w-xs mx-auto">Select a clear vehicle photo for scanning</p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center">
                <img 
                  ref={imageRef}
                  src={selectedImage} 
                  alt="Preview" 
                  className="max-w-full max-h-[500px] object-contain rounded-lg shadow-xl"
                />
                <canvas 
                  ref={canvasRef}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none"
                />
                
                {isProcessing && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-4 z-10">
                    <div className="bg-indigo-600 p-4 rounded-full shadow-lg shadow-indigo-200">
                      <Loader2 className="text-white animate-spin" size={32} />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-slate-800 text-lg tracking-tight">Processing Vision...</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {!result && selectedImage && !isProcessing && (
            <div className="mt-8">
              <button
                onClick={processImage}
                className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold text-lg shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors"
              >
                <Scan size={24} /> Run AI Extraction
              </button>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 rounded-2xl bg-red-50 text-red-600 border border-red-100 text-sm font-medium flex items-center gap-3">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Recognition", val: "Gemini AI" },
              { label: "Status", val: result ? "Success" : "Ready", color: result ? "text-green-600" : "text-slate-700" },
              { label: "Engine", val: "OCR-Vision" },
              { label: "Confidence", val: result ? `${result.confidence}%` : "-" }
            ].map((item, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-wider">{item.label}</div>
                <div className={cn("text-lg font-bold", item.color || "text-slate-700")}>{item.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Results Sidebar */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
        <div className="bg-slate-900 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-11 h-11 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/30">
              <Scan size={22} />
            </div>
            <h3 className="font-bold text-lg">OCR Extraction</h3>
          </div>

          <div className="mb-8">
            <div className="text-[10px] uppercase font-bold text-slate-500 mb-2 tracking-[0.2em]">Detected Number</div>
            <div className="text-5xl font-black tracking-widest text-indigo-400 font-mono py-2">
              {result ? result.vehicleNumber : "---- ----"}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Confidence Score</span>
              <span className="text-xl font-bold text-indigo-400">{result ? `${result.confidence}%` : "0%"}</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: result ? `${result.confidence}%` : 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.5)]"
              />
            </div>
          </div>

          {result && (
            <button
              onClick={downloadResult}
              className="w-full mt-8 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 border border-white/5"
            >
              <Download size={18} /> Export Processed Media
            </button>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
              <AlertCircle size={20} />
            </div>
            <h3 className="font-bold text-slate-800">Process Guidelines</h3>
          </div>
          
          <div className="space-y-6">
            {[
              { id: "01", title: "Frame Plate", desc: "Ensure the license plate is clearly visible in the image frame." },
              { id: "02", title: "Wait for AI", desc: "Our engine analyzes textures and contrast to isolate characters." },
              { id: "03", title: "Verify Data", desc: "Results are cross-referenced with your local detection history." }
            ].map(step => (
              <div key={step.id} className="flex gap-4">
                <span className="text-xs font-bold text-indigo-600 mt-1">{step.id}</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{step.title}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed mt-1">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
