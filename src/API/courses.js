import axios from "axios"

const domain = 'https://enimar.4gmobiles.com/';

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
    const response = await axios.patch(
      `${domain}learning/courses/${courseId}/`,
      { published: publishedStatus }, 
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating course published status:', error.response ? error.response.data : error.message);
    throw new Error('Error updating course published status');
  }
};

// Function to mark a subsection as completed
export const makeCompletion = async (completionData, accessToken) => {
  try {
    const response = await axios.post(
      `${domain}learning/subsection-completions/`,
      completionData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error marking subsection as completed:', error.response ? error.response.data : error.message);
    throw new Error('Error marking subsection as completed');
  }
};

// get all compelte subsections
export const getCompleteSubsections = async (accessToken) => {
  try {
    const response = await axios.get(`${domain}learning/subsection-completions/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching complete subsections:', error.response ? error.response.data : error.message);
    throw new Error('Error fetching complete subsections');
  }
};


export const getCompletedSubsectionsForCourse = async (courseId, accessToken) => {
  const response = await axios.get(`${domain}learning/courses/${courseId}/completed-subsections/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return response.data;
};

// Function to create a certificate
export const createCertificate = async (certificateData, accessToken) => {
  try {
    const response = await axios.post(`${domain}learning/certificates/`, certificateData, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating certificate:', error.response ? error.response.data : error.message);
    throw new Error('Error creating certificate');
  }
};

// Function to fetch certificates for a specific user and course
export const fetchUserCourseCertificates = async (courseId, accessToken) => {
  try {
    const response = await axios.get(`${domain}learning/certificates/user_course_certificates/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      params: {
        course_id: courseId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching certificates:', error.response ? error.response.data : error.message);
    throw new Error('Error fetching certificates');
  }
};
