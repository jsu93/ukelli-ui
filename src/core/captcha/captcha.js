import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import { Call } from 'basic-helper';

import Input from '../form-control/input';

export default class CAPTCHA extends Component {
  static propTypes = {
    onError: PropTypes.func,
    onChange: PropTypes.func,
    onCaptchaLoad: PropTypes.func,
    onBlur: PropTypes.func,
    value: PropTypes.string,
    icon: PropTypes.string,
    limit: PropTypes.number,
    scale: PropTypes.string,
  };
  constructor(props) {
    super(props);
    this.state = {
      captchaImg: '',
      captchaValue: '',
      loading: false,
    };
    this.isControl = props.hasOwnProperty('value');
    this.captchaLength = props.limit || 4;
    this.isPass = false;
    this.value = props.value;
    this.captchaKey = '';
    this.refreshTime = 0;
  }
  componentDidMount() {
    this.getCaptcha();
  }
  select() {
    this.captchaInput.select();
  }
  getCaptcha(props) {
    props = props || this.props;
    this.refreshTime = Date.now();
    const {onError} = props;

    this.setState({
      loading: true
    });

    if(window.$UKE.queryCAPTCHAData) {
      window.$UKE.queryCAPTCHAData(options => {
        if (this.__unmount) return;
        const {hasErr, captchaImage, captchaKey} = options;
        if(hasErr) {
          this.clearTimeout();
          this.getCaptchaTimer = setTimeout(() => {
            this.refreshCaptcha();
          }, 1000);
        } else {
          this.setState({
            loading: false,
            captchaImg: captchaImage
          });
          this.captchaKey = captchaKey;
          this.props.onCaptchaLoad && this.props.onCaptchaLoad();
        }
      });
    }
  }
  componentWillUnmount() {
    this.__unmount = true;
    this.clearTimeout()
  }
  clearTimeout() {
    this.getCaptchaTimer && clearTimeout(this.getCaptchaTimer);
  }
  shouldRefreshCaptcha(should = false) {
    let clickTime = Date.now();
    if(should || clickTime - this.refreshTime > 1 * 60 * 1000) {
      this.getCaptcha();
    }
    this.select();
  }
  refreshCaptcha() {
    this.shouldRefreshCaptcha(true);
  }
  changeCaptcha(val) {
    const {onChange} = this.props;
    let _val = val.length > this.captchaLength ? val.slice(0, this.captchaLength) : val;
    if(val.length === this.captchaLength) this.isPass = true;
    if(!this.isControl) {
      this.setState({
        captchaValue: _val
      });
    }
    this.value = _val;
    Call(onChange, {
      isPass: this.isPass,
      value: _val,
      key: this.captchaKey,
      // forUsername: this.forUsername
    });
  }
  focus() {
    this.captchaInput.focus();
  }
  render() {
    let gm = window.$UKE.getUkeKeyMap;
    const {captchaImg, captchaValue, loading} = this.state;
    const {value = '', icon = 'security'} = this.props;
    const _captchaValue = this.isControl ? value : captchaValue;

    let hasCap = !!captchaImg;
    let loadingTip = null;
    let captchaImgElem = hasCap && !loading ? (
      <img
        src={captchaImg}
        alt=""
        className="cover-image"/>
    ) : null;
    if(!hasCap) {
      loadingTip = gm('验证码');
    }
    if(loading) {
      loadingTip = gm('刷新中');
    }

    return (
      <div className="captcha-group">
        <Input
          ref={e => this.captchaInput = e}
          icon={icon}
          type="number"
          className="form-control captcha-input"
          value={_captchaValue}
          onFocus={e => this.shouldRefreshCaptcha()}
          onChange={val => this.changeCaptcha(val)}
          placeholder={gm("验证码")}>
          <div className="captcha"
            onClick={e => {
              this.getCaptcha();
            }}>
            <div
              className={"text-center captcha-tip" + (!loading && hasCap ? ' hide' : '')}>
              {loadingTip}
            </div>
            {captchaImgElem}
          </div>
        </Input>
      </div>
    );
  // <input
  //   type="text"
  //   className={"form-control captcha-input input-" + scale}
  //   ref="captchaInput"
  //   value={_captchaValue}
  //   onFocus={e => this.shouldRefreshCaptcha()}
  //   onChange={e => this.changeCaptcha(e.target.value)}
  //   placeholder="验证码"/>
  }
}
