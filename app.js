// EXTRACT SONG METADATA
const jsmediatags = window.jsmediatags

// DOM ELEMENTS
const main = document.querySelector('.musicplayer__wrapper')
const bgImage = document.querySelector('.bg-image')
const prev = document.querySelector('.prev')
const next = document.querySelector('.next')
const shuffle = document.querySelector('.fa-shuffle')
const repeat = document.querySelector('.fa-repeat')
const playPause = document.querySelector('.play-pause')
const playBtn = document.querySelector('.play-btn')
const audio = document.querySelector('.audio')
const artist = document.querySelector('.song--artist')
const songTitle = document.querySelector('.song--title')
const songImageContainer = document.querySelector('.song__img--container')
const progressBar = document.querySelector('.progress-bar')

// GLOBAL INDEX TO KEEP TRACK OF CURRENT SONG
let songIndex = localStorage.getItem('id') ? localStorage.getItem('id') : 1

// SONGS ARRAY
const songs = [
  './songs/2become1.mp3',
  './songs/amazing.mp3',
  './songs/bang-my-head.mp3',
  './songs/born-to-die.mp3',
  './songs/close.mp3',
  './songs/desperado.mp3',
  './songs/dont-let-me-go.mp3',
  './songs/dreams-come-true.mp3',
  './songs/drive.mp3',
  './songs/edge-of-glory.mp3',
  './songs/elastic-heart.mp3',
  './songs/heal.mp3',
  './songs/i-wanna-grow-old-with-you.mp3',
  './songs/imaginary-diva.mp3',
  './songs/in-this-life.mp3',
  './songs/incomplete.mp3',
  './songs/is-there-someone-else.mp3',
  './songs/its-you.mp3',
  './songs/juice.mp3',
  './songs/just-cant-get-enough.mp3',
  './songs/love-in-the-dark.mp3',
  './songs/love-takes-two.mp3',
  './songs/lovesong.mp3',
  './songs/miss-you-nights.mp3',
  './songs/no-place-that-far.mp3',
  './songs/obvious.mp3',
  './songs/perfect-illusion.mp3',
  './songs/pictures-in-my-head.mp3',
  './songs/puzzle-of-my-heart.mp3',
  './songs/queen-of-my-heart.mp3',
  './songs/remedy.mp3',
  './songs/rolling-in-the-deep.mp3',
  './songs/rolling-stone.mp3',
  './songs/shes-back.mp3',
  './songs/thats-where-you-find-love.mp3',
  './songs/the-hills.mp3',
  './songs/the-night-is-still-young.mp3',
  './songs/to-be-loved.mp3',
  './songs/truth-hurts.mp3',
  './songs/unbreakable.mp3',
  './songs/us-against-the-world.mp3',
  './songs/when-we-were-young.mp3',
  './songs/world-of-our-own.mp3',
  './songs/written-in-the-stars.mp3'
]

// GETS SONG FILE AND EXTRACT ITS METADATA
const setSong = index => {
  audio.src = songs[index - 1]
  // song metadata
  jsmediatags.read(audio.src, {
    onSuccess: tag => {
      artist.innerHTML = tag.tags.artist
      songTitle.innerHTML = tag.tags.title
      // song thumbnail and page background image
      let pictureData = tag.tags.picture.data
      let pictureFormat = tag.tags.picture.format
      let base64String = ''
      for (let i = 0; i < pictureData.length; i++) {
        base64String += String.fromCharCode(pictureData[i])
      }
      let songImg = `data:${pictureFormat};base64,${window.btoa(base64String)}`

      // change color of progress bar based on brightness of song thumbnail
      getImageBrightness(songImg, (brightness) => {
        let imageBrightness = brightness
        if (imageBrightness > 113) {
          progressBar.style.backgroundColor = 'rgb(53, 53, 53)'
        } else {
          progressBar.style.backgroundColor = 'rgb(235, 235, 235)'
        }
      })
      // set the page background to song thumbnail
      songImageContainer.style.backgroundImage = `url(${songImg})`
      bgImage.style.backgroundImage = `url(${songImg})`
    }
  })
  // save last played song to localStorage
  storeLastSong(index)
}

