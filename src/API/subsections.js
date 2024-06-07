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

// get files of a subsection

export const getSubsectionFiles = async (subsectionId, accessToken) => {
  try {
    const response = await axios.get(`${domain}learning/subsections/${subsectionId}/files/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching subsection files:', error.response ? error.response.data : error.message);
    throw new Error('Error fetching subsection files');
  }
}




// get a readings to a subsection

export const getSubsectionReadings = async (subsectionId, accessToken) => {
  try {
    const response = await axios.get(`${domain}learning/subsections/${subsectionId}/readings/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching subsection readings:', error.response ? error.response.data : error.message);
    throw new Error('Error fetching subsection readings');
  }
}


// get a photos to a subsection

export const getSubsectionPhotos = async (subsectionId, accessToken) => {
  try {
    const response = await axios.get(`${domain}learning/subsections/${subsectionId}/photos/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching subsection photos:', error.response ? error.response.data : error.message);
    throw new Error('Error fetching subsection photos');
  }
}


// add a file to a subsection

export const addSubsectionFile = async (fileData, accessToken) => {
  try {
    const response = await axios.post(`${domain}learning/files/`, fileData, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error adding file:', error.response ? error.response.data : error.message);
    throw new Error('Error adding file');
  }
}

// add a reading to a subsection

export const addSubsectionReading = async (readingData, accessToken) => {
  try {
    const response = await axios.post(`${domain}learning/readings/`, readingData, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error adding reading:', error.response ? error.response.data : error.message);
    throw new Error('Error adding reading');
  }
}

// add a photo to a subsection

export const addSubsectionPhoto = async (photoData, accessToken) => {
  try {
    const response = await axios.post(`${domain}learning/photos/`, photoData, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  }
  catch (error) {
    console.error('Error adding photo:', error.response ? error.response.data : error.message);
    throw new Error('Error adding photo');
  }
};