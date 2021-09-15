import React, {useCallback, useState} from "react";
import PropTypes from "prop-types";
import {PlusOutlined} from "@ant-design/icons";

const PostImages = ({ images }) => {
  const [showImagesZoom, setShowImagesZoom] = useState(false);
  
  const onZoom = useCallback(() => {
    setShowImagesZoom(true);
  }, []);
  
  if (images.length === 1) {
    return (
      <>
        {/* 스크린 리더에서 굳이 클릭할 필요가 없는 경우 role="presentation" 기입 */}
        <img role="presentation" src={images[0].src} alt={images[0].src} onClick={onZoom} />
      </>
    );
  } else if (images.length === 2) {
    return (
      <>
        {/* 스크린 리더에서 굳이 클릭할 필요가 없는 경우 role="presentation" 기입 */}
        <img role="presentation" style={{ width: "50%", display: 'inline-block' }} src={images[0].src} alt={images[0].src} onClick={onZoom} />
        <img role="presentation" style={{ width: "50%", display: 'inline-block' }} src={images[1].src} alt={images[1].src} onClick={onZoom} />
      </>
    );
  } else {  // 이미지가 세 개 이상이면 더보기
    return (
      <div>
        <img role="presentation" style={{ width: "50%", display: 'inline-block' }} src={images[0].src} alt={images[0].src} onClick={onZoom} />
        <div
          role="presentation"
          style={{ display: 'inline-block', width: '50%', textAlign: 'center', verticalAlign: 'middle' }}
          onClick={onZoom}
        >
          <PlusOutlined />
          <br />
          {images.length - 1}
          개의 사진 더보기
        </div>
      </div>
    );
  }
};

PostImages.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object),
};

export default PostImages;