import React from 'react';

interface HomeTabsProps {}

function HomeTabs(props: HomeTabsProps) {
  return (
    <div className="tabs">
      <div className="active">
        <span>All</span>
      </div>
      <div>
        <span>Technical Skill</span>
      </div>
      <div>
        <span>Team Fit</span>
      </div>
      <div>
        <span>Personal Motivation</span>
      </div>
      <div>
        <span>Fun / Other</span>
      </div>
    </div>
  );
}

export default HomeTabs;
