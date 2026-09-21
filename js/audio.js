window.KarateAudio = {
    speak(text) {
        if (!('speechSynthesis' in window)) {
            window.dispatchEvent(new CustomEvent('karate:audio-unavailable'));
            return;
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        utterance.rate = 0.82;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
    }
};
