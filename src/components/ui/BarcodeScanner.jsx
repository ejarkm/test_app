import React, { useState, useRef, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import { BrowserMultiFormatReader } from '@zxing/library';
import Icon from '../AppIcon';
import Button from './Button';

const BarcodeScanner = ({ isOpen, onClose, onScan, onError }) => {
  const webcamRef = useRef(null);
  const codeReader = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [hasPermission, setHasPermission] = useState(null);

  // Initialize code reader
  useEffect(() => {
    codeReader.current = new BrowserMultiFormatReader();
    
    // Get available video devices
    const getDevices = async () => {
      try {
        const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices();
        setDevices(videoInputDevices);
        if (videoInputDevices.length > 0) {
          // Prefer back camera if available
          const backCamera = videoInputDevices.find(device => 
            device.label.toLowerCase().includes('back') || 
            device.label.toLowerCase().includes('rear')
          );
          setSelectedDeviceId(backCamera ? backCamera.deviceId : videoInputDevices[0].deviceId);
        }
      } catch (err) {
        console.error('Error getting devices:', err);
        setError('No se pudo acceder a la cámara');
      }
    };

    if (isOpen) {
      getDevices();
    }

    return () => {
      if (codeReader.current) {
        codeReader.current.reset();
      }
    };
  }, [isOpen]);

  // Request camera permissions
  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' // Prefer back camera
        } 
      });
      stream.getTracks().forEach(track => track.stop()); // Stop the stream, we just needed permission
      setHasPermission(true);
      setError('');
    } catch (err) {
      console.error('Camera permission denied:', err);
      setHasPermission(false);
      setError('Permisos de cámara denegados. Por favor, permita el acceso a la cámara.');
    }
  };

  // Start scanning
  const startScanning = useCallback(async () => {
    if (!selectedDeviceId || !hasPermission) return;
    
    setIsScanning(true);
    setError('');
    
    try {
      const result = await codeReader.current.decodeOnceFromVideoDevice(selectedDeviceId);
      if (result) {
        const scannedCode = result.getText();
        console.log('Scanned code:', scannedCode);
        
        // Call onScan callback
        onScan?.(scannedCode);
        
        // Stop scanning after successful scan
        stopScanning();
      }
    } catch (err) {
      console.error('Scanning error:', err);
      if (err.name !== 'NotFoundException') {
        setError('Error durante el escaneo. Intente de nuevo.');
        onError?.(err);
      }
      // Continue scanning if it was just "not found"
      if (isScanning && err.name === 'NotFoundException') {
        // Retry scanning after a short delay
        setTimeout(() => {
          if (isScanning) {
            startScanning();
          }
        }, 100);
      }
    }
  }, [selectedDeviceId, hasPermission, isScanning, onScan, onError]);

  // Stop scanning
  const stopScanning = useCallback(() => {
    setIsScanning(false);
    if (codeReader.current) {
      codeReader.current.reset();
    }
  }, []);

  // Handle device change
  const handleDeviceChange = (deviceId) => {
    stopScanning();
    setSelectedDeviceId(deviceId);
  };

  // Close scanner
  const handleClose = () => {
    stopScanning();
    onClose?.();
  };

  // Video constraints for better barcode scanning
  const videoConstraints = {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: 'environment', // Use back camera by default
    deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      {/* Scanner Interface */}
      <div className="relative w-full h-full flex flex-col">
        
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-black/80 backdrop-blur-sm">
          <div className="flex items-center justify-between p-4 text-white">
            <div className="flex items-center space-x-3">
              <Icon name="QrCode" size={24} className="text-primary" />
              <div>
                <h2 className="text-lg font-semibold">Escáner de Códigos</h2>
                <p className="text-sm text-gray-300">
                  {isScanning ? 'Escaneando...' : 'Presione "Iniciar" para escanear'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              iconName="X"
              className="text-white hover:bg-white/20"
            />
          </div>
        </div>

        {/* Camera View */}
        <div className="flex-1 relative bg-black flex items-center justify-center">
          {hasPermission === null && (
            <div className="text-center text-white">
              <Icon name="Camera" size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="mb-4">Necesitamos acceso a tu cámara para escanear códigos</p>
              <Button
                onClick={requestPermissions}
                iconName="Camera"
                variant="default"
              >
                Permitir Cámara
              </Button>
            </div>
          )}

          {hasPermission === false && (
            <div className="text-center text-white">
              <Icon name="CameraOff" size={48} className="mx-auto mb-4 text-red-400" />
              <p className="mb-4 text-red-300">No se pudo acceder a la cámara</p>
              <p className="text-sm text-gray-400 mb-4">
                Por favor, permite el acceso a la cámara en tu navegador
              </p>
              <Button
                onClick={requestPermissions}
                iconName="RefreshCw"
                variant="outline"
                className="text-white border-white"
              >
                Reintentar
              </Button>
            </div>
          )}

          {hasPermission && selectedDeviceId && (
            <>
              {/* Webcam */}
              <Webcam
                ref={webcamRef}
                audio={false}
                videoConstraints={videoConstraints}
                className="w-full h-full object-cover"
                onUserMediaError={(error) => {
                  console.error('Webcam error:', error);
                  setError('Error al acceder a la cámara');
                  setHasPermission(false);
                }}
              />

              {/* Scanning overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative">
                  {/* Scanning frame */}
                  <div className={`
                    w-64 h-64 border-2 rounded-lg relative
                    ${isScanning ? 'border-primary animate-pulse' : 'border-white/50'}
                  `}>
                    {/* Corner indicators */}
                    <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
                    <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
                    
                    {/* Scanning line */}
                    {isScanning && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse"></div>
                    )}
                  </div>
                  
                  {/* Instructions */}
                  <p className="text-white text-center mt-4 text-sm bg-black/50 px-4 py-2 rounded-lg">
                    {isScanning 
                      ? 'Mantén el código dentro del recuadro'
                      : 'Coloca el código de barras o QR en el centro'
                    }
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm">
          <div className="p-4 space-y-4">
            
            {/* Error message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-red-200">
                  <Icon name="AlertCircle" size={16} />
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}

            {/* Camera selector */}
            {devices.length > 1 && hasPermission && (
              <div className="flex items-center space-x-3 text-white">
                <Icon name="Camera" size={20} />
                <select
                  value={selectedDeviceId}
                  onChange={(e) => handleDeviceChange(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {devices.map((device) => (
                    <option key={device.deviceId} value={device.deviceId} className="text-black">
                      {device.label || `Cámara ${devices.indexOf(device) + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="outline"
                onClick={handleClose}
                iconName="X"
                className="text-white border-white/50 hover:bg-white/10"
              >
                Cancelar
              </Button>
              
              {hasPermission && selectedDeviceId && (
                <>
                  {!isScanning ? (
                    <Button
                      onClick={startScanning}
                      iconName="Play"
                      variant="default"
                      size="lg"
                    >
                      Iniciar Escaneo
                    </Button>
                  ) : (
                    <Button
                      onClick={stopScanning}
                      iconName="Square"
                      variant="destructive"
                      size="lg"
                    >
                      Detener
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
