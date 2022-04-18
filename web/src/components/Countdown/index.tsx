import React from "react";
import { motion } from "framer-motion";

interface CountdownProps {
  seconds: number;
}

const Countdown: React.FC<CountdownProps> = ({ seconds }) => {
  return (
    <motion.div
      animate={{
        scale: [0, 1, 0],
      }}
      transition={{ repeat: Infinity, duration: 1, type: "spring" }}
    >
      <div className="text-center text-8xl font-bold">{seconds}</div>
    </motion.div>
  );
};

export default Countdown;

