const myHtml = document ? document.querySelector("html") as HTMLHtmlElement : null;
function shuffle(arr: string[][] | string[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
function cleanSentence(sentence: string): string {
  return sentence
    .replace(/[^a-zA-Zа-яА-Я ]/g, "") // Remove all characters except letters and spaces
    .replace(/\s+/g, " ") // Replace multiple spaces with a single space
    .trim();
}
function hasRusLetters(str: string) {
  return /[а-яА-Я]/.test(str);
}
function hasEngLetters(str: string) {
  return /[a-zA-Z]/.test(str);
}
function separateString(str: string) {
  let rusIndex = str.search(/[а-яА-Я]/g);
  let engIndex = str.search(/[a-zA-Z]/g);
  let russianExpression = "";
  let engExpression = "";
  if (rusIndex > engIndex) {
    russianExpression = str.slice(rusIndex);
    engExpression = str.slice(0, rusIndex);
  } else {
    russianExpression = str.slice(0, rusIndex);
    engExpression = str.slice(rusIndex);
  }
  return [engExpression, russianExpression];
}

function createEngPlusRussianSentences(string: string): string[][] {
    let array: string[] = string.split("\n") || [];
    array = array.filter(Boolean);
  let separatedSentences: string[][] = [];
  
  for (let i = array.length - 1; i >= 0; i--) {
    if (!array[i]) continue;

    const currentSentence = cleanSentence(array[i].trim());
    if (hasRusLetters(currentSentence) && hasEngLetters(currentSentence)) {
      separatedSentences.push(separateString(currentSentence));
      array.splice(i, 1);
      continue;
    }

  // если каждая из англ и рус фраз разделены абзацем - преобразовать два абзаца в один (англ+рус)
    const previousSentence = cleanSentence(array[i - 1].trim());
    if (
      currentSentence.search(/[а-яА-Я]/g) === 0 &&
      previousSentence.search(/[а-яА-Я]/g) === -1
    ) {
      separatedSentences.push([previousSentence, currentSentence]);
      array.splice(i - 1, 2);
    } else if (
      currentSentence.search(/[a-zA-Z]/g) === 0 &&
      previousSentence.search(/[a-zA-Z]/g) === -1
    ) {
      separatedSentences.push([currentSentence, previousSentence]);
      array.splice(i - 1, 2);
    }
  }
  return separatedSentences;
}

export { myHtml, shuffle, createEngPlusRussianSentences };