// DETERMINE BRIGHTNESS OF SONG THUMBNAIL
function getImageBrightness(image, cb) {
  let img = document.createElement('img')
  img.src = image
  img.style.display = 'none'
  let colorSum = 0

  img.addEventListener('load', () => {
    // create canvas
    let canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height

    let ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)

    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    let data = imageData.data
    let red, green, blue, average

    for (let i = 0, len = data.length; i < len; i+=4) {
      red = data[i]
      green = data[i+1]
      blue = data[i+2]
      average = Math.floor((red+green+blue)/3)
      colorSum += average
    }

    let brightness = Math.floor(colorSum / (canvas.width*canvas.height))

    cb(brightness)
  })
}

// PLAY AND PAUSE SONG FUNCTIONS
const playSong = () => {
  playPause.classList.add('play')
  playPause.querySelector('i').classList.remove('fa-play')
  playPause.querySelector('i').classList.add('fa-pause')
  audio.play()
}

const pauseSong = () => {
  playPause.classList.remove('play')
  playPause.querySelector('i').classList.remove('fa-pause')
  playPause.querySelector('i').classList.add('fa-play')
  audio.pause()
}

// PREVIOUS AND SKIP SONG FUNCTIONS
const nextBtnAction = () => {
  songIndex === songs.length ? songIndex = 1 : songIndex++
  setSong(songIndex)
  playSong()
}

const prevBtnAction = () => {
  // replay song on previous btn click if song is still starting
  if (audio.currentTime > 8) {
    setSong(songIndex)
    playSong()
    return
  }
  songIndex === 1 ? songIndex = songs.length : songIndex--
  setSong(songIndex)
  playSong()
  
}

// UNIQUE CONSECUTIVE SONG INDEX GENERATOR
let lastNumber
const genRandNumber = () => {
  let randomNum = Math.floor(Math.random() * songs.length + 1)

  if (randomNum === lastNumber) {
    genRandNumber()
  }
  return randomNum
}

// SHUFFLE SONGS
const shuffleSong = () => {
  const shuffledIndex = genRandNumber()
  lastNumber = shuffledIndex
  if (shuffle.parentElement.classList.contains('clicked')) {
    songIndex = shuffledIndex
    setSong(songIndex)
    playSong()
  } else {
    nextBtnAction()
  }
}

// SHUFFLE OR REPEAT
const shuffleOrRepeat = () => {
  if (repeat.parentElement.classList.contains('clicked')) {
    setSong(songIndex)
    playSong()
  } else {
    shuffleSong()
  }
}

// EVENT LISTENERS
prev.addEventListener('click', prevBtnAction)
next.addEventListener('click', shuffleOrRepeat)
shuffle.addEventListener('click', () => {
  shuffle.parentElement.classList.toggle('clicked')
})
repeat.addEventListener('click', () => {
  repeat.parentElement.classList.toggle('clicked')
})
playBtn.addEventListener('click', () => {
  let isPlaying = playPause.classList.contains('play')
  isPlaying ? pauseSong() : playSong()
})

// PLAY NEXT SONG IF PREVIOUS SONG HAS ENDED
audio.addEventListener('ended', shuffleOrRepeat)

// UPDATE THE PROGRESS BAR WIDTH AS SONG PLAYS
audio.addEventListener('timeupdate', (e) => {
  const { currentTime, duration } = e.currentTarget
  const progress = (currentTime / duration) * 100
  document.querySelector('.progress-bar').style.width = `${progress}%`
})

// UPDATE THE SONG'S CURRENT TIME ON PROGRESS BAR CLICK
document.querySelector('.progress-bar__container').addEventListener('click', (e) =>{
  let rect = e.currentTarget.getBoundingClientRect().width
  let clickXPos = e.offsetX
  const duration = audio.duration
  audio.currentTime = (clickXPos / rect) * duration
})

// LOADER
window.addEventListener('load', () => {
  let state = document.readyState
  if (state === 'interactive') {
    main.style.visibility = 'hidden'
  } else if (state === 'complete') {
    setTimeout(() => {
      main.style.visibility = 'visible'
      document.body.style.visibility = 'visible'
      document.querySelector('.loader').style.visibility = 'hidden'
    }, 1000)
  }
  setSong(songIndex)
})

// LOCALSTORAGE
function storeLastSong(index) {
  localStorage.setItem('id', index)
}