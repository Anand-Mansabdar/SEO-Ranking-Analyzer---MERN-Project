import keywordTrackingModel from "../Models/keyword.model.js";
import { keywordTracking } from "../Services/keywordTracker.service.js";

// Add Keyword to track ranking
export const addKeyword = async (req, res) => {
  try {
    const { keyword, url } = req.body;

    if (!keyword || !url) {
      return res.status(400).json({
        success: false,
        message: "Keyword and URL are required",
      });
    }

    // Extract Domain from URL
    let domain;
    try {
      const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
      domain = urlObj.hostname.replace("www.", "");
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid URL format",
      });
    }

    // Check if kryword is already tracking
    const existing = await keywordTrackingModel.findOne({
      userId: req.userId,
      keyword: keyword.toLowerCase().trim(),
      domain,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Already tracking this keyword for this domain",
      });
    }

    // Create Tracking Entry
    const tracking = await keywordTrackingModel.create({
      userId: req.userId,
      keyword: keyword.toLowerCase().trim(),
      url: url.startsWith("http") ? url : `https://${url}`,
      domain,
      status: "checking",
    });

    res.status(201).json({
      success: true,
      message: "Keyword Tracking Started",
      tracking,
    });

    keywordTracking(tracking);
  } catch (error) {
    console.error("Keyword Adding Error: ", error.message);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Already tracking this keyword",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get all tracked keywords for user
export const getKeywords = async (req, res) => {};

// Get single keyword with full history
export const getKeyword = async (req, res) => {};

// Manually refresh a keyword ranking
export const refreshKeyword = async (req, res) => {};

// Delete keyword
export const deleteKeyword = async (req, res) => {};

// Toggle Tracking active/inactive
export const toggleTracking = async (req, res) => {};
