import { Slide } from 'react-slideshow-image';

import 'react-slideshow-image/dist/styles.css';
import styles from './ProductSlideShow.module.css';

interface Props {
  images: string[];
}

export const ProductSlideshow: React.FC<Props> = ({ images }) => {
  return (
    <Slide easing='ease' duration={3000} indicators>
      {images.map(img => {
        const url = `/products/${img}`;

        return (
          <div className={styles['each-slide']} key={img}>
            <div
              style={{
                backgroundImage: `url(${url})`,
                backgroundSize: 'cover',
              }}
            ></div>
          </div>
        );
      })}
    </Slide>
  );
};
