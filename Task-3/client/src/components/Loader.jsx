import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = () => (
  <div className="loader">
    <Loader2 className="spinner" size={20} />
    <span>Processing...</span>
  </div>
);

export default Loader;