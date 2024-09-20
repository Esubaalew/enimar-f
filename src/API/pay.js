import axios from 'axios';

const domain = 'https://enimar.4gmobiles.com/';

export const initializePayment = async (paymentData, accessToken) => {
  try {
    const response = await axios.post(`${domain}payments/initialize/`, paymentData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error initializing payment:', error.response ? error.response.data : error.message);
    throw new Error('Error initializing payment');
  }
};

export const verifyPayment = async (txRef, accessToken) => {
  try {
    const response = await axios.get(`${domain}payments/callback/?tx_ref=${txRef}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error verifying payment:', error.response ? error.response.data : error.message);
    throw new Error('Error verifying payment');
  }
};


// payements for course
export const getPaymentsForCourseForTeacher = async (courseId, accessToken) => {
  try {
    const response = await axios.get(`${domain}payments/teacher/${courseId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching payments for course:', error.response ? error.response.data : error.message);
    throw new Error('Error fetching payments for course');
  }
}

