import dotenv from "dotenv";
import express from "express";
import { getNews } from "./utils/news.js";
import { createMarketingCampaign } from "./utils/ai.js";
import { trimJson } from "./utils/utils.js";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

app.post("/", async (req, res) => {
  const { productName } = req.body;
  const news = await getNews(productName);
  const marketingCampaign = await createMarketingCampaign(news, productName);

  const json = trimJson(marketingCampaign);

  return res.json(json);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
