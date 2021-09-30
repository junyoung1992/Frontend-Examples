import React, { useEffect, useState } from 'react';
import Slick from 'react-slick';
import PropTypes from 'prop-types';

import { CloseBtn, Global, Header, ImageWrapper, Indicator, Overlay, SlickWrapper } from './styles';

const ImagesZoom = ({ images, onClose }) => {
  // 컴포넌트가 렌더릴될 떄마다 실행
  useEffect(() => {
    const escKeyClose = (e) => {
      if (e.keyCode === 27) onClose();
    };

    window.addEventListener('keyup', escKeyClose);

    return (() => {
      window.removeEventListener('keyup', escKeyClose);
    });
  }, []);

  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <Overlay>
      <Global />
      <Header>
        <h1>상세 이미지</h1>
        <CloseBtn onClick={onClose}>X</CloseBtn>
      </Header>
      <div>
        <div>
          <SlickWrapper>
            <div>
              <Slick
                initialSlide={0}
                afterChange={(slide) => setCurrentSlide(slide)}
                infinite
                arrows={false}
                slidesToShow={1}
                slidesToScroll={1}
              >
                {images.map((v) => (
                  <ImageWrapper key={v.src}>
                    <img src={`http://localhost:3065/${v.src}`} alt={v.src} />
                  </ImageWrapper>
                ))}
              </Slick>
              <Indicator>
                <div>
                  {currentSlide + 1}
                  {' '}
                  /
                  {images.length}
                </div>
              </Indicator>
            </div>
          </SlickWrapper>
        </div>
      </div>
    </Overlay>
  );
};

ImagesZoom.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ImagesZoom;
