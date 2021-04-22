import React from "react";
import "./informationOverlayDiv.scss";

export default function InformationOverlayDiv({ children, ...restProps }) {
  return (
    <div className="InformationOverlayDivContainer" {...restProps}>
      <span>{children}</span>
    </div>
  );
}
