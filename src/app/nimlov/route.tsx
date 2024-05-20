"use client"
import React, { useState } from 'react';
import axios from 'axios';

// Buat komponen React untuk halaman Anime
const AnimePage: React.FC = () => {
  // State untuk menyimpan hasil pencarian
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Fungsi untuk melakukan pencarian anime
  const searchAnime = async () => {
    try {
      const response = await axios.get(`https://sh.zanixon.xyz/api/otakusearch?q=${searchQuery}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <h1>Halaman Anime</h1>
      {/* Form pencarian anime */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          searchAnime();
        }}
      >
        <input
          type="text"
          placeholder="Cari anime..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Cari</button>
      </form>
      
      {/* Tampilkan hasil pencarian */}
      <div>
        {searchResults.map((anime, index) => (
          <div key={index}>
            <h3>{anime.title}</h3>
            <p>{anime.synopsis}</p>
            {/* Tampilkan data lainnya sesuai kebutuhan */}
          </div>
        ))}
      </div>
    </div>
  );
};

// Ekspor komponen sebagai default
export default AnimePage;
