import { useEffect, useRef, useState } from "react";
import { useContentStore } from "../store/content";
import axios from "axios";
import { Link } from "react-router-dom";
import { SMALL_IMG_BASE_URL } from "../utils/constants";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MovieSlider = ({ category }) => {
	const { contentType } = useContentStore();
	const [content, setContent] = useState([]); // content is an array of objects, ie each object contains the details of a movie or tv show , here initially it is empty
	const [showArrows, setShowArrows] = useState(false);

	const sliderRef = useRef(null); // ***

	const formattedCategoryName = category.replaceAll("_", " ")[0].toUpperCase() + category.replaceAll("_", " ").slice(1); // replaces _ with space and capitalizes the first letter
	const formattedContentType = contentType === "movie" ? "Movies" : "TV Shows"; // if contentType is movie then Movies will be shown else TV Shows will be shown as heading

	useEffect(() => { // useEffect is used to fetch the content of the movies or tv shows, when the component is mounted , ie when the component is rendered for the first time
		const getContent = async () => {
			const res = await axios.get(`/api/v1/${contentType}/${category}`);
			setContent(res.data.content); // res.data.content contains the details of the movies or tv shows, and setContent sets the content to the details of the movies or tv shows
		};
		getContent();
	}, [contentType, category]); // useEffect will run when contentType or category changes

	const scrollLeft = () => { // ***
		if (sliderRef.current) { 
			sliderRef.current.scrollBy({ left: -sliderRef.current.offsetWidth, behavior: "smooth" }); 
		}
	};
	const scrollRight = () => { // ***
		sliderRef.current.scrollBy({ left: sliderRef.current.offsetWidth, behavior: "smooth" });
	};

	return (
		<div
			className='bg-black text-white relative px-5 md:px-20'
			onMouseEnter={() => setShowArrows(true)}
			onMouseLeave={() => setShowArrows(false)}
		>
			<h2 className='mb-4 text-2xl font-bold'>
				{formattedCategoryName} {formattedContentType}
			</h2>

			<div className='flex space-x-4 overflow-x-scroll scrollbar-hide' ref={sliderRef}> {/* *** */} {/* scrollbar-hide is a class for hiding the scrollbar , and plugin tailwind-scrollbar-hide has been used */}
				{content.map((item) => ( // maps through the content array and displays the image of the movie or tv show
					<Link to={`/watch/${item.id}`} className='min-w-[250px] relative group' key={item.id}> {/* when the image is clicked it will redirect to the watch page of the movie or tv show */}
						<div className='rounded-lg overflow-hidden'>
							<img
								src={SMALL_IMG_BASE_URL + item.backdrop_path} // SMALL_IMG_BASE_URL is the base url for the image and item.backdrop_path is the path of the image
								alt='Movie image'
								className='transition-transform duration-300 ease-in-out group-hover:scale-125'
							/>
						</div>
						<p className='mt-2 text-center'>{item.title || item.name}</p> {/* item.title is for movies and item.name is for tv shows , if title is not present then name will be shown*/}
					</Link>
				))}
			</div>

			{showArrows && ( // if showArrows is true then the left and right arrow buttons will be shown
				<>
					<button
						className='absolute top-1/2 -translate-y-1/2 left-5 md:left-24 flex items-center justify-center
            size-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10
            '
						onClick={scrollLeft}
					>
						<ChevronLeft size={24} />
					</button>

					<button
						className='absolute top-1/2 -translate-y-1/2 right-5 md:right-24 flex items-center justify-center
            size-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10
            '
						onClick={scrollRight}
					>
						<ChevronRight size={24} />
					</button>
				</>
			)}
		</div>
	);
};
export default MovieSlider;