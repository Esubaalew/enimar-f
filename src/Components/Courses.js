import React, { useEffect, useState } from 'react';
import '../styles/Courses.css';
import { getAllCourses } from '../API/courses';
import { getUserById } from '../API/users';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const accessToken = JSON.parse(localStorage.getItem('user')).access;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courseData = await getAllCourses(accessToken);
        const coursePromises = courseData.map(async (course) => {
          const teacherData = await getUserById(course.teacher, accessToken);
          return { ...course, teacher: teacherData };
        });
        const coursesWithTeachers = await Promise.all(coursePromises);
        setCourses(coursesWithTeachers);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [accessToken]);

  return (
    <div className="courses-container">
      <h1>Explore Our Courses</h1>
      <p>Find the perfect course to expand your knowledge and skills.</p>
      <div className="courses-grid">
        {courses.map((course) => (
          <div className="course-card" key={course.id}>
            <div className="course-poster">
              <img src={course.poster} alt={course.title} />
            </div>
            <h2>{course.title}</h2>
            <p>{course.description}</p>
            <p className="course-price">ETB{course.price}</p>
            <p className="course-teacher">By {course.teacher.first_name} {course.teacher.last_name}</p>
            <button className="enroll-button">Enroll</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
