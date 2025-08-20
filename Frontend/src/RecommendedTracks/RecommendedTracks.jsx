import React, { useState } from "react";
import "./scroller.css";

const RecommendedTracks = ({ Songs }) => {
  const [Playing, setPlaying] = useState(null);
  const handlePlayPause = (index) => {
    if (Playing === index) {
      setPlaying(null);
    } else {
      setPlaying(index);
    }
  };

  return (
    <div className="w-full h-full  flex  flex-col justify-center items-center pt-5">
      <section className="w-1/2  flex flex-col ">
        <h1 className="text-2xl  font-bold px-12 py-4">Recommended Tracks</h1>
        <ul className="flex flex-col gap-4 px-4 overflow-y-auto h-50 scrollbar-hide">
          {Songs.map((Songs, index) => (
            <li key={index} className="flex  w-full px-8 justify-between">
              <section>
                <h3 className="text-1xl">{Songs.title}</h3>
                <p className="text-sm opacity-60">{Songs.artist}</p>
              </section>
              <div className="rounded-full bg-gray-300   flex justify-center items-center ">
                {
                  Playing === index &&
                <audio
                  src={Songs.audio}
                  className="bg-red-500"
                  style={{
                    display: "none"
                  }}
                  autoPlay={Playing === index}
                ></audio>
}
                <button className="w-10 h-9" onClick={() => handlePlayPause(index)}>
                  {Playing === index ? (
                    <i className="ri-pause-mini-line"></i>
                  ) : (
                    <i className="ri-play-large-line"></i>
                  )}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default RecommendedTracks;
