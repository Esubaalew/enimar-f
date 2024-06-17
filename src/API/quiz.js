import axios from 'axios';

const domain = 'http://localhost:8000/';

// Function to add  a question
export const addQuestion = async (questionData, accessToken) => {
    try {
        const response = await axios.post(`${domain}learning/questions/`, questionData, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        } });
        return response.data;
    }
    catch (error) {
        console.error('Error adding question:', error.response ? error.response.data : error.message);
        throw new Error('Error adding question');
    }
};

// Function to add a quiz question
export const addQuestionChoice = async (questionChoiceData, accessToken) => {
    try {
        const response = await axios.post(`${domain}learning/questions/`, questionChoiceData, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        } });
        return response.data;
    }
    catch (error) {
        console.error('Error adding  question choice:', error.response ? error.response.data : error.message);
        throw new Error('Error adding  question choice');
    }
};

// Function to get all choices of a question

export const getQuestionChoices = async (questionId, accessToken) => {
    try {
        const response = await axios.get(`${domain}learning/questions/${questionId}/choices/`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        } });
        return response.data;
    }
    catch (error) {
        console.error('Error fetching question choices:', error.response ? error.response.data : error.message);
        throw new Error('Error fetching question choices');
    }
}