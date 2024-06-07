import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCourseById, getCourseSections } from '../API/courses';
import { addSection } from '../API/sections';
import AddSectionModal from './AddSectionModal'; // Import the AddSectionModal component
import '../styles/CourseDashboard.css';

const CourseDashboard = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const accessToken = JSON.parse(localStorage.getItem('user')).access;

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const fetchedCourse = await getCourseById(id, accessToken);
        setCourse(fetchedCourse);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    const fetchSections = async () => {
      try {
        const fetchedSections = await getCourseSections(id, accessToken);
        setSections(fetchedSections);
      } catch (error) {
        console.error('Error fetching course sections:', error);
        setError('Error fetching course sections');
      }
    };

    fetchCourse();
    fetchSections();
  }, [id, accessToken]);

  const handleAddSection = async (sectionData) => {
    try {
      const newSection = await addSection({ ...sectionData, course: id }, accessToken); // Pass the courseId
      setSections([...sections, newSection]);
      setIsAddSectionModalOpen(false); 
    } catch (error) {
      console.error('Error adding section:', error);
      setError('Error adding section');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="course-dashboard-container">
      <h1>{course.title}</h1>
      <div className="course-details">
        <p>Description: {course.description}</p>
        <p>Price: ${course.price}</p>
        <p>Teacher: {course.teacher}</p>
      </div>
      <div className="sections">
        <h2>Sections</h2>
        <button onClick={() => setIsAddSectionModalOpen(true)}>Add Section</button>
        {sections.length === 0 ? (
          <p>No sections added yet.</p>
        ) : (
          <ul>
            {sections.map(section => (
              <li key={section.id}>{section.name}</li>
            ))}
          </ul>
        )}
      </div>
      <AddSectionModal
        isOpen={isAddSectionModalOpen}
        onClose={() => setIsAddSectionModalOpen(false)}
        onAddSection={handleAddSection}
        courseId={id}
      />
    </div>
  );
};

export default CourseDashboard;
