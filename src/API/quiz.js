import axios from 'axios';

const domain = 'http://localhost:8000/';

// Function to add  a quiz
export const addQuiz = async (quizData, accessToken) => {
    try {
        const response = await axios.post(`${domain}learning/quizzes/`, quizData, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        } });
        return response.data;
    }
    catch (error) {
        console.error('Error adding quiz:', error.response ? error.response.data : error.message);
        throw new Error('Error adding quiz');
    }
};

// Function to add a quiz question
export const addQuizQuestion = async (quizQuestionData, accessToken) => {
    try {
        const response = await axios.post(`${domain}learning/questions/`, quizQuestionData, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        } });
        return response.data;
    }
    catch (error) {
        console.error('Error adding quiz question:', error.response ? error.response.data : error.message);
        throw new Error('Error adding quiz question');
    }
};