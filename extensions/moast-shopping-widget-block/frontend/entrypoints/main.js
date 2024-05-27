import 'vite/modulepreload-polyfill';
import profiles from '../data/profile.json';
import { register } from 'swiper/element/bundle'// import Swiper JS
import Swiper from 'swiper';
// import Swiper styles
import 'swiper/css';
register();

if (customElements.get('moast-slider') == undefined) {
    class MoastSlider extends HTMLElement {
        constructor() {
            super();

        }
        connectedCallback() {
            const slides = profiles.profiles.map((profile) => {
                const slide = document.createElement('swiper-slide');
                slide.classList.add('swiper-slide');
                const img = document.createElement('img');
                img.src = profile.member.avatars[0].url;
                img.style.maxWidth = '100%';
                img.style.maxHeight = '100%';
                slide.appendChild(img);

                return slide
            })
            const swiperContainer = document.createElement('swiper-container');

            swiperContainer.innerHTML = ` ${slides.map((slide) => slide.outerHTML).join('')}`

            this.shadowRoot.appendChild(swiperContainer);
        }

    }

    customElements.define('moast-slider', MoastSlider);
}
if (customElements.get('moast-profile') === undefined) {
    class MoastProfile extends HTMLElement {
        constructor() {
            super();

        }
        render() {
            return `
            <div>
            
            </div>
            `
        }
        connectedCallback() {
            this.innerHTML = this.render();
        }
    }
    customElements.define('moast-profile', MoastProfile);
}
