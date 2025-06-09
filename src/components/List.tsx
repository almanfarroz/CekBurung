import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

interface Label {
  burung_id: number;
  labels_name: string;
  indo_name: string;
  english_name: string;
  latin_name: string;
  endemik: string;
  status_perlindungan: string;
}

export default function About() {
  const [open, setOpen] = useState(false);
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof Label | ''>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const itemsPerPage = 10;

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
    const fetchLabels = async () => {
      try {
        const response = await fetch('https://backend-production-5db8.up.railway.app/labels/');
        const data = await response.json();
        setLabels(data);
      } catch (error) {
        console.error("Gagal mengambil data label:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLabels();
  }, []);

  const handleImageClick = (src: string) => {
    setSelectedImage(src);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const handleSort = (key: keyof Label) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortKey === key && sortDirection === 'asc') {
      direction = 'desc';
    }
    setSortKey(key);
    setSortDirection(direction);
    setCurrentPage(1);
  };

  const sortedLabels = [...labels].sort((a, b) => {
    if (!sortKey) return 0;
    const aValue = a[sortKey].toString().toLowerCase();
    const bValue = b[sortKey].toString().toLowerCase();
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredLabels = sortedLabels.filter((label) =>
    label.indo_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    label.english_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    label.latin_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredLabels.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLabels.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

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
          <li className="w-full"><Link to="/list" className="block w-full py-3 px-4 text-[#0AC5C7] font-semibold md:hover:bg-gray-100 rounded-lg" onClick={() => setOpen(false)}>List</Link></li>
          <li className="w-full"><Link to="/about" className="block w-full py-3 px-4 text-[#033641] md:hover:text-[#0AC5C7] md:hover:bg-gray-100 rounded-lg" onClick={() => setOpen(false)}>Tentang</Link></li>
        </ul>
      </nav>

      <main className="w-full px-8 md:px-20 py-20 flex flex-col items-center justify-center">
        <div className="max-w-6xl w-full bg-white rounded-lg shadow-lg p-6 md:p-12">
          <h2 className="text-3xl md:text-5xl font-extrabold text-center text-[#033641] leading-tight mb-8">List Burung</h2>

          {loading ? (
            <p className="text-center text-[#033641]">Loading daftar burung...</p>
          ) : (
            <>
              <div className="mb-4">
                <div className="flex justify-center md:justify-end">
                  <input
                    type="text"
                    placeholder="Cari burung..."
                    className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </div>

              <div className="overflow-x-auto w-full">
                <table className="min-w-full table-fixed border-collapse border rounded-lg shadow-lg text-sm md:text-base">
                  <thead className="bg-[#0AC5C7] text-[#033641]">
                    <tr>
                      <th className="border px-4 py-2">#</th>
                      <th className="border px-4 py-2">Foto</th>

                      <th className="border px-4 py-2 cursor-pointer" onClick={() => handleSort('indo_name')}>
                        <span className="flex items-center gap-1 justify-center">
                          Nama Indonesia
                          <span>{sortKey === 'indo_name' ? (sortDirection === 'asc' ? '▲' : '▼') : '▲'}</span>
                        </span>
                      </th>

                      <th className="border px-4 py-2 cursor-pointer" onClick={() => handleSort('english_name')}>
                        <span className="flex items-center gap-1 justify-center">
                          Nama Inggris
                          <span>{sortKey === 'english_name' ? (sortDirection === 'asc' ? '▲' : '▼') : '▲'}</span>
                        </span>
                      </th>

                      <th className="border px-4 py-2 cursor-pointer" onClick={() => handleSort('latin_name')}>
                        <span className="flex items-center gap-1 justify-center">
                          Nama Latin
                          <span>{sortKey === 'latin_name' ? (sortDirection === 'asc' ? '▲' : '▼') : '▲'}</span>
                        </span>
                      </th>

                      <th className="border px-4 py-2 cursor-pointer" onClick={() => handleSort('endemik')}>
                        <span className="flex items-center gap-1 justify-center">
                          Endemik Indonesia
                          <span>{sortKey === 'endemik' ? (sortDirection === 'asc' ? '▲' : '▼') : '▲'}</span>
                        </span>
                      </th>

                      <th className="border px-4 py-2 cursor-pointer" onClick={() => handleSort('status_perlindungan')}>
                        <span className="flex items-center gap-1 justify-center">
                          Status Perlindungan
                          <span>{sortKey === 'status_perlindungan' ? (sortDirection === 'asc' ? '▲' : '▼') : '▲'}</span>
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((label, index) => (
                      <tr key={label.burung_id} className="text-center md:hover:bg-gray-100">
                        <td className="border px-4 py-4">{indexOfFirstItem + index + 1}</td>
                        <td className="border px-4 py-4">
                          <img
                            src={`/assets/images/${label.labels_name}.jpg`}
                            alt={label.indo_name}
                            className="mx-auto w-20 aspect-square object-cover rounded cursor-pointer"
                            onClick={() => handleImageClick(`/assets/images/${label.labels_name}.jpg`)}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/assets/logoburung.png";
                            }}
                          />
                        </td>
                        <td className="border px-4 py-2">{label.indo_name}</td>
                        <td className="border px-4 py-2">{label.english_name}</td>
                        <td className="border px-4 py-2 italic">{label.latin_name}</td>
                        <td className="border px-4 py-2">{label.endemik}</td>
                        <td className="border px-4 py-2">{label.status_perlindungan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <div className="flex flex-wrap gap-2 items-center justify-center overflow-x-auto max-w-full">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                    >
                      Prev
                    </button>
                    <div className="hidden md:flex gap-2">
                      {Array.from({ length: totalPages }, (_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => paginate(i + 1)}
                          className={`px-3 py-1 rounded ${
                            currentPage === i + 1
                              ? 'bg-[#0AC5C7] text-white'
                              : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <span className="block md:hidden text-sm px-2">
                      Halaman {currentPage} dari {totalPages}
                    </span>
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={closeModal}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white text-2xl font-bold z-50"
            >
              &times;
            </button>
            <img
              src={selectedImage}
              alt="Preview"
              className="max-w-[90vw] max-h-[80vh] rounded shadow-lg"
            />
          </div>
        </div>
      )}
      <footer className='text-[#033641]'>
        © 2025 CekBurung. All rights reserved
      </footer>
    </div>
  );
}
