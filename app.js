// extract song metadata
const jsmediatags = window.jsmediatags

const main = document.querySelector('.musicplayer__wrapper')
const bgImage = document.querySelector('.bg-image')
const prev = document.querySelector('.prev')
const next = document.querySelector('.next')
const playPause = document.querySelector('.play-pause')
const playBtn = document.querySelector('.play-btn')
const audio = document.querySelector('.audio')
const artist = document.querySelector('.artist')
const songTitle = document.querySelector('.song--title')
const songImageContainer = document.querySelector('.song__img--container')

// GLOBAL INDEX TO KEEP TRACK OF CURRENT SONG
let songIndex = localStorage.getItem('id') ? localStorage.getItem('id') : 1

// SONGS ARRAY
const songs = [
  './songs/2become1.mp3',
  './songs/amazing.mp3',
  './songs/close.mp3',
  './songs/dreams-come-true.mp3',
  './songs/heal.mp3',
  './songs/i-wanna-grow-old-with-you.mp3',
  './songs/imaginary-diva.mp3',
  './songs/in-this-life.mp3',
  './songs/is-there-someone-else.mp3',
  './songs/its-you.mp3',
  './songs/juice.mp3',
  './songs/just-cant-get-enough.mp3',
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
  './songs/rolling-stone.mp3',
  './songs/shes-back.mp3',
  './songs/thats-where-you-find-love.mp3',
  './songs/the-hills.mp3',
  './songs/the-night-is-still-young.mp3',
  './songs/to-be-loved.mp3',
]

// GETS SONG THUMBNAIL AND SONG FILE
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
      songImageContainer.style.backgroundImage = `url(data:${pictureFormat};base64,${window.btoa(base64String)})`
      bgImage.style.backgroundImage = `url(data:${pictureFormat};base64,${window.btoa(base64String)})`
    }
  })
  // save last song played to localStorage
  storeLastSong(index)
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
  songIndex === 1 ? songIndex = songs.length : songIndex--
  setSong(songIndex)
  playSong()
}

// EVENT LISTENERS
prev.addEventListener('click', prevBtnAction)
next.addEventListener('click', nextBtnAction)
playBtn.addEventListener('click', () => {
  let isPlaying = playPause.classList.contains('play')
  if (isPlaying) {
    pauseSong()
  } else {
    playSong()
  }
})

// PLAY NEXT SONG IF PREVIOUS SONG HAS ENDED
audio.addEventListener('ended', nextBtnAction)

// UPDATE THE PROGRESS BAR AS SONG PLAYS
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
      document.querySelector('.loader').style.visibility = 'hidden'
    }, 1000)
  }
  setSong(songIndex)
})

// LOCALSTORAGE
function storeLastSong(index) {
  localStorage.setItem('id', index)
}