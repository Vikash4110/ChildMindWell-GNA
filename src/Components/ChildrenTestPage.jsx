import React, { useState, useEffect } from 'react';
import BarChart from './BarChart';

const ChildrenTestPage = () => {
  const questions = [
    "1. Feels sad or unhappy", "2. Feels hopeless", "3. Is down on him or herself", "4. Worries a lot", "5. Seems to be having less fun",
    "6. Fidgety, unable to sit still", "7. Daydreams too much", "8. Distracted easily", "9. Has trouble concentrating",
    "10. Acts as if driven by a motor", "11. Fights with others", "12. Does not listen to rules",
    "13. Does not understand other people’s feelings", "14. Teases others", "15. Blames others for his or her troubles",
    "16. Refuses to share", "17. Takes things that do not belong to him or her"
  ];

  const [questionIndex, setQuestionIndex] = useState(0);
  const [questionnaire, setQuestionnaire] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [riskMessage, setRiskMessage] = useState("");
  const [timer, setTimer] = useState(15);
  const [loading, setLoading] = useState(false); // Define loading state

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
    setLoading(true); // Set loading to true before fetching translation
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|hi`);
    const data = await response.json();
    setLoading(false); // Set loading back to false after fetching translation
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
            <p className="text-xl text-red-600 md:font-bold mb-4 flex items-center">
              Time remaining: {timer} seconds
              {loading && (
                <svg className="animate-spin h-5 w-5 ml-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.001 8.001 0 0120 12h-4a7.96 7.96 0 00-2.265-5.656l-1.414 1.414A5.96 5.96 0 0116 12H6c0 1.191.348 2.302.949 3.236l1.414-1.414zM20 12a8 8 0 00-8-8v4c1.191 0 2.302.348 3.236.949l1.414-1.414A5.96 5.96 0 0118 8c1.191 0 2.302.348 3.236.949l1.414-1.414A7.96 7.96 0 0020 4v8z"></path>
                </svg>
              )}
            </p>
          
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

export default ChildrenTestPage;
