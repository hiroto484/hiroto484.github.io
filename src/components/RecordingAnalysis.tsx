import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import { storage, db } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';

interface AnalysisResult {
  type: 'positive' | 'negative' | 'suggestion';
  content: string;
}

const RecordingAnalysis: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await analyzeRecording(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('録音エラー:', err);
      setError('マイクへのアクセスに失敗しました。マイクの権限を確認してください。');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const analyzeRecording = async (audioBlob: Blob) => {
    try {
      setIsAnalyzing(true);
      setError(null);

      // Firebaseに音声ファイルをアップロード
      const storageRef = ref(storage, `recordings/${Date.now()}.wav`);
      await uploadBytes(storageRef, audioBlob);
      const audioUrl = await getDownloadURL(storageRef);

      // OpenAI Whisperで音声をテキストに変換
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioUrl }),
      });
      const { text } = await response.json();

      // GPTで分析
      const analysisResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const analysis = await analysisResponse.json();

      // 分析結果を保存
      await addDoc(collection(db, 'analyses'), {
        text,
        analysis,
        timestamp: new Date(),
      });

      setAnalysisResults(analysis);
    } catch (err) {
      console.error('分析エラー:', err);
      setError('音声の分析中にエラーが発生しました。');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getIconByType = (type: string) => {
    switch (type) {
      case 'positive':
        return <CheckCircleIcon color="success" />;
      case 'negative':
        return <ErrorIcon color="error" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        音声分析
      </Typography>
      <Typography variant="body1" paragraph>
        録音した音声をAIが分析し、改善点や問題点を指摘します。
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          color={isRecording ? "error" : "primary"}
          startIcon={isRecording ? <StopIcon /> : <MicIcon />}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isAnalyzing}
        >
          {isRecording ? '録音停止' : '録音開始'}
        </Button>
      </Box>

      {isAnalyzing && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {analysisResults.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            分析結果
          </Typography>
          <List>
            {analysisResults.map((result, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  {getIconByType(result.type)}
                </ListItemIcon>
                <ListItemText primary={result.content} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Paper>
  );
};

export default RecordingAnalysis; 