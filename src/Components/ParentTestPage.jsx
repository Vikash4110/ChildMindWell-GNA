import React, { useState, useEffect } from 'react';
import BarChart from './BarChart';

const ParentTestPage = () => {
  const questions = [
    "1. Your child seems sad, unhappy, or depressed",
    "2. Your child is down on him or herself or has very low self-esteem",
    "3. Your child does not enjoy anything or seems unable to have fun",
    "4. Your child worries a lot",
    "5. Your child has trouble sleeping",
    "6. Your child gets tired easily or has little energy",
    "7. Your child is too frightened or scared",
    "8. Your child is nervous or tense",
    "9. Your child cries a lot",
    "10. Your child is irritable or angry",
    "11. Your child is having headaches or stomachaches",
    "12. Your child is not doing well in school or has trouble concentrating",
    "13. Your child does not listen to rules or has behavior problems in school or at home",
    "14. Your child fights with other children or is bullies by other children",
    "15. Your child is teased or bullied by other children",
    "16. Your child does not have many friends or gets along better with adults than with other children",
    "17. Your child is not interested in things or does not have hobbies",
    "18. Your child is in trouble with his or her family or does not get along with parents or brothers or sisters"

  ];

  const [questionIndex, setQuestionIndex] = useState(0);
  const [questionnaire, setQuestionnaire] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [riskMessage, setRiskMessage] = useState("");
  const [timer, setTimer] = useState(15);

  useEffect(() => {
    let timerInterval;

    if (timer > 0 && !showResult) {
      timerInterval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else if (timer === 0 && !showResult) {
      handleFailTest();
    }

    return () => clearInterval(timerInterval);
  }, [timer, showResult]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = parseInt(value);
    setQuestionnaire(prevState => ({ ...prevState, [name]: newValue }));
  };

  const handleNextQuestion = () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(prevIndex => prevIndex + 1);
      setTimer(15); // Reset timer for the next question
    } else {
      calculateResult();
    }
  };

  const handleFailTest = () => {
    setRiskMessage("Test failed. You didn't answer in time.");
    setShowResult(true);
  };

  const calculateResult = () => {
    let total = 0;

    for (let i = 0; i < questions.length; i++) {
      total += questionnaire[`item${i + 1}`] || 0;
    }

    let message = `Total Score: ${total}\n`;

    if (total > 15) {
      message += "Your child may have mental health concerns. Further evaluation is recommended.";
    } else {
      message += "Your child's total score is within the normal range.";
    }

    setRiskMessage(message);
    setShowResult(true);
  };

  const handleLearnMore = () => {
    console.log("Learn More About Mental Health");
    // Redirect to learn more page
    window.location.href = "/blogpage";
  };

  const handleSession = () => {
    console.log("Session by Our Experts");
    // Redirect to sessions page
    window.location.href = "/sessions";
  };

  const handleSendEmail = () => {
    console.log("Send Result to Email");
    // Implement email sending functionality
  };

  const handleBackToHome = () => {
    console.log("Back to Home Page");
    // Redirect to home page
    window.location.href = '/';
  };

  const translateToHindi = async (text) => {
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|hi`);
    const data = await response.json();
    return data.responseData.translatedText;
  };

  const handleVoiceClick = async (question, language) => {
    if ('speechSynthesis' in window) {
      let textToSpeak = question;
      if (language === 'hi-IN') {
        textToSpeak = await translateToHindi(question);
      }
      const speech = new SpeechSynthesisUtterance(textToSpeak);
      speech.lang = language;
      speechSynthesis.speak(speech);
      speech.addEventListener('end', () => {
        speechSynthesis.cancel();
      });
    } else {
      console.log("Speech synthesis not supported.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleNextQuestion();
  };

  return (
    <div className="container mx-auto px-4 py-8 text-black overflow-auto">
      <h1 className="text-4xl font-semibold text-center mb-8 text-cyan-400 font-mono">PSC-17-Parent (PSC-17)</h1>
      <div className="flex justify-center items-center">
        {showResult ? (
          <div className="mt-8 p-4 rounded-lg text-black bg-gradient-to-r from-blue-200 to-cyan-200 flex flex-col items-center justify-center w-[50vw] mx-auto">
            <h2 className="text-3xl bg-gradient-to-r from-violet-700 to-orange-700 bg-clip-text text-transparent font-semibold mb-4 font-serif">Result</h2>
            <p className="font-bold font-serif text-lg">{riskMessage}</p>
            <BarChart questionnaire={questionnaire} />
            <div className="mt-8 flex space-x-4">
              <button className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600" onClick={handleLearnMore}>Learn More About Mental Health</button>
              <button className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600" onClick={handleSession}>Session by Our Experts</button>
              <button className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600" onClick={handleSendEmail}>Send Result to Email</button>
              <button className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600" onClick={handleBackToHome}>Back to Home Page</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 p-4 rounded-lg text-black bg-gradient-to-r from-blue-200 to-cyan-200 flex flex-col items-center justify-center w-[50vw] mx-auto">
            <h2 className="text-2xl font-semibold mb-4">{questions[questionIndex]}</h2>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => handleVoiceClick(questions[questionIndex], 'en-US')}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:bg-gray-300"
              >
                🎤 Voice (English)
              </button>
              <button
                type="button"
                onClick={() => handleVoiceClick(questions[questionIndex], 'hi-IN')}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:bg-gray-300"
              >
                🎤 Voice (Hindi)
              </button>
            </div>
            <br/>
            <p className="text-xl text-red-600 md:font-bold mb-4 flex items-center">Time remaining: {timer} seconds</p>
            <div className="flex justify-between">
              <button
                type="button"
                name={`item${questionIndex + 1}`}
                value="2"
                onClick={handleChange}
                className={`w-1/4 py-2 px-4 flex items-center justify-center  border rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${questionnaire[`item${questionIndex + 1}`] === 2 ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
              >
                Often
              </button>
              <button
                type="button"
                name={`item${questionIndex + 1}`}
                value="1"
                onClick={handleChange}
                className={`w-1/3 py-2 px-12 flex items-center justify-center border rounded-md m border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${questionnaire[`item${questionIndex + 1}`] === 1 ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
              >
                Sometimes
              </button>
              <button
                type="button"
                name={`item${questionIndex + 1}`}
                value="0"
                onClick={handleChange}
                className={`w-1/3 py-2 px-4 border flex items-center justify-center  rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${questionnaire[`item${questionIndex + 1}`] === 0 ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
              >
                Never
              </button>
            </div>
            <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 sm:w-auto mt-4">Next Question</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ParentTestPage;
