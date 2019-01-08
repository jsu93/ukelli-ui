import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { IsFunc } from 'basic-helper';

// import LoadingDOMSnip from './snip';
import LoadingProgress from './progress';
import LoadingDOMPlaceholder from './placeholder';

export default class Loading extends Component {
  static propTypes = {
    /** timeout */
    timeout: PropTypes.number,
    /** loading 状态 */
    loading: PropTypes.bool.isRequired,
    /** animation className */
    animationClass: PropTypes.string,
    /** 子内容，从 2.10.5 版本开始支持 function children */
    children: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.element,
      PropTypes.array,
    ]),
    /** 可以替换默认的 loading 模版 */
    loadingDOM: PropTypes.any,
    /** 内容是否与 loading 模版共存 */
    inrow: PropTypes.bool,
  };
  static defaultProps = {
    inrow: false,
    timeout: 200,
    animationClass: 'loading',
  };
  transitionWrap(key, children) {
    const { timeout } = this.props;
    return (
      <CSSTransition
        classNames="loading"
        timeout={timeout}
        key={key}>
        {children}
        {/* <div>
          {children}
        </div> */}
      </CSSTransition>
    );
  }
  render() {
    const { loading, children, inrow, loadingDOM, timeout, animationClass } = this.props;

    let loadingDOMFilterRes;

    switch (true) {
    case !!loadingDOM: // custom mode
      loadingDOMFilterRes = loadingDOM;
      break;
    case inrow: // progress
      loadingDOMFilterRes = <LoadingProgress />;
      break;
    default: // placeholder
      loadingDOMFilterRes = <LoadingDOMPlaceholder />;
    }

    let container;
    let key = loading ? 'loading' : 'loaded';
    // let animationClassName = animationClass + (inrow ? '-row' : '');
    let animationClassName = animationClass + '-row';

    if(loading) {
      if(inrow) {
        container = (
          <React.Fragment>
            <div className="loading-container">
              {loadingDOMFilterRes}
            </div>
            {IsFunc(children) ? children() : children}
          </React.Fragment>
        );
      } else {
        container = (
          <div className="loading-container">
            {loadingDOMFilterRes}
          </div>
        );
      }
    } else {
      container = IsFunc(children) ? children() : children;
    }

    // switch (true) {
    // // solution 1, render chidlren with progress
    // case loading && inrow:
    //   // container = [
    //   //   this.transitionWrap(
    //   //     'loading',
    //   //     <div className="loading-container">
    //   //       {loadingDOMFilterRes}
    //   //     </div>
    //   //   ),
    //   //   this.transitionWrap('loaded', children)
    //   // ];
    //   container = (
    //     <React.Fragment>
    //       <div className="loading-container">
    //         {loadingDOMFilterRes}
    //       </div>
    //       {children}
    //     </React.Fragment>
    //   );
    //   break;
    //   // solution 2, when inrow and no children or not inrow, just render placeholder
    // case loading && !inrow:
    //   // container = this.transitionWrap(
    //   //   'loading',
    //   //   <div className="loading-container">
    //   //     {loadingDOMFilterRes}
    //   //   </div>
    //   // );
    //   container = (
    //     <div className="loading-container">
    //       {loadingDOMFilterRes}
    //     </div>
    //   );
    //   break;
    //   // solution 3, just render children
    // case !loading:
    //   // container = this.transitionWrap('loaded', children);
    //   container = children;
    //   break;
    // default:
    // }
    return (
      <div className={"loading-control " + (loading ? 'loading' : 'planning')}>
        <TransitionGroup
          appear={false}
          component={null}>
          <CSSTransition
            classNames={animationClassName}
            timeout={timeout}
            key={key}>
            {/* {container} */}
            <div>
              {container}
            </div>
          </CSSTransition>
          {/* {container} */}
        </TransitionGroup>
      </div>
    );
  }
}
