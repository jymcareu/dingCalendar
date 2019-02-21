/**
 * hls 播放器
 * 需引入 video.js 也可npm安装
 * 基本参数如下
 *   width: 650,
 *   height: 500,
 *   autoplay: true,
 *   controls: false,
 *   sources: [{src: 'https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8', type: 'application/x-mpegURL'}],
 *   poster:picUrl || pathUrl('images/map/nopic.jpg'),
 */

import {Component} from 'react';

class VideoPlayer extends Component {


  componentWillReceiveProps(props){

  }
  componentDidMount () {
    this.player = videojs(this.videoNode, this.props, function onPlayerReady () {
    });
  }
  componentWillUnmount () {
    if (this.player) {
      this.player.dispose();
    }
  }

  render () {
    return (
      <div style={{width: this.props.width, height: this.props.height}}>
        <video
          ref={node => this.videoNode = node}
          className="video-js vjs-default-skin vjs-big-play-centered"
          style={{width: "100%", height: "100%"}}
          controls>
        </video>
      </div>
    );
  }
}
export default VideoPlayer;
