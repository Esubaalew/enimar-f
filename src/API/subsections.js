import axios from "axios";

const domain = 'http://localhost:8000/';

// Function to get all subsections
export const getAllSubsections = async (accessToken) => {
  try {
    const response = await axios.get(`${domain}learning/subsections/`, {
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

// function to add a subsection

export const addSubsection = async (subsectionData, accessToken) => {
  try {
    const response = await axios.post(`${domain}learning/subsections/`, subsectionData, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      } });
    return response.data;
  }
  catch (error) {
    console.error('Error adding subsection:', error.response ? error.response.data : error.message);
    throw new Error('Error adding subsection');
  } 
};