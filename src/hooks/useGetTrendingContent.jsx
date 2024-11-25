import { useEffect, useState } from "react";
import { useContentStore } from "../store/content";
import axios from "axios";

const useGetTrendingContent = () => {
	const [trendingContent, setTrendingContent] = useState(null); // trendingContent is the state that stores the trending content
	const { contentType } = useContentStore(); // get the contentType from the useContentStore hook

	useEffect(() => { // useEffect hook to fetch the trending content based on the contentType
		const getTrendingContent = async () => { // async function to fetch the trending content
			const res = await axios.get(`/api/v1/${contentType}/trending`);
			setTrendingContent(res.data.content);    // set the trending content in the state
		};

		getTrendingContent(); // call the getTrendingContent function
	}, [contentType]); // re-run the effect when the contentType changes, [contentType]: Ensures that the fetching logic runs only when contentType changes.

	return { trendingContent };
};
export default useGetTrendingContent;