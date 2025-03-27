import React from 'react';
import { Container, Typography } from '@mui/material';
import RecordingAnalysis from '../components/RecordingAnalysis';

const Recording: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        録音と分析
      </Typography>
      <Typography variant="body1" paragraph>
        音声を録音して、AIによる分析を受けることができます。
        分析では、発話の流暢性、詰まりやすい箇所、呼吸の管理などについてフィードバックが得られます。
      </Typography>
      <RecordingAnalysis />
    </Container>
  );
};

export default Recording; 