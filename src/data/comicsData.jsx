// Create a single "source of truth" for your comic metadata.
// This is the only part you'll ever need to update when you add a new comic.
const comicMetadata = [
  {
    slug: "viral-shaaji",
    title: "Viral Shaaji",
    date: "02-09-2025", // Add the date here
  },
  {
    slug: "its-a-match",
    title: "It's A Match!",
    date: "05-09-2025",
  },
  // ... add all your other comic objects here
];

// Dynamically create the final `comics` array using .map()
// This code never needs to be touched again. It will automatically build
// the correct structure for any comic you add to the metadata above.
export const comics = comicMetadata.map((comic) => ({
  slug: comic.slug,
  title: comic.title,
  date: comic.date,
  coverImage: `/comic/cover/${comic.slug}.png`,
  comicImage: `/comic/story/${comic.slug}.png`,
}));
