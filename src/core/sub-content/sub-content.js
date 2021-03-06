import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';

const SubContent = ({displayElem, children}) => {
  return (
    <div className="uke-hide-container">
      <span className="display-elem">{displayElem}</span>
      <div className="hide-content">
        <span className="caret" />
        {children}
      </div>
    </div>
  );
};
SubContent.propTypes = {
  /** 显示的元素 */
  displayElem: PropTypes.any,
  /** 隐藏的元素，当鼠标移动到显示的元素时出现 */
  children: PropTypes.any,
};

export default SubContent;