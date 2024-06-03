// App.js
import React, { useState } from 'react';
import PostModal from './PostModal';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <button onClick={openModal}>Create Post</button>
      {isModalOpen && <PostModal onClose={closeModal} />}
    </div>
  );
};

export default Home;
