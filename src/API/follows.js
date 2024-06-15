import axios from "axios";

const domain = "http://localhost:8000/";


// Function to get add a follow
export const addFollow = async (followData, accessToken) => {
  try {
    const response = await axios.post(
      `${domain}account/follows/`,followData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        }
    );
    return response.data;
    } catch (error) {
    console.error("Error adding follow:", error.response.data); 
    throw new Error("Error adding follow");
    }
};

// Function to delete a follow
export const deleteFollow = async (followId, accessToken) => {
  try {
    const response = await axios.delete(
      `${domain}account/follows/${followId}/`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        }
    );
    return response.data;
    }
    catch (error) {
    console.error("Error deleting follow:", error.response.data);
    throw new Error("Error deleting follow");
    }
};