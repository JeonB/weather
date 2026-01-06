"use client";

import { motion } from "motion/react";
import { cn } from "@shared/lib/cn";

interface WeatherSceneProps {
  icon: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function WeatherScene({
  icon,
  size = "lg",
  className,
}: WeatherSceneProps) {
  const weatherCode = icon.substring(0, 2);
  const isDay = icon.endsWith("d");

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const sceneSize = {
    sm: { width: 48, height: 48 },
    md: { width: 96, height: 96 },
    lg: { width: 128, height: 128 },
  };

  const { width, height } = sceneSize[size];

  // 맑음 (Clear sky)
  if (weatherCode === "01") {
    return (
      <div className={cn(sizeClasses[size], "relative", className)}>
        <svg
          width={width}
          height={height}
          viewBox="0 0 128 128"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {isDay ? (
            <>
              {/* 태양 */}
              <motion.circle
                cx="64"
                cy="64"
                r="28"
                fill="#FDB813"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              {/* 태양 광선 */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <motion.line
                  key={angle}
                  x1="64"
                  y1="64"
                  x2={64 + Math.cos((angle * Math.PI) / 180) * 45}
                  y2={64 + Math.sin((angle * Math.PI) / 180) * 45}
                  stroke="#FDB813"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ opacity: 0.7 }}
                  animate={{
                    opacity: [0.7, 1, 0.7],
                    strokeWidth: [3, 4, 3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: angle / 100,
                  }}
                />
              ))}
            </>
          ) : (
            <>
              {/* 달 */}
              <motion.circle
                cx="64"
                cy="64"
                r="24"
                fill="#E8E8E8"
                animate={{
                  opacity: [0.9, 1, 0.9],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              {/* 달 크레이터 */}
              <circle cx="58" cy="58" r="4" fill="#D0D0D0" opacity="0.4" />
              <circle cx="70" cy="62" r="3" fill="#D0D0D0" opacity="0.4" />
              <circle cx="62" cy="72" r="5" fill="#D0D0D0" opacity="0.4" />
            </>
          )}
        </svg>
      </div>
    );
  }

  // 구름 (Few clouds, Scattered clouds, Broken clouds)
  if (weatherCode === "02" || weatherCode === "03" || weatherCode === "04") {
    const cloudCount = weatherCode === "02" ? 1 : weatherCode === "03" ? 2 : 3;
    const showSun = weatherCode === "02";

    return (
      <div className={cn(sizeClasses[size], "relative", className)}>
        <svg
          width={width}
          height={height}
          viewBox="0 0 128 128"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 태양 (few clouds만) */}
          {showSun && isDay && (
            <motion.circle
              cx="80"
              cy="40"
              r="18"
              fill="#FDB813"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}

          {/* 구름들 */}
          <CloudShape x={20} y={50} scale={0.8} delay={0} />
          {cloudCount >= 2 && <CloudShape x={50} y={45} scale={0.9} delay={0.5} />}
          {cloudCount >= 3 && <CloudShape x={35} y={65} scale={0.7} delay={1} />}
        </svg>
      </div>
    );
  }

