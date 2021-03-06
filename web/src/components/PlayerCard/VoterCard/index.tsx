import React, { useState } from "react";
import { motion } from "framer-motion";
import { Player } from "@/types/player";
import { EXPAND_IN, FADE_IN } from "@/utils/variants";
import EmojiPicker from "@/components/EmojiPicker";
import { CountdownStatus } from "@/types/countdown";

interface VoterCardProps {
  player: Player;
  showVote: boolean;
  countdownStatus: CountdownStatus;
  setEmoji: (e: string) => void;
  isCurrentPlayer: boolean;
}

const VoterCard: React.FC<VoterCardProps> = ({
  player,
  showVote,
  countdownStatus,
  setEmoji,
  isCurrentPlayer,
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const { name, vote, emoji } = player;

  const handleSetEmoji = (e: string) => {
    setEmoji(e);
    setIsPickerOpen(false);
  };

  return (
    <>
      <motion.div variants={EXPAND_IN} exit={{ opacity: 0 }}>
        <div
          className={`flex justify-center items-center mx-auto p-4 bg-light-secondary dark:bg-dark-secondary rounded-md h-22 w-16 font-bold text-4xl border-2 ${
            vote
              ? "border-light-main dark:border-dark-main"
              : "border-light-primary dark:border-dark-primary"
          }`}
        >
          {showVote && (
            <motion.div variants={FADE_IN}>{vote ?? "-"}</motion.div>
          )}
          {!showVote && vote && countdownStatus === CountdownStatus.STARTED && (
            <motion.div variants={FADE_IN}>✅</motion.div>
          )}
          {!showVote &&
            !vote &&
            countdownStatus === CountdownStatus.STARTED && (
              <motion.div variants={FADE_IN}>{emoji}</motion.div>
            )}
          {!showVote && countdownStatus === CountdownStatus.STOPPED && (
            <motion.div
              whileHover={isCurrentPlayer ? { scale: 1.05 } : {}}
              whileTap={isCurrentPlayer ? { scale: 0.95 } : {}}
            >
              <button
                disabled={!isCurrentPlayer}
                onClick={() => setIsPickerOpen(true)}
              >
                <span>{emoji}</span>
              </button>
            </motion.div>
          )}
        </div>
        <div
          className={`mt-2 text-center text-md font-semibold ${
            isCurrentPlayer ? "text-light-main dark:text-dark-main" : ""
          }`}
        >
          {name}
        </div>
      </motion.div>
      <motion.div variants={FADE_IN} exit={{ opacity: 0 }}>
        <EmojiPicker
          onSelect={(e: string) => handleSetEmoji(e)}
          isOpen={isPickerOpen}
          setIsOpen={setIsPickerOpen}
        />
      </motion.div>
    </>
  );
};

export default VoterCard;

