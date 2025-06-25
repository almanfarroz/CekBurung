import { useState, useRef, useEffect } from 'react';
import { Upload, Camera, Menu, X} from 'lucide-react';
import { Link } from 'react-router-dom';
import Cropper, { Area } from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';
import { v4 as uuidv4 } from 'uuid';
import { ShieldAlert, Globe2, Languages, BadgeCheck, Feather, SearchCheck } from "lucide-react";

const API_URL = 'https://backend-production-5db8.up.railway.app/prediction/';
// const API_URL = 'http://localhost:8000/prediction/';

interface BirdResult {
  bird_types_prediction: string;
  confidence: string;
  indo_name: string;
  english_name: string;
  latin_name: string;
  endemik: string;
  status_perlindungan: string;
}

export default function Scan() {
  const [preview, setPreview] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [result, setResult] = useState<BirdResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(-3);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [showCropper, setShowCropper] = useState(true);
  const [open, setOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const confidenceValue = parseFloat(result?.confidence?.replace('%', '') || '0');
  const isLowConfidence = confidenceValue < 75;
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const isMobileDevice = () => {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  };  

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    return () => {
      [preview, croppedImage].forEach(url => {
        if (url?.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [preview, croppedImage]);

  const capturePhoto = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const DataUrl = canvas.toDataURL('image/png'); 

    setPreview(DataUrl);
    setCrop({ x: 0, y: 0 });           
    setZoom(-3);                         
    setCroppedAreaPixels(null);      
    setShowCropper(true);            
  
    setIsCameraOpen(false);
    const stream = videoRef.current.srcObject;
    if (stream instanceof MediaStream) {
      stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
    }
    videoRef.current.srcObject = null;
  };

  const openCamera = async () => {
    setIsCameraOpen(true);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];


        setPreview(URL.createObjectURL(file));
        setCrop({ x: 0, y: 0 });
        setZoom(-3);
        setCroppedAreaPixels(null);
        setShowCropper(true);
      
    }
  };

  const showCroppedPreview = async () => {
    if (!preview || !croppedAreaPixels) return;
    try {
      const cropped = await getCroppedImg(preview, croppedAreaPixels);
      setCroppedImage(cropped);
      setShowCropper(false);
    } catch (error) {
      console.error('Gagal memotong gambar:', error);
    }
  };

  const sendImageToBackend = async () => {
    if (!croppedImage) return;
    setLoading(true);
    try {
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      const uniqueId = uuidv4();
      const fileName = `cropped-image-${uniqueId}.png`;
      const file = new File([blob], fileName, { type: blob.type });
      const formData = new FormData();
      formData.append('file', file);

      const apiResponse = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });

      if (!apiResponse.ok) throw new Error('Gagal mengklasifikasikan gambar');

      const data = await apiResponse.json();
      setResult({
        bird_types_prediction: data.data?.bird_types_prediction || 'Tidak Diketahui',
        confidence: data.data?.confidence ? `${data.data.confidence * 100}%` : '0%',
        indo_name: data.data?.indo_name || '-',
        english_name: data.data?.english_name || '-',
        latin_name: data.data?.latin_name || '-',
        endemik: data.data?.endemik || '-',
        status_perlindungan: data.data?.status_perlindungan || '-',
      });
      setShowPopup(true);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-green-50">
      <nav className="w-full bg-white shadow-lg py-6 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50 border-b">
        {/* Logo dan Judul */}
        <div className="flex items-center space-x-3">
          <img src="/assets/logoburung.png" alt="Bird Logo" className="w-8 h-8 md:w-12 md:h-12 object-contain" />
          <h1 className="text-xl md:text-2xl font-bold text-[#033641] tracking-tight">CekBurung</h1>
        </div>

        {/* Tombol Hamburger (Mobile) */}
        <button className="md:hidden text-[#033641]" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigasi (Responsif) */}
        <ul className={`md:flex text-m md:text-base font-medium ${open ? 'flex items-center text-center absolute top-full left-0 w-full bg-white border-t px-6 py-4 shadow-lg z-50' : 'hidden'} md:static md:bg-transparent md:shadow-none`}>
          <li className="w-full"><Link to="/" className="block w-full py-3 px-4 text-[#033641] md:hover:text-[#0AC5C7] md:hover:bg-gray-100 rounded-lg" onClick={() => setOpen(false)}>Beranda</Link></li>
          <li className="w-full"><Link to="/scan" className="block w-full py-3 px-4 text-[#0AC5C7] font-semibold md:hover:bg-gray-100 rounded-lg" onClick={() => setOpen(false)}>Identifikasi</Link></li>
          <li className="w-full"><Link to="/list" className="block w-full py-3 px-4 text-[#033641] md:hover:text-[#0AC5C7] md:hover:bg-gray-100 rounded-lg" onClick={() => setOpen(false)}>List</Link></li>
          <li className="w-full"><Link to="/about" className="block w-full py-3 px-4 text-[#033641] md:hover:text-[#0AC5C7] md:hover:bg-gray-100 rounded-lg" onClick={() => setOpen(false)}>Tentang</Link></li>
        </ul>
      </nav>

      <main className="w-full px-8 md:px-20 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[calc(100vh-80px)] items-center">
        <section className="space-y-6 flex flex-col justify-center">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-[#033641] leading-snug">Kenali Spesies Burung di Indonesia dengan Mudah</h2>
          <p className="text-lg text-[#033641] max-w-xl">
            Ambil gambar atau gunakan kamera untuk mengidentifikasi spesies burung di indonesia dan mengetahui status perlindungannya.
          </p>
          <p className="text-lg text-[#033641] max-w-xl mt-2">
            Lihat daftar <Link to="/list" className="font-semibold underline hover:text-[#025066] transition-colors">spesies burung yang dapat diidentifikasi</Link> melalui list burung.
          </p>
          <div className="flex flex-wrap gap-2">
            <label className="cursor-pointer px-6 py-3 bg-white border-2 border-dashed border-gray-300 rounded-lg md:hover:border-[#0AC5C7] transition flex items-center gap-2">
              <Upload size={20} className="text-[#033641]" />
              <span className="font-medium">Ambil Gambar</span>
              <input id='gallery' type="file" accept="image/*" style={{ display: "none" }}
              onClick={(e) => {
                e.currentTarget.value = '';
              }}
              onChange={handleImageUpload} />
            </label>
            {isMobileDevice() ? (
            <label className="px-6 py-3 bg-[#033641] text-white rounded-lg md:hover:bg-[#0AC5C7] flex items-center gap-2">
              <Camera size={20}/>
              <span className="font-medium">Gunakan Kamera</span>
              <input id='camera' type="file" accept="image/*" capture="environment" style={{ display: "none" }}
              onChange={handleImageUpload} />
            </label>
            ) : (
            <button
              onClick={openCamera}
              className="px-6 py-3 bg-[#033641] text-white rounded-lg md:hover:bg-[#0AC5C7] flex items-center gap-2"
            >
              <Camera size={20} /> Gunakan Kamera
            </button>
            )}
          </div>
        </section>

        <section className="flex justify-center items-center">
          {preview && showCropper ? (
            <div className="relative w-[360px] h-[360px] md:w-[600px] md:h-[600px]">
              <Cropper
                image={preview}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, areaPixels) => setCroppedAreaPixels(areaPixels)}
              />
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="absolute bottom-4 left-1/2 accent-[#033641] transform -translate-x-1/2 w-1/2"
              />
              <button
                onClick={showCroppedPreview}
                className="absolute top-2 right-2 bg-green-600 text-white px-4 py-1 text-sm rounded-lg"
              >Gunakan</button>
            </div>
          ) : croppedImage ? (
            <div className="w-full max-w-[600px] aspect-square relative items-center justify-center pb-8">
              <img src={croppedImage} alt="Hasil Crop" className="w-full h-full object-cover rounded-lg shadow-lg" />
              <button
                onClick={() => {
                  setPreview(null);
                  setCroppedImage(null);
                }}
                className="absolute top-2 right-2 bg-white text-[#033641] w-8 h-8 rounded-lg flex items-center justify-center border border-gray-300 shadow-lg md:hover:bg-red-500 md:hover:text-white"
              >
                ×
              </button>
              <button
                onClick={sendImageToBackend}
                className="mt-4 w-full bg-[#033641] text-white py-3 rounded-xl md:hover:bg-[#0AC5C7]"
              >{loading ? 'Memproses...' : 'Identifikasi Sekarang'}</button>
            </div>
          ) : (
            <div className="w-[360px] h-[360px] md:w-[600px] md:h-[600px] flex flex-col text-center items-center justify-center bg-gray-100 rounded-lg border border-dashed border-gray-300 text-gray-400">
              Pratinjau Gambar Akan Ditampilkan Di Sini
            </div>
          )}
        </section>
      </main>

      {isCameraOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2">
          <div className="relative bg-white p-4 rounded-lg shadow-lg text-center space-y-4">
            <div className="flex justify-end">
            <button
                onClick={() => {
                  if (videoRef.current?.srcObject instanceof MediaStream) {
                    videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
                  }
                  if (videoRef.current) {
                    videoRef.current.srcObject = null;
                  }
                  setIsCameraOpen(false);                  
                }}className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-400 text-black border-red-500 shadow-lg md:hover:bg-gray-300 md:hover:text-white transition"
              >
              ×
            </button>
            </div>
            <video ref={videoRef} autoPlay className="w-96 h-96 rounded-lg mb-4 bg-gray-200" />
            <button onClick={capturePhoto} className="px-2 py-2 bg-[#033641] text-white rounded-lg md:hover:bg-[#0AC5C7]">Ambil Foto</button>          
          </div>
        </div>
      )}

      {showPopup && result && (
      <div className={`fixed inset-0 bg-black bg-opacity-60 flex ${isLowConfidence ? 'items-center' : 'items-start pt-10'} justify-center z-50 px-6 py-6 overflow-auto`}>
        <div className="bg-white rounded-lg p-6 max-w-xl w-full shadow-lg">
          {/* Cek nilai confidence */}
          {isLowConfidence ? (
            <div className="text-center space-y-6">
              <h2 className="text-2xl font-bold text-[#F28513]">Identifikasi Tidak Valid</h2>
              <p className="text-[#033641] text-sm">
                Gambar yang Anda unggah memiliki tingkat kepercayaan rendah, yaitu kurang dari 75% dan tidak dapat dikenali
                sebagai burung tertentu. Silakan coba gambar lain.
              </p>
              <button onClick={() => setShowPopup(false)} className="bg-red-500 md:hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg">Tutup</button>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-extrabold text-center text-[#033641] mb-6 flex items-center justify-center gap-2">
              <span>Hasil Identifikasi Burung</span>
              </h2>
              <div className="w-full flex justify-center mb-6">
                {result?.bird_types_prediction ? (
                  <img
                    src={`/assets/images/${result.bird_types_prediction}.jpg`}
                    alt={result.bird_types_prediction}
                    className="w-64 h-64 object-cover rounded-lg shadow-lg border"
                  />
                ) : (
                  <p className="text-sm text-[#033641] italic">Gambar tidak ditemukan.</p>
                )}
              </div>
              <div className="space-y-4 text-sm md:text-base text-[#033641]">
                {/* Confidence */}
                <div className="bg-white border border-gray-200 px-5 py-4 rounded-lg shadow-md flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <SearchCheck className="w-5 h-5 text-green-500" />
                    <span className="font-medium">Tingkat Kepercayaan</span>
                  </div>
                  <span className="text-right font-semibold">{result.confidence}</span>
                </div>

                {/* Nama Indonesia */}
                <div className="bg-white border border-gray-200 px-5 py-4 rounded-lg shadow-md flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <BadgeCheck className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">Nama Indonesia</span>
                  </div>
                  <span className="text-right">{result.indo_name}</span>
                </div>

                {/* Nama Inggris */}
                <div className="bg-white border border-gray-200 px-5 py-4 rounded-lg shadow-md flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Languages className="w-5 h-5 text-purple-500" />
                    <span className="font-medium">Nama Inggris</span>
                  </div>
                  <span className="text-right">{result.english_name}</span>
                </div>

                {/* Nama Latin */}
                <div className="bg-white border border-gray-200 px-5 py-4 rounded-lg shadow-md flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Feather className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium">Nama Latin</span>
                  </div>
                  <span className="italic text-right">{result.latin_name}</span>
                </div>

                {/* Endemik */}
                <div className="bg-white border border-gray-200 px-5 py-4 rounded-lg shadow-md flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Globe2 className="w-5 h-5 text-indigo-500" />
                    <span className="font-medium">Endemik Indonesia</span>
                  </div>
                  <span className="text-right">{result.endemik}</span>
                </div>

                {/* Status Perlindungan */}
                <div className="bg-red-50 border border-red-300 px-5 py-4 rounded-lg shadow-inner flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <ShieldAlert className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-red-700">Status Perlindungan</span>
                  </div>
                  <span className="font-bold text-red-600 text-right">{result.status_perlindungan}</span>
                </div>

                {/* Catatan Tambahan */}
                <div className="bg-white px-4 pt-2 pb-4 rounded-lg text-xs md:text-sm text-gray-600 border border-gray-100 shadow-sm">
                  <p className="mb-2 font-semibold">Catatan:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      <strong>Endemik Indonesia</strong> berarti spesies tersebut hanya ditemukan di wilayah Indonesia dan tidak ditemukan di tempat lain di dunia.
                    </li>
                    <li>
                      <strong>Status Perlindungan</strong> menunjukkan apakah spesies tersebut dilindungi/tidak oleh peraturan pemerintah Indonesia, yaitu Permen LHK Nomor P.106/MENLHK/SETJEN/KUM.1/12/2018 tentang Jenis Tumbuhan dan Satwa yang Dilindungi.
                    </li>
                  </ul>
                </div>
              </div>
              <div className="text-center mt-8">
                <button onClick={() => setShowPopup(false)} className="inline-block bg-gradient-to-r from-red-500 to-red-600 md:hover:from-red-600 md:hover:to-red-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition">Tutup</button>
              </div>
            </>
          )}
        </div>
      </div>
      )}
    </div>
  );
}