import React, { useState, useEffect } from 'react';
import { getUserById } from '../API/users';

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
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            {teacher && <small>By: {teacher.username}</small>}
        </div>
    );
};

const CourseList = ({ courses }) => {
    const accessToken = JSON.parse(localStorage.getItem('user'))?.access;

    return (
        <div className="course-list">
            <h2>Available Courses</h2>
            {courses.map(course => (
                <CourseItem key={course.id} course={course} accessToken={accessToken} />
            ))}
        </div>
    );
};

export default CourseList;
