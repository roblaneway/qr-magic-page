import { useState } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Download, Link, QrCode, Sparkles } from "lucide-react";

const QRGenerator = () => {
  const [url, setUrl] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateQRCode = async () => {
    if (!url.trim()) {
      toast({
        title: "Please enter a URL",
        description: "You need to provide a URL to generate a QR code.",
        variant: "destructive",
      });
      return;
    }

    // Add protocol if missing
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = "https://" + formattedUrl;
    }

    setIsGenerating(true);
    try {
      const qrDataUrl = await QRCode.toDataURL(formattedUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      setQrCodeUrl(qrDataUrl);
      toast({
        title: "QR Code Generated!",
        description: "Your QR code is ready to use.",
      });
    } catch (error) {
      toast({
        title: "Error generating QR code",
        description: "Please check your URL and try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;

    const link = document.createElement("a");
    link.download = "qr-code.png";
    link.href = qrCodeUrl;
    link.click();

    toast({
      title: "QR Code Downloaded!",
      description: "Your QR code has been saved to your downloads.",
    });
  };

  const clearAll = () => {
    setUrl("");
    setQrCodeUrl("");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <QrCode className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              QR Magic
            </h1>
            <Sparkles className="h-6 w-6 text-accent" />
          </div>
          <p className="text-lg text-muted-foreground">
            Transform any URL into a beautiful QR code instantly
          </p>
        </div>

        {/* Generator Form */}
        <Card className="shadow-elegant border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              Generate QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="url" className="text-sm font-medium">
                Enter URL
              </Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && generateQRCode()}
                className="transition-smooth"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={generateQRCode}
                disabled={isGenerating}
                className="flex-1 bg-gradient-primary hover:opacity-90 transition-smooth"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <QrCode className="h-4 w-4" />
                    Generate QR Code
                  </div>
                )}
              </Button>
              
              {qrCodeUrl && (
                <Button
                  onClick={clearAll}
                  variant="outline"
                  className="transition-smooth"
                >
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* QR Code Display */}
        {qrCodeUrl && (
          <Card className="shadow-elegant border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-center">Your QR Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <div className="p-4 bg-white rounded-lg shadow-md">
                  <img
                    src={qrCodeUrl}
                    alt="Generated QR Code"
                    className="w-72 h-72 object-contain"
                  />
                </div>
              </div>
              
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground break-all">
                  QR Code for: <span className="font-medium">{url}</span>
                </p>
                
                <Button
                  onClick={downloadQRCode}
                  variant="secondary"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 transition-smooth"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download QR Code
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QRGenerator;