import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCourseById, getCourseSections } from '../API/courses';
import { getSectionSubsections } from '../API/sections';
import { getSubsectionFiles, getSubsectionPhotos, getSubsectionReadings, getSubsectionVideos } from '../API/subsections';
import { makeCompletion, getCompletedSubsectionsForCourse } from '../API/courses';
import { getLoggedInUser } from '../API/auth';
import { createCertificate, fetchUserCourseCertificates } from '../API/courses';
import '../styles/StudentCourseView.css';
import Header from './Header';

const StudentCourseView = () => {
  const { id } = useParams();
  // eslint-disable-next-line no-unused-vars
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [selectedSubsection, setSelectedSubsection] = useState(null);
  const [subsectionContent, setSubsectionContent] = useState({
    readings: [],
    files: [],
    photos: [],
    videos: []
  });
  const [completedSubsections, setCompletedSubsections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const accessToken = JSON.parse(localStorage.getItem('user')).access;
  const backendUrl = 'http://localhost:8000';
  const [allSectionsCompleted, setAllSectionsCompleted] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const [fetchedCourse, fetchedSections, fetchedCompletedSubsections] = await Promise.all([
          getCourseById(id, accessToken),
          getCourseSections(id, accessToken),
          getCompletedSubsectionsForCourse(id, accessToken)
        ]);

        const sectionsWithSubsections = await Promise.all(fetchedSections.map(async (section) => {
          const subsections = await getSectionSubsections(section.id, accessToken);
          return { ...section, subsections };
        }));

        setCourse(fetchedCourse);
        setSections(sectionsWithSubsections);
        setCompletedSubsections(fetchedCompletedSubsections.map(item => item.subsection));

        const allCompleted = sectionsWithSubsections.every(section =>
          section.subsections.every(subsection =>
            fetchedCompletedSubsections.some(item => item.subsection === subsection.id)
          )
        );
        setAllSectionsCompleted(allCompleted);

        const fetchedCertificates = await fetchUserCourseCertificates(id, accessToken);
        setCertificates(fetchedCertificates);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id, accessToken]);

  const handleSubsectionClick = async (subsection) => {
    setSelectedSubsection(subsection);
    try {
      const [readings, files, photos, videos] = await Promise.all([
        getSubsectionReadings(subsection.id, accessToken),
        getSubsectionFiles(subsection.id, accessToken),
        getSubsectionPhotos(subsection.id, accessToken),
        getSubsectionVideos(subsection.id, accessToken)
      ]);
      setSubsectionContent({ readings, files, photos, videos });
    } catch (error) {
      setError('Error fetching subsection content');
    }
  };

  const markAsCompleted = async () => {
    setIsCompleting(true);
    try {
      const user = await getLoggedInUser(accessToken);

      const completionData = {
        user: user?.id,
        subsection: selectedSubsection?.id,
        completed: true
      };
      await makeCompletion(completionData, accessToken);

      if (selectedSubsection) {
        setSelectedSubsection(prevState => ({
          ...prevState,
          completed: true
        }));
        setCompletedSubsections(prev => [...prev, selectedSubsection.id]);

        const allCompleted = sections.every(section =>
          section.subsections.every(subsection =>
            completedSubsections.includes(subsection.id)
          )
        );
        setAllSectionsCompleted(allCompleted);
      }
    } catch (error) {
      setError('Error marking subsection as completed');
    } finally {
      setIsCompleting(false);
    }
  };

  const handleClaimCertificate = async () => {
    try {
      const user = await getLoggedInUser(accessToken);
      const certificateData = { course: id, user: user?.id };
      const newCertificate = await createCertificate(certificateData, accessToken);
      setCertificates(prevCertificates => [...prevCertificates, newCertificate]);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDownloadCertificate = () => {
    if (certificates.length > 0) {
      const firstCertificate = certificates[0];
      const url = firstCertificate.pdf_file;
      const a = document.createElement('a');
      a.href = url;
      a.download = 'certificate.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };
  
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Header />
      <div className="course-dashboard-container">
        <div className="sidebarL">
          <h2>Contents</h2>
          {sections.length === 0 ? (
            <p>No sections added yet.</p>
          ) : (
            <ul className="section-list">
              {sections.map(section => (
                <li key={section.id} className="section-item">
                  <details>
                    <summary>{section.name}</summary>
                    <ul className="subsection-list">
                      {section.subsections.map(subsection => (
                        <li
                          key={subsection.id}
                          className={`subsection-item ${selectedSubsection?.id === subsection.id ? 'selected' : ''}`}
                          onClick={() => handleSubsectionClick(subsection)}
                        >
                          {subsection.name}
                          {completedSubsections.includes(subsection.id) && (
                            <i className="fas fa-check-circle completed-checkmark"></i>
                          )}
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              ))}
            </ul>
          )}
          {allSectionsCompleted && (
            <div className="congratulations-section">
              {certificates.length > 0 ? (
                <button className="claim-certificate-btn" onClick={handleDownloadCertificate}>
                  Download Certificate
                </button>
              ) : (
                <button className="claim-certificate-btn" onClick={handleClaimCertificate}>
                  Claim Certificate
                </button>
              )}
              <p>Congratulations! You have completed all sections of this course.</p>
            </div>
          )}
        </div>
        <div className="contentL custom-content">
          {selectedSubsection ? (
            <div className="subsection-content">
              <h2>{selectedSubsection.name}</h2>
              {subsectionContent.readings.length > 0 && (
                <div className="reading-list">
                  <h4>Readings:</h4>
                  <ul>
                    {subsectionContent.readings.map(reading => (
                      <li key={reading.id}>
                        <h5>{reading.title}</h5>
                        <p>{reading.content}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {subsectionContent.files.length > 0 && (
                <div className="file-list">
                  <h4>Files:</h4>
                  <ul>
                    {subsectionContent.files.map(file => (
                      <li key={file.id}>{file.file_name}</li>
                    ))}
                  </ul>
                </div>
              )}
              {subsectionContent.photos.length > 0 && (
                <div className="photo-list">
                  <h4>Photos:</h4>
                  <ul>
                    {subsectionContent.photos.map(photo => (
                      <li key={photo.id}>
                        <img src={`${backendUrl}${photo.image}`} alt={` of ${photo.image}`} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {subsectionContent.videos.length > 0 && (
                <div className="video-list">
                  <h4>Videos:</h4>
                  <ul>
                    {subsectionContent.videos.map(video => (
                      <li key={video.id}>
                        <video src={`${backendUrl}${video.video_file}`} controls>
                          Your browser does not support the video tag.
                        </video>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {!completedSubsections.includes(selectedSubsection.id) && (
                <button
                  className="mark-completed-btn"
                  onClick={markAsCompleted}
                  disabled={isCompleting}
                >
                  {isCompleting ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    'Mark as Completed'
                  )}
                </button>
              )}
              {completedSubsections.includes(selectedSubsection.id) && (
                <span className="completed-tag">Completed</span>
              )}
            </div>
          ) : (
            <p>Select a subsection to view its content</p>
          )}
        </div>
      </div>
    </>
  );
};

export default StudentCourseView;
