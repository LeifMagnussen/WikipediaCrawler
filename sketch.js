// This is a wikipedia game inspired by Daniel Shiffman's example from his 75th coding challenge
// entitled Wikipedia API Link(https://www.youtube.com/watch?v=RPz75gcHj18&t=864s)
// 
// This game is played by entering a word into the search box and then waiting and seeing how long
// it takes to randomly find the word 'day' in a wikipedia title.
// The program outputs each wikipedia title that it finds on the webpage, so you can track along to what
// articles are being found
// Once the word is found the program will display the number of searches it took to be found.
// This game was created for me to practice my javascript and using the P5 standard libraries and
// functions
// Leif Magnussen Fall 2017/Winter 2018


// using wikipedia standard search and content URLs
let searchUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=';
let contentUrl = 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=';

// creating global variables and initializing to values that wont disturb the first iteration
let userInput;
let counter = 0;
let title = 'null';

function setup() {
  noCanvas();
  // pulling data from the search box
  userInput = select('#userinput');
  userInput.changed(startSearch);
  

  function startSearch() {
    counter = 0;
    goWiki(userInput.value());
  }

  function goWiki(term) {
    counter = counter + 1;
    // checking if the word 'Day' is within the wikipedia title
    if (title.indexOf("Day") <= -1) {
      // for keeping initial search in randomized guess
      //let term = userInput.value();
      let url = searchUrl + term;
      loadJSON(url, gotSearch, 'jsonp');
      
    }
    else {
      // displaying the number of searches if the word is found
      window.alert("Day was found");
      createDiv("Number of searches to find day:");
      createDiv(counter);
      
      
    }
  }

  function gotSearch(data) {
    // uncomment if you want to see the data from each page found
    //console.log(data);
    let len = data[1].length;
    let index = floor(random(len));
    title = data[1][index];
    
    // using try and catch to deal with randomly selecting non words in the article
    try {
    title = title.replace(/\s+/g, ' ');
    }
    catch(err) {
      title = userInput.value();
    }
    createDiv(title);
    console.log('Querying: ' + title);
    let url = contentUrl + title;
    loadJSON(url, gotContent, 'jsonp');
  }

  function gotContent(data) {
    let page = data.query.pages;
    let pageId = Object.keys(data.query.pages)[0];
    console.log(pageId);
    let content = page[pageId].revisions[0]['*'];
    let wordRegex = /\b\w{4,}\b/g;
    let words = content.match(wordRegex);
    // randomly selecting a word from within the wikipedia article
    let word = random(words);
    goWiki(word);
   
  }
}
