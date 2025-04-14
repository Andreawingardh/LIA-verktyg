import PropTypes from "prop-types";
import React from "react";
import './button.css'

export const Button = ({ text, onClick, className, leftIcon, rightIcon, hasIcon = false, ...props }) => {
  return (
    <button className={className} onClick={onClick} {...props}>
      {hasIcon && leftIcon}
      {text} {hasIcon && rightIcon}
    </button>
  );
};