  // 비 (Shower rain, Rain)
  if (weatherCode === "09" || weatherCode === "10") {
    return (
      <div className={cn(sizeClasses[size], "relative", className)}>
        <svg
          width={width}
          height={height}
          viewBox="0 0 128 128"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 구름 */}
          <CloudShape x={30} y={30} scale={1} delay={0} dark />

          {/* 빗방울 */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.line
              key={i}
              x1={30 + i * 12}
              y1="65"
              x2={28 + i * 12}
              y2="85"
              stroke="#4A90E2"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ opacity: 0, y: -10 }}
              animate={{
                opacity: [0, 1, 0],
                y: [0, 20, 40],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.15,
              }}
            />
          ))}
        </svg>
      </div>
    );
  }

  // 뇌우 (Thunderstorm)
  if (weatherCode === "11") {
    return (
      <div className={cn(sizeClasses[size], "relative", className)}>
        <svg
          width={width}
          height={height}
          viewBox="0 0 128 128"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 어두운 구름 */}
          <CloudShape x={30} y={30} scale={1} delay={0} dark />

          {/* 번개 */}
          <motion.path
            d="M 64 60 L 58 75 L 64 75 L 60 95"
            stroke="#FDB813"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 0, 0, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* 빗방울 */}
          {[0, 1, 2, 3].map((i) => (
            <motion.line
              key={i}
              x1={35 + i * 15}
              y1="65"
              x2={33 + i * 15}
              y2="85"
              stroke="#4A90E2"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 0],
                y: [0, 20, 40],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.2,
              }}
            />
          ))}
        </svg>
      </div>
    );
  }

  // 눈 (Snow)
  if (weatherCode === "13") {
    return (
      <div className={cn(sizeClasses[size], "relative", className)}>
        <svg
          width={width}
          height={height}
          viewBox="0 0 128 128"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 구름 */}
          <CloudShape x={30} y={30} scale={1} delay={0} />

          {/* 눈송이 */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.g
              key={i}
              initial={{ opacity: 0, y: -10 }}
              animate={{
                opacity: [0, 1, 0.8, 0],
                y: [0, 15, 30, 50],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.4,
              }}
            >
              <circle
                cx={32 + i * 12}
                cy="65"
                r="3"
                fill="#E8F4F8"
                stroke="#B8D4E8"
                strokeWidth="1"
              />
            </motion.g>
          ))}
        </svg>
      </div>
    );
  }

  // 안개 (Mist, Fog, Haze)
  if (weatherCode === "50") {
    return (
      <div className={cn(sizeClasses[size], "relative", className)}>
        <svg
          width={width}
          height={height}
          viewBox="0 0 128 128"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 안개 레이어 */}
          {[0, 1, 2, 3].map((i) => (
            <motion.line
              key={i}
              x1="20"
              y1={45 + i * 12}
              x2="108"
              y2={45 + i * 12}
              stroke="#C0C0C0"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ opacity: 0.4 }}
              animate={{
                opacity: [0.4, 0.7, 0.4],
                x: [0, 5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          ))}
        </svg>
      </div>
    );
  }

  // 기본 (아이콘 코드 매칭 안 될 경우)
  return (
    <div className={cn(sizeClasses[size], "relative", className)}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 128 128"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <CloudShape x={30} y={40} scale={1} delay={0} />
      </svg>
    </div>
  );
}

// 재사용 가능한 구름 컴포넌트
function CloudShape({
  x,
  y,
  scale = 1,
  delay = 0,
  dark = false,
}: {
  x: number;
  y: number;
  scale?: number;
  delay?: number;
  dark?: boolean;
}) {
  const cloudColor = dark ? "#8B92A0" : "#FFFFFF";
  const cloudStroke = dark ? "#6B7280" : "#E5E7EB";

  return (
    <motion.g
      initial={{ x: 0 }}
      animate={{
        x: [0, 3, 0],
        y: [0, -2, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      <ellipse
        cx={x + 20 * scale}
        cy={y + 10 * scale}
        rx={15 * scale}
        ry={10 * scale}
        fill={cloudColor}
        stroke={cloudStroke}
        strokeWidth="1"
      />
      <ellipse
        cx={x + 35 * scale}
        cy={y + 8 * scale}
        rx={18 * scale}
        ry={12 * scale}
        fill={cloudColor}
        stroke={cloudStroke}
        strokeWidth="1"
      />
      <ellipse
        cx={x + 50 * scale}
        cy={y + 10 * scale}
        rx={15 * scale}
        ry={10 * scale}
        fill={cloudColor}
        stroke={cloudStroke}
        strokeWidth="1"
      />
      <ellipse
        cx={x + 35 * scale}
        cy={y + 15 * scale}
        rx={25 * scale}
        ry={12 * scale}
        fill={cloudColor}
        stroke={cloudStroke}
        strokeWidth="1"
      />
    </motion.g>
  );
}

