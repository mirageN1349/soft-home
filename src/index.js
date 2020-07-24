import './scss/index.scss'
import { Like } from './components/like/Like'
import { localStorageHelper } from './core/localStorage'
import './components/burger/burger'

const storage = localStorageHelper()

document.addEventListener('DOMContentLoaded', () => {
  const input = document.querySelector('.header-input'),
    hide = document.querySelectorAll('.hide'),
    likeArr = document.querySelectorAll('.program-like')

  likeArr.forEach(like => {
    likeClick(like, false)()
    like.addEventListener('click', likeClick(like, true))
  })

  if (document.documentElement.clientWidth <= 768) {
    hide.forEach(el => (el.style.display = 'none'))

    input.addEventListener('click', inputClick)

    function inputClick() {
      input.value = ''
      input.classList.toggle('active')
    }
  }

  function likeClick(like, check) {
    const programs = ['skype', 'whatsapp', 'zoom']
    return function () {
      programs.forEach(program => {
        const currentLike = like.closest(`.${program}`)
        if (currentLike) {
          const softName = currentLike.classList[1]
          getRequest(softName, check, program, like)
        }
      })
    }
  }

  function getRequest(softName, check, program, currentLike) {
    fetch(`https://soft-zilla.firebaseio.com/${softName}.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(res => {
        const prevLikeState = storage.getItem(program) || false
        prevLikeState
          ? currentLike.classList.add('active')
          : currentLike.classList.remove('active')

        let counter = res.counter || 0

        if (check) {
          storage.setItem(program, prevLikeState)

          if (prevLikeState === false) {
            currentLike.classList.add('active')
            counter = res.counter + 1
            storage.setItem(program, true)
          } else {
            currentLike.classList.remove('active')
            counter = res.counter - 1
            storage.setItem(program, false)
          }
        }

        const text = {
          counter,
          softName,
        }
        putRequest(text, softName)
      })
  }

  function putRequest(text, softName) {
    Like.create(text, softName).then(() => {
      console.log('finish')
    })
  }
})
