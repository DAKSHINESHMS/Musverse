import React from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
const SingleArtist = ({ id, title, image, name }) => {
  return (
    <Link to={`/artist/${id}`} className="w-28 block group">
      <div className="relative w-28 h-28 border-2 border-opacity-40 border-slate-300 rounded-full overflow-hidden">
        <LazyLoadImage
          src={image[1].link}
          alt=""
          effect="blur"
          className="w-full h-full object-cover rounded-full group-hover:scale-110 ease-linear duration-500"
        />
      </div>
      <h4
        className="w-full text-center text-darkSongname text-sm mt-3 px-1 "
        title={title}
      >
        {title || name}
      </h4>
      <p className="text-center text-slate-400 text-xs tracking-wide mt-1">
        Artist
      </p>
    </Link>
  );
};

export default SingleArtist;
