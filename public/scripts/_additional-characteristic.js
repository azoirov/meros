import {selectOne, selectAll} from './_functions'

export default function () {
   try {
      const additionalCharacteristic = selectOne('.additional-characteristic'),
         additionalCharacterBtn = selectOne('.additional-characteristic-btn')

      function additionalCharacterFields(index) {
         let rowElement = document.createElement('div')
         rowElement.classList.add('row', 'mb-3')
         rowElement.innerHTML = `
            <div class="col-md-3">
                New characteristic <b>(UZ)</b>
                <input class="form-control mb-2" type="text" placeholder="Character name" name="character-name-uz-${index}">
                <input class="form-control" type="text" placeholder="Character value" name="character-value-uz-${index}">
            </div>
            <div class="col-md-3">
                New characteristic <b>(RU)</b>
                <input class="form-control mb-2" type="text" placeholder="Character name" name="character-name-ru-${index}">
                <input class="form-control" type="text" placeholder="Character value" name="character-value-ru-${index}">
            </div>
            <div class="col-md-3">
                New characteristic <b>(EN)</b>
                <input class="form-control mb-2" type="text" placeholder="Character name" name="character-name-en-${index}">
                <input class="form-control" type="text" placeholder="Character value" name="character-value-en-${index}">
            </div>
            <div class="col-md-1 pt-3">
                <button class="btn btn-danger remove-btn" type="button"><i class="fa fa-trash"></i></button>
            </div>
         `
         additionalCharacteristic.append(rowElement)
         let removeBtns = selectAll('.remove-btn')
         removeBtnsListen(removeBtns)
      }

      let index = 0
      additionalCharacterBtn.addEventListener('click', () => {
         additionalCharacterFields(index)
         index++
      })

      function removeBtnsListen(array) {
         array.forEach(el => {
            el.addEventListener('click', e => {
               e.currentTarget.parentElement.parentElement.remove()
            })
         })
      }
   } catch (e) {

   }
}