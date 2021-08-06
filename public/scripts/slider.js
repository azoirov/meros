'use strict'

document.addEventListener('DOMContentLoaded', function () {
   try {
      new Splide('.banner__slider', {
         type: 'loop',
         speed: 400,
         autoplay: true,
         arrows: false,
         interval: 5000,
         pauseOnHover: true,
         pauseOnFocus: true
      }).mount()
   } catch (e) {
   }
   try {
      new Splide('.popular-categories__slider', {
         type: 'loop',
         speed: 400,
         autoplay: true,
         arrows: true,
         interval: 2000,
         pauseOnHover: true,
         pauseOnFocus: true,
         perPage: 5,
         perMove: 1,
         gap: '30px',
         pagination: false,
         breakpoints: {
            '1400': {
               perPage: 5,
               width: '100%',
               gap: '20px',
            },
            '1343': {
               perPage: 4,
               width: '100%',
               gap: '20px',
            },
            '1020': {
               perPage: 3,
               width: '100%',
               gap: '20px',
            },
            '785': {
               perPage: 2,
               width: '100%',
               gap: '20px',
            },
            '400': {
               perPage: 1,
               width: '100%',
               gap: '0',
            },
         }
      }).mount()
   } catch (e) {
   }
   try {
      new Splide('.popular-authors__slider', {
         type: 'loop',
         speed: 400,
         autoplay: true,
         arrows: true,
         interval: 2000,
         pauseOnHover: true,
         pauseOnFocus: true,
         perPage: 6,
         perMove: 1,
         gap: '72px',
         pagination: false,
         breakpoints: {
            '1400': {
               perPage: 5,
               width: '100%',
               gap: '20px'
            },
            '1343': {
               perPage: 4,
               width: '100%',
               gap: '20px'
            },
            '1020': {
               perPage: 3,
               width: '100%',
               gap: '15px'
            }
         }
      }).mount()
   } catch (e) {
   }
   try {
      new Splide('.recommends-for-you__slider', {
         type: 'loop',
         speed: 400,
         autoplay: true,
         arrows: true,
         interval: 2000,
         pauseOnHover: true,
         pauseOnFocus: true,
         perPage: 5,
         perMove: 1,
         gap: '30px',
         pagination: false,
         breakpoints: {
            '1300': {
               perPage: 4,
               width: '100%',
               gap: '20px',
            },
            '1060': {
               perPage: 3,
               width: '100%',
               gap: '20px',
            },
            '800': {
               perPage: 2,
               width: '100%',
               gap: '20px',
            }
         }
      }).mount()
   } catch (e) {
   }
   try {
      new Splide('.brands__slider', {
         type: 'loop',
         speed: 400,
         autoplay: true,
         arrows: true,
         interval: 2000,
         pauseOnHover: true,
         pauseOnFocus: true,
         perPage: 6,
         perMove: 1,
         gap: '40px',
         pagination: false,
         breakpoints: {
            '1300': {
               perPage: 4,
               width: '100%',
               gap: '30px',
            },
            '900': {
               perPage: 3,
               width: '100%',
               gap: '40px',
            },
            '500': {
               perPage: 2,
               width: '100%',
               gap: '40px',
            },
         }
      }).mount()
   } catch (e) {
   }
})