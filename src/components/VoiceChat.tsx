import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GoogleGenerativeAI } from "@google/generative-ai";
import companyPrompt from '../companyPrompt'; // adjust path if needed


type VoiceChatState = 'idle' | 'listening' | 'processing' | 'speaking';
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);

export const VoiceChat = () => {
  const [state, setState] = useState<VoiceChatState>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [log, setLog] = useState<{ transcript: string; response: string }[]>([]);
  const recognitionRef = useRef<any>(null);

  // --- Start recording ---
  const startRecording = () => {
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) return alert('SpeechRecognition API not supported');

    // Always create a NEW recognition instance
    const recog = new SpeechRecognition();
    recog.lang = 'en-US';
    recog.interimResults = false;
    recog.maxAlternatives = 1;

    recog.onstart = () => {
      setState('listening');
      setTranscript('');
      setResponse('');
    };

    recog.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setState('processing');
      sendToGemini(text);
    };

    recog.onend = () => {
      // reset ref so we can start fresh next time
      recognitionRef.current = null;
      // only reset to idle if we’re not already processing/speaking
      if (state === 'listening') {
        setState('idle');
      }
    };

    recog.onerror = (e) => {
      console.error(e);
      setResponse('Speech recognition error.');
      setState('idle');
      recognitionRef.current = null;
    };

    recog.start();
    recognitionRef.current = recog;
  };

  // --- Stop recording ---
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = null; 
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setState('idle');
  };

  // --- Browser TTS (instant) ---
  const speakText = (text: string) => {
    if (!text) return;
    window.speechSynthesis.cancel();

    // Detect Hindi characters
    const isHindi = /[\u0900-\u097F]/.test(text);
    const lang = isHindi ? 'hi-IN' : 'en-US';

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onend = () => {
      // when speech ends, allow new input
      setState('idle');
    };

    window.speechSynthesis.speak(utterance);
  };

  // --- Send text to Gemini chat ---
  const sendToGemini = async (text: string) => {
    try {
      if (!apiKey) {
        setResponse('Gemini API key is not set.');
        setState('idle');
        return;
      }
      const finalPrompt = `${companyPrompt}\n\nUser: ${text}\nAssistant:`;

      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(finalPrompt);
      const responseText = await result.response.text();

      setResponse(responseText);
      setLog((prev) => [...prev, { transcript: text, response: responseText }]);
      setState('speaking');

      if (!isMuted) speakText(responseText);
    } catch (err) {
      console.error(err);
      setResponse('Error contacting Gemini API.');
      setState('idle');
    }
  };

  const handleVoiceButton = () => {
    if (state === 'idle') {
      setTranscript('');
      setResponse('');
      // Always cancel any ongoing speech before starting recognition
      window.speechSynthesis.cancel();
      // Add a short delay to ensure speech engine is stopped
      setTimeout(() => {
        startRecording();
      }, 150);
    } else if (state === 'speaking') {
      stopSpeaking(); // allow interruption
    } else if (state === 'listening') {
      stopRecording();
    }
  };

  const getButtonIcon = () => {
    if (state === 'listening') return <MicOff className="h-8 w-8" />;
    if (state === 'speaking') return <VolumeX className="h-8 w-8" />;
    return <Mic className="h-8 w-8" />;
  };

  const getStatusText = () => {
    switch (state) {
      case 'listening': return 'Listening...';
      case 'processing': return 'Processing...';
      case 'speaking': return 'Speaking...';
      default: return 'Tap and hold to start talking';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-voice-surface to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center space-y-8 shadow-voice">
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto voice-gradient rounded-full flex items-center justify-center shadow-glow">
            <Mic className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Talk to Rev</h1>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <Button
              onMouseDown={handleVoiceButton}
              onMouseUp={() => state === 'listening' && stopRecording()}
              onMouseLeave={() => state === 'listening' && stopRecording()}
              onTouchStart={handleVoiceButton}
              onTouchEnd={() => state === 'listening' && stopRecording()}
              size="lg"
              variant="voice"
              className={cn(
                'w-24 h-24 rounded-full text-2xl',
                state === 'listening' && 'animate-listening',
                state === 'processing' && 'animate-pulse-slow'
              )}
              disabled={state === 'processing'}
            >
              {getButtonIcon()}
            </Button>

            {state === 'listening' && (
              <div className="absolute inset-0 rounded-full border-4 border-voice-primary/30 animate-ping" />
            )}
          </div>
          <p className="text-lg font-medium text-muted-foreground">{getStatusText()}</p>
        </div>

        {(transcript || response) && (
          <div className="space-y-4 text-left">
            {transcript && (
              <div className="voice-glow rounded-lg p-4">
                <p className="text-sm font-medium text-voice-primary mb-1">You said:</p>
                <p className="text-foreground">{transcript}</p>
              </div>
            )}
            {response && (
              <div className="bg-voice-surface border border-voice-primary/20 rounded-lg p-4">
                <p className="text-sm font-medium text-voice-primary mb-1">Rev:</p>
                <p className="text-foreground">{response}</p>
              </div>
            )}
          </div>
        )}

        {log.length > 0 && (
          <div className="mt-4 text-left">
            <h2 className="text-xs font-bold text-muted-foreground mb-2">History</h2>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {log.map((item, idx) => (
                <div key={idx} className="border border-voice-primary/10 rounded p-2 bg-background/50">
                  <div className="text-xs text-voice-primary">You: <span className="text-foreground">{item.transcript}</span></div>
                  <div className="text-xs text-voice-primary">Rev: <span className="text-foreground">{item.response}</span></div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center space-x-4">
          <Button
            variant="voice-secondary"
            size="sm"
            onClick={() => setIsMuted(!isMuted)}
            className="rounded-full"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Tap and hold to speak</p>
          <p>• You can interrupt Rev while speaking</p>
          <p>• Supports multiple languages</p>
        </div>
      </Card>
    </div>
  );
};
