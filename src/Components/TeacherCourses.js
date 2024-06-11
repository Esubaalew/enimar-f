import React, { useEffect, useState } from 'react';
import { getStudentsWhoPaidForCourse, deleteCourse } from '../API/courses';
import { getCoursesByTeacher } from '../API/users';
import { getLoggedInUser } from '../API/auth';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import '../styles/TeacherCourses.css';
import Header from './Header';
const TeacherCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState({});
  const [courseToDelete, setCourseToDelete] = useState(null);
  const accessToken = JSON.parse(localStorage.getItem('user')).access;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const user = await getLoggedInUser(accessToken);
        setLoggedInUser(user);
        if (user.is_teacher) {
          const teacherCourses = await getCoursesByTeacher(user.username, accessToken);
          setCourses(teacherCourses);
        } else {
          navigate('/coursesS');
        }
      } catch (error) {
        console.error('Error fetching teacher data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [accessToken, navigate]);

  const toggleStudentsForCourse = async (courseId) => {
    if (students[courseId]) {
      setStudents(prevState => {
        const newState = { ...prevState };
        delete newState[courseId];
        return newState;
      });
    } else {
      try {
        const studentsData = await getStudentsWhoPaidForCourse(courseId, accessToken);
        setStudents(prevState => ({ ...prevState, [courseId]: studentsData }));
      } catch (error) {
        console.error(`Error fetching students for course ${courseId}:`, error);
      }
    }
  };

  const handleDeleteCourse = async () => {
    if (courseToDelete) {
      try {
        await deleteCourse(courseToDelete.id, accessToken);
        setCourses(courses.filter(course => course.id !== courseToDelete.id));
        console.log(`Course with ID ${courseToDelete.id} deleted successfully.`);
      } catch (error) {
        console.error(`Error deleting course with ID ${courseToDelete.id}:`, error);
      }
    }
    setCourseToDelete(null);
  };

  const openDeleteConfirmationModal = (course) => {
    setCourseToDelete(course);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
    <Header />
    <div className="TC-teacher-courses-container">
      <h1>{loggedInUser?.first_name}'s Courses</h1>
      {courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <div className="TC-courses-list">
          {courses.map(course => (
            <div className="TC-course-card" key={course.id}>
              <div className="TC-course-info">
                <h2 className="TC-course-title">{course.title}</h2>
                <p className="TC-course-description">{course.description}</p>
                <p className="TC-student-count">Number of Students Enrolled: {students[course.id] ? students[course.id].length : 0}</p>
                <div className="TC-icon-container">
                  <button className="TC-icon-button" onClick={() => navigate(`/course/${course.id}/edit`)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button className="TC-icon-button" onClick={() => openDeleteConfirmationModal(course)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <button className="TC-icon-button" onClick={() => toggleStudentsForCourse(course.id)}>
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                </div>
              </div>
              {students[course.id] && (
                <div className="TC-students-list">
                  <h3>Students Enrolled</h3>
                  <ul>
                    {students[course.id].map(student => (
                      <li key={student.id}>{student.first_name} {student.last_name} - {student.email}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {courseToDelete && (
        <div className="TC-modal">
          <div className="TC-modal-content">
            <p>Are you sure you want to delete the course <strong>{courseToDelete.title}</strong>?</p>
            <div>
              <button onClick={handleDeleteCourse}>Yes</button>
              <button onClick={() => setCourseToDelete(null)}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default TeacherCourses;
