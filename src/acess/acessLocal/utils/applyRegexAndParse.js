const applyRegexAndParse = (regex, string) => {
  const RegexIterator = string
    .matchAll(regex);

  const arrayOfParsedMatches = Array
    .from(RegexIterator)
    .map((match) => JSON.parse(match[0]));

  return arrayOfParsedMatches;
};

module.exports = { applyRegexAndParse }
