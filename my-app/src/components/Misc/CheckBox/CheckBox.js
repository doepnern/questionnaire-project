import React from "react";
import "./checkbox.scss";

export default function CheckBox({ checked }) {
  return (
    <label className="checkbox bounce">
      <input type="checkbox" checked={checked} readOnly />
      <svg viewBox="0 0 21 21">
        <polyline points="5 10.75 8.5 14.25 16 6"></polyline>
      </svg>
    </label>
  );
}
