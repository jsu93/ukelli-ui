import React, {Component, PureComponent} from 'react';

import {DatetimePicker, DatepickerHelper} from '../datetimepicker';
import {Radio, DropdownMenu} from '../selector';
import {Input, IconInput} from '../form-control';
import CitySelector from '../city-selector';
import Ranger from '../range-selector';
import Captcha from '../captcha';

export default class FormFilterHelper extends Component {
  constructor(props) {
    super(props);
    this.value = {};
    this.requiredRefMapper = {}; // 用于检测是否通过表单强制要求验证的mapper

    this.initValues();
  }
  initValues() {
    const {conditionConfig, formOptions} = this.props;
    this.setDefaultValues(formOptions || conditionConfig);
  }
  resetValues() {
    this.initValues();
  }
  componentWillReceiveProps(nextProps) {
    this.resetRequireRefMapper(nextProps);
  }
  resetRequireRefMapper(nextProps = this.props) {
    this.requiredRefMapper = {};
    const {conditionConfig, formOptions} = nextProps;
    const configArr = formOptions || conditionConfig || [];
    configArr.forEach(config => this.setRequiredRefMapper(config));
  }
  componentWillUnmount() {
    this.value = {};
    this.requiredRefMapper = {};
  }
  setRequiredRefMapper(config) {
    const {required, title = '', ref} = this.wrapConditionTitle(config);
    if(!required) return;
    this.requiredRefMapper = Object.assign({}, this.requiredRefMapper, {
      [ref]: title
    });
  }
  setDefaultValues(options = []) {
    options.forEach(config => {
      this.setDefaultValue(config);
      this.setRequiredRefMapper(config);
    });
  }
  setDefaultValue(config) {
    const {
      defaultValue, ref, refs, range
    } = config;
    if(!!ref) this.value[ref] = defaultValue;

    if(Array.isArray(refs)) {
      refs.forEach((_ref, idx) => this.value[_ref] = range[idx]);
    }
  }
  checkForm() {
    let {requiredRefMapper} = this;
    let isPass = Object.keys(requiredRefMapper).length == 0;
    let desc = '';
    let ref = '';
    let requiredRefs = Object.keys(requiredRefMapper);
    for(let i = 0; i < requiredRefs.length; i++) {
      let itemRef = requiredRefs[i];
      let currVal = this.value[itemRef];
      if(!$GH.HasValue(currVal)) {
        isPass = false;
        desc = requiredRefMapper[itemRef];
        ref = itemRef;
        this.focusRef(ref);
        break;
      }
      isPass = true;
    }
    return {
      isPass,
      desc,
      ref
    };
  }
  wrapConditionTitle(condition) {
    let title = condition.title || $UK.getKeyMap(condition.ref) || condition.ref || '';
    condition.title = title;
    return condition;
  }
  focusRef(ref) {
    const targetDOM = this.refs[ref];
    if(!!targetDOM && !!targetDOM.focus) targetDOM.focus();
  }
  changeValue(value, ref, update = true) {
    if(this.value[ref] === value) return;
    this.value[ref] = value;
    if(update) this.forceUpdate();
    $GH.CallFunc(this.props.onChange)(this.value, ref);
  }
  changeValues(valRefMapper, update = true) {
    const refs = Object.keys(valRefMapper);
    const self = this;
    /**
     * valRefMapper
     * {
     *   ref: val
     * }
     */
    refs.forEach(ref => {
      const val = valRefMapper[ref];
      self.changeValue(val, ref);
    });
  }
  refreshCaptcha(ref) {
    this.refs[ref].refreshCaptcha();
  }
  greneratFormDOM(config) {
    const {
      ref, type, className, text
    } = config;
    switch (type) {
      case 'captcha':
        let captchaKeyRef = 'CaptchaKey';
        let captchaForUsernameRef = 'CaptchaForUsername';
        return (
          <Captcha
            {...config}
            value={this.value[ref]}
            onChange={captchaConfig => {
              this.changeValue(captchaConfig.value, ref);
              if(captchaConfig.isPass) {
                this.changeValue(captchaConfig.key, captchaKeyRef);
                this.changeValue(captchaConfig.forUsername, captchaForUsernameRef);
              }
            }}/>
        );
      case 'select':
        return (
          <DropdownMenu
            {...config}
            value={this.value[ref]}
            onChange={val => {
              this.changeValue(val, ref)
            }}
          />
        )
      case 'input':
      case 'password':
        var formClass = 'form-control input-sm ' + (className || '');
        return (
          <IconInput
            iconName={config.iconName}
            inputBtnConfig={config.inputBtnConfig}
            ref={config.ref}
            inputProps={{
              className: formClass,
              value: this.value[ref] === 0 ? 0 : (this.value[ref] || ''),
              type: config.type == 'input' ? 'text' : 'password',
              placeholder: config.placeholder || config.title,
              readOnly: config.readOnly,
              onBlur: e => {
                let __val = e.target.value.trim()
                this.changeValue(__val, ref);
                $GH.CallFunc(config.onBlur)(__val);
              },
              onChange: e => {
                if (config.disabled) return;
                let __val = e.target.value;
                let {inputType = 'string'} = config;
                if(inputType == 'number') __val = +__val === 0 ? (__val == '0.' ? '0.' : undefined) : (+__val ? __val: undefined);
                if(inputType == 'string') __val = __val + '';
                this.changeValue(__val, ref);
              },
            }}/>
        )
      case 'textarea':
        return (
          <textarea
            defaultValue={this.value[ref]}
            className="form-control"
            id={ref}
            onBlur={e => this.changeValue(e.target.value, ref)}></textarea>
        )
      case 'ranger':
        return (
          <Ranger
            {...config}
            value={this.value[ref]}
            onChange={val => this.changeValue(val, ref)}/>
        )
      case 'text':
        return (
          <label className={className}>{this.value[ref] || text}</label>
        )
      case 'radio':
        const {needDefaultValue = true} = config;
        const ___V = (config.values[0] || {}).value;
        const __defVal = needDefaultValue ? (___V === 0 ? 0 : ___V) : '';
        return (
          <Radio
            {...config}
            value={(this.value[ref] === 0 ? 0 : this.value[ref] || __defVal)}
            didMountChange={needDefaultValue}
            onChange={val => {
              this.changeValue(val, ref);
            }}
          />
        );
      case 'button':
        return (
          <span
            className={'btn flat ' + config.className}
            onClick={e => config.onClick(e, ref)}
          >{text}</span>
        );
      case 'citySelector':
        return (
          <CitySelector
            {...config}
            onChange={val => this.changeValue(val, ref)}
          />
        );
      case 'datetime':
        var {needTime = true, title} = config;
        return (
          <span>
            <DatetimePicker
              {...config}
              needTime={needTime}
              id={ref}
              value={this.value[ref]}
              onChange={val => {
                this.changeValue(val, ref);
              }}/>
          </span>
        );
      case 'datetimeRange':
        var {needTime = true, refs, range, clickToClose} = config;
        let [refS, refE] = refs;
        let [rangeS, rangeE] = range;

        let datePickerHelper = !config.noHelper ? (
          <DatepickerHelper
            {...config}
            value={this.value[ref]}
            onClick={dateConfig => {
              refs.forEach((_ref, idx) => {
                this.changeValue(dateConfig[idx], _ref)
              });
            }
          }/>
        ) : null;

        return (
          <div className="datepicker-ranger-content">
            <span className="title">起始时间</span>
            <DatetimePicker
              {...config}
              ref={refS}
              needTime={needTime}
              id={refS}
              clickToClose={clickToClose}
              value={this.value[refS]}
              onChange={val => this.changeValue(val, refS)}/>
            <span className="mr10 divde">-</span>
            <DatetimePicker
              {...config}
              ref={refE}
              needTime={needTime}
              id={refE}
              clickToClose={clickToClose}
              value={this.value[refE]}
              onChange={val => this.changeValue(val, refE)}/>
            {datePickerHelper}
          </div>
        );
      default:
        return null;
    }
  }
}
