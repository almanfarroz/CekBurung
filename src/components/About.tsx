import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X} from 'lucide-react';

export default function About() {
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
      <nav className="w-full bg-white shadow-sm py-6 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50 border-b">
        <div className="flex items-center space-x-3">
          <img src="/assets/logoburung.png" alt="Bird Logo" className="w-8 h-8 md:w-12 md:h-12 object-contain" />
          <h1 className="text-xl md:text-2xl font-bold text-[#033641] tracking-tight">CekBurung</h1>
        </div>

        <button className="md:hidden text-[#033641]" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

        <ul className={`md:flex text-m md:text-base font-medium ${open ? 'flex items-center text-center absolute top-full left-0 w-full bg-white border-t px-6 py-4 shadow-lg z-50' : 'hidden'} md:static md:bg-transparent md:shadow-none`}>
          <li className="w-full"><Link to="/" className="block w-full py-3 px-4 text-[#033641] md:hover:text-[#0AC5C7] md:hover:bg-gray-100 rounded-lg" onClick={() => setOpen(false)}>Beranda</Link></li>
          <li className="w-full"><Link to="/scan" className="block w-full py-3 px-4 text-[#033641] md:hover:text-[#0AC5C7] md:hover:bg-gray-100 rounded-lg" onClick={() => setOpen(false)}>Identifikasi</Link></li>
          <li className="w-full"><Link to="/list" className="block w-full py-3 px-4 text-[#033641] md:hover:text-[#0AC5C7] md:hover:bg-gray-100 rounded-lg" onClick={() => setOpen(false)}>List</Link></li>
          <li className="w-full"><Link to="/about" className="block w-full py-3 px-4 text-[#0AC5C7] font-semibold md:hover:bg-gray-100 rounded-lg" onClick={() => setOpen(false)}>Tentang</Link></li>
        </ul>
      </nav>

      <main className="w-full px-8 md:px-20 py-20 flex flex-col items-center justify-center">
        <div className="max-w-6xl w-full bg-white rounded-lg shadow-lg p-6 md:p-12">
          <h2 className="text-3xl md:text-5xl font-extrabold text-center text-[#033641] leading-tight mb-8">Tentang CekBurung</h2>

          <p className="text-lg leading-relaxed text-justify mb-4">
            Aplikasi <strong>CekBurung</strong> merupakan sebuah <strong>alat edukasi</strong> yang bertujuan untuk membantu masyarakat dalam mengenali <strong>spesies burung di indonesia yang boleh dipelihara</strong>, sehingga masyarakat dapat terhindar dari potensi jeratan hukum.
          </p>
          <p className="text-lg leading-relaxed text-justify mb-4">
            Sistem ini dirancang untuk memberikan informasi nama spesies burung, status perlindungan, serta endemisitasnya hanya dengan <strong>mengunggah atau mengambil gambar burung</strong> secara langsung.
          </p>
          <p className="text-lg leading-relaxed text-justify mb-4">
            Sebelum menggunakan fitur identifikasi, pengguna dapat melihat daftar <strong>nama spesies burung</strong> yang dapat diidentifikasi melalui tombol di bawah ini.
          </p>

          <div className="flex justify-center mt-6">
            <Link
              to="/list"
              className="bg-[#033641] md:hover:bg-[#0AC5C7] text-white font-semibold py-2 px-6 rounded-lg shadow transition-all duration-200"
            >
              Lihat List Burung
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
