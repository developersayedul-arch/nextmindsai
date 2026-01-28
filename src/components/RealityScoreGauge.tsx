import { motion } from "framer-motion";

interface RealityScoreGaugeProps {
  score: number;
  size?: number;
}

const RealityScoreGauge = ({ score, size = 200 }: RealityScoreGaugeProps) => {
  // Score color logic
  const getScoreColor = (s: number) => {
    if (s >= 7) return { main: "#22c55e", glow: "#22c55e40" }; // success green
    if (s >= 4) return { main: "#f59e0b", glow: "#f59e0b40" }; // warning amber
    return { main: "#ef4444", glow: "#ef444440" }; // destructive red
  };

  const getScoreLabel = (s: number) => {
    if (s >= 8) return "উৎকৃষ্ট";
    if (s >= 7) return "ভালো";
    if (s >= 5) return "মোটামুটি";
    if (s >= 3) return "ঝুঁকিপূর্ণ";
    return "বিপজ্জনক";
  };

  const colors = getScoreColor(score);
  const percentage = score * 10;
  const circumference = 2 * Math.PI * 80; // radius 80
  const strokeDashoffset = circumference - (percentage / 100) * circumference * 0.75; // 270 degree arc

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      {/* Glow effect */}
      <div 
        className="absolute inset-0 rounded-full blur-2xl opacity-50"
        style={{ backgroundColor: colors.glow }}
      />
      
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        className="transform -rotate-[135deg]"
      >
        {/* Background arc */}
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke="currentColor"
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={circumference * 0.75}
          strokeDashoffset={0}
          className="text-secondary/30"
        />
        
        {/* Animated score arc */}
        <motion.circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke={colors.main}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={circumference * 0.75}
          initial={{ strokeDashoffset: circumference * 0.75 }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
          style={{
            filter: `drop-shadow(0 0 10px ${colors.main})`,
          }}
        />

        {/* Tick marks */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((tick) => {
          const angle = (tick / 10) * 270 - 135;
          const rad = (angle * Math.PI) / 180;
          const innerR = 65;
          const outerR = tick % 5 === 0 ? 60 : 62;
          const x1 = 100 + innerR * Math.cos(rad);
          const y1 = 100 + innerR * Math.sin(rad);
          const x2 = 100 + outerR * Math.cos(rad);
          const y2 = 100 + outerR * Math.sin(rad);
          return (
            <line
              key={tick}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth={tick % 5 === 0 ? 2 : 1}
              className="text-muted-foreground/50"
            />
          );
        })}
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-5xl font-bold"
          style={{ color: colors.main }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          {score}
        </motion.span>
        <motion.span
          className="text-lg text-muted-foreground font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          / 10
        </motion.span>
        <motion.span
          className="text-sm font-semibold mt-1 px-3 py-1 rounded-full"
          style={{ 
            backgroundColor: colors.glow,
            color: colors.main
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          {getScoreLabel(score)}
        </motion.span>
      </div>
    </div>
  );
};

export default RealityScoreGauge;
