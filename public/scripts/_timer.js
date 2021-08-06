import { selectOne} from './_functions'

export default function timer(selector, time) {
   try {
      const timerDisplayElement = selectOne(selector)

      function addZero(number) {
         if (number < 10) return `0${number}`
         return number
      }

      let totalTime = time > 0 ? time : 0

      const timerInterval = setInterval(() => {
         totalTime = totalTime - 1
         let seconds = totalTime % 60, minutes = Math.floor(totalTime / 60)

         if (totalTime < 0) {
            clearInterval(timerInterval)
            seconds = minutes = 0
         }

         timerDisplayElement.textContent = `${addZero(minutes)}:${addZero(seconds)}`
      }, 1000)
   } catch (e) {
      
   }
}