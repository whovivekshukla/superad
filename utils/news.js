import fetch from "node-fetch";

export const getNews = async (searchQuery) => {
  try {
    const options = {
      method: "GET",
      url: `https://newsapi.org/v2/everything?q=${encodeURIComponent(
        searchQuery
      )}&apiKey=${process.env.NEWS_API}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(options.url, {
      method: options.method,
      headers: options.headers,
    });

    const news = await response.json();
    return news.articles;
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while fetching the news" };
  }
};
