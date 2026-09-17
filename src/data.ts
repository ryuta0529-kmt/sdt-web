export type LogSample = {
  timestamp: number
  boomAngle: number
  armAngle: number
  bucketAngle: number
  swingAngle: number
  engineRpm: number
  hydraulicPressure: number
  alarm: string | null
}

export const DURATION = 10
export const ALARM_TIME = 5.2

export const mockLog: LogSample[] = Array.from({ length: 101 }, (_, index) => {
  const t = index / 10
  const pressureSpike = 17 * Math.exp(-Math.pow((t - 5.25) / 0.58, 2))
  return {
    timestamp: t,
    boomAngle: 24 + 18 * Math.sin(t * 0.62 - 0.5),
    armAngle: -50 + 22 * Math.sin(t * 0.78 + 0.8),
    bucketAngle: -34 + 28 * Math.sin(t * 1.05 + 1.4),
    swingAngle: -22 + 44 * (t / DURATION) + 8 * Math.sin(t * 0.45),
    engineRpm: 1540 + 250 * Math.sin(t * 0.72) + pressureSpike * 5,
    hydraulicPressure: 15 + 3 * Math.sin(t * 1.15) + pressureSpike,
    alarm: Math.abs(t - ALARM_TIME) < 0.051 ? 'E123 Hydraulic Pressure High' : null,
  }
})

export function sampleAt(time: number): LogSample {
  const position = Math.max(0, Math.min(DURATION, time)) * 10
  const before = mockLog[Math.floor(position)]
  const after = mockLog[Math.min(Math.ceil(position), mockLog.length - 1)]
  const mix = position - Math.floor(position)
  const lerp = (a: number, b: number) => a + (b - a) * mix
  return {
    timestamp: time,
    boomAngle: lerp(before.boomAngle, after.boomAngle), armAngle: lerp(before.armAngle, after.armAngle),
    bucketAngle: lerp(before.bucketAngle, after.bucketAngle), swingAngle: lerp(before.swingAngle, after.swingAngle),
    engineRpm: lerp(before.engineRpm, after.engineRpm), hydraulicPressure: lerp(before.hydraulicPressure, after.hydraulicPressure),
    alarm: Math.abs(time - ALARM_TIME) <= 0.7 ? 'E123 Hydraulic Pressure High' : null,
  }
}
