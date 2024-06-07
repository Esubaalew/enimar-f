import axios from "axios";

const domain = 'http://localhost:8000/';

// Function to get all sections
export const getAllSections = async (accessToken) => {
  try {
    const response = await axios.get(`${domain}learning/sections/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching sections:', error.response ? error.response.data : error.message);
    throw new Error('Error fetching sections');
  }
};


// function to add a section
export const addSection = async (sectionData, accessToken) => {
  try {
    const response = await axios.post(`${domain}learning/sections/`, sectionData, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      } });
    return response.data;
  }
  catch (error) {
    console.error('Error adding section:', error.response ? error.response.data : error.message);
    throw new Error('Error adding section');
  } 
};

// get subsection for sections
export const getSectionSubsections = async (sectionId, accessToken) => {
  try {
    const response = await axios.get(`${domain}learning/sections/${sectionId}/subsections/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching subsections:', error.response ? error.response.data : error.message);
    throw new Error('Error fetching subsections');
  }
};