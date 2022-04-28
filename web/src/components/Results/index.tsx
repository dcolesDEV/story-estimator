import React from "react";
import { motion } from "framer-motion";
import { Player } from "@/types/player";
import { FADE_IN, STAGGER } from "@/utils/variants";

interface ResultsProps {
  players: Array<Player>;
  options: Array<string>;
}

const Results: React.FC<ResultsProps> = ({ players, options }) => {
  const getVotes = () =>
    options
      .map(option => ({
        value: option,
        total: players.filter(p => p.vote === option).length,
      }))
      .filter(o => o.total > 0);

  const getAverage = () => {
    let count = 0;
    let total = 0;
    for (const player of players) {
      if (player.vote && player.vote !== "?") {
        total += parseInt(player.vote);
        count++;
      }
    }
    return (total / count).toFixed(1).replace(/\.0+$/, "");
  };

  return (
    <motion.div variants={FADE_IN}>
      <div className="border-b-dark-secondary border-b-2">
        <div className="mb-2 text-lg">Average:</div>
        <div className="text-8xl font-bold mb-2">{getAverage()}</div>
      </div>
      <motion.div variants={STAGGER}>
        <div className="mt-8 flex space-x-2">
          {getVotes()
            .sort((a, b) => b.total - a.total)
            .map(x => (
              <motion.div
                variants={FADE_IN}
                className="mb-2 text-lg"
                key={`${x.value}-result`}
              >
                <span className="rounded-md p-2 my-2 bg-blue-500">
                  <span className="font-bold">{x.total}</span> vote for{" "}
                  <span className="font-bold">{x.value}</span> point
                  {x.value === "1" ? "" : "s"}
                </span>
              </motion.div>
            ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Results;

