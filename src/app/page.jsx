"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Analytics } from '@vercel/analytics/react';

const apiEndpoints = [
  {
    category: 'RANIME',
    endpoints: [
      { method: 'GET', path: '/api/waifu' },
      { method: 'GET', path: '/api/maid' },
      { method: 'GET', path: '/api/oppai' },
      { method: 'GET', path: '/api/marin-kitagawa' },
      { method: 'GET', path: '/api/mori-calliope' },
      { method: 'GET', path: '/api/raiden-shogun' },
    ],
  },
  {
    category: 'ANIMEDL',
    endpoints: [
      { method: 'GET', path: '/api/otakudown?id=1' },
      { method: 'GET', path: '/api/otakusearch?q=id' },
      { method: 'GET', path: '/api/newanime' },
    ],
  },
    {
    category: 'DOWNLDR',
    endpoints: [
      { method: 'GET', path: '/api/tiktok?q=' },
      { method: 'GET', path: '/api/ytmp3?q=' },
      { method: 'GET', path: '/api/ytmp4?q=' },
      { method: 'GET', path: '/api/igdl?q=' },
    ],
  },
    {
    category: 'UPLDR',
    endpoints: [
      { method: 'GET', path: '/api/telegph?q=' },
      { method: 'GET', path: '/api/cdn?q=' },
    ],
  },
    {
    category: 'AI',
    endpoints: [
      { method: 'GET', path: '/api/gpt-4?q=' },
      { method: 'GET', path: '/api/gpt-3?q=' },
      { method: 'GET', path: '/api/bing?q=' },
      { method: 'GET', path: '/api/dall-e?q=' },
    ],
  },
  {
    category: 'NSFW',
    endpoints: [
      { method: 'GET', path: '/api/hentai' },
      { method: 'GET', path: '/api/ecchi' },
      { method: 'GET', path: '/api/milf' },
      { method: 'GET', path: '/api/oral' },
      { method: 'GET', path: '/api/ass' },
      { method: 'GET', path: '/api/ero' },
    ],
  },
];

const Page = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [endpointStatus, setEndpointStatus] = useState({});
  const [serverData, setServerData] = useState(null);

  const handleNavigate = (endpoint) => {
    window.location.href = endpoint;
  };

  const toggleCategory = (category) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  const checkEndpointStatus = async (endpoint) => {
    try {
      const response = await fetch(endpoint);
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const fetchStatus = async () => {
      const statusPromises = apiEndpoints.flatMap((category) =>
        category.endpoints.map(async (endpoint) => {
          const status = await checkEndpointStatus(endpoint.path);
          return { path: endpoint.path, status };
        })
      );

      const statusResults = await Promise.all(statusPromises);
      const statusMap = statusResults.reduce((acc, { path, status }) => {
        acc[path] = status;
        return acc;
      }, {});

      setEndpointStatus(statusMap);
    };

    fetchStatus();

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
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h2>Docs ID NSTAPI</h2>
        <section>
          <p>Haloo Semua! Saya Memperkenalkan API Free Dari NeastooID,
            Project Ini Sebenarnya Sudah Tertinggal Sejak 2022 Dan Baru Di Lanjut Skrg,
            Project Ini Hanya Iseng Dan Gabut, Hanya Untuk Pembelajaran Saja,
            Namun Jika Kalian Ingin Memakai Nya Silahkan Dan Yap Yang Paling Penting Ini Free!,
            Namun Jika Kalian Berkenan Berdonasi Boleh Banget Kok!</p>
        </section>
        {apiEndpoints.length === 0 ? (
          <section>
            <p>No API endpoints configured.</p>
          </section>
        ) : (
          apiEndpoints.map((category, catIndex) => (
            <section key={catIndex}>
              <h2
                onClick={() => toggleCategory(category.category)}
                style={{
                  cursor: 'pointer',
                  color: 'white',
                  border: '1px solid gray',
                  padding: '10px 15px', // Adjusted padding to reduce width by 5px
                  borderRadius: '5px',
                  backgroundColor: 'gray',
                  width: 'calc(100% - 5px)'
                }}
              >
                {category.category} Endpoints
              </h2>
              {activeCategory === category.category && (
                <div style={{ marginTop: '10px', transition: 'max-height 0.5s ease-in-out' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                    <thead>
                      <tr>
                        <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Nama Endpoint</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Status</th>
                        <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Test</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.endpoints.map((endpoint, index) => (
                        <tr key={index}>
                          <td style={{ border: '1px solid #ccc', padding: '8px' }}>{endpoint.path}</td>
                          <td
                            style={{
                              border: '1px solid #ccc',
                              padding: '8px',
                              color: endpointStatus[endpoint.path] ? 'green' : 'red',
                            }}
                          >
                            {endpointStatus[endpoint.path] ? '200 Success' : '404 Error'}
                          </td>
                          <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                            <button
                              onClick={() => handleNavigate(endpoint.path)}
                              style={{ background: 'none', border: '1px solid blue', color: 'blue', borderRadius: '4px', cursor: 'pointer', padding: '5px 10px' }}
                            >
                              Get
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ))
        )}
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
    </>
  );
};

export default Page;
