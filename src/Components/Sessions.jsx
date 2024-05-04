import React from 'react';
import UserPhoto from '../assets/user_photo.jpg';
import sess1 from '../assets/sess1.jpg';
import sess2 from '../assets/sess2.jpg';
import sess3 from '../assets/sess3.jpg';

const Sessions = () => {
  // Dummy data for sessions
  const sessions = [
    {
      id: 1,
      title: "Mindfulness Meditation Workshop",
      expert: "Dr Lucifer",
      cost: "$50",
      image: sess1, // Placeholder image URL
    },
    {
      id: 2,
      title: "Escape from Depression",
      expert: "Dr Thomas",
      cost: "$75",
      image: sess2, // Placeholder image URL
    },
    {
      id: 3,
      title: "Stress Management Workshop",
      expert: "Dr Vikash",
      cost: "$60",
      image: sess3, // Placeholder image URL
    },
    
    // Add more sessions as needed
  ];

  return (
    <div className="container mx-auto px-4 py-8 text-center bg-gradient-to-r from-blue-200 to-cyan-200 rounded-lg mt-[6vh] font-mono">
      <h1 className="text-4xl font-semibold mb-8 font-serif">Sessions by Our Experts</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {sessions.map(session => (
          <div key={session.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center transition duration-300 hover:shadow-lg hover:bg-gray-100 transform hover:scale-105">
         <div className="w-35 h-40 rounded-lg overflow-hidden mb-2"> {/* Adjusted size */}
              <img src={session.image} alt={session.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center mb-2">
              <img src={UserPhoto} alt={session.expert} className="w-6 h-6 rounded-full mr-2" />
              <h3 className="text-md font-semibold">{session.expert}</h3>
            </div>
            <h3 className="text-md font-semibold mb-2">{session.title}</h3>
            <p className="text-md font-semibold text-green-500">Cost: {session.cost}</p>

            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold mt-2 px-3 py-1 rounded-lg transition duration-300">Book Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sessions;
