import axios from 'axios';

const domain = 'http://localhost:8000/';

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
