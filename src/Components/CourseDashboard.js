import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getCourseById,
  getCourseSections,
  updateCourseStatus
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
  getSubsectionVideos,
  getSubsectionQuestions 
} from '../API/subsections';
import { addQuestion, addQuestionChoice, getQuestionChoices } from '../API/quiz';
import AddSectionModal from './AddSectionModal';
import AddSubsectionModal from './AddSubsectionModal';
import AddReadingModal from './AddReadingModal';
import AddFileModal from './AddFileModal';
import AddPhotoModal from './AddPhotoModal';
import AddVideoModal from './AddVideoModal';
import ConfirmPublishModal from './ConfirmPublishModal';
import AddQuestionModal from './AddQuestionModal';
import AddChoiceModal from './AddChoiceModal'; // Corrected import statement
import '../styles/CourseDashboard.css';
import { getLoggedInUser } from '../API/auth';
import Header from './Header';

const backendUrl = 'http://localhost:8000';

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
  const [isConfirmPublishModalOpen, setIsConfirmPublishModalOpen] = useState(false);
  const [publishError, setPublishError] = useState(null);
  const [currentSectionId, setCurrentSectionId] = useState(null);
  const [currentSubsectionId, setCurrentSubsectionId] = useState(null);
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);
  const [currentSubsectionIdForQuestion, setCurrentSubsectionIdForQuestion] = useState(null);
  const [isAddChoiceModalOpen, setIsAddChoiceModalOpen] = useState(false);
  const [currentQuestionIdForChoice, setCurrentQuestionIdForChoice] = useState(null);



  const accessToken = JSON.parse(localStorage.getItem('user'))?.access || '';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const fetchedCourse = await getCourseById(id, accessToken);
        const loggedInUser = await getLoggedInUser(accessToken);
        const loggedInUserId = loggedInUser?.id;

        if (fetchedCourse.teacher !== loggedInUserId) {
          navigate('/unauthorized');
          return;
        }
        setCourse(fetchedCourse);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchSections = async () => {
      try {
        const fetchedSections = await getCourseSections(id, accessToken);
        const sectionsWithSubsections = await Promise.all(fetchedSections.map(async (section) => {
          const subsections = await getSectionSubsections(section.id, accessToken);
          const subsectionsWithContent = await Promise.all(subsections.map(async (subsection) => {
            const [files, readings, photos, videos, questions] = await Promise.all([
              getSubsectionFiles(subsection.id, accessToken),
              getSubsectionReadings(subsection.id, accessToken),
              getSubsectionPhotos(subsection.id, accessToken),
              getSubsectionVideos(subsection.id, accessToken),
              getSubsectionQuestions(subsection.id, accessToken)
            ]);
            const questionsWithChoices = await Promise.all(questions.map(async (question) => {
              const choices = await getQuestionChoices(question.id, accessToken);
              return { ...question, choices };
            }));
            return { ...subsection, files, readings, photos, videos, questions: questionsWithChoices };
          }));
          return { ...section, subsections: subsectionsWithContent.length ? subsectionsWithContent : [] };
        }));
        setSections(sectionsWithSubsections);
      } catch (error) {
        setError('Error fetching course sections');
      }
    };
    
  
    fetchCourse();
    fetchSections();
  }, [id, accessToken, navigate]);

  const handleAddSection = async (sectionData) => {
    try {
      const newSection = await addSection({ ...sectionData, course: id }, accessToken);
      setSections(prevSections => [...prevSections, { ...newSection, subsections: [] }]);
      setIsAddSectionModalOpen(false);
    } catch (error) {
      setError('Error adding section');
    }
  };
  
  const handleAddSubsection = async (subsectionData) => {
    try {
      const newSubsection = await addSubsection(subsectionData, accessToken);
      setSections(prevSections =>
        prevSections.map(section =>
          section.id === currentSectionId
            ? {
                ...section,
                subsections: section.subsections
                  ? [...section.subsections, { ...newSubsection, readings: [], files: [], photos: [], videos: [], questions: [] }]
                  : [{ ...newSubsection, readings: [], files: [], photos: [], videos: [], questions: [] }]
              }
            : section
        )
      );
      setIsAddSubsectionModalOpen(false);
    } catch (error) {
      setError('Error adding subsection');
    }
  };
  
  const handleAddReading = async (readingData) => {
    try {
      const newReading = await addSubsectionReading(readingData, accessToken);
      setSections(prevSections =>
        prevSections.map(section =>
          section.id === currentSectionId
            ? {
                ...section,
                subsections: section.subsections.map(subsection =>
                  subsection.id === currentSubsectionId
                    ? { 
                        ...subsection, 
                        readings: subsection.readings ? [...subsection.readings, newReading] : [newReading] 
                      }
                    : subsection
                )
              }
            : section
        )
      );
      setIsAddReadingModalOpen(false);
    } catch (error) {
      setError('Error adding reading');
    }
  };
  
  const handleAddFile = async (fileData) => {
    try {
      const newFile = await addSubsectionFile(fileData, accessToken);
      setSections(prevSections =>
        prevSections.map(section =>
          section.id === currentSectionId
            ? {
                ...section,
                subsections: section.subsections.map(subsection =>
                  subsection.id === currentSubsectionId
                    ? { 
                        ...subsection, 
                        files: subsection.files ? [...subsection.files, newFile] : [newFile] 
                      }
                    : subsection
                )
              }
            : section
        )
      );
      setIsAddFileModalOpen(false);
    } catch (error) {
      setError('Error adding file');
    }
  };
  
  const handleAddPhoto = async (photoData) => {
    try {
      const newPhoto = await addSubsectionPhoto(photoData, accessToken);
      setSections(prevSections =>
        prevSections.map(section =>
          section.id === currentSectionId
            ? {
                ...section,
                subsections: section.subsections.map(subsection =>
                  subsection.id === currentSubsectionId
                    ? { 
                        ...subsection, 
                        photos: subsection.photos ? [...subsection.photos, newPhoto] : [newPhoto] 
                      }
                    : subsection
                )
              }
            : section
        )
      );
      setIsAddPhotoModalOpen(false);
    } catch (error) {
      setError('Error adding photo');
    }
  };
  
  const handleAddVideo = async (videoData) => {
    try {
      const newVideo = await addSubsectionVideo(videoData, accessToken);
      setSections(prevSections =>
        prevSections.map(section =>
          section.id === currentSectionId
            ? {
                ...section,
                subsections: section.subsections.map(subsection =>
                  subsection.id === currentSubsectionId
                    ? { 
                        ...subsection, 
                        videos: subsection.videos ? [...subsection.videos, newVideo] : [newVideo] 
                      }
                    : subsection
                )
              }
            : section
        )
      );
      setIsAddVideoModalOpen(false);
    } catch (error) {
      setError('Error adding video');
    }
  };
  
  const handleAddQuestion = async (questionData) => {
    try {
      const newQuestion = await addQuestion(questionData, accessToken);
      setSections(prevSections =>
        prevSections.map(section =>
          section.id === currentSectionId
            ? {
                ...section,
                subsections: section.subsections.map(subsection =>
                  subsection.id === currentSubsectionIdForQuestion
                    ? { 
                        ...subsection, 
                        questions: subsection.questions ? [...subsection.questions, { ...newQuestion, choices: [] }] : [{ ...newQuestion, choices: [] }] 
                      }
                    : subsection
                )
              }
            : section
        )
      );
      setIsAddQuestionModalOpen(false);
    } catch (error) {
      setError('Error adding question');
    }
  };
  
  const handleAddChoice = async (choiceData) => {
    try {
      const newChoice = await addQuestionChoice(choiceData, accessToken);
      setSections(prevSections =>
        prevSections.map(section =>
          section.subsections.map(subsection =>
            subsection.id === currentSubsectionIdForQuestion
              ? {
                  ...subsection,
                  questions: subsection.questions.map(question =>
                    question.id === currentQuestionIdForChoice
                      ? { 
                          ...question, 
                          choices: question.choices ? [...question.choices, newChoice] : [newChoice] 
                        }
                      : question
                  )
                }
              : subsection
          )
        )
      );
      setIsAddChoiceModalOpen(false);
    } catch (error) {
      setError('Error adding choice');
    }
  };
  
  
  const handlePublish = async () => {
    try {
      await updateCourseStatus(id, true, accessToken); 
      setCourse(prevCourse => ({ ...prevCourse, published: true }));
      setIsConfirmPublishModalOpen(false);
    } catch (error) {
      setPublishError('Error publishing course');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      <Header />
      <div className="DDB-course-dashboard-container">
        <div className="fancy-header">
          <h1>{course.title}</h1>
        </div>
        <div className="DDB-course-details">
          <p>Description: {course.description}</p>
          <p>Price: ${course.price}</p>
          <p>Teacher: {course.teacher}</p>
        </div>
        <div className="DDB-sections">
          <h2>Sections</h2>
          <button onClick={() => setIsAddSectionModalOpen(true)} className="DDB-button">
            Add Section
          </button>
          {sections.length === 0 ? (
            <p>No sections added yet.</p>
          ) : (
            <ul className="DDB-section-list">
              {sections.map((section) => (
                <li key={section.id} className="DDB-section-item">
                  <div className="DDB-section-header">
                    {section.name}
                    <button
                      onClick={() => {
                        setIsAddSubsectionModalOpen(true);
                        setCurrentSectionId(section.id);
                      }}
                      className="DDB-button"
                    >
                      Add Subsection
                    </button>
                  </div>
                  {section.subsections?.length === 0 ? (
                    <p>No subsections added yet.</p>
                  ) : (
                    <ul className="DDB-subsection-list">
                      {section.subsections?.map((subsection) => (
                        <li key={subsection.id} className="DDB-subsection-item">
                          <div className="DDB-subsection-header">
                            {subsection.name}
                            <div className="DDB-subsection-actions">
                              <button
                                onClick={() => {
                                  setIsAddQuestionModalOpen(true);
                                  setCurrentSubsectionIdForQuestion(subsection.id);
                                }}
                                className="DDB-button"
                              >
                                Add Question
                              </button>
                              <button
                                onClick={() => {
                                  setIsAddReadingModalOpen(true);
                                  setCurrentSubsectionId(subsection.id);
                                }}
                                className="DDB-button"
                              >
                                Add Reading
                              </button>
                              <button
                                onClick={() => {
                                  setIsAddFileModalOpen(true);
                                  setCurrentSubsectionId(subsection.id);
                                }}
                                className="DDB-button"
                              >
                                Add File
                              </button>
                              <button
                                onClick={() => {
                                  setIsAddPhotoModalOpen(true);
                                  setCurrentSubsectionId(subsection.id);
                                }}
                                className="DDB-button"
                              >
                                Add Photo
                              </button>
                              <button
                                onClick={() => {
                                  setIsAddVideoModalOpen(true);
                                  setCurrentSubsectionId(subsection.id);
                                }}
                                className="DDB-button"
                              >
                                Add Video
                              </button>
                            </div>
                          </div>
                          <div className="DDB-subsection-content">
                            {/* Display Questions */}
                            {subsection.questions?.length > 0 && (
                              <div className="DDB-question-list">
                                <h3>Questions:</h3>
                                <ul>
                                  {subsection.questions.map((question) => (
                                    <li key={question.id}>
                                      <p>{question.text}</p>
                                      {/* Display Choices if available */}
                                      {question.choices?.length > 0 && (
                                  <ul className="DDB-choice-list">
                                    {question.choices.map((choice) => (
                                      <li key={choice.id} className="DDB-choice-item">
                                        <p className="choice-text">{choice.text}</p>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                                      {/* Add Choice Button */}
                                      <button
                                        onClick={() => {
                                          setIsAddChoiceModalOpen(true); // Open AddChoiceModal
                                          setCurrentQuestionIdForChoice(question.id); // Pass question id
                                        }}
                                        className="DDB-button"
                                      >
                                        Add Choice
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {/* Display Readings */}
                            {subsection.readings?.length > 0 && (
                              <div className="DDB-reading-list">
                                <h3>Readings:</h3>
                                <ul>
                                  {subsection.readings.map((reading) => (
                                    <li key={reading.id}>{reading.title}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {/* Display Files */}
                            {subsection.files?.length > 0 && (
                              <div className="DDB-file-list">
                                <h3>Files:</h3>
                                <ul>
                                  {subsection.files.map((file) => (
                                    <li key={file.id}>{file.file_name}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {/* Display Photos */}
                            {subsection.photos?.length > 0 && (
                              <div className="DDB-photo-list">
                                <h3>Photos:</h3>
                                <ul>
                                  {subsection.photos.map((photo) => (
                                    <li key={photo.id}>
                                      <img src={`${backendUrl}${photo.image}`} alt={photo.image} />
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {/* Display Videos */}
                            {subsection.videos?.length > 0 && (
                              <div className="DDB-video-list">
                                <h3>Videos:</h3>
                                <ul>
                                  {subsection.videos.map((video) => (
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
  
        {/* Modals */}
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
          subsectionId={currentSubsectionId}
        />
        <AddFileModal
          isOpen={isAddFileModalOpen}
          onClose={() => setIsAddFileModalOpen(false)}
          onAddFile={handleAddFile}
          subsectionId={currentSubsectionId}
        />
        <AddPhotoModal
          isOpen={isAddPhotoModalOpen}
          onClose={() => setIsAddPhotoModalOpen(false)}
          onAddPhoto={handleAddPhoto}
          subsectionId={currentSubsectionId}
        />
        <AddVideoModal
          isOpen={isAddVideoModalOpen}
          onClose={() => setIsAddVideoModalOpen(false)}
          onAddVideo={handleAddVideo}
          subsectionId={currentSubsectionId}
        />
        <AddQuestionModal
          isOpen={isAddQuestionModalOpen}
          onClose={() => setIsAddQuestionModalOpen(false)}
          onAddQuestion={handleAddQuestion}
          subsectionId={currentSubsectionIdForQuestion}
        />
        <AddChoiceModal
          isOpen={isAddChoiceModalOpen} // State for opening/closing modal
          onClose={() => setIsAddChoiceModalOpen(false)} // Close modal function
          onSubmit={handleAddChoice} // Function to handle adding choice
          questionId={currentQuestionIdForChoice} // Pass questionId to modal
        />
  
        
        <ConfirmPublishModal
          isOpen={isConfirmPublishModalOpen}
          onRequestClose={() => setIsConfirmPublishModalOpen(false)}
          onConfirm={handlePublish}
          error={publishError}
        />
        <button
          onClick={() => setIsConfirmPublishModalOpen(true)}
          disabled={false}
          className="DDB-button DDB-publish-button"
        >
          Publish Course
        </button>
      </div>
    </>
  );
  
  
  
  
  
};

export default CourseDashboard;


