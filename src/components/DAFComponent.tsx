import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Slider,
  Typography,
  Paper,
  Switch,
  FormControlLabel,
} from '@mui/material';

const DAFComponent: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [delay, setDelay] = useState(200);
  const [volume, setVolume] = useState(0.5);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const delayNodeRef = useRef<DelayNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    return () => {
      stopDAF();
    };
  }, []);

  const startDAF = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      audioContextRef.current = new AudioContext();
      sourceNodeRef.current = audioContextRef.current.createMediaStreamSource(stream);
      delayNodeRef.current = audioContextRef.current.createDelay();
      gainNodeRef.current = audioContextRef.current.createGain();

      delayNodeRef.current.delayTime.value = delay / 1000;
      gainNodeRef.current.gain.value = volume;

      sourceNodeRef.current
        .connect(delayNodeRef.current)
        .connect(gainNodeRef.current)
        .connect(audioContextRef.current.destination);

      setIsEnabled(true);
    } catch (error) {
      console.error('DAFの開始に失敗しました:', error);
      alert('マイクへのアクセスを許可してください。');
    }
  };

  const stopDAF = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsEnabled(false);
  };

  const handleDelayChange = (event: Event, newValue: number | number[]) => {
    const value = Array.isArray(newValue) ? newValue[0] : newValue;
    setDelay(value);
    if (delayNodeRef.current) {
      delayNodeRef.current.delayTime.value = value / 1000;
    }
  };

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    const value = Array.isArray(newValue) ? newValue[0] : newValue;
    setVolume(value);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = value;
    }
  };

  const handleToggle = () => {
    if (isEnabled) {
      stopDAF();
    } else {
      startDAF();
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        遅延聴覚フィードバック（DAF）
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        イヤホンまたはヘッドホンの使用が必要です。発話を遅延させて聞くことで、より流暢な発話を練習できます。
      </Typography>
      <FormControlLabel
        control={
          <Switch
            checked={isEnabled}
            onChange={handleToggle}
            color="primary"
          />
        }
        label="DAFを有効にする"
      />
      <Box sx={{ mt: 2 }}>
        <Typography gutterBottom>
          遅延時間: {delay}ms
        </Typography>
        <Slider
          value={delay}
          onChange={handleDelayChange}
          min={50}
          max={500}
          step={10}
          disabled={!isEnabled}
          valueLabelDisplay="auto"
        />
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography gutterBottom>
          音量: {Math.round(volume * 100)}%
        </Typography>
        <Slider
          value={volume}
          onChange={handleVolumeChange}
          min={0}
          max={1}
          step={0.1}
          disabled={!isEnabled}
          valueLabelDisplay="auto"
        />
      </Box>
    </Paper>
  );
};

export default DAFComponent; 