import React, { useState, useEffect } from 'react';
import { getUserById } from '../API/users';
import '../styles/CourseList.css';

const CourseItem = ({ course, accessToken }) => {
    const [teacher, setTeacher] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeacher = async () => {
            try {
                const teacherData = await getUserById(course.teacher, accessToken);
                setTeacher(teacherData);
            } catch (error) {
                console.error('Error fetching teacher:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeacher();
    }, [course.teacher, accessToken]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="course-item">
            <div className="course-avatar">
                {course.poster ? (
                    <img src={course.poster} alt={`${course.title} poster`} className="course-poster" />
                ) : (
                    <div className="placeholder-avatar"></div>
                )}
            </div>
            <div className="course-info">
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                {teacher && <small>By: {teacher.first_name + ' '+ teacher.last_name}</small>}
            </div>
        </div>
    );
};

const CourseList = ({ courses }) => {
    const accessToken = JSON.parse(localStorage.getItem('user'))?.access;
    // Filter out courses that are not published
    const publishedCourses = courses.filter(course => course.published);

    return (
        <div className="course-list">
            <h2>Recommended Courses</h2>
            {publishedCourses.map(course => (
                <CourseItem key={course.id} course={course} accessToken={accessToken} />
            ))}
        </div>
    );
};

export default CourseList;
