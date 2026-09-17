import { useEffect, useMemo, useRef } from 'react'
import Scene from './Excavator'
import PressureGraph from './PressureGraph'
import { ALARM_TIME, DURATION, sampleAt } from './data'
import { useReplayStore } from './store'

const Gauge = ({ label, value, unit, accent }: { label: string; value: string; unit: string; accent?: boolean }) => <div className={`gauge ${accent ? 'accent' : ''}`}><span>{label}</span><strong>{value}<small>{unit}</small></strong></div>

export default function App() {
  const { currentTime, playing, speed, setTime, toggle, setPlaying, setSpeed } = useReplayStore()
  const lastFrame = useRef<number | null>(null)
  useEffect(() => {
    if (!playing) { lastFrame.current = null; return }
    let frame = 0
    const tick = (now: number) => { const previous = lastFrame.current ?? now; lastFrame.current = now; const next = useReplayStore.getState().currentTime + (now - previous) / 1000 * useReplayStore.getState().speed
      if (next >= DURATION) { setTime(DURATION); setPlaying(false) } else setTime(next)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick); return () => cancelAnimationFrame(frame)
  }, [playing, setPlaying, setTime])
  const data = useMemo(() => sampleAt(currentTime), [currentTime])
  const activeAlarm = Boolean(data.alarm)
  const play = () => { if (!playing && currentTime >= DURATION) setTime(0); toggle() }
  return <main>
    <header><div className="brand-mark">R</div><div><h1>Remote SDT</h1><p>DIAGNOSTIC REPLAY</p></div><div className="session"><span className="status-dot" /> LOG CONNECTED <b>EXC-07</b><em>2026.09.17 / SESSION 0142</em></div></header>
    <section className="workspace">
      <div className="viewport"><div className="panel-label"><span>3D MACHINE VIEW</span><b>LIVE SYNC</b></div><Scene /><div className="hint">ドラッグで回転 ・ スクロールでズーム</div><div className="axes"><i>X</i><i>Y</i><i>Z</i></div></div>
      <aside><div className="aside-head"><div><p>TELEMETRY</p><h2>Sensor Data</h2></div><span>100 ms</span></div>
        <div className="gauges"><Gauge label="ENGINE RPM" value={data.engineRpm.toFixed(0)} unit="rpm" /><Gauge label="HYDRAULIC PRESSURE" value={data.hydraulicPressure.toFixed(1)} unit="MPa" accent={activeAlarm} /><Gauge label="BOOM ANGLE" value={data.boomAngle.toFixed(1)} unit="deg" /><Gauge label="ARM ANGLE" value={data.armAngle.toFixed(1)} unit="deg" /><Gauge label="BUCKET ANGLE" value={data.bucketAngle.toFixed(1)} unit="deg" /></div>
        <div className="graph-section"><div className="graph-title"><div><p>HYDRAULIC PRESSURE</p><h3>Pressure trend</h3></div><span>● Live</span></div><PressureGraph /></div>
        <div className={`alert ${activeAlarm ? 'active' : ''}`}><div className="alert-icon">!</div><div><small>{activeAlarm ? 'ACTIVE ALERT' : 'ALERT MONITOR'}</small><strong>{activeAlarm ? 'E123 Hydraulic Pressure High' : 'No active alerts'}</strong><p>{activeAlarm ? `Detected at ${ALARM_TIME.toFixed(1)}s · Boom circuit` : 'System operating normally'}</p></div>{activeAlarm && <b>HIGH</b>}</div>
      </aside>
    </section>
    <footer><div className="controls"><button className="play" onClick={play} aria-label={playing ? 'Pause' : 'Play'}>{playing ? 'Ⅱ' : '▶'}</button><div className="time"><strong>{currentTime.toFixed(1)}</strong><span>/ {DURATION.toFixed(1)} sec</span></div><div className="speeds">{[.5, 1, 2].map(n => <button className={speed === n ? 'selected' : ''} onClick={() => setSpeed(n)} key={n}>{n}×</button>)}</div></div>
      <div className="timeline"><div className="timeline-meta"><span>SESSION TIMELINE</span><span>{activeAlarm ? '⚠ E123 ACTIVE' : '1 EVENT'}</span></div><div className="track"><div className="progress" style={{ width: `${currentTime * 10}%` }} /><div className="alarm-marker" style={{ left: `${ALARM_TIME * 10}%` }}><label>E123</label></div><input aria-label="Replay timeline" type="range" min="0" max={DURATION} step="0.01" value={currentTime} onChange={e => setTime(Number(e.target.value))} /></div><div className="ticks"><span>0:00</span><span>0:02</span><span>0:04</span><span>0:06</span><span>0:08</span><span>0:10</span></div></div>
    </footer>
  </main>
}
