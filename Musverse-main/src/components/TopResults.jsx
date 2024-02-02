import React from "react";
import { usePlayerContext } from "../Context/PlayerContext";
import { Link } from "react-router-dom";
import {  SingleSongList, SingleArtist } from "../components";

const TopResults = () => {
  const { search_results } = usePlayerContext();

  let data = search_results.topQuery.results;

  return (
    <div className="mt-5">
      {data.map((item, index) => {
        if (item.type === "album") {
          return (
            <div key={index}>
              <Link
                to={`/album/${item.id}`}
                className="flex gap-8 cursor-pointer bg-[#1b103f] rounded-lg shadow-xl py-4 items-center px-5"
              >
                <img
                  src={item.image[1].link}
                  className="w-14 rounded-lg object-cover"
                  alt={item.title}
                />
                <div>
                  <h3
                    className="text-slate-200"
                    dangerouslySetInnerHTML={{
                      __html: `${item.title}`,
                    }}
                  />
                  <p className="text-xs opacity-90 mt-[2px] capitalize  text-darkTextColor tracking-wide">
                    {item.type}
                  </p>
                </div>
              </Link>
            </div>
          );
        }
        if (item.type === "song") {
          return <SingleSongList {...item} name={item.title} key={index} />;
        }
        if (item.type === "artist") {
          return <SingleArtist {...item} key={index} />;
        }
      })}
    </div>
  );
};

export default TopResults;
