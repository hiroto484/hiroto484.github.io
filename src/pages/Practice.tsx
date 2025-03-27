import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
} from '@mui/material';
import {
  Mic as MicIcon,
  Stop as StopIcon,
  PlayArrow as PlayArrowIcon,
} from '@mui/icons-material';
import DAFComponent from '../components/DAFComponent';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const Practice: React.FC = () => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (window.SpeechRecognition || (window as any).webkitSpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'ja-JP';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
          setTranscript(transcript);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleRecordToggle = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
    setIsRecording(!isRecording);
  };

  const handleTextToSpeech = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      window.speechSynthesis.speak(utterance);
    } else {
      alert('お使いのブラウザは音声合成をサポートしていません。');
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        音読練習
      </Typography>
      <Typography variant="body1" gutterBottom color="textSecondary">
        テキストを入力して音読練習を始めましょう。音声認識で発話を確認できます。
      </Typography>

      <DAFComponent />

      <Paper sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          練習テキスト
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="ここに練習したいテキストを入力してください"
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleTextToSpeech}
            startIcon={<PlayArrowIcon />}
            disabled={!text.trim()}
          >
            テキストを読み上げ
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          音声認識
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            color={isRecording ? 'secondary' : 'primary'}
            onClick={handleRecordToggle}
            startIcon={isRecording ? <StopIcon /> : <MicIcon />}
            disabled={!window.SpeechRecognition && !(window as any).webkitSpeechRecognition}
          >
            {isRecording ? '録音停止' : '録音開始'}
          </Button>
        </Box>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={transcript}
          placeholder="音声認識の結果がここに表示されます"
          variant="outlined"
          disabled
        />
      </Paper>
    </Container>
  );
};

export default Practice; 