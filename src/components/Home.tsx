import { useState, useEffect  } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Home() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(false);
      }
    };
  
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-green-50">
      {/* Navbar */}
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
          <li className="w-full"><Link to="/" className="block w-full py-3 px-4 text-[#0AC5C7] font-semibold md:hover:bg-gray-100 rounded-lg" onClick={() => setOpen(false)}>Beranda</Link></li>
          <li className="w-full"><Link to="/scan" className="block w-full py-3 px-4 text-[#033641] md:hover:text-[#0AC5C7] md:hover:bg-gray-100 rounded-lg" onClick={() => setOpen(false)}>Identifikasi</Link></li>
          <li className="w-full"><Link to="/list" className="block w-full py-3 px-4 text-[#033641] md:hover:text-[#0AC5C7] md:hover:bg-gray-100 rounded-lg" onClick={() => setOpen(false)}>List</Link></li>
          <li className="w-full"><Link to="/about" className="block w-full py-3 px-4 text-[#033641] md:hover:text-[#0AC5C7] md:hover:bg-gray-100 rounded-lg" onClick={() => setOpen(false)}>Tentang</Link></li>
        </ul>
      </nav>

      <main className="w-full px-8 md:px-20 py-20 flex flex-col items-center justify-center text-center min-h-[calc(100vh-80px)]">
        <div className="max-w-3xl space-y-6">
          <div className="flex flex-col items-center justify-center gap-6">
            <img
              src="/assets/logoburung.png"
              alt="Logo Burung"
              className="w-24 h-24 md:w-32 md:h-32 object-contain"
            />
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#033641] leading-tight text-center">
              Selamat Datang di <br /> CekBurung
            </h2>
          </div>

          <p className="text-base md:text-lg text-[#033641]">
            Aplikasi berbasis website untuk mengidentifikasi spesies burung di indonesia secara cepat dan akurat. Ambil
            gambar atau gunakan kamera untuk mengetahui nama spesies burung serta status perlindungannya.
          </p>

          <Link
            to="/scan"
            className="inline-block bg-[#033641] md:hover:bg-[#0AC5C7] text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg transition"
          >
            Mulai Identifikasi Sekarang
          </Link>
        </div>
      </main>
    </div>
  );
}
