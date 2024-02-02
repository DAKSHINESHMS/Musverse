import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  LoadingSpinner,
  SongsList,
  TopResults,
  SearchAlbum,
  SingleChart,
} from "../components";
import ListItemButton from "@mui/material/ListItemButton";
import { motion } from "framer-motion";
import { usePlayerContext } from "../Context/PlayerContext";

const SearchResult = () => {
  const { side_menu_show, search_loading, search_results, inputValue } =
    usePlayerContext();

  if (search_loading) {
    return (
      <div
        className={
          "bg-darkBlue pl-10 max-md:pl-4 pr-4 overflow-hidden " +
          (side_menu_show
            ? "mr-96 transition-all duration-300 ease-in"
            : "mr-0")
        }
      >
        <div className="text-2xl font-bold fixed inset-0 w-full h-full flex place-items-center justify-center bg-[#2d1b69] -z-20 max-md:pr-0 pr-32 md:translate-x-1/4 md:pr-48  lg:translate-x-0">
          <LoadingSpinner size={80} />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { ease: "easeInOut" } }}
      exit={{ opacity: 0, transition: { ease: "easeInOut" } }}
      className={
        "bg-[#2d1b69] h-screen pl-10 max-md:pl-1 pr-4 overflow-x-hidden pb-30 " +
        (side_menu_show ? "mr-96 transition-all duration-300 ease-in" : "mr-0")
      }
    >
      {!search_results && (
        <div>
          <p className="mt-20 text-center mx-auto w-fit text-darkTextColor">
            Type to start searching...
          </p>
        </div>
      )}
      <div>
        {search_results && (
          <div className="mb-40">
            <section className=" max-md:ml-3">
              <h3 className="text-white text-lg ml-2 max-md:font-semibold max-md:text-xl mt-3 lg:mt-10">
                Top Results
              </h3>
              <TopResults />
            </section>

            <section className="mt-9">
              <h3 className="text-white tracking-wide text-lg mb-4 ml-5 max-md:font-semibold max-md:text-xl">
                Songs
              </h3>
              {search_results.songs.results.length > 0 && (
                <SongsList songs={search_results.songs.results} />
              )}

              <ListItemButton
                sx={[
                  {
                    width: 115,
                    padding: 0,
                    marginTop: 2,
                    borderRadius: 3,
                    marginLeft: 1,
                  },
                  (theme) => ({
                    "&:hover": {
                      backgroundColor: "#1f242a",
                    },
                  }),
                ]}
              >
                <Link
                  to={`songs/${inputValue}`}
                  className="text-white rounded-md flex w-full py-2 items-center gap-2 justify-center"
                >
                  <p className="tracking-wide">View All</p>
                  <ArrowForwardIosIcon
                    sx={{ fontSize: "16px" }}
                    className="mb-[2px]"
                  />
                </Link>
              </ListItemButton>
            </section>

            {search_results.albums.results.length > 0 && (
              <section className="mt-12 max-md:ml-4">
                <h3 className="text-white text-lg mb-5 max-md:font-semibold max-md:text-xl ">
                  Albums
                </h3>
                <div className="flex gap-8 overflow-scroll h-full">
                  {search_results.albums.results.map((item, index) => {
                    return <SearchAlbum {...item} key={index} />;
                  })}
                  <Link
                    to={`albums/${inputValue}`}
                    className="text-white flex items-center gap-2 self-center mb-11 justify-center ml-6 rounded-md px-2 group h-fit"
                  >
                    <p className="group-hover:opacity-80">View All</p>
                    <div className="bg-slate-500 group-hover:scale-110 transition-all ease-linear duration-200 bg-opacity-10 px-3 py-2 rounded-full">
                      <ArrowForwardIosIcon
                        sx={{ fontSize: "16px" }}
                        className="mb-[2px] "
                      />
                    </div>
                  </Link>
                </div>
              </section>
            )}
            {search_results.playlists.results.length > 0 && (
              <section className="mt-10 mb-10 max-md:ml-4">
                <h3 className="text-white text-lg mb-6 ml-1 max-md:font-semibold max-md:text-xl">
                  Playlist
                </h3>

                <div className="flex gap-8 max-md:gap-3 overflow-scroll h-full">
                  {search_results.playlists.results.map((item, index) => {
                    return <SingleChart {...item} key={index} />;
                  })}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SearchResult;
