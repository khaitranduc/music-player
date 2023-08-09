const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  songs: [
    { name: 'Sự Mập Mờ',
      singer: 'Suni Hạ Linh',
      path: './assets/music/SMM.mp3',
      img: './assets/img/sumapmo.jpg'
    },

    { name: 'Ngỏ Lời',
      singer: 'Suni Hạ Linh',
      path: './assets/music/NL.mp3',
      img: './assets/img/ngoloi.jpg'
    },

    { name: 'Không Sao Mà Em Đây Rồi',
     singer: 'Suni Hạ Linh',
     path: './assets/music/ksmedr.mp3',
     img: './assets/img/ksmedr.jpg'
    },
    { name: 'Out Of Time',
     singer: 'The Weekend',
     path: './assets/music/OutOfTime.mp3',
     img: './assets/img/OutOfTime.jpg'
    },
    { name: 'Anh Nhớ Ra',
     singer: 'Vũ',
     path: './assets/music/anhnhora.mp3',
     img: './assets/img/Anhnhora.png'
    },
    { name: 'Forget About Her',
     singer: 'Justatee x Touliver',
     path: './assets/music/forgetabouther.mp3',
     img: './assets/img/forgetabouther.jpg'
    },
    { name: 'Dear',
     singer: 'Gonzo ft Lê Hiếu',
     path: './assets/music/Dear.mp3',
     img: './assets/img/Dear.jpg'
    },
    { name: 'Đoạn Kết Mới',
    singer: 'Hoàng Dũng',
    path: './assets/music/Doanketmoi.mp3',
    img: './assets/img/doanketmoi.jpg'
   },
   { name: 'Vẫn Nhớ Cover',
    singer: 'Soobin',
    path: './assets/music/Vannho.mp3',
    img: './assets/img/vannho.jpg'
   },
   { name: 'Vệt Nắng Cuối Trời',
    singer: 'Bùi Anh Tuấn',
    path: './assets/music/Vetnangcuoitroi.mp3',
    img: './assets/img/buianhtuan.jpg'
   },
],
   render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
      <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
        <div class="thumb" style="background-image: url('${song.img}')">
        </div>
        <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div>
      </div>
      `
     
    })
    playlist.innerHTML = htmls.join('')

   },
   defineProperties: function() {
    Object.defineProperty(this, 'currentSong', {
      get: function () {
        return this.songs[this.currentIndex]
      }
    })
   },
   handleEvents: function () {
    const _this = this
    const cdWidth = cd.offsetWidth

    // xử lý cd rotation and pause 
    const cdThumbAnimate = cdThumb.animate([
      { transform: 'rotate(360deg)'}
    ], {
      duration: 20000,
      iterations: Infinity,
    })
    cdThumbAnimate.pause()
    //xử lý phóng to / thu nhỏ cd
    document.onscroll = function() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const newCdwidth = cdWidth - scrollTop

      cd.style.width = newCdwidth > 0 ? newCdwidth + 'px' : 0
      cd.style.opacity = newCdwidth / cdWidth
    }

    // xử lý khi ấn play
      
      playBtn.onclick = function() {
        if (_this.isPlaying) {
          audio.pause()
        } else {
          audio.play()
        }
      }

      // when song is playing 
      audio.onplay = function() {
        _this.isPlaying = true
        player.classList.add('playing')
        cdThumbAnimate.play()
      }

      // when song is paused
      audio.onpause = function() {
        _this.isPlaying = false
        player.classList.remove('playing')
        cdThumbAnimate.pause()
      }
      // when song time is changed
      audio.ontimeupdate = function() {
        if (audio.duration) {
          const progressPercent = Math.floor(audio.currentTime / audio.duration *100)
          progress.value = progressPercent 
        }
      }

      // xử lí rewind song
      progress.oninput = function() {
        const rewind = progress.value / 100 * audio.duration;
        audio.currentTime = rewind;
      };
      

      //next song
      nextBtn.onclick = function() {
        if (_this.isRandom) {
          _this.randomSong()
        } else {
          _this.nextSong()
        }
        audio.play();
        _this.render();
        _this.scrollToActiveSong();
      };

      // prev song
      prevBtn.onclick = function() {
        if (_this.isRandom) {
          _this.playRandomSong()
        } else {
          _this.prevSong()
        }
        audio.play();
        _this.render();
      };

      // random song 
      randomBtn.onclick = function(e) {
       _this.isRandom = !_this.isRandom
        randomBtn.classList.toggle('active', _this.isRandom)
      }

      // next when song is ended
      audio.onended = function() {
        if (_this.isRepeat) {
          audio.play()
        } else {
        nextBtn.click()
        }
      }
      // repeat song
      repeatBtn.onclick = function() {
        _this.isRepeat =!_this.isRepeat
        repeatBtn.classList.toggle('active', _this.isRepeat)
      }

      playlist.onclick = function(e) {

        const songNode = e.target.closest('.song:not(.active)')
        if (songNode || e.target.closest('.option') ) {

          if (songNode) {
            _this.currentIndex = Number(songNode.dataset.index)
            _this.loadCurrentSong()
            audio.play()
            _this.render()
          }

          if (e.target.closest('.option')) {

          }
        }
      }
   
      
   },

  
   scrollToActiveSong: function() {
    setTimeout(() => {
      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: "end",
        inline: "nearest"
      })
    },200)
    
   },
   loadCurrentSong: function() {
   

    heading.textContent = this.currentSong.name
    cdThumb.style.backgroundImage = `url(${this.currentSong.img})`
    audio.src = this.currentSong.path

   },
   nextSong: function() {
    this.currentIndex++
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0
    }
    this.loadCurrentSong()
   },
   prevSong: function() {
    this.currentIndex--
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.lenght -1
    }
    this.loadCurrentSong()
   },
   randomSong: function() {
    let newIndex 
    do {
      newIndex = Math.floor(Math.random() * this.songs.length)
    }
     while (newIndex === this.currentIndex)
    this.currentIndex = newIndex
    this.loadCurrentSong()
   },
   start: function () {
    //định nghĩa các thuộc tính cho Object
    this.defineProperties()

    // Lắng nghe / Xử lí các sự kiện (DOM events)
    this.handleEvents()

    // tải thông tin bài hát vào UI khi chạy ứng dụng
    this.loadCurrentSong()

    // Render playlist
    this.render()
   }
}

app.start()
