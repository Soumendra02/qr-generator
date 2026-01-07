import React, { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

const QRGenerator = () => {
  const [url, setUrl] = useState("");
  const [finalUrl, setFinalUrl] = useState("");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [qrColor, setQrColor] = useState("#020617"); // slate-950
  const [showQR, setShowQR] = useState(false);
  const qrRef = useRef(null);

  const validateUrl = (value) => {
    if (!value) {
      setError("");
      setIsValid(false);
      return false;
    }

    let testUrl = value.trim();
    if (!testUrl.startsWith("http://") && !testUrl.startsWith("https://")) {
      testUrl = "https://" + testUrl;
    }

    try {
      const parsed = new URL(testUrl);
      if (
        !parsed.hostname.includes(".") ||
        parsed.hostname.split(".").pop().length < 2
      ) {
        setError("Please enter a valid website URL");
        setIsValid(false);
        return false;
      }
      setError("");
      setIsValid(true);
      return true;
    } catch {
      setError("Please enter a valid website URL");
      setIsValid(false);
      return false;
    }
  };

  const handleChange = (e) => {
    setUrl(e.target.value);
    validateUrl(e.target.value);
  };

  const handleGenerate = () => {
    let input = url.trim();
    if (!input.startsWith("http://") && !input.startsWith("https://")) {
      input = "https://" + input;
    }
    if (!validateUrl(url)) return;
    setFinalUrl(input);
    setShowQR(true);
  };

  const handleDownload = () => {
    const canvas = qrRef.current.querySelector("canvas");
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = "premium-qr.png";
    link.click();
  };

  const handleReset = () => {
    setUrl("");
    setFinalUrl("");
    setError("");
    setIsValid(false);
    setShowQR(false);
    setQrColor("#020617");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-6 py-14">
      <div className="max-w-7xl mx-auto">
        {/* HERO */}
        <div className="text-center mb-14">
          <h1 className="text-5xl font-bold text-slate-900 tracking-tight">
            Premium QR Generator
          </h1>
          <p className="text-slate-600 mt-4 text-lg max-w-2xl mx-auto">
            Create beautiful, branded QR codes that look professional and scan perfectly.
          </p>
        </div>

        {/* MAIN */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* LEFT – CONTROLS */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Website URL
            </label>

            <div className="relative">
              <input
                type="text"
                placeholder="google.com or https://example.com"
                value={url}
                onChange={handleChange}
                className={`w-full px-5 py-4 pr-12 rounded-xl border text-lg outline-none transition
                  ${
                    error
                      ? "border-red-400 focus:border-red-500"
                      : isValid
                      ? "border-emerald-500 focus:border-emerald-600"
                      : "border-slate-300 focus:border-blue-500"
                  }`}
              />
              {isValid && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600 text-xl">
                  ✓
                </span>
              )}
            </div>

            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
            {!error && isValid && (
              <p className="text-emerald-600 text-sm mt-2">
                URL is valid and ready
              </p>
            )}

            {/* COLOR */}
            <div className="flex items-center justify-between mt-8">
              <span className="text-sm font-semibold text-slate-700">
                QR Color
              </span>
              <label className="flex items-center gap-4 cursor-pointer">
                <div
                  className="w-11 h-11 rounded-xl shadow-inner border"
                  style={{ backgroundColor: qrColor }}
                />
                <span className="font-mono text-sm text-slate-600">
                  {qrColor.toUpperCase()}
                </span>
                <input
                  type="color"
                  value={qrColor}
                  onChange={(e) => setQrColor(e.target.value)}
                  className="hidden"
                />
              </label>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-4 mt-10">
              <button
                onClick={handleGenerate}
                disabled={!isValid}
                className={`flex-1 py-4 rounded-xl text-lg font-semibold transition
                  ${
                    !isValid
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
                  }`}
              >
                Generate QR
              </button>

              <button
                onClick={handleReset}
                className="flex-1 py-4 rounded-xl border border-slate-300 hover:bg-slate-100 text-lg font-semibold transition"
              >
                Reset
              </button>
            </div>
          </div>

          {/* RIGHT – QR PREVIEW */}
          <div className="relative bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 rounded-3xl shadow-xl border border-slate-200 p-10 flex flex-col items-center justify-center">
            {showQR ? (
              <>
                <div
                  ref={qrRef}
                  className="relative bg-white p-8 rounded-3xl shadow-2xl ring-1 ring-slate-200"
                >
                  <div className="absolute inset-0 rounded-3xl ring-4 ring-indigo-200/40 pointer-events-none" />

                  <QRCodeCanvas
                    value={finalUrl}
                    size={240}
                    fgColor={qrColor}
                    bgColor="#ffffff"
                    imageSettings={{
                      src: "/logo.jpg",
                      height: 48,
                      width: 48,
                      excavate: true,
                    }}
                  />
                </div>

                <button
                  onClick={handleDownload}
                  className="mt-8 w-full py-4 rounded-xl bg-indigo-600 text-white text-lg font-semibold hover:bg-indigo-700 transition shadow-lg"
                >
                  Download QR
                </button>

                <p className="mt-5 text-xs text-slate-700 break-all text-center">
                  {finalUrl}
                </p>
              </>
            ) : (
              <p className="text-slate-500 text-lg text-center">
                Your premium QR preview will appear here
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;