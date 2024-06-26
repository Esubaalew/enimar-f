import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../styles/CourseModal.css';
import { addCourse } from '../API/courses';

const CourseModal = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [poster, setPoster] = useState(null);
  const [price, setPrice] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const accessToken = JSON.parse(localStorage.getItem('user')).access;
  const teacher = JSON.parse(localStorage.getItem('user')).id; 
  const navigate = useNavigate(); 

  const handlePosterChange = (event) => {
    setPoster(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const courseData = new FormData();
    courseData.append('title', title);
    courseData.append('description', description);
    courseData.append('poster', poster);
    courseData.append('price', price);
    courseData.append('teacher', teacher);

    try {
      const newCourse = await addCourse(courseData, accessToken);
      console.log('New course created:', newCourse);
      setError(null);
      setSuccessMessage('Course created successfully!'); 
      navigate(`/course/${newCourse.id}/edit`);
      setTimeout(() => {
        onClose();
      }, 2000); 
    } catch (error) {
      setError(error.message);
      console.error('Failed to create course:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Cmodal-overlay" onClick={onClose}>
      <div className="Cmodal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>X</button>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a description"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter the price"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="poster">Poster</label>
            <input
              type="file"
              id="poster"
              onChange={handlePosterChange}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="course-button" disabled={loading}>
              {loading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                'Create Course'
              )}
            </button>
            <button type="button" className="cancel-button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      </div>
    </div>
  );
};

export default CourseModal;
