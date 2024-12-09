import React, { useState } from 'react';
import Table from '../../components/contentmanagementsystem/Table';

// The content for each choice
const contentData = {
  News: "Latest news and updates in various fields.",
  Events: "Upcoming events and seminars you can attend.",
  Reporting: "Detailed reports and analysis on various topics.",
  Forum: "Join the community discussion in the forum."
};

const ContentManagementSystem = () => {
  // State to track the selected content type
  const [selectedContent, setSelectedContent] = useState('News');

  return (
    <Table></Table>
  );
};

export default ContentManagementSystem;
