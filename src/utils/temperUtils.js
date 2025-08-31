// utils/temperUtils.js
import { TEMPER_STORAGE_KEY } from "../constants/app";

/**
 * Get the temper level from localStorage
 * @returns {number} The temper level (0-2), defaults to 0 if not found
 */
export const getTemperLevel = () => {
  try {
    const stored = localStorage.getItem(TEMPER_STORAGE_KEY);
    if (stored !== null) {
      const level = parseInt(stored, 10);
      // Validate the level is within bounds (0-2)
      if (level >= 0 && level <= 2) {
        return level;
      }
    }
  } catch (error) {}
  // Return default temper level if not found or invalid
  return 0;
};

/**
 * Save the temper level to localStorage
 * @param {number} level - The temper level to save (0-2)
 */
export const setTemperLevel = (level) => {
  try {
    // Validate the level is within bounds
    if (level >= 0 && level <= 2) {
      localStorage.setItem(TEMPER_STORAGE_KEY, level.toString());
    } else {
      console.warn("Invalid temper level:", level);
    }
  } catch (error) {}
};

/**
 * Clear the temper level from localStorage (reset to default)
 */
export const clearTemperLevel = () => {
  try {
    localStorage.removeItem(TEMPER_STORAGE_KEY);
  } catch (error) {}
};
