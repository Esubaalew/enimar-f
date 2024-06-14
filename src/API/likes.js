import axios from "axios";

const domain = "http://localhost:8000/";

export const addLike = async (postId, accessToken) => {
  try {
    const response = await axios.post(
      `${domain}social/posts/${postId}/like/`,
      {},
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