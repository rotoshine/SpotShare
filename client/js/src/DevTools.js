import React from 'react';
import ChartMonitor from 'redux-devtools-chart-monitor';

// Exported from redux-devtools
import {createDevTools} from 'redux-devtools';

// Monitors are separate packages, and you can make a custom one
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';

// createDevTools takes a monitor and produces a DevTools component
export default createDevTools(
  <DockMonitor defaultIsVisible={false}
               toggleVisibilityKey="shift-ctrl-H"
               changeMonitorKey="shift-ctrl-M"
               changePositionKey="shift-ctrl-Q">
    <LogMonitor theme='tomorrow'/>
    <ChartMonitor />
  </DockMonitor>
);
