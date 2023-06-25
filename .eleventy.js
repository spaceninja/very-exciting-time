const { DateTime } = require('luxon');
const { EleventyHtmlBasePlugin } = require('@11ty/eleventy');
const pluginRss = require('@11ty/eleventy-plugin-rss');

/**
 * Based on Eleventy Base Blog v8
 * @see https://github.com/11ty/eleventy-base-blog/tree/main
 */
module.exports = function (eleventyConfig) {
  // Copy over various static files
  eleventyConfig.addPassthroughCopy(
    'src/**/*.(gif|ico|jpg|png|svg|webp|woff|woff2)'
  );

  // Watch for CSS changes
  eleventyConfig.addWatchTarget('./src/_scss/');

  // Official plugins
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  // Date formatting (human readable)
  // Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
  eleventyConfig.addFilter('readableDate', (dateObj, format, zone) => {
    return DateTime.fromJSDate(dateObj, { zone: zone || 'utc' }).toFormat(
      format || 'dd LLLL yyyy'
    );
  });

  // Date formatting (machine readable)
  // dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
  });

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter('head', (array, n) => {
    if (!Array.isArray(array) || array.length === 0) {
      return [];
    }
    if (n < 0) {
      return array.slice(n);
    }
    return array.slice(0, n);
  });

  // Return the smallest number argument
  eleventyConfig.addFilter('min', (...numbers) => {
    return Math.min.apply(null, numbers);
  });

  // Return all the tags used in a collection
  eleventyConfig.addFilter('getAllTags', (collection) => {
    let tagSet = new Set();
    let tagCount = {};
    for (let item of collection) {
      (item.data.tags || []).forEach((tag) => {
        tagCount[tag] = tagCount[tag] ? tagCount[tag] + 1 : 1;
        tagSet.add(tag);
      });
    }
    return (
      // At least one tag, sort by count, then alphabetically
      Array.from(tagSet)
        .filter((tag) => tagCount[tag] > 1)
        .sort() // alfa(7), golf(3), xray(7)
        .reverse() // xray(7), golf(3), alfa(7)
        .sort((a, b) => tagCount[a] - tagCount[b]) // golf(3), xray(7), alfa(7)
        .reverse() // alfa(7), xray(7), golf(3)
    );
  });

  // Return all the tags used in a collection, except some
  eleventyConfig.addFilter('filterTagList', function filterTagList(tags) {
    return (tags || []).filter(
      (tag) => ['all', 'nav', 'episodes'].indexOf(tag) === -1
    );
  });

  // Current year shortcode
  eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`);

  return {
    dir: {
      input: 'src',
      output: 'dist',
    },
  };
};
