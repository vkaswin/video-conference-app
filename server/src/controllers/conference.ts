import { readFileSync } from "fs";
import { asyncHandler } from "../utils";

export const getConferencePage = asyncHandler(async (req, res) => {
  let filePath = process.cwd() + "/src/templates/conference.html";
  let html = await readFileSync(filePath, { encoding: "utf-8" });
  res.contentType("html").status(200).send(html);
});
