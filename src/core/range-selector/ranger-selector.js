import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import { ToFixed, HasValue } from 'basic-helper';

import InputVerify from '../form-control/input-verify';

/**
 * 拖动的选择控件
 *
 * @export
 * @class Ranger
 * @extends {Component}
 */
export default class Ranger extends Component {
  static propTypes = {
    /** 值改变的回调 */
    onChange: PropTypes.func.isRequired,
    /** 默认值 */
    defaultValue: PropTypes.number,
    /** 基础的单位 */
    basicUnit: PropTypes.number,
    /** 是否禁用 */
    disabled: PropTypes.bool,
    /** 是否百分比显示 */
    precent: PropTypes.bool,
    /** 是否带有输入框 */
    withInput: PropTypes.bool,
    /** 范围 */
    range: PropTypes.arrayOf(PropTypes.number)
  };
  static defaultProps = {
    basicUnit: 1,
    disabled: false,
    precent: false,
    withInput: true,
    range: [0, 10]
  }
  handleWidth = 20;
  constructor(props) {
    super(props);

    this.isControl = props.hasOwnProperty('value');

    const defaultValue = props.defaultValue || 0;
    const { range } = props;
    let [min, max] = range;
    let isRevert = min > max;
    if(isRevert) [max, min] = [min, max];
    this.isRevert = isRevert;

    this.max = max;
    this.min = min;

    let defaultPosition = this.valToPercent(defaultValue);
    this.originalOffsetPercent = defaultPosition;
    this.offsetPercent = defaultPosition;

    this.state = {
      stateValue: defaultValue,
      draping: false
    };
    this.value = defaultValue;
    this.drapElemInfo = {
      dragOriginX: 0,
      elemOrigonX: 0
    };
  }
  shouldUpdateComponent(nextState, nextProps) {
    const isChange = this.isControl ? JSON.stringify(this.props) !== JSON.stringify(nextProps) : JSON.stringify(this.state) !== JSON.stringify(nextState);
    return isChange;
  }
  componentDidMount() {
    setTimeout(() => {
      this.initData();
    }, 50);
  }
  initData() {
    const {min, max} = this;
    this.drapElemInfo.dragElem = this.handle;
    this.rangerBodyWidth = this.rangerContainer.offsetWidth;
    this.preUnitPixel = this.rangerBodyWidth / (max - min);
  }
  handleMouseDown(e) {
    // e.preventDefault();
    // e.stopPropagation();

    const touches = e.changedTouches || e;
    this.dragOriginX = touches[0] ? touches[0].pageX : touches.pageX;

    this.drapElemInfo = {
      ...this.drapElemInfo,
      dragOriginX: this.dragOriginX
    };
    this.setState({
      draping: true
    });
    this.mouseMoving();
  }
  movingHandle = (e) => {
    if (!this.state.draping) return;

    const { dragOriginX } = this.drapElemInfo;
    
    const touches = e.changedTouches || e;
    const offsetX = touches[0] ? touches[0].pageX : touches.pageX;

    const moveOffset = this.isRevert ? dragOriginX - offsetX : offsetX - dragOriginX;

    let currOffsetPer = Math.round(moveOffset / this.rangerBodyWidth * 100 + this.originalOffsetPercent);

    if(currOffsetPer < 0) currOffsetPer = 0;
    if(currOffsetPer > 100) currOffsetPer = 100;

    this.changeValue(this.percentToVal(currOffsetPer));
  }
  dragEnd = () => {
    if (!this.state.draping) return;

    const endX = this.drapElemInfo.dragOriginX + this.offsetPercent;

    this.drapElemInfo = {
      ...this.drapElemInfo,
      dragOriginX: endX
    };
    this.mouseMoved();
    this.setEndPosition(this.offsetPercent);
    this.setState({
      draping: false
    });
  }
  mouseMoving() {
    document.addEventListener('mousemove', this.movingHandle, false);
    document.addEventListener('mouseup', this.dragEnd, false);
    document.addEventListener('touchmove', this.movingHandle, false);
    document.addEventListener('touchend', this.dragEnd, false);
  }
  mouseMoved() {
    document.removeEventListener('mousemove', this.movingHandle, false);
    document.removeEventListener('mouseup', this.dragEnd, false);
    document.removeEventListener('touchmove', this.movingHandle, false);
    document.removeEventListener('touchend', this.dragEnd, false);
  }
  percentToVal(percent) {
    if(percent - 1 < -1) return;
    const { basicUnit } = this.props;
    const { min, max } = this;
    let _val = Math.floor(percent * (max - min) / 100 + min, 0) || 0;
    if(_val % basicUnit !== 0) _val += 1;
    return _val;
  }
  valToPercent(val) {
    if(val - 1 < -1) return;
    const { min, max } = this;
    let _precent = +(ToFixed((val - min) * 100 / (max - min), 0)) || 0;
    return _precent;
  }
  setEndPosition(offsetPercent) {
    this.originalOffsetPercent = offsetPercent;
    // this.setState({
    //   originalOffsetPercent: offsetPercent
    // });
  }
  changeValue(val, emitChangeEvent = true) {
    if(!HasValue(val) || val - 1 < -1) return;

    const { disabled, onChange } = this.props;
    const stateValue = this.valueFilter();

    if(disabled) return;

    const {min, max} = this;

    if(val < min) val = min;
    if(val > max) val = max;

    if(stateValue !== val) {
      this.offsetPercent = this.valToPercent(val) || 0;
    
      this.value = val;

      if(emitChangeEvent) onChange(val);

      !this.isControl && this.setState({
        stateValue: val
      });
    }
  }
  plusAndLess(mark) {
    const { basicUnit } = this.props;
    const stateValue = this.valueFilter();

    let each = basicUnit;
    if(mark == '-') each = -each;
    if(this.isRevert) each = -each;
    let _val = stateValue + each;

    this.changeValue(_val, true);
    this.setEndPosition(this.valToPercent(_val));
  }
  valueFilter() {
    return this.isControl ? this.props.value || 0 : this.state.stateValue || 0;
  }
  render() {
    const stateValue = this.valueFilter();
    const {disabled, precent, range, withInput, basicUnit} = this.props;
    const {draping} = this.state;

    const handleStyle = this.isRevert ? {
      marginRight: - this.handleWidth / 2,
      right: `${this.offsetPercent}%`
    } : {
      marginLeft: - this.handleWidth / 2,
      left: `${this.offsetPercent}%`
    };

    const _value = precent ? (stateValue / 10).toFixed(1) : stateValue.toFixed(0);

    return (
      <div className={`uke-ranger ${disabled ? 'disabled' : ''} ${draping ? 'draping' : ''} ${withInput ? 'with-input' : ''}`}>
        <div className="disabled-mask" />
        <div className="ranger"
          onTouchStart={e => this.handleMouseDown(e)}
          onMouseDown={e => this.handleMouseDown(e)}>
          {/* <span className="less handle-btn"
            onClick={e => this.plusAndLess('-')}>-</span> */}
          <div className="all-process"
            ref={c => {
              if(c) this.rangerContainer = c;
            }}>
            <div className="active-process" style={{
              width: this.offsetPercent + '%'
            }} />
            <div className="handle"
              ref={h => {
                if(h) {
                  this.handle = h;
                  this.handleWidth = h.offsetWidth;
                }
              }}
              style={handleStyle}>
              <div className="hide-value">
                <span className="text">{_value}{precent ? '%' : ''}</span>
                <span className="caret" />
              </div>
            </div>
          </div>
          {/* <span className="plus handle-btn" onClick={e => this.plusAndLess('+')}> + </span> */}
        </div>
        {
          withInput ? (
            <InputVerify 
              value={+stateValue}
              inputable={false}
              precent={precent}
              numRange={[0, range[1]]}
              unit={basicUnit}
              onChange={val => {
                this.plusAndLess(val - stateValue > 0 ? '+' : '-');
              }}/>
          ) : null
        }
      </div>
    );
  }
}
