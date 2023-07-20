/* eslint-disable curly */
/**
 * Rescue Orphans
 *
 * Replaces the space preceding the last word in a string with `&nbsp;`
 * to "rescue" orphans. Only applies if there are at least two words
 * and the last word is below a certain length.
 *
 * @param {*} string    The text to operate on
 * @param {*} maxLength Maximum word length to rescue
 * @param {*} minWords  Minimum number of words to rescue last one
 * @param {*} maxRatio  If the length of the conjoined string is larger than the
 *                      preceding string by this ratio, it won't be rescued.
 * @returns string
 */
export const rescueOrphans = (
  string,
  maxLength = 10,
  minWords = 3,
  maxRatio = 1.5,
) => {
  // Split the string into words.
  // This complex regex is to prevent matching HTML tags in the string.
  // @see https://stackoverflow.com/a/13325161
  const words = string.split(/[ ](?=[^>]*(?:<|$))/);

  // If the string is too short, return it unmodified.
  if (words.length < minWords) return string;

  // Get the last word.
  const lastWord = words.pop();

  // If the last word is too long, return the string unmodified.
  if (lastWord.length > maxLength) return string;

  // Add a non-breaking space between the last two words,
  // compute the ratio between the last two words and the rest of the string.
  const textEnd = `${words.pop()}&nbsp;${lastWord}`;
  const textStart = words.join(' ');
  const ratio = textEnd.length / textStart.length;

  // If the ratio is too high, return the string unmodified.
  if (ratio > maxRatio) return string;

  // Return the string with a non-breaking space.
  return `${textStart} ${textEnd}`;
};
