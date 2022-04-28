import React from "react";
import { motion } from "framer-motion";
import { Player, PlayerType } from "@/types/player";
import { EXPAND_IN, FADE_IN, FADE_UP } from "@/utils/variants";
import { STATUS } from "@/utils/constants";

interface VoterCardProps {
  player: Player;
  showVote: boolean;
  countdownStatus: string;
}

const VoterCard: React.FC<VoterCardProps> = ({
  player,
  showVote,
  countdownStatus,
}) => {
  const { name, vote, type } = player;

  const voting = type === PlayerType.Voter;

  return (
    <motion.div variants={EXPAND_IN} exit={{ opacity: 0 }}>
      <div
        className={`flex justify-center items-center mx-auto p-4 bg-dark-secondary rounded-md h-24 w-20 font-bold text-4xl border-2 ${
          vote ? "border-blue-500" : "border-dark-primary"
        }`}
      >
        {!voting && <motion.div variants={FADE_IN}>👀</motion.div>}
        {voting && showVote && (
          <motion.div variants={FADE_IN}>{vote}</motion.div>
        )}
        {voting && !showVote && vote && countdownStatus === STATUS.STARTED && (
          <motion.div variants={FADE_IN}>🔒</motion.div>
        )}
        {voting && !showVote && vote && countdownStatus === STATUS.STOPPED && (
          <motion.div variants={FADE_IN}>❔</motion.div>
        )}
        {voting && !showVote && !vote && (
          <motion.div variants={FADE_UP}>🤔</motion.div>
        )}
      </div>
      <div className="mt-2 text-center text-lg font-semibold">{name}</div>
    </motion.div>
  );
};

export default VoterCard;

