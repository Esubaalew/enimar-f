import React, { useEffect, useState } from 'react';
import { getStudentsWhoPaidForCourse, deleteCourse, getCourseById } from '../API/courses';
import { getPaymentsForCourseForTeacher } from '../API/pay';
import { getCoursesByTeacher, getUserById } from '../API/users';
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
  const [payments, setPayments] = useState({});
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [tab, setTab] = useState('courses'); // 'courses' or 'payments'
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
          navigate('/courses');
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

  const fetchPaymentsForCourse = async (courseId) => {
    try {
      const paymentsData = await getPaymentsForCourseForTeacher(loggedInUser?.id, accessToken);
      // Iterate through paymentsData and fetch user and course details
      const populatedPayments = await Promise.all(paymentsData.map(async (payment) => {
        try {
          const user = await getUserById(payment.user, accessToken);
          const course = await getCourseById(payment.course, accessToken);
          return {
            ...payment,
            user: user,
            course: course
          };
        } catch (error) {
          console.error(`Error fetching details for payment ${payment.id}:`, error);
          return payment; // Return original payment object on error
        }
      }));
      setPayments(prevState => ({ ...prevState, [courseId]: populatedPayments }));
    } catch (error) {
      console.error(`Error fetching payments for course ${courseId}:`, error);
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
        <div className="fancy-header">
          <h1>{loggedInUser?.first_name}'s Courses</h1>
        </div>
        <div className="tabs">
          <button className={`tab ${tab === 'courses' ? 'active' : ''}`} onClick={() => setTab('courses')}>
            Courses
          </button>
          <button className={`tab ${tab === 'payments' ? 'active' : ''}`} onClick={() => setTab('payments')}>
            Payments
          </button>
        </div>
        {tab === 'courses' && (
          <div className="TC-courses-list">
            {courses.length === 0 ? (
              <p>No courses found.</p>
            ) : (
              courses.map(course => (
                <div className="TC-course-card" key={course.id}>
                  <div className="TC-course-info">
                    <h2 className="TC-course-title">{course.title}</h2>
                    <p className="TC-course-description">{course.description}</p>
                    <p className="TC-course-status">
                      Status: {course.published ? 'Published' : 'Draft'}
                    </p>
                    <p className="TC-student-count">
                      Number of Students Enrolled: {students[course.id] ? students[course.id].length : 0}
                    </p>
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
                      <button className="TC-icon-button" onClick={() => fetchPaymentsForCourse(course.id)}>
                        Show Payments
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
              ))
            )}
          </div>
        )}
        {tab === 'payments' && (
          <div className="TC-payments-table">
            <h2>Payments</h2>
            <table>
              <thead>
                <tr>
                  <th>Course</th>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(payments).map(courseId => (
                  payments[courseId].map(payment => (
                    <tr key={payment.id}>
                    <td>{payment.course ? payment.course.title : 'Loading...'}</td>
                    <td>{payment.user ? payment.user.username : 'Loading...'}</td>
                    <td>{payment.amount}</td>
                    <td>{payment.created_at}</td>
                  </tr>
                  ))
                ))}
              </tbody>
            </table>
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
