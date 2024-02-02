import React from "react";
import { useMusicContext } from "../Context/MusicContext";
import slider from "../assets/slider.webp"
import { TopArtists } from "../Utils/topplaylist";
import { SingleArtist } from "../components";
import { motion } from "framer-motion";
import {
  LoadingSpinner,
  TrendingAlbums,
  Albums,
  TopCharts,
  TopPlaylists,
} from "../components";
import { Link } from "react-router-dom";
const Mains = () => {
  const { homeDataLoading: loading } = useMusicContext();
  if (loading) {
    return (
      <div className="text-2xl font-bold fixed inset-0 w-full h-full flex place-items-center justify-center bg-[#8842a6] -z-20 max-md:pr-0 pr-32 md:translate-x-1/4 md:pr-48 lg:translate-x-0">
        <LoadingSpinner size={80} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { ease: "easeInOut" } }}
      exit={{ x: "-100vw", transition: { ease: "easeInOut" } }}
      className={"bg-[#371645] pl-10 pr-4 max-md:pl-4 overflow-y-hidden pb-24 "}
    >

      <section className="w-full my-6 ">
        <div className="flex justify-between  items-center">
          <h1 className="font-bold text-3xl  w-fit text-darkTitle my-4">
            Trending
          </h1>
          <h1 className="text-sm  w-fit text-darkTitle my-4 opacity-80">Load more</h1>
        </div>
        <TrendingAlbums />
      </section>

      <section className="w-full my-6 ">
        <div className="flex justify-between  items-center">
          <h1 className="font-bold text-3xl  w-fit text-darkTitle my-4">
            You May like
          </h1>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {TopArtists?.slice(0,10)?.map((artist, index) => (
            <SingleArtist {...artist} key={index} />
          ))}
        </div>
      </section>
      <section className="w-full my-6">
        <div className="flex justify-between  items-center">
          <h1 className="font-bold text-3xl  w-fit text-darkTitle my-4">
            Latest Releases
          </h1>
          <h1 className="text-sm  w-fit text-darkTitle my-4 opacity-80">Load more</h1>
        </div>
        <Albums />
      </section>
      <section>
      <h1 className="font-bold text-3xl w-fit text-darkTitle my-4">
            Top Charts
          </h1>
        <TopCharts />
      </section>
      <section>
        <div className="flex justify-between  items-center">
          <h1 className="font-bold text-3xl w-fit text-darkTitle my-4">
            Top Playlist
          </h1>
          <h1 className="text-sm  w-fit text-darkTitle my-4 opacity-80">Load more</h1>
        </div>
        <TopPlaylists />
      </section>
    </motion.div>
  );
};

export default Mains;
