"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Analytics } from '@vercel/analytics/react';

const apiEndpoints = [
  {
    category: 'RandAnine',
    endpoints: [
      {
        method: 'GET',
        path: '/api/waifu',
        description: 'Example response:\n{ "waifuName": "Linucx Chan>3", "anime": "I\'m Not Ready To Do It UwU" }',
      },
      {
        method: 'GET',
        path: '/api/maid',
        description: 'Example response:\n{ "url": "https://cdn.waifu.im/7347.jpg" }',
      },
      {
        method: 'GET',
        path: '/api/oppai',
        description: 'Example response:\n{ "oppaiSize": "XL", "anime": "Big Oppai" }',
      },
    ],
  },
  {
    category: 'AninDown',
    endpoints: [
      {
        method: 'GET',
        path: '/api/otakudown?=id',
        description: 'Example response:\n{ "link": "https://otakudesu.cloud/batch/knkgdddn01nk-batch-sub-indo/" }',
      },
      {
        method: 'GET',
        path: '/api/otakusearch?q=id',
        description: 'Example response:\n{ "searchResults": [ { "title": "Naruto", "link": "https://otakudesu.cloud/anime/naruto", "imageUrl": "https://otakudesu.cloud/wp-content/uploads/2024/04/Naruto.jpg", "altText": "Naruto Sub Indo", "genres": ["Action", "Adventure"], "status": "Completed", "rating": "8.5" } ] }',
      },
    ],
  },
];

const Page = () => {
  const [description, setDescription] = useState('');
  const [serverData, setServerData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

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

  return (
    <>
      <Analytics />
      <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif' }}>
        <aside style={{ width: '250px', padding: '20px', borderRight: '1px solid #ccc' }}>
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
                    fontWeight: selectedCategory === index ? 'bold' : 'normal'
                  }}
                >
                  {category.category}
                </button>
                {selectedCategory === index && (
                  <ul style={{ listStyleType: 'none', padding: '10px 0 0 20px' }}>
                    {category.endpoints.map((endpoint, epIndex) => (
                      <li key={epIndex} style={{ marginBottom: '5px' }}>
                        <button
                          onClick={() => handleNavigate(endpoint.path)}
                          style={{ 
                            background: 'none', 
                            border: '1px solid blue', 
                            color: 'blue', 
                            borderRadius: '4px', 
                            cursor: 'pointer', 
                            padding: '5px 10px' 
                          }}
                        >
                          {endpoint.method} {endpoint.path}
                        </button>
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
          {selectedCategory !== null && apiEndpoints[selectedCategory].endpoints.map((endpoint, index) => (
            <section key={index}>
              <h3>
                {endpoint.method} {endpoint.path}
                <button
                  onClick={() => handleNavigate(endpoint.path)}
                  style={{ 
                    marginLeft: '10px', 
                    background: 'none', 
                    border: '1px solid blue', 
                    color: 'blue', 
                    borderRadius: '4px', 
                    cursor: 'pointer', 
                    padding: '5px 10px' 
                  }}
                >
                  Use
                </button>
              </h3>
              <div style={{ backgroundColor: '#f4f4f4', padding: '10px', borderRadius: '5px' }}>
                <pre>
                  <code>{endpoint.description}</code>
                </pre>
              </div>
            </section>
          ))}
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
          <footer style={{ marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
            <p>&copy; {new Date().getFullYear()} Created by Yusupkakuu</p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Page;
