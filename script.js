const newQuoteBtn = document.getElementById('new-quote');
const audioElement = document.getElementById('audio');
const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');

function showLoadingSpinner() {
    loader.hidden = false;
    quoteContainer.hidden = true;
}

function removeLoadingSpinner() {
    if (!loader.hidden) {
        quoteContainer.hidden = false;
        loader.hidden = true;
    }
}

function toggleButton() {
    newQuoteBtn.disabled = !newQuoteBtn.disabled;
}

function sayQuote(quoteTeller) {
    const quoteTellerString = quoteTeller.trim().replace(/ /g, '%20');
    VoiceRSS.speech({
        key: 'bfe574c7d2c7467f9c56e7a5aacc8d8a',
        src: quoteTellerString,
        hl: 'en-ca',
        r: 0,
        c: 'mp3',
        f: '44khz_16bit_stereo',
        ssml: false
    });
    
}

function tweetQuote() {
    const quote = quoteText.innerText;
    const author = authorText.innerText;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
    window.open(twitterUrl, '_blank');
}

async function getQuote() {
    let quoteTeller = '';
    const proxyUrl = 'https://lit-dawn-05160.herokuapp.com/'
    const apiUrl = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
    try {
        const response = await fetch(proxyUrl + apiUrl);
        const data = await response.json();
        // console.log(data);
        if (data.quoteAuthor === '') {
            authorText.innerText = 'Unknown';
        } else {
            authorText.innerText = data.quoteAuthor;
        }
        quoteText.innerText = data.quoteText;

        if (data.quoteText) {
            quoteTeller = `${data.quoteText} ${data.quoteAuthor}`;
        }

        if (data.quoteText.length > 120) {
            quoteText.classList.add('long-quote');
        } else {
            quoteText.classList.remove('long-quote');
        }
        quoteText.innerText = data.quoteText;
        sayQuote(quoteTeller);
        toggleButton();
    } catch (error) {
        getQuote();
        console.log('Cant load quote', error);
    }
}

newQuoteBtn.addEventListener('click', getQuote);
twitterBtn.addEventListener('click', tweetQuote);
audioElement.addEventListener('ended', toggleButton);

