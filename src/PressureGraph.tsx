import { useEffect, useRef } from 'react'
import uPlot from 'uplot'
import { ALARM_TIME, mockLog } from './data'
import { useReplayStore } from './store'

export default function PressureGraph() {
  const host = useRef<HTMLDivElement>(null)
  const chart = useRef<uPlot | null>(null)
  const time = useReplayStore((s) => s.currentTime)
  useEffect(() => {
    if (!host.current) return
    const width = host.current.clientWidth
    chart.current = new uPlot({ width, height: 176, legend: { show: false }, cursor: { show: false },
      scales: { x: { time: false, range: [0, 10] }, y: { range: [8, 38] } },
      axes: [{ stroke: '#71889a', grid: { stroke: '#213542' }, ticks: { stroke: '#314756' } }, { stroke: '#71889a', grid: { stroke: '#213542' }, ticks: { stroke: '#314756' }, label: 'MPa', labelSize: 13 }],
      series: [{}, { stroke: '#28c5d9', width: 2, fill: 'rgba(40,197,217,.12)' }],
    }, [mockLog.map(d => d.timestamp), mockLog.map(d => d.hydraulicPressure)] as uPlot.AlignedData, host.current)
    const onResize = () => chart.current?.setSize({ width: host.current?.clientWidth ?? width, height: 176 })
    window.addEventListener('resize', onResize); return () => { window.removeEventListener('resize', onResize); chart.current?.destroy() }
  }, [])
  return <div className="chart-wrap"><div ref={host} /><div className="graph-cursor" style={{ left: `${time * 10}%` }} /><div className="graph-alarm" style={{ left: `${ALARM_TIME * 10}%` }} /></div>
}
