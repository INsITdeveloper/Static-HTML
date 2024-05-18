"use client";
import React, { useState } from 'react';

const apiEndpoints = [
  {
    method: 'GET',
    path: '/api/waifu',
    description: 'Fetches waifu data.\nExample response:\n{ "waifuName": "Linucx Chan>3", "anime": "I'm Not Ready To Do It UwU" }',
    requestBody: null,
  },
];

const Page: React.FC = () => {
  const [description, setDescription] = useState('');

  const handleNavigate = (endpoint: string) => {
    window.location.href = endpoint;
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>API Documentation</h1>
      <section>
        <h2>Docs ID ( Indonesia )</h2>
        <p>Haloo Semua! Saya Memperkenalkan API Free Dari NeastooID,
          Project Ini Sebenarnya Sudah Tertinggal Sejak 2022 Dan Baru Di Lanjut Skrg,
          Project Ini Hanya Iseng Dan Gabut, Hanya Untuk Pembelajaran Saja,
          Namun Jika Kalain Ingin Memakai Nya Silahkan Dan Yap Yang Paling Penting Ini Free!,
          Namun Jika Kalian Berkenana Berdonasi Boleh Banget Kok!</p>
      </section>
      {apiEndpoints.length === 0 ? (
        <section>
          <p>No API endpoints configured.</p>
        </section>
      ) : (
        <section>
          <h2>Endpoints</h2>
          {apiEndpoints.map((endpoint, index) => (
            <div key={index} style={{ marginBottom: '20px' }}>
              <h3>
                {endpoint.method === 'GET' ? (
                  <>
                    {endpoint.method} /api/waifu
                    <button
                      onClick={() => handleNavigate(endpoint.path)}
                      style={{ marginLeft: '10px', background: 'none', border: '1px solid blue', color: 'blue', borderRadius: '4px', cursor: 'pointer', padding: '5px 10px' }}
                    >
                      Use
                    </button>
                  </>
                ) : (
                  `${endpoint.method} ${endpoint.path}`
                )}
              </h3>
              <div style={{ backgroundColor: '#f4f4f4', padding: '10px', borderRadius: '5px' }}>
                <pre>
                  <code>{endpoint.description}</code>
                </pre>
              </div>
              {endpoint.requestBody && (
                <>
                  <h4>Request Body</h4>
                  <pre>
                    <code>{endpoint.requestBody}</code>
                  </pre>
                </>
              )}
            </div>
          ))}
        </section>
      )}
      <footer style={{ marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
        <p>&copy; {new Date().getFullYear()} Created by Yusupkakuu</p>
      </footer>
    </div>
  );
};

export default Page;
