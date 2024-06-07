import axios from "axios"

const domain = 'http://localhost:8000/';

// Function to get all courses
export const getAllCourses = async (accessToken) => {
  try {
    const response = await axios.get(`${domain}learning/courses/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error.response ? error.response.data : error.message);
    throw new Error('Error fetching courses');
  }
};

// function to add a course
export const addCourse = async (courseData, accessToken) => {
  try {
    const response = await axios.post(`${domain}learning/courses/`, courseData, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      } });
    return response.data;
  }
  catch (error) {
    console.error('Error adding course:', error.response ? error.response.data : error.message);
    throw new Error('Error adding course');
  } 
};

// function to get course by id
export const getCourseById = async (courseId, accessToken) => {
  try {
    const response = await axios.get(`${domain}learning/courses/${courseId}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  }
  catch (error) {
    console.error('Error fetching course:', error.response ? error.response.data : error.message);
    throw new Error('Error fetching course');
  }
};
