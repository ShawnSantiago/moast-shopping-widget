import 'vite/modulepreload-polyfill';
import profiles from '../data/profile.json';
import { register } from 'swiper/element/bundle'// import Swiper JS
import { animate, glide, spring } from 'motion';
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

                const slideUp = document.createElement('moast-slide-up');
                slideUp.setAttribute('profile-image', profile.member.avatars[0].url);
                slideUp.setAttribute('name', profile.member.firstName);

                slide.appendChild(img);
                slide.appendChild(slideUp);


                return slide
            })
            const swiperContainer = document.createElement('swiper-container');

            swiperContainer.innerHTML = ` ${slides.map((slide) => slide.outerHTML).join('')}`
            swiperContainer.setAttribute('touch-start-prevent-default', 'false')
            this.shadowRoot.appendChild(swiperContainer);
        }

    }

    customElements.define('moast-slider', MoastSlider);
}
if (customElements.get('moast-slide-up') === undefined) {
    class MoastSlideUP extends HTMLElement {
        constructor() {
            super();
            this.lastPoint = { x: null, y: null };
            this.leftOrRight = '';
            this.upOrDown = '';
            this.addEventListener('message-success', (e) => {
                const item = this.renderSucccessAlert();
                this.append(item);
                animate(
                    item,
                    { opacity: [0, 1] },

                ).finished
                    .then(() => {
                        setTimeout(() => {
                            animate(
                                item,
                                { opacity: [1, 0] },

                            ).finished
                                .then(() => {
                                    this.querySelector('.message_success').remove();
                                })
                        }, 3000)
                    })

            })

        }
        renderSucccessAlert() {
            const message = document.createElement('div');
            message.classList.add('message_success');
            message.style.opacity = 0
            message.innerHTML = `
            <div>
                <p>Message sent successfully</p>
            </div>
            `
            return message
        }

        render() {
            return `
            <div class="container">
                <div class="header">
                    <div class="profile_image"> 
                        <img src="${this.getAttribute('profile-image')}"/>
                    </div>
                    <p class="title">Send ${this.getAttribute('name')} a message</p>
                </div>
                <div class="content">
                 <form>
                    <input type="text" placeholder="Your Name" required />
                    <input type="email" placeholder="name@example.com" required />
                 </form>
                 <p class="disclaimer">By submitting this form you agree to our <a href="#">Terms and Conditions</a></p>
                </div>
                <div class="footer"> 
                <div class="button">
                    <input type="text" placeholder="Write your message..." class="message" required/>
                    <button type="submit" class="send"><svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M24.3721 5.72554C24.2016 5.43128 23.8864 5.25 23.5455 5.25H4.45457C4.07667 5.25 3.73435 5.47213 3.58154 5.81649C3.42873 6.16086 3.4942 6.56262 3.74851 6.84113L8.73123 12.298C8.99518 12.5871 9.40975 12.6858 9.77646 12.547L16.6966 9.92626C16.7772 9.89581 16.8137 9.90841 16.8296 9.91471C16.8575 9.92574 16.8975 9.95444 16.9288 10.0074C16.9602 10.0603 16.9661 10.1091 16.9623 10.1387C16.9602 10.1557 16.9536 10.1937 16.8879 10.2491L11.2062 15.0508C10.9134 15.2982 10.7979 15.6965 10.913 16.0614L13.0894 22.9591C13.203 23.319 13.5193 23.578 13.8957 23.6193C14.272 23.6605 14.6374 23.4762 14.8267 23.1494L24.3721 6.67664C24.5426 6.38237 24.5426 6.01982 24.3721 5.72554Z" fill="#B0B0B3"/>
                    </svg>
                    </button>
                </div>
            </div>
            `
        }

        connectedCallback() {
            this.innerHTML = this.render();
            const form = this.querySelector('form');
            const message = this.querySelector('.message');
            const inputs = this.querySelectorAll('input');

            Array.from([...inputs, message]).forEach((input) => {
                input.addEventListener('input', (e) => {
                    if (input.checkValidity() == false) {
                        input.setAttribute('aria-invalid', 'true');
                    } else {
                        input.removeAttribute('aria-invalid');
                    }
                })
            })

            this.querySelector('.send').addEventListener('click', (e) => {
                e.preventDefault();
                form.reportValidity();
                message.reportValidity();
                Array.from([...inputs, message]).forEach((input) => {
                    if (input.checkValidity() == false) {
                        input.setAttribute('aria-invalid', 'true');
                    }
                })
                if (message.checkValidity() && form.checkValidity()) {
                    this.dispatchEvent(new CustomEvent('message-success', { detail: { message: message.value } }));
                }

            })

            window.addEventListener('mousemove', e => {
                const leftOrRight = (
                    e.clientX > this.lastPoint.x ? 'right'
                        : e.clientX < this.lastPoint.x ? 'left'
                            : 'none'
                )
                const upOrDown = (
                    e.clientY > this.lastPoint.y ? 'down'
                        : e.clientY < this.lastPoint.y ? 'up'
                            : 'none'
                )
                this.lastPoint.x = e.clientX
                this.lastPoint.y = e.clientY
                this.leftOrRight = leftOrRight
                this.upOrDown = upOrDown

            })

            this.querySelector('.header').addEventListener("mousedown", (e) => {
                console.log(this.leftOrRight, this.upOrDown);
                if (!this.classList.contains('expanded')) {
                    animate(
                        this,
                        { minHeight: "100%" },
                        { easing: 'ease-in-out' }
                    ).finished
                        .then(() => {
                            this.classList.add('expanded');
                        })
                } else {
                    animate(
                        this,
                        { minHeight: "50%" },
                        { easing: 'ease-in-out' }
                    ).finished
                        .then(() => {
                            this.classList.remove('expanded');
                        })
                }

            })

        }
    }
    customElements.define('moast-slide-up', MoastSlideUP);
}
