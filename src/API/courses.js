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


// get course course sections

export const getCourseSections = async (courseId, accessToken) => {
  try {
    const response = await axios.get(`${domain}learning/courses/${courseId}/sections/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching course sections:', error.response ? error.response.data : error.message);
    throw new Error('Error fetching course sections');
  }
};

// Function to get students who made payments for a specific course
export const getStudentsWhoPaidForCourse = async (courseId, accessToken) => {
  try {
    const response = await axios.get(`${domain}learning/course/${courseId}/students/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching students who paid for course:', error.response ? error.response.data : error.message);
    throw new Error('Error fetching students who paid for course');
  }
};

// Function to delete a course
export const deleteCourse = async (courseId, accessToken) => {
  try {
    const response = await axios.delete(`${domain}learning/courses/${courseId}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  }
  catch (error) {
    console.error('Error deleting course:', error.response ? error.response.data : error.message);
    throw new Error('Error deleting course');
  }
};

// Function to update the published status of a course
export const updateCourseStatus = async (courseId, publishedStatus, accessToken) => {
  try {
    const response = await axios.patch(`${domain}learning/courses/${courseId}/`, 
    { published: publishedStatus }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating course published status:', error.response ? error.response.data : error.message);
    throw new Error('Error updating course published status');
  }
};