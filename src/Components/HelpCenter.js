import React, { useState, useEffect } from 'react';
import '../styles/HelpCenter.css';
import questionsData from '../questions.json';
import Header from './Header';

const HelpCenter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchTerm('');
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      if (selectedCategory) {
        const categoryQuestions = questionsData.find(
          (cat) => cat.category === selectedCategory
        );
        const questions = categoryQuestions ? categoryQuestions.questions : [];
        if (searchTerm) {
          setFilteredQuestions(questions.filter(
            (q) =>
              q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
              q.answer.toLowerCase().includes(searchTerm.toLowerCase())
          ));
        } else {
          setFilteredQuestions(questions);
        }
      } else if (searchTerm) {
        const allQuestions = questionsData.flatMap(cat => cat.questions);
        setFilteredQuestions(allQuestions.filter(
          (q) =>
            q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.answer.toLowerCase().includes(searchTerm.toLowerCase())
        ));
      } else {
        setFilteredQuestions([]);
      }
      setLoading(false);
    }, 500); // Simulate loading delay
  }, [selectedCategory, searchTerm]);

  return (
    <>
      <Header />
      <div className="help-center">
        <div className="sidebarr">
          <ul>
            {questionsData.map((category, index) => (
              <li
                key={index}
                className={selectedCategory === category.category ? 'active' : ''}
                onClick={() => handleCategoryClick(category.category)}
              >
                {category.category}
              </li>
            ))}
            <li className="clear-filters" onClick={clearFilters}>
              Clear Filters
            </li>
          </ul>
        </div>
        <div className="main-content">
          <h1>How can we help you?</h1>
          <input
            type="text"
            placeholder="Search help articles..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div className="popular-topics">
            <div className="topic-card" onClick={() => handleCategoryClick('Using the App')}>Using the App</div>
            <div className="topic-card" onClick={() => handleCategoryClick('Managing Your Account')}>Managing Your Account</div>
            <div className="topic-card" onClick={() => handleCategoryClick('Privacy, Safety, and Security')}>Privacy, Safety, and Security</div>
            <div className="topic-card" onClick={() => handleCategoryClick('Policies and Reporting')}>Policies and Reporting</div>
          </div>
          <div className="questions-list">
            {loading ? (
              <div className="loading-spinner"></div>
            ) : filteredQuestions.length > 0 ? (
              filteredQuestions.map((question, index) => (
                <div key={index} className="questionn-item">
                  <h3>{question.question}</h3>
                  <p>{question.answer}</p>
                </div>
              ))
            ) : (
              <p>No results found</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HelpCenter;
