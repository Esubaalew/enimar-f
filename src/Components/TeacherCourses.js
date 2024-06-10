import React, { useEffect, useState } from 'react';
import { getStudentsWhoPaidForCourse } from '../API/courses';
import { getCoursesByTeacher } from '../API/users';
import { getLoggedInUser } from '../API/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/TeacherCourses.css';

const TeacherCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState({});
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="teacher-courses-container">
      <h1>{loggedInUser?.first_name}'s Courses</h1>
      {courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <div className="courses-list">
          {courses.map(course => (
            <div className="course-card" key={course.id}>
              <div className="course-info">
                <h2>{course.title}</h2>
                <p>{course.description}</p>
                {students[course.id] ? (
                  <button onClick={() => toggleStudentsForCourse(course.id)}>
                    {students[course.id] ? 'Hide Students' : 'Show Students'}
                  </button>
                ) : (
                  <button onClick={() => toggleStudentsForCourse(course.id)}>
                    Show Students
                  </button>
                )}
              </div>
              {students[course.id] && (
                <div className="students-list">
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
    </div>
  );
};

export default TeacherCourses;
