import React, { Component } from 'react';
import PropTypes from 'prop-types';

const bgImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUAQMAAAC3R49OAAAABlBMVEX5+fn///8pDrwNAAAAFElEQVQI12NgsP/AQAz+f4CBGAwAJIIdTTn0+w0AAAAASUVORK5CYII=';

class ImageDiff extends Component {
  constructor() {
    super();
    this.handleImgLoad = this.handleImgLoad.bind(this);
    this.getScaledDimensions = this.getScaledDimensions.bind(this);

    this.state = {
      naturalWidthBefore: null,
      naturalHeightBefore: null,
      naturalWidthAfter: null,
      naturalHeightAfter: null,
    };
  }

  getScaledDimensions() {
    const getDimensions = (maxHeight, maxWidth, naturalHeight, naturalWidth) => {
      const heightRatio = (typeof maxHeight !== 'undefined' && maxHeight !== null) ? (naturalHeight / maxHeight) : 1;
      const widthRatio = (typeof maxWidth !== 'undefined' && maxWidth !== null) ? (naturalWidth / maxWidth) : 1;

      // Use max to prevent scaling up the image
      let divisor = Math.max(1, widthRatio);
      if (widthRatio < heightRatio) {
        // fit to height
        divisor = Math.max(1, heightRatio);
      }

      return {
        width: naturalWidth / divisor,
        height: naturalHeight / divisor,
      };
    };

    const {
      naturalWidthBefore,
      naturalHeightBefore,
      naturalWidthAfter,
      naturalHeightAfter,
    } = this.state;
    const {
      width: maxWidth,
      height: maxHeight,
    } = this.props;

    let height = 0;
    let width = 0;
    let heightBefore = 0;
    let widthBefore = 0;
    let heightAfter = 0;
    let widthAfter = 0;

    if (naturalHeightBefore && naturalHeightAfter) {
      ({
        height: heightBefore,
        width: widthBefore,
      } = getDimensions(maxHeight, maxWidth, naturalHeightBefore, naturalWidthBefore));
      ({
        height: heightAfter,
        width: widthAfter,
      } = getDimensions(maxHeight, maxWidth, naturalHeightAfter, naturalWidthAfter));
      height = Math.max(heightBefore, heightAfter);
      width = Math.max(widthBefore, widthAfter);
    }

    return {
      height,
      width,
      heightBefore,
      widthBefore,
      heightAfter,
      widthAfter,
    };
  }

  handleImgLoad(e, type) {
    const { naturalHeight, naturalWidth } = e.target;
    this.setState({
      [`naturalHeight${type}`]: naturalHeight,
      [`naturalWidth${type}`]: naturalWidth,
    });
  }

  renderDifference(height, width) {
    const style = {
      position: 'relative',
    };
    const beforeStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      ...this.props.imageStyle,
    };
    const afterStyle = {
      ...beforeStyle,
      ...this.props.imageStyle,
    };

    return (
      <div className="ImageDiff_inner--difference" style={style}>
        <div className="ImageDiff__before" style={beforeStyle}>
          <img
            alt="Before"
            src={this.props.before}
            style={{
              maxHeight: height,
              maxWidth: width,
            }}
            onLoad={e => this.handleImgLoad(e, 'Before')}
          />
        </div>
        <div className="ImageDiff__after" style={afterStyle}>
          <img
            alt="After"
            src={this.props.after}
            style={{
              maxHeight: height,
              maxWidth: width,
              mixBlendMode: 'difference',
            }}
            onLoad={e => this.handleImgLoad(e, 'After')}
          />
        </div>
      </div>
    );
  }

  renderFade(height, width) {
    const style = {
      backgroundImage: `url(${bgImage})`,
      height,
      margin: 0,
      position: 'absolute',
      width,
      ...this.props.imageStyle,
    };

    const beforeStyle = {
      border: '1px solid #f77',
      ...style,
    };

    const afterStyle = {
      border: '1px solid #63c363',
      opacity: 1 - this.props.value,
      ...style,
    };

    return (
      <div className="ImageDiff__inner--fade" style={style}>
        <div className="ImageDiff__before" style={beforeStyle}>
          <img
            alt="Before"
            src={this.props.before}
            style={{
              maxHeight: height,
              maxWidth: width,
            }}
            onLoad={e => this.handleImgLoad(e, 'Before')}
          />
        </div>
        <div className="ImageDiff__after" style={afterStyle}>
          <img
            alt="After"
            src={this.props.after}
            style={{
              maxHeight: height,
              maxWidth: width,
            }}
            onLoad={e => this.handleImgLoad(e, 'After')}
          />
        </div>
      </div>
    );
  }

  renderSwipe(height, width) {
    const style = {
      backgroundImage: `url(${bgImage})`,
      height,
      margin: 0,
      position: 'absolute',
      width,
      ...this.props.imageStyle,
    };

    const beforeStyle = {
      border: '1px solid #f77',
      ...style,
    };

    const afterStyle = {
      border: '1px solid #63c363',
      right: 0,
      ...style,
    };

    const swiperStyle = {
      borderLeft: '1px solid #999',
      height: height + 2,
      margin: 0,
      overflow: 'hidden',
      position: 'absolute',
      right: -2,
      width: width * (1 - this.props.value),
    };

    return (
      <div className="ImageDiff__inner--swipe" style={style}>
        <div className="ImageDiff__before" style={beforeStyle}>
          <img
            alt="Before"
            src={this.props.before}
            style={{
              maxHeight: height,
              maxWidth: width,
            }}
            onLoad={e => this.handleImgLoad(e, 'Before')}
          />
        </div>
        <div className="ImageDiff--swiper" style={swiperStyle}>
          <div className="ImageDiff__after" style={afterStyle}>
            <img
              alt="After"
              src={this.props.after}
              style={{
                maxHeight: height,
                maxWidth: width,
              }}
              onLoad={e => this.handleImgLoad(e, 'After')}
            />
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {
      height,
      width,
    } = this.getScaledDimensions();
    const {
      width: _width,           // not used
      height: _height,         // not used
      after: _after,           // not used
      before: _before,         // not used
      type: _type,             // not used
      value: _value,           // not used
      imageStyle: _imageStyle, // not used
      style,
      ...otherProps
    } = this.props;
    return (
      <div
        className="ImageDiff"
        style={{
          display: 'inline-block',
          position: 'relative',
          height,
          width,
          ...style,
        }}
        {...otherProps}
      >
        {this.props.type === 'difference' ? this.renderDifference(height, width) : null}
        {this.props.type === 'fade' ? this.renderFade(height, width) : null}
        {this.props.type === 'swipe' ? this.renderSwipe(height, width) : null}
      </div>
    );
  }
}

ImageDiff.propTypes = {
  after: PropTypes.string.isRequired,
  before: PropTypes.string.isRequired,
  height: PropTypes.number,
  type: PropTypes.string.isRequired,
  value: PropTypes.number,
  width: PropTypes.number,
  style: PropTypes.shape({}),
  imageStyle: PropTypes.shape({}),
};

ImageDiff.defaultProps = {
  value: 1,
  height: null,
  width: null,
  style: {},
  imageStyle: {},
};

module.exports = ImageDiff;
