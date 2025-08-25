import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

type VoiceChatState = 'idle' | 'listening' | 'processing' | 'speaking';

export const VoiceChat = () => {
  const [state, setState] = useState<VoiceChatState>('idle');
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setState('listening');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Please allow microphone access to use voice chat.');
      setState('idle');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setState('processing');
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    // TODO: Implement Gemini Live API integration
    // For now, simulate processing
    setTranscript('Processing your voice...');
    
    setTimeout(() => {
      setTranscript('Hello! I heard your voice.');
      setResponse('Thanks for testing the voice chat! The Gemini Live API integration will be implemented next.');
      setState('speaking');
      
      setTimeout(() => {
        setState('idle');
        setTranscript('');
        setResponse('');
      }, 3000);
    }, 1500);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const getStatusText = () => {
    switch (state) {
      case 'listening':
        return 'Listening...';
      case 'processing':
        return 'Processing...';
      case 'speaking':
        return 'Speaking...';
      default:
        return 'Tap to start talking';
    }
  };

  const getButtonIcon = () => {
    if (state === 'listening') {
      return <MicOff className="h-8 w-8" />;
    }
    return <Mic className="h-8 w-8" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-voice-surface to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center space-y-8 shadow-voice">
        {/* Logo Area */}
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto voice-gradient rounded-full flex items-center justify-center shadow-glow">
            <Mic className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Talk to Rev</h1>
        </div>

        {/* Voice Button */}
        <div className="space-y-6">
          <div className="relative">
            <Button
              onClick={toggleRecording}
              size="lg"
              variant="voice"
              className={cn(
                "w-24 h-24 rounded-full text-2xl",
                state === 'listening' && "animate-listening",
                state === 'processing' && "animate-pulse-slow"
              )}
              disabled={state === 'processing'}
            >
              {getButtonIcon()}
            </Button>
            
            {/* Status indicator */}
            {state === 'listening' && (
              <div className="absolute inset-0 rounded-full border-4 border-voice-primary/30 animate-ping" />
            )}
          </div>

          {/* Status Text */}
          <p className="text-lg font-medium text-muted-foreground">
            {getStatusText()}
          </p>
        </div>

        {/* Transcript and Response */}
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

        {/* Controls */}
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

        {/* Instructions */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Tap and hold to speak</p>
          <p>• You can interrupt Rev while speaking</p>
          <p>• Supports multiple languages</p>
        </div>
      </Card>
    </div>
  );
};