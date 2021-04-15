import React, { useEffect, useState } from "react";
import "./styles.css";
export default function Fade({
  children,
  show,
  speed = 0.6,
  MyDivProp,
  zIndex = 0,
}) {
  const style = {
    animation: `${show ? "fadeIn" : "fadeOut"} ${speed}s`,
    zIndex: zIndex,
  };
  const MyDiv = MyDivProp ? (
    <MyDivProp style={style} onAnimationEnd={onAnimationEnd}>
      {children}
    </MyDivProp>
  ) : (
    <div style={style} onAnimationEnd={onAnimationEnd}>
      {children}
    </div>
  );

  const [shouldRender, setRender] = useState(show);
  useEffect(() => {
    if (show) setRender(true);
  }, [show]);
  function onAnimationEnd() {
    if (!show) setRender(false);
  }
  return <>{shouldRender ? MyDiv : undefined}</>;
}
