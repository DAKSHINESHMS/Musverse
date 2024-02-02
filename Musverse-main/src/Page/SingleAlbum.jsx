import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMusicContext } from "../Context/MusicContext";
import { SongsList, LoadingSpinner } from "../components";
import { ImageFetch } from "../Utils/Helper";
import Skeleton from "@mui/material/Skeleton";
import { usePlayerContext } from "../Context/PlayerContext";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import RippleButton from "ripple-effect-reactjs";

const SingleAlbum = () => {
  const [ImageLoading, SetImageLoading] = useState(true);
  const [alert, setAlert] = useState(false);
  let { id } = useParams();
  const {
    singleAlbums,
    currentAlbum,
    single_album_loading: loading,
  } = useMusicContext();

  useEffect(() => {
    singleAlbums(id);
  }, [id]);

  if (loading) {
    return (
      <div className="text-2xl font-bold fixed inset-0 w-full h-full flex place-items-center justify-center bg-[#2d1b69] -z-20 max-md:pr-0 pr-32 md:translate-x-1/4 md:pr-48 lg:translate-x-0 ">
        <LoadingSpinner size={80} />
      </div>
    );
  }

  const handleImageLoad = () => {
    SetImageLoading(false);
  };

  const HandleDownloadAll = () => {
    const btns = document.querySelectorAll(".btnss");
    btns.forEach((btn) => {
      btn.click();
    });
  };

  let timeoutId;
  const HandleAlert = () => {
    setAlert(true);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      setAlert(false);
    }, 5000);
  };

  return (
    <div
      className={
        "bg-[#2d1b69] h-screen overflow-x-auto pb-56 "
      }
    >
      <div className="flex flex-col gap-8 relative w-full pt-3 px-16 max-md:px-5 pb-7  bg-[#1b103f]">
        <div className="grid grid-cols-[max-content,auto] mt-7 max-md:grid-cols-1 max-md:place-items-center gap-5 ">
          {ImageLoading && (
            <Skeleton
              variant="rounded"
              width={160}
              height={170}
              sx={{ bgcolor: "#2d1b69" }}
            />
          )}
          <img
            src={ImageFetch(currentAlbum)}
            alt={currentAlbum.name}
            onLoad={handleImageLoad}
            className={
              "w-56 shadow-xl max-md:w-34 rounded-xl " +
              (ImageLoading ? "hidden" : "block")
            }
          />

          <div className="flex place-content-end max-md:place-items-center flex-col">
            <h2
              className="font-bold text-4xl max-md:text-center max-md:text-2xl text-white tracking-wider"
              dangerouslySetInnerHTML={{
                __html: `${currentAlbum.name}`,
              }}
            />

            <div className="flex max-md:flex-col items-center gap-3 max-md:my-0 max-md:gap-2 my-2 max-md:mt-4">
              <p
                className="text-slate-200 text-sm max-md:text-xs max-md:text-center"
                dangerouslySetInnerHTML={{
                  __html: `${currentAlbum.primaryArtists}`,
                }}
              />
              <div className="bg-darkTextColor rounded-full w-1 h-1 max-md:hidden"></div>
              <p className="text-slate-200 text-sm max-md:text-xs">
                {currentAlbum.year}
              </p>
              <div className="bg-darkTextColor rounded-full max-md:text-xs w-1 h-1 max-md:hidden"></div>
              <p className="text-slate-200 text-sm min-w-fit">
                {currentAlbum.songCount} songs
              </p>
            </div>

            <div className="w-[38px] max-md:mt-4" onClick={HandleDownloadAll}>
                <RippleButton height={36} radius={50} color={"#5454548c"}>
                  <CloudDownloadIcon
                    sx={{ fontSize: 35 }}
                    className="text-neutral-300 cursor-pointer"
                  />
                </RippleButton>
              </div>
          </div>
        </div>
      </div>
      <section className="mx-12 mb-10 mt-6 max-md:mx-2 bg-[#1b103f]">
        {currentAlbum.songs && (
          <SongsList songs={currentAlbum.songs} current={"currentAlbum"} />
        )}
      </section>
    </div>
  );
};

export default SingleAlbum;
