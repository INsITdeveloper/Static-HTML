"use client";
import React, { useState } from 'react';
import axios from 'axios';

const Photo = () => {
  const [photoData, setPhotoData] = useState<string[]>([]);

  const handleSubmit = async (query: string) => {
    try {
      const response = await axios.get(`https://sh.zanixon.xyz/api/dall-e?q=${query}`);
      setPhotoData(response.data);
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  return (
    <div>
      <button onClick={() => handleSubmit(prompt('Enter query:'))}>Create</button>
      <div>
        {photoData.map((photo, index) => (
          <img key={index} src={`data:image/jpeg;base64,${photo}`} alt={`Photo ${index + 1}`} />
        ))}
      </div>
    </div>
  );
};

export default Photo;
