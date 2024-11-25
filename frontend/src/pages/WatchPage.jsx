import React from 'react'
import { Link, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useContentStore } from "../store/content";
import axios from "axios";
import Navbar from "../components/Navbar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReactPlayer from "react-player";
import { formatReleaseDate } from "../utils/dateFunction";
import { ORIGINAL_IMG_BASE_URL, SMALL_IMG_BASE_URL } from "../utils/constants";
import WatchPageSkeleton from "../components/WatchPageSkeleton";


const WatchPage = () => {
  const { id } = useParams(); // useParams is a hook that returns an object of key/value pairs of URL parameters , here id is the key
  const [trailers, setTrailers] = useState([]); // trailers is an array of objects, ie each object contains the details of a trailer , here initially it is empty
  const [currentTrailerIdx, setCurrentTrailerIdx] = useState(0); // currentTrailerIdx is the index of the current trailer,  so that we ca navigate to the next or previous trailer
  const [loading, setLoading] = useState(true); // to have a loading effect when the trailers are being fetched, by default it is true because initially the trailers are not fetched
  const [content, setContent] = useState({}); // content is an object that contains the details of the movie or tv show , here initially it is empty
  const { contentType } = useContentStore(); // useContentStore hook returns an object with the contentType and methods to set the contentType
  const [similarContent, setSimilarContent] = useState([]);// similarContent is an array of objects, ie each object contains the details of a similar movie or tv show , here initially it is empty

  const sliderRef = useRef(null);
  


  useEffect(() => {
		const getTrailers = async () => { // useEffect is used to fetch the trailers of the movie or tv show, when the component is mounted , ie when the component is rendered for the first time
			try {
				const res = await axios.get(`/api/v1/${contentType}/${id}/trailers`);
				setTrailers(res.data.trailers);
			} catch (error) {
				if (error.message.includes("404")) {
					setTrailers([]);
				}
			}
		};
    getTrailers();
	}, [contentType, id]); // useEffect will run when contentType or id changes
  

  useEffect(() => { // useEffect is used to fetch the details of the movie or tv show, when the component is mounted , ie when the component is rendered for the first time
		const getSimilarContent = async () => {
			try {
				const res = await axios.get(`/api/v1/${contentType}/${id}/similar`);
				setSimilarContent(res.data.similar);
			} catch (error) {
				if (error.message.includes("404")) {
					setSimilarContent([]);
				}
			}
		};

		getSimilarContent();
	}, [contentType, id]); // useEffect will run when contentType or id changes


  useEffect(() => {
		const getContentDetails = async () => { // useEffect is used to fetch the details of the movie or tv show, when the component is mounted , ie when the component is rendered for the first time
			try {
				const res = await axios.get(`/api/v1/${contentType}/${id}/details`);
				setContent(res.data.content);
			} catch (error) {
				if (error.message.includes("404")) {
					setContent(null);
				}
			} finally {
				setLoading(false);
			}
		};

		getContentDetails();
	}, [contentType, id]); // useEffect will run when contentType or id changes
   
	const handleNext = () => {
		if (currentTrailerIdx < trailers.length - 1) setCurrentTrailerIdx(currentTrailerIdx + 1);
	};
	const handlePrev = () => {
		if (currentTrailerIdx > 0) setCurrentTrailerIdx(currentTrailerIdx - 1);
	};


	// already a note is there in NoteComponent to understand the below code
	const scrollLeft = () => { // scrollLeft and scrollRight are functions to scroll the slider to the left or right
		if (sliderRef.current) sliderRef.current.scrollBy({ left: -sliderRef.current.offsetWidth, behavior: "smooth" });
	};
	const scrollRight = () => {
		if (sliderRef.current) sliderRef.current.scrollBy({ left: sliderRef.current.offsetWidth, behavior: "smooth" });
	};

	if (loading) // if the trailers are being fetched then show the loading effect
		return (
			<div className='min-h-screen bg-black p-10'>
				<WatchPageSkeleton />
			</div>
		);

	if (!content) {
		return (
			<div className='bg-black text-white h-screen'>
				<div className='max-w-6xl mx-auto'>
					<Navbar />
					<div className='text-center mx-auto px-4 py-8 h-full mt-40'>
						<h2 className='text-2xl sm:text-5xl font-bold text-balance'>Content not found 😥</h2>
					</div>
				</div>
			</div>
		);
	}


  return (
	<div className='bg-black min-h-screen text-white'>
			<div className='mx-auto container px-4 py-8 h-full'>
				<Navbar />

				{trailers.length > 0 && ( // if trailers are available then only show the buttons to navigate to the next or previous trailer
					<div className='flex justify-between items-center mb-4'>
						<button
							className={`
							bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded ${
								currentTrailerIdx === 0 ? "opacity-50 cursor-not-allowed " : ""
							}}
							`}
							disabled={currentTrailerIdx === 0} // if currentTrailerIdx is 0 then the previous button is disabled
							onClick={handlePrev}
						>
							<ChevronLeft size={24} />
						</button>

						<button
							className={`
							bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded ${
								currentTrailerIdx === trailers.length - 1 ? "opacity-50 cursor-not-allowed " : "" // if currentTrailerIdx is equal to the length of trailers array then the next button is disabled
							}}
							`}
							disabled={currentTrailerIdx === trailers.length - 1} // if currentTrailerIdx is equal to the length of trailers array then the next button is disabled
							onClick={handleNext}
						>
							<ChevronRight size={24} />
						</button>
					</div>
				)}

				<div className='aspect-video mb-8 p-2 sm:px-10 md:px-32'>
					{trailers.length > 0 && (
						<ReactPlayer
							controls={true}
							width={"100%"}
							height={"70vh"}
							className='mx-auto overflow-hidden rounded-lg'
							url={`https://www.youtube.com/watch?v=${trailers[currentTrailerIdx].key}`} //the key here is the youtube video id
						/>
					)}

					{trailers?.length === 0 && (
						<h2 className='text-xl text-center mt-5'>
							No trailers available for{" "}
							<span className='font-bold text-red-600'>{content?.title || content?.name}</span> 😥
						</h2>
					)}
				</div>

				{/* movie details */}
				<div
					className='flex flex-col md:flex-row items-center justify-between gap-20 
				max-w-6xl mx-auto'
				>
					<div className='mb-4 md:mb-0'>
						<h2 className='text-5xl font-bold text-balance'>{content?.title || content?.name}</h2>

						<p className='mt-2 text-lg'>
							{formatReleaseDate(content?.release_date || content?.first_air_date)} |{" "} {/* formatReleaseDate is a function , defined utils folder, that takes the release date as an argument and returns the formatted date, for tv shows it is first_air_date and for movies it is release_date */}
							{content?.adult ? (
								<span className='text-red-600'>18+</span>
							) : (
								<span className='text-green-600'>PG-13</span>
							)}{" "}
						</p>
						<p className='mt-4 text-lg'>{content?.overview}</p>
					</div>
					<img
						src={ORIGINAL_IMG_BASE_URL + content?.poster_path}
						alt='Poster image'
						className='max-h-[600px] rounded-md'
					/>
				</div>

				{similarContent.length > 0 && (
					<div className='mt-12 max-w-5xl mx-auto relative'>
						<h3 className='text-3xl font-bold mb-4'>Similar Movies/Tv Show</h3>

						<div className='flex overflow-x-scroll scrollbar-hide gap-4 pb-4 group' ref={sliderRef}>
							{similarContent.map((content) => { // similarContent is an array of objects, ie each object contains the details of a similar movie or tv show , here initially it is empty
								if (content.poster_path === null) return null; // if the poster_path is null for a particular movie or tv show then return null , ie dont show it
								return (
									<Link key={content.id} to={`/watch/${content.id}`} className='w-52 flex-none'>
										<img
											src={SMALL_IMG_BASE_URL + content.poster_path}
											alt='Poster path'
											className='w-full h-auto rounded-md'
										/>
										<h4 className='mt-2 text-lg font-semibold'>{content.title || content.name}</h4>
									</Link>
								);
							})}

							<ChevronRight
								className='absolute top-1/2 -translate-y-1/2 right-2 w-8 h-8
								opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer
								bg-red-600 text-white rounded-full'
								onClick={scrollRight}
							/>
							<ChevronLeft
								className='absolute top-1/2 -translate-y-1/2 left-2 w-8 h-8 opacity-0 
								group-hover:opacity-100 transition-all duration-300 cursor-pointer bg-red-600 
								text-white rounded-full'
								onClick={scrollLeft}
							/>
						</div>
					</div>
				)}
			</div>
		</div>
    
  )
}

export default WatchPage