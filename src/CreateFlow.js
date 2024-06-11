import React, { useState } from 'react';
import axios from 'axios';

const CreateFlow = () => {
  const [name, setName] = useState('');
  const [categories, setCategories] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/create-flow', {
        name,
        categories: categories.split(',').map(cat => cat.trim().toUpperCase()),
      });
      console.log('Flow created successfully:', response.data);
    } catch (error) {
      console.error('Error creating flow:', error);
    }
  };

  return (
    <div>
      <h1>Create New Flow</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Categories:</label>
          <input type="text" value={categories} onChange={(e) => setCategories(e.target.value)} required />
        </div>
        <button type="submit">Create Flow</button>
      </form>
    </div>
  );
};

export default CreateFlow;
