import React, { useState } from 'react';
import Loader from './Loader';

const InputBox = ({ onSubmit, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) onSubmit(input);
  };

  return (
    <div className="input-section clearfix">
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Paste reel caption or transcript here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="btn-submit"
          disabled={!input.trim() || isLoading}
        >
          {isLoading ? <Loader /> : 'Extract Knowledge'}
        </button>
      </form>
    </div>
  );
};

export default InputBox;