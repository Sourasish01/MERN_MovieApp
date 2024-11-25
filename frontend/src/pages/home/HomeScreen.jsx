import React from 'react';
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import { Info, Play } from "lucide-react";
import useGetTrendingContent from "../../hooks/useGetTrendingContent";
import { MOVIE_CATEGORIES, ORIGINAL_IMG_BASE_URL, TV_CATEGORIES } from "../../utils/constants";
import { useContentStore } from "../../store/content";
import { useState } from "react";
import MovieSlider from "../../components/MovieSlider";

const HomeScreen = () => {

  const { trendingContent } = useGetTrendingContent(); // in curly braces because it is an object
  const { contentType } = useContentStore();
  const [imgLoading, setImgLoading] = useState(true);

  if (!trendingContent) // if trendingContent is not present then return the following shimmer effect to get the loading effect
	return (
		<div className='h-screen text-white relative'>
			<Navbar />
			<div className='absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center -z-10 shimmer' /> {/* shimmer is a class for loading animation ,and has been defined in index.css */}
		</div>
	);


  return (
    <>
    <div className='relative h-screen text-white '>
				<Navbar />

				{/*OPTIMIZATION HACK FOR IMAGES */}
				{imgLoading && (
					<div className='absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center shimmer -z-10' />
				)}

				<img
					src={ORIGINAL_IMG_BASE_URL + trendingContent?.backdrop_path} // ORIGINAL_IMG_BASE_URL is the base url for the image and trendingContent?.backdrop_path is the path of the image, where .backdrop_path is the path of the image
					alt='Hero img'
					className='absolute top-0 left-0 w-full h-full object-cover -z-50'
					onLoad={() => {
						setImgLoading(false);
					}}
				/>

				<div className='absolute top-0 left-0 w-full h-full bg-black/50 -z-50' aria-hidden='true' />

				<div className='absolute top-0 left-0 w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-32'>
					<div
						className='bg-gradient-to-b from-black via-transparent to-transparent 
					absolute w-full h-full top-0 left-0 -z-10'
					/>

					<div className='max-w-2xl'>
						<h1 className='mt-4 text-6xl font-extrabold text-balance'>
							{trendingContent?.title || trendingContent?.name} {/*trendingContent?.title is for movies and trendingContent?.name is for tv shows , if title is not present then name will be shown*/}
						</h1>
						<p className='mt-2 text-lg'>
							{trendingContent?.release_date?.split("-")[0] ||
								trendingContent?.first_air_date.split("-")[0]}{" "}
							| {trendingContent?.adult ? "18+" : "PG-13"}
						</p>

						<p className='mt-4 text-lg'>
							{trendingContent?.overview.length > 200
								? trendingContent?.overview.slice(0, 200) + "..." // if the overview is more than 200 characters then only 200 characters will be shown
								: trendingContent?.overview}
						</p>
					</div>

					<div className='flex mt-8'>
						<Link
							to={`/watch/${trendingContent?.id}`} // in curly braces because it is a variable
							className='bg-white hover:bg-white/80 text-black font-bold py-2 px-4 rounded mr-4 flex
							 items-center'
						>
							<Play className='size-6 mr-2 fill-black' />
							Play
						</Link>

						<Link
							to={`/watch/${trendingContent?.id}`}
							className='bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded flex items-center'
						>
							<Info className='size-6 mr-2' />
							More Info
						</Link>
					</div>
				</div>
			</div>

			<div className='flex flex-col gap-10 bg-black py-10'>
				{contentType === "movie"
					? MOVIE_CATEGORIES.map((category) => <MovieSlider key={category} category={category} />) // here we are mapping the categories of movies from the constants file and passing them to the MovieSlider component  as props
					: TV_CATEGORIES.map((category) => <MovieSlider key={category} category={category} />)}
			</div>
    </>
  )
}

export default HomeScreen