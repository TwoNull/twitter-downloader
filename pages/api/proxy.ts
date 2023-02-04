import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { link } = req.query;
  if (typeof link != "string") {
    return res.status(400).json({ message: "Malformed Request" });
  }
  let response: any;
  try {
    const url = new URL(link);
    if (url.host != "video.twimg.com") {
      throw "URL Invalid";
    }
    response = await axios({
      method: "GET",
      responseType: "stream",
      url: url.href,
    });
    const contentType = response.headers["content-type"];
    const contentLength = response.headers["content-length"];
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=td_download.mp4"
    );
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Length", contentLength);
    return res.status(200).send(response.data);
  } catch (err: any) {
    return res.status(400).json({ message: "URL Invalid" });
  }
}

export const config = {
  api: {
    responseLimit: "12mb",
  },
};
