import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Modal({ children, isShown, toggleShown }) {
  return (
    <AnimatePresence>
      {isShown && (
        <motion.div
          className="Modal"
          onClick={toggleShown}
          transition={{ duration: 0.1 }}
          animate="shown"
          initial="hidden"
          exit={{ opacity: "0%" }}
          variants={animationModalVariants()}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
  function animationModalVariants() {
    return {
      hidden: {
        opacity: "0%",
        width: "0%",
        height: "0%",
        top: "0%",
        left: "50%",
      },
      shown: {
        opacity: "100%",
        width: "100%",
        height: "100%",
        top: "50%",
        left: "50%",
      },
    };
  }
}
