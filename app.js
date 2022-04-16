const main = document.querySelector('.musicplayer__wrapper')
const loader = document.querySelector('.loader')
const prev = document.querySelector('.prev')
const next = document.querySelector('.next')
const playPause = document.querySelector('.play-pause')
const playBtn = document.querySelector('.play-btn')
const audio = document.querySelector('.audio')
const artist = document.querySelector('.artist')
const songTitle = document.querySelector('.song--title')
const songImageContainer = document.querySelector('.song__img--container')
// global index
let songIndex = 1
let isPlaying

const songs = [
  {img: './songs/images/perfect-illusion.jpg', songName: 'Perfect illusion', songFile: './songs/files/perfect-illusion.mp3', artist: 'Lady gaga'},
  {img: './songs/images/2become1.jpg', songName: '2 become 1', songFile: './songs/files/2become1.mp3', artist: 'Spice girls'},
  {img: './songs/images/Anti.png', songName: 'Desperado', songFile: './songs/files/Desperado.mp3', artist: 'Rihanna'},
  {img: './songs/images/diamonds.jpg', songName: 'Diamond', songFile: './songs/files/diamond.mp3', artist: 'Rihanna'},
  {img: './songs/images/only-girl.png', songName: 'Only girl(in the world)', songFile: './songs/files/only-girl.mp3', artist: 'Rihanna'}
]

songs.forEach(song => {
  let image = document.createElement('img')
  image.src = song.img
  image.classList.add('song__img')
  songImageContainer.appendChild(image)
})

const setSong = (index) => {
  // song thumbnails
  let prevSongImage = songImageContainer.querySelector('[data-played]')
  songImageContainer.children[index - 1].dataset.played = true
  prevSongImage && delete prevSongImage.dataset.played

  // song audio files
  let currSong = songs[index - 1].songFile
  audio.src = currSong
  // artist info
  artist.innerHTML = songs[index - 1].artist
  songTitle.innerHTML = songs[index - 1].songName
  
}

function isSongPlaying () {
  isPlaying = playPause.classList.contains('play')
  if (!isPlaying) {
    playSong()
  } else {
    pauseSong()
  }
}

function playSong() {
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


prev.addEventListener('click', () => { prevBtnAction() })
next.addEventListener('click', () => { nextBtnAction() })
playBtn.addEventListener('click', () => {
  isSongPlaying()  
})

window.addEventListener('load', () => {
  let state = document.readyState

  if (state === 'interactive') {
      console.log(state)

    main.style.visibility = 'hidden'
  } else if (state === 'complete') {
    setTimeout(() => {
      main.style.visibility = 'visible'
      loader.style.visibility = 'hidden'
    }, 1000)
  }
  setSong(songIndex)
})