import 'vite/modulepreload-polyfill'
import './main.scss'

console.log('hello world');
if (customElements.get('swiper-slide') !== undefined) {
    console.log('SwiperSlide is already defined');
    const SwiperSlide = customElements.get('swiper-slide');
    console.log(SwiperSlide);
    class MoastSlide extends SwiperSlide {
        constructor() {
            super();
            this.addEventListener('click', (event) => {
                console.log(event);
            });
        }
    }
    console.log('MoastSlide', MoastSlide);
    customElements.define('moast-slide', MoastSlide);
}