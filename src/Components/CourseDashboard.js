import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  getCourseById,
  getCourseSections
} from '../API/courses';
import {
  addSection,
  getSectionSubsections
} from '../API/sections';
import {
  addSubsection,
  getSubsectionFiles,
  getSubsectionReadings,
  getSubsectionPhotos,
  addSubsectionFile,
  addSubsectionReading,
  addSubsectionPhoto,
  addSubsectionVideo,
  getSubsectionVideos
} from '../API/subsections';
import AddSectionModal from './AddSectionModal';
import AddSubsectionModal from './AddSubsectionModal';
import AddReadingModal from './AddReadingModal';
import AddFileModal from './AddFileModal';
import AddPhotoModal from './AddPhotoModal';
import AddVideoModal from './AddVideoModal';
import '../styles/CourseDashboard.css';

const CourseDashboard = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [isAddSubsectionModalOpen, setIsAddSubsectionModalOpen] = useState(false);
  const [isAddReadingModalOpen, setIsAddReadingModalOpen] = useState(false);
  const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);
  const [isAddPhotoModalOpen, setIsAddPhotoModalOpen] = useState(false);
  const [isAddVideoModalOpen, setIsAddVideoModalOpen] = useState(false);
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
          const subsectionsWithContent = await Promise.all(subsections.map(async (subsection) => {
            const [files, readings, photos, videos] = await Promise.all([
              getSubsectionFiles(subsection.id, accessToken),
              getSubsectionReadings(subsection.id, accessToken),
              getSubsectionPhotos(subsection.id, accessToken),
              getSubsectionVideos(subsection.id, accessToken)
            ]);
            return { ...subsection, files, readings, photos, videos };
          }));
          return { ...section, subsections: subsectionsWithContent };
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

  const handleAddReading = async (readingData) => {
    try {
      const newReading = await addSubsectionReading(readingData, accessToken);
      const updatedSections = sections.map(section =>
        section.id === currentSectionId
          ? {
            ...section,
            subsections: section.subsections.map(subsection =>
              subsection.id === currentSectionId
                ? { ...subsection, readings: [...subsection.readings, newReading] }
                : subsection
            )
          }
          : section
      );
      setSections(updatedSections);
      setIsAddReadingModalOpen(false);
    } catch (error) {
      console.error('Error adding reading:', error);
      setError('Error adding reading');
    }
  };

  const handleAddFile = async (fileData) => {
    try {
      const newFile = await addSubsectionFile(fileData, accessToken);
      const updatedSections = sections.map(section =>
        section.id === currentSectionId
          ? {
            ...section,
            subsections: section.subsections.map(subsection =>
              subsection.id === currentSectionId
                ? { ...subsection, files: [...subsection.files, newFile] }
                : subsection
            )
          }
          : section
      );
      setSections(updatedSections);
      setIsAddFileModalOpen(false);
    } catch (error) {
      console.error('Error adding file:', error);
      setError('Error adding file');
    }
  };

  const handleAddPhoto = async (photoData) => {
    try {
      const newPhoto = await addSubsectionPhoto(photoData, accessToken);
      const updatedSections = sections.map(section =>
        section.id === currentSectionId
          ? {
            ...section,
            subsections: section.subsections.map(subsection =>
              subsection.id === currentSectionId
                ? { ...subsection, photos: [...subsection.photos, newPhoto] }
                : subsection
            )
          }
          : section
      );
      setSections(updatedSections);
      setIsAddPhotoModalOpen(false);
    } catch (error) {
      console.error('Error adding photo:', error);
      setError('Error adding photo');
    }
  };

  const handleAddVideo = async (videoData) => {
    try {
      const newVideo = await addSubsectionVideo(videoData, accessToken);
      const updatedSections = sections.map(section =>
        section.id === currentSectionId
          ? {
            ...section,
            subsections: section.subsections.map(subsection =>
              subsection.id === currentSectionId
                ? { ...subsection, videos: [...subsection.videos, newVideo] }
                : subsection
            )
          }
          : section
      );
      setSections(updatedSections);
      setIsAddVideoModalOpen(false);
    } catch (error) {
      console.error('Error adding video:', error);
      setError('Error adding video');
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
        {sections?.length === 0 ? (
          <p>No sections added yet.</p>
        ) : (
          <ul className="section-list">
            {sections.map(section => (
              <li key={section.id} className="section-item">
                <div className="section-header">
                  {section.name}
                  <button onClick={() => { setIsAddSubsectionModalOpen(true); setCurrentSectionId(section.id); }}>Add Subsection</button>
                </div>
                {section?.subsections.length === 0 ? (
                  <p>No subsections added yet.</p>
                ) : (
                  <ul className="subsection-list">
                    {section.subsections.map(subsection => (
                      <li key={subsection.id} className="subsection-item">
                        <div className="subsection-header">
                          {subsection.name}
                          <div className="subsection-actions">
                            {!subsection.readings.length && (
                              <button onClick={() => { setIsAddReadingModalOpen(true); setCurrentSectionId(subsection.id); }}>Add Reading</button>
                            )}
                            {!subsection.files.length && (
                              <button onClick={() => { setIsAddFileModalOpen(true); setCurrentSectionId(subsection.id); }}>Add File</button>
                            )}
                            {!subsection.photos.length && (
                              <button onClick={() => { setIsAddPhotoModalOpen(true); setCurrentSectionId(subsection.id); }}>Add Photo</button>
                            )}
                            {!subsection.videos.length && (
                              <button onClick={() => { setIsAddVideoModalOpen(true); setCurrentSectionId(subsection.id); }}>Add Video</button>
                            )}
                          </div>
                        </div>
                        <div className="subsection-content">
                          {subsection?.readings?.length > 0 && (
                            <div className="reading-list">
                              <h3>Readings:</h3>
                              <ul>
                                {subsection.readings.map(reading => (
                                  <li key={reading.id}>{reading.title}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {subsection?.files?.length > 0 && (
                            <div className="file-list">
                              <h3>Files:</h3>
                              <ul>
                                {subsection.files.map(file => (
                                  <li key={file.id}>{file.file_name}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {subsection?.photos?.length > 0 && (
                            <div className="photo-list">
                              <h3>Photos:</h3>
                              <ul>
                                {subsection.photos.map(photo => (
                                  <li key={photo.id}>
                                    <img src={photo?.image} alt={photo.image} />
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {subsection?.videos?.length > 0 && (
                            <div className="video-list">
                              <h3>Videos:</h3>
                              <ul>
                                {subsection.videos.map(video => (
                                  <li key={video.id}>
                                    <video src={video.video_file} controls>
                                      Your browser does not support the video tag.
                                    </video>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </li>
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
      <AddReadingModal
        isOpen={isAddReadingModalOpen}
        onClose={() => setIsAddReadingModalOpen(false)}
        onAddReading={handleAddReading}
        subsectionId={currentSectionId}
      />
      <AddFileModal
        isOpen={isAddFileModalOpen}
        onClose={() => setIsAddFileModalOpen(false)}
        onAddFile={handleAddFile}
        subsectionId={currentSectionId}
      />
      <AddPhotoModal
        isOpen={isAddPhotoModalOpen}
        onClose={() => setIsAddPhotoModalOpen(false)}
        onAddPhoto={handleAddPhoto}
        subsectionId={currentSectionId}
      />
      <AddVideoModal
        isOpen={isAddVideoModalOpen}
        onClose={() => setIsAddVideoModalOpen(false)}
        onAddVideo={handleAddVideo}
        subsectionId={currentSectionId}
      />
    </div>
  );
};

export default CourseDashboard;

