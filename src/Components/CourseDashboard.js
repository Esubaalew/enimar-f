import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCourseById, getCourseSections } from '../API/courses';
import { addSection, getSectionSubsections } from '../API/sections';
import { addSubsection } from '../API/subsections';
import AddSectionModal from './AddSectionModal'; // Import the AddSectionModal component
import AddSubsectionModal from './AddSubsectionModal'; // Import the AddSubsectionModal component
import '../styles/CourseDashboard.css';

const CourseDashboard = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [isAddSubsectionModalOpen, setIsAddSubsectionModalOpen] = useState(false);
  const [currentSectionId, setCurrentSectionId] = useState(null);
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
        const sectionsWithSubsections = await Promise.all(fetchedSections.map(async (section) => {
          const subsections = await getSectionSubsections(section.id, accessToken);
          return { ...section, subsections };
        }));
        setSections(sectionsWithSubsections);
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
      const newSection = await addSection({ ...sectionData, course: id }, accessToken);
      setSections([...sections, newSection]);
      setIsAddSectionModalOpen(false); 
    } catch (error) {
      console.error('Error adding section:', error);
      setError('Error adding section');
    }
  };

  const handleAddSubsection = async (subsectionData) => {
    try {
      const newSubsection = await addSubsection(subsectionData, accessToken);
      const updatedSections = sections.map(section => 
        section.id === currentSectionId 
        ? { ...section, subsections: [...section.subsections, newSubsection] } 
        : section
      );
      setSections(updatedSections);
      setIsAddSubsectionModalOpen(false);
    } catch (error) {
      console.error('Error adding subsection:', error);
      setError('Error adding subsection');
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
              <li key={section.id}>
                <div>{section.name}</div>
                <button onClick={() => { setIsAddSubsectionModalOpen(true); setCurrentSectionId(section.id); }}>Add Subsection</button>
                {section.subsections.length === 0 ? (
                  <p>No subsections added yet.</p>
                ) : (
                  <ul>
                    {section.subsections.map(subsection => (
                      <li key={subsection.id}>{subsection.name}</li>
                    ))}
                  </ul>
                )}
              </li>
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
      <AddSubsectionModal
        isOpen={isAddSubsectionModalOpen}
        onClose={() => setIsAddSubsectionModalOpen(false)}
        onAddSubsection={handleAddSubsection}
        sectionId={currentSectionId}
      />
    </div>
  );
};

export default CourseDashboard;
