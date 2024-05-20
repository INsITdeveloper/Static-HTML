"use client";
import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';

const apiEndpoints = [
  {
    category: 'RandAnine',
    endpoints: [
      {
        method: 'GET',
        path: '/api/waifu',
        status: 'active'
      },
      {
        method: 'GET',
        path: '/api/maid',
        status: 'active'
      },
      {
        method: 'GET',
        path: '/api/oppai',
        status: 'active'
      },
    ],
  },
  {
    category: 'AninDown',
    endpoints: [
      {
        method: 'GET',
        path: '/api/otakudown?id=1',
        status: 'active'
      },
      {
        method: 'GET',
        path: '/api/otakusearch?q=id',
        status: 'active'
      },
    ],
  },
];

const Page = () => {
  const [serverData, setServerData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleNavigate = (endpoint) => {
    window.location.href = endpoint;
  };

  useEffect(() => {
    const fetchServerData = async () => {
      try {
        const response = await fetch('https://sh.zanixon.xyz/api/server');
        const data = await response.json();
        setServerData(data);
      } catch (error) {
        console.error('Error fetching server data:', error);
      }
    };

    fetchServerData();
    const interval = setInterval(fetchServerData, 1000); // Update every second

    const script = document.createElement('script');
    script.src = 'https://https-sh-zanixon-xyz.disqus.com/embed.js';
    script.setAttribute('data-timestamp', String(new Date()));
    script.async = true;

    document.head.appendChild(script);

    return () => {
      clearInterval(interval); // Clear the interval when component unmounts
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setIsDarkMode(e.matches);
    };
    
    setIsDarkMode(darkModeMediaQuery.matches);
    darkModeMediaQuery.addEventListener('change', handleChange);

    return () => {
      darkModeMediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return (
    <>
      <Analytics />
      <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif', backgroundColor: isDarkMode ? '#121212' : '#ffffff', color: isDarkMode ? '#ffffff' : '#000000' }}>
        <aside style={{ width: '250px', padding: '20px', borderRight: `1px solid ${isDarkMode ? '#333' : '#ccc'}`, backgroundColor: isDarkMode ? '#1e1e1e' : '#f9f9f9' }}>
          <h2>Categories</h2>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {apiEndpoints.map((category, index) => (
              <li key={index} style={{ marginBottom: '10px' }}>
                <button
                  onClick={() => setSelectedCategory(selectedCategory === index ? null : index)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    textAlign: 'left', 
                    cursor: 'pointer', 
                    fontWeight: selectedCategory === index ? 'bold' : 'normal',
                    color: isDarkMode ? '#ffffff' : '#000000'
                  }}
                >
                  {category.category}
                </button>
                {selectedCategory === index && (
                  <ul style={{ listStyleType: 'none', padding: '10px 0 0 20px' }}>
                    {category.endpoints.map((endpoint, epIndex) => (
                      <li key={epIndex} style={{ marginBottom: '5px' }}>
                        <div>
                          <span style={{ marginRight: '10px' }}>{endpoint.status}</span>
                          <button
                            onClick={() => handleNavigate(endpoint.path)}
                            style={{ 
                              background: 'none', 
                              border: `1px solid ${isDarkMode ? '#90caf9' : 'blue'}`, 
                              color: isDarkMode ? '#90caf9' : 'blue', 
                              borderRadius: '4px', 
                              cursor: 'pointer', 
                              padding: '5px 10px' 
                            }}
                          >
                            {endpoint.method} {endpoint.path}
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </aside>
        <div style={{ padding: '20px', flexGrow: 1 }}>
          <h2>Docs ID NSTAPI</h2>
          <section>
            <p>Haloo Semua! Saya Memperkenalkan API Free Dari NeastooID,
              Project Ini Sebenarnya Sudah Tertinggal Sejak 2022 Dan Baru Di Lanjut Skrg,
              Project Ini Hanya Iseng Dan Gabut, Hanya Untuk Pembelajaran Saja,
              Namun Jika Kalian Ingin Memakai Nya Silahkan Dan Yap Yang Paling Penting Ini Free!,
              Namun Jika Kalian Berkenan Berdonasi Boleh Banget Kok!</p>
          </section>
          <div id="disqus_thread"></div>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() { 
                  var d = document, s = d.createElement('script');
                  s.src = 'https://https-sh-zanixon-xyz.disqus.com/embed.js';
                  s.setAttribute('data-timestamp', +new Date());
                  (d.head || d.body).appendChild(s);
                })();
              `,
            }}
          />
          <section>
            <h2>Console</h2>
            <div>
              {serverData ? (
                <pre>
                  <code>{JSON.stringify(serverData, null, 2)}</code>
                </pre>
              ) : (
                <p>Loading server data...</p>
              )}
            </div>
          </section>
          <footer style={{ marginTop: '20px', borderTop: `1px solid ${isDarkMode ? '#444' : '#ccc'}`, paddingTop: '10px' }}>
            <p>&copy; {new Date().getFullYear()} Created by Yusupkakuu</p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Page;
