import React, { useState } from 'react';
import { DATABASE } from '../data/database';
import './TimeAxis.css';

interface TimeAxisProps {
  composers?: any[];
  selectedComposerId?: string;
  onSelectComposer: (id: string) => void;
  currentYear?: number;
  onYearChange?: (year: number) => void;
}

const TimeAxis: React.FC<TimeAxisProps> = ({
  composers = DATABASE,
  selectedComposerId,
  onSelectComposer,
  currentYear = 1800,
  onYearChange
}) => {
  const getYearFromLifeDates = (lifeDates: string): number => {
    const match = lifeDates.match(/\d{4}/);
    return match ? parseInt(match[0]) : 1700;
  };
  
  const years = composers.map(c => getYearFromLifeDates(c.lifeDates));
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  const yearRange = maxYear - minYear;
  
  const eraColors: Record<string, string> = {
    'Baroque': '#8b5cf6',
    'Classical': '#10b981',
    'Romantic': '#ef4444',
    '20th Century': '#f59e0b',
    'Contemporary': '#3b82f6'
  };
  
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const year = Math.round(minYear + percentage * yearRange);
    
    if (onYearChange) {
      onYearChange(year);
    }
    
    const closestComposer = composers.reduce((prev, curr) => {
      const prevYear = getYearFromLifeDates(prev.lifeDates);
      const currYear = getYearFromLifeDates(curr.lifeDates);
      const prevDiff = Math.abs(prevYear - year);
      const currDiff = Math.abs(currYear - year);
      return currDiff < prevDiff ? curr : prev;
    });
    
    onSelectComposer(closestComposer.id);
  };
  
  return (
    <div className="time-axis-container">
      <div className="time-axis-header">
        <h2>🎵 Music History Timeline</h2>
      </div>
      
      <div className="time-axis-content">
        <div className="timeline-layer">
          <div className="timeline-track" onClick={handleTimelineClick}>
            <div className="timeline-line" />
            
            <div className="composers-layer">
              {composers.map(composer => {
                const birthYear = getYearFromLifeDates(composer.lifeDates);
                const percentage = (birthYear - minYear) / yearRange * 100;
                const isSelected = selectedComposerId === composer.id;
                
                return (
                  <div 
                    key={composer.id}
                    className={`composer-marker ${isSelected ? 'selected' : ''}`}
                    style={{ 
                      left: `${percentage}%`,
                      backgroundColor: eraColors[composer.era] || '#3b82f6'
                    }}
                    onClick={() => onSelectComposer(composer.id)}
                    title={`${composer.label} (${composer.lifeDates}) - ${composer.era}`}
                  >
                    <div className="composer-dot" />
                    <div className="composer-label">
                      {composer.label.split(' ').pop() || composer.label.substring(0, 8)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      <div className="time-axis-legend">
        <div className="legend-title">Eras:</div>
        {Object.entries(eraColors).map(([era, color]) => (
          <div key={era} className="legend-item">
            <span className="legend-color" style={{ backgroundColor: color }} />
            <span className="legend-label">{era}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeAxis;
