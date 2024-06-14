import axios from "axios";

const domain = "http://localhost:8000/";

// Function to get add like
export const addLike = async (likeData, accessToken) => {
  try {
    const response = await axios.post(
      `${domain}social/likes/`,likeData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        }
    );
    return response.data;
    } catch (error) {
    console.error("Error adding like:", error.response.data);
    throw new Error("Error adding like");
    }
}

// Function to delete a like

export const deleteLike = async (likeId, accessToken) => {
  try {
    const response = await axios.delete(
      `${domain}social/likes/${likeId}/`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        }
    ); 
    return response.data;
    }
    catch (error) {
    console.error("Error deleting like:", error.response.data);
    throw new Error("Error deleting like");
    }
}