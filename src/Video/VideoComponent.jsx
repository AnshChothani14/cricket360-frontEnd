import React, { Component } from 'react';
import video from '../logo_Animation.mp4';
import './video.css';

class VideoComponent extends Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
    this.state = { videoEnded: false };
  }

  componentDidMount() {
    if (this.videoRef.current) {
      this.videoRef.current.muted = true;
      this.videoRef.current.play();
      this.videoRef.current.addEventListener('ended', this.handleVideoEnd);
    }
  }

  componentWillUnmount() {
    if (this.videoRef.current) {
      this.videoRef.current.removeEventListener('ended', this.handleVideoEnd);
    }
  }

  handleVideoEnd = () => {
    setTimeout(() => {
      this.setState({ videoEnded: true });
      this.props.onVideoEnd(); // Notify parent component
    }, 10);
  };

  handleSkip = () => {
    if (this.videoRef.current) {
      this.videoRef.current.pause();
      this.setState({ videoEnded: true });
      this.props.onVideoEnd(); // Notify parent component
    }
  };

  render() {
    return (
      <div className={`video-container ${this.state.videoEnded ? 'hide' : ''}`}>
        <video ref={this.videoRef} className={`fullscreen-video ${this.state.videoEnded ? 'fadeOut' : ''}`} width="100%" height="50%">
          <source src={video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

      </div>
    );
  }
}

export default VideoComponent;

