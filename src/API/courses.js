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