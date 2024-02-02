import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import Slider from "@mui/material/Slider";
import IconButton from "@mui/material/IconButton";
import PauseRounded from "@mui/icons-material/PauseRounded";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import FastForwardRounded from "@mui/icons-material/FastForwardRounded";
import FastRewindRounded from "@mui/icons-material/FastRewindRounded";
import { usePlayerContext } from "../Context/PlayerContext";
import { AudioLinkSelector, ImageFetch } from "../Utils/Helper";
import SongDownloader from "./downloader/SongDownloader";
import RepeatIcon from "@mui/icons-material/Repeat";
import RepeatOneIcon from "@mui/icons-material/RepeatOne";
import UpNextSongs from "./UpNextSongs";
import { AnimatePresence, motion } from "framer-motion";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { useLikedSongs } from "../Context/LikedSongsContext";
import { useLoginContext } from "../Context/LoginContext"
import {useHistoryContext} from "../Context/HistoryContext"
import { toast } from "react-hot-toast";
const AudioPlayer = () => {
  const {
    current_song,
    side_menu_show,
    audio_playing,
    current_playing_lists,
    singleSong,
  } = usePlayerContext();
  const { likedSongs, addSongToLikedSongs,deleteLikedSong,error } = useLikedSongs()
  const { username, loggedIn } = useLoginContext();
  const { addSongToHistory } = useHistoryContext();

  const [repeatOne, setRepeatOne] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [showUpNext, setShowUpNext] = useState(false);
  const songNameContainer = useRef(null);
  const [coverRadius, setCoverRadius] = useState(false);
  const songName = useRef(null);
  const [volume, setVolume] = useState(60);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const songNameCon = songNameContainer.current;
    const songNamee = songName.current;
    if (songNameCon && songNamee) {
      if (songNamee.clientWidth > 200) {
        setShouldAnimate(false);
      } else {
        setShouldAnimate(false);
      }
      const addToHistory = async () => {
        if (loggedIn && username) {
          try {
            addSongToHistory(current_song.id, current_song.name, ImageFetch(current_song));
          } catch (error) {
            console.error("Error adding song to history:", error);
          }
        }
      };
      addToHistory();
    }
  }, [audio_playing, current_song, loggedIn, username, addSongToHistory]);

  useEffect(() => {
    // Check if the current song is liked and update the isLiked state
    setIsLiked(likedSongs.some((song) => song.songId === current_song.id));
  }, [likedSongs, current_song]);
  

  const [audioProgress, setAudioProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [musicTotalLength, setMusicTotalLength] = useState("00:00");
  const [musicCurrentTime, setMusicCurrentTime] = useState("00:00");
  const theme = useTheme();

  const handleMusicProgressBar = (e) => {
    setAudioProgress(e.target.value);
    currentAudio.current.currentTime =
      (e.target.value * currentAudio.current.duration) / 100;
  };

  const currentAudio = useRef();

  const handleAudioPlay = () => {
    if (currentAudio.current.paused) {
      currentAudio.current.play();
      setPaused(false);
    } else {
      currentAudio.current.pause();
      setPaused(true);
    }
  };

  // function to add or delelte liked songs
  const handleThumbsUpClick = () => {
    if (!loggedIn) {
      // Show an alert if the user is not logged in
      toast.error("Please login first",{
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
        duration: 4000,
      })
      return;
    }
  
    const isSongLiked = likedSongs.some((song) => song.songId === current_song.id);
  
    if (isSongLiked) {
      setIsLiked(false);
      deleteLikedSong(current_song.id);
    } else {
      if(!error){
      addSongToLikedSongs(current_song.id, current_song.name, ImageFetch(current_song), username);
      setIsLiked(true);
      }else{
        toast.error("Error adding songs in liked",{
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
          duration: 4000,
        })
      }
    }
  };
  
  const handleAudioUpdate = () => {
    if (currentAudio.current.currentTime === currentAudio.current.duration) {
      if (repeatOne) {
        singleSong(current_song.id);
        currentAudio.current.play();
      } else {
        if (current_playing_lists.length > 0) {
          let IndexOfCurrentSong = current_playing_lists.indexOf(
            current_song.id
          );
          if (IndexOfCurrentSong !== current_playing_lists.length - 1) {
            singleSong(current_playing_lists[IndexOfCurrentSong + 1]);
          } else {
            setPaused(true);
          }
        } else {
          setPaused(true);
        }
      }
    }

    if (currentAudio.current.paused) {
      setPaused(true);
    } else {
      setPaused(false);
    }

    //input total length of the audio
    let minutes = Math.floor(currentAudio.current.duration / 60);
    let seconds = Math.floor(currentAudio.current.duration % 60);
    let musicTotalLength = `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0:${seconds}` : seconds
      }`;
    setMusicTotalLength(musicTotalLength);


    let min = Math.floor(currentAudio.current.currentTime / 60);
    let sec = Math.floor(currentAudio.current.currentTime % 60);
    let musicCurrent = `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec
      }`;
    setMusicCurrentTime(musicCurrent);


    const progress = parseInt(
      (currentAudio.current.currentTime / currentAudio.current.duration) * 100
    );
    setAudioProgress(isNaN(progress) ? 0 : progress);
  };

  const HandleNextSong = () => {
    if (current_playing_lists.length > 0) {
      let IndexOfCurrentSong = current_playing_lists.indexOf(current_song.id);
      if (IndexOfCurrentSong !== current_playing_lists.length - 1) {
        singleSong(current_playing_lists[IndexOfCurrentSong + 1]);
      }
    }
  };

  const HandlePreviousSong = () => {
    if (current_playing_lists.length > 0) {
      let IndexOfCurrentSong = current_playing_lists.indexOf(current_song.id);
      if (IndexOfCurrentSong !== 0) {
        singleSong(current_playing_lists[IndexOfCurrentSong - 1]);
      }
    }
  };

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
    currentAudio.current.volume = newValue / 100;
  };

  const isMuted = volume === 0;
  if (!audio_playing) {
    return null;
  }
  return (
    <div
      className={
        " px-7 py-2 mt-0 lg:mt-0  max-md:h-full " +
        (side_menu_show ? "opacity-100" : "opacity-0")
      }
    >
      <img
        src={ImageFetch(current_song)}
        alt="background"
        className="absolute inset-0 -z-40 h-full  object-cover opacity-20 blur-md rounded-lg
    "
      />
      <section className="flex flex-col items-center gap-1 ">
        <audio
          src={AudioLinkSelector(current_song)}
          ref={currentAudio}
          autoPlay
          onTimeUpdate={handleAudioUpdate}
          id="myAudio"
        ></audio>
        <div
          className={
            "text-container  flex justify-center overflow-hidden items-center " +
            (side_menu_show ? " w-52 max-md:w-72" : "w-0")
          }
          ref={songNameContainer}
        >
          <h3
            className={
              "text-lg text-darkTitle mt-4  max-md:text-xl  w-max whitespace-pre " +
              (shouldAnimate ? "scrolling-text text-right" : " text-center")
            }
            ref={songName}
            dangerouslySetInnerHTML={{
              __html: `${current_song.name}`,
            }}
          />
        </div>
        <p className="text-xs max-md:text-base opacity-90 text-center whitespace-nowrap w-40 overflow-hidden text-ellipsis">
          {current_song.primaryArtists}
        </p>
        {/* <button className=" bg-transparent border-2 border-solid border-gray-700 p-2 rounded-full text-sm w-28 mt-2 ">Lyrics</button> */}
        <img
          src={ImageFetch(current_song)}
          alt="song Avatar"
          onClick={() => setCoverRadius((prev) => !prev)}
          className={
            " h-72 md:h-60 lg:h-52 transition-all ease-linear duration-500 cursor-pointer object-cover mt-4 " +
            (coverRadius ? "rounded-[100%]" : " rounded-[15%]")
          }
        />
        <div className="flex justify-between w-full mb-2 max-md:mb-0 max-md:mt-6  ">
          <p className="text-xs max-md:text-sm tracking-normal">
            {musicCurrentTime}
          </p>
          <p className="text-xs max-md:text-sm tracking-normal">
            {musicTotalLength}
          </p>
        </div>

        <Slider
          aria-label="time-indicator"
          size="small"
          value={audioProgress}
          onChange={handleMusicProgressBar}
          sx={{
            color: theme.palette.mode === "dark" ? "#fff" : "#007aff",
            height: 4,
            padding: 0,
            "& .MuiSlider-thumb": {
              width: 8,
              height: 8,
              transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
              "&:before": {
                boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
              },
              "&:hover, &.Mui-focusVisible": {
                boxShadow: `0px 0px 0px 8px ${theme.palette.mode === "dark"
                  ? "rgb(255 255 255 / 16%)"
                  : "rgb(0 0 0 / 16%)"
                  }`,
              },
              "&.Mui-active": {
                width: 20,
                height: 20,
              },
            },
            "& .MuiSlider-rail": {
              opacity: 0.28,
            },
          }}
        />

        <div className="mt-1 max-md:scale-125 max-md:mt-5">
          <IconButton
            sx={{
              marginRight: "10px",
            }}
            aria-label="favsong"
            onClick={handleThumbsUpClick} 
          >
            <ThumbUpIcon
              fontSize="2rem"
              htmlColor={isLiked ? "#3B82F6" : "#8e9196"} 
            />
          </IconButton>
          <IconButton
            aria-label="previous song"
            onClick={HandlePreviousSong}
            sx={{
              ":hover": {
                bgcolor: "#2a2a2abf",
              },
            }}
          >
            <FastRewindRounded fontSize="2rem" htmlColor="#8e9196" />
          </IconButton>
          <IconButton
            sx={{
              ":hover": {
                bgcolor: "#2a2a2abf",
              },
            }}
            aria-label={paused ? "play" : "pause"}
            onClick={handleAudioPlay}
          >
            {paused ? (
              <PlayArrowRounded sx={{ fontSize: "3rem" }} htmlColor="#8e9196" />
            ) : (
              <PauseRounded sx={{ fontSize: "3rem" }} htmlColor="#8e9196" />
            )}
          </IconButton>
          <IconButton
            sx={{
              ":hover": {
                bgcolor: "#2a2a2abf",
              },
            }}
            aria-label="nextsong"
            onClick={HandleNextSong}
          >
            <FastForwardRounded fontSize="2rem" htmlColor="#8e9196" />
          </IconButton>
          <IconButton
            sx={{
              ":hover": {
                bgcolor: "#2a2a2abf",
              },
              marginLeft: "10px",
            }}
            onClick={() => setRepeatOne((prev) => !prev)}
          >
            {repeatOne ? (
              <RepeatOneIcon fontSize="2rem" htmlColor="#8e9196" />
            ) : (
              <RepeatIcon fontSize="2rem" htmlColor="#8e9196" />
            )}
          </IconButton>
        </div>
        <div className=" w-full pl-6 lg:pl-0 flex justify-end items-center gap-2 max-md:mr-10">
          {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
          <Slider
            aria-label="volume-indicator"
            size="small"
            value={volume}
            onChange={handleVolumeChange}
            sx={{
              color: theme.palette.mode === 'dark' ? '#fff' : '#007aff',
              height: 4,
              width: "120px",
              padding: 0,
              '& .MuiSlider-thumb': {
                width: 8,
                height: 8,
                transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                '&:before': {
                  boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                },
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: `0px 0px 0px 8px ${theme.palette.mode === 'dark'
                    ? 'rgb(255 255 255 / 16%)'
                    : 'rgb(0 0 0 / 16%)'
                    }`,
                },
                '&.Mui-active': {
                  width: 20,
                  height: 20,
                },
              },
              '& .MuiSlider-rail': {
                opacity: 0.28,
              },
            }}
          />
          <SongDownloader songId={current_song.id} />
        </div>

        <button
          onClick={() => setShowUpNext((prev) => !prev)}
          className="mt-0  top-0 max-md:mt-16 max-md:text-xl"
        >
          View More
        </button>
        {showUpNext && (
          <div
            className=" fixed  max bg-black inset-0 bg-opacity-20"
            onClick={() => setShowUpNext(false)}
          ></div>
        )}
        <AnimatePresence>
          {showUpNext && (
            <motion.section
              initial={{ y: "100%" }}
              animate={{ y: "0", transition: { ease: "easeInOut" } }}
              exit={{ y: "100%", transition: { ease: "easeInOut" } }}
              className="bg-neutral-800  bg-opacity-70 -bottom-8 max-md:bottom-16 pb-4 z-[55] backdrop-blur-md absolute
         px-1 rounded-xl w-full"
            >
              <div
                onClick={() => setShowUpNext((prev) => !prev)}
                className=" cursor-pointer pt-3"
              >
                <div className="bg-neutral-400 w-10 h-1 rounded-xl mx-auto mb-2 cursor-pointer"></div>
              </div>

              <div className="overflow-auto h-96">
                <UpNextSongs current_song={current_song} />
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};

export default AudioPlayer;
