import Slider from "react-slick";
import CarouselComponent from './CarouselComponent';
import './Carousel.css'   // added import for custom slick styles

// import image files so bundler resolves them
import hostel1 from '../assets/hostel.png'
import hostel2 from '../assets/hostel2.png'
import hostel3 from '../assets/hostel3.png'

const slides = [
  { id: 1, image: hostel1, title: 'Premium rooms' },
  { id: 2, image: hostel2, title: 'Comfortable lounges' },
  { id: 3, image: hostel3, title: 'Secure living' },
]

const Carousel = () => {
  const settings = { dots: true, infinite: true, speed: 500, slidesToShow: 1, slidesToScroll: 1 }
  return (
    <div className="slider-container mx-auto">
      <Slider {...settings}>
        {slides.map((slide) => (
          <CarouselComponent key={slide.id} image={slide.image} title={slide.title} />
        ))}
      </Slider>
    </div>
  )
};

export default Carousel;
