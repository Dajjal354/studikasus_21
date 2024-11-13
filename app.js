const url = 'https://icanhazdadjoke.com/';
const translateUrl = 'https://api.mymemory.translated.net/get';

const btn = document.querySelector('.btn');
const translateBtn = document.querySelector('.translate-btn');
const result = document.querySelector('.result');
let currentJoke = '';

const langSelect = document.querySelector('#langSelect');

const secretBtn = document.querySelector('.secret-btn');
const jumpscare = document.getElementById('jumpscare');
const scarySound = document.getElementById('scarySound');

btn.addEventListener('click', () => {
  fetchDadJoke();
});

translateBtn.addEventListener('click', async () => {
  if (currentJoke) {
    const targetLang = langSelect.value;
    if (targetLang === 'en') {
      result.textContent = `😎 ${currentJoke}`;
    } else {
      const translatedJoke = await translateJoke(currentJoke, 'en', targetLang);
      result.textContent = `😎 ${translatedJoke}`;
    }
  }
});

secretBtn.addEventListener('click', () => {
  scarySound.volume = 0.5;
  
  const playPromise = scarySound.play();

  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        jumpscare.classList.add('active');
        
        setTimeout(() => {
          jumpscare.classList.remove('active');
          scarySound.pause();
          scarySound.currentTime = 0;
        }, 2000);
      })
      .catch(error => {
        console.log("Playback failed:", error);
      });
  }
});

let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
  if (e.key === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      secretBtn.style.opacity = '1';
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});

const fetchDadJoke = async () => {
  result.textContent = 'Loading...';
  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'learning app',
      },
    });
    if (!response.ok) {
      throw new Error('error');
    }
    const data = await response.json();
    currentJoke = data.joke;
    result.textContent = `😎 ${currentJoke}`;
  } catch (error) {
    console.log(error.message);
    result.textContent = 'There was an error...';
  }
};

const translateJoke = async (text, sourceLang, targetLang) => {
  try {
    const response = await fetch(
      `${translateUrl}?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`
    );
    const data = await response.json();
    if (data.responseStatus === 200) {
      return data.responseData.translatedText;
    } else {
      throw new Error('Translation failed');
    }
  } catch (error) {
    console.log(error);
    return 'Gagal menerjemahkan...';
  }
};

fetchDadJoke();
