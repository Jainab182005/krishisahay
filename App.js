import { useState } from "react";

function MyApp() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [language, setLanguage] = useState("en");

  // 🌍 Language Codes for Voice Recognition
  const languageCodes = {
    en: "en-IN",
    hi: "hi-IN",
    te: "te-IN",
    ta: "ta-IN",
    kn: "kn-IN",
  };

  // 🌍 Language Text Dictionary
  const translations = {
    en: {
      title: "🌾 KrishiSahay",
      subtitle: "Generative AI Powered Agricultural Assistant",
      placeholder: "Ask your farming question...",
      ask: "Ask AI",
      responseTitle: "AI Response",
      voice: "🎤 Voice Input",
      pest: "🪲 Use neem oil spray or organic pesticide.",
      wheat: "🌾 Wheat grows well in loamy soil.",
      rice: "🌱 Rice requires clayey soil and water.",
      fertilizer: "🌿 Use balanced NPK fertilizer.",
      default: "🤖 Please provide more details.",
    },
    hi: {
      title: "🌾 कृषि सहायक",
      subtitle: "एआई आधारित कृषि सहायक",
      placeholder: "अपना कृषि प्रश्न पूछें...",
      ask: "पूछें",
      responseTitle: "एआई उत्तर",
      voice: "🎤 आवाज़ इनपुट",
      pest: "🪲 नीम तेल स्प्रे या जैविक कीटनाशक का उपयोग करें।",
      wheat: "🌾 गेहूं दोमट मिट्टी में अच्छी तरह उगता है।",
      rice: "🌱 चावल को चिकनी मिट्टी और पानी की आवश्यकता होती है।",
      fertilizer: "🌿 संतुलित NPK उर्वरक का उपयोग करें।",
      default: "🤖 कृपया अधिक विवरण दें।",
    },
    te: {
      title: "🌾 కృషి సహాయ్",
      subtitle: "AI ఆధారిత వ్యవసాయ సహాయకుడు",
      placeholder: "మీ వ్యవసాయ ప్రశ్న అడగండి...",
      ask: "అడగండి",
      responseTitle: "AI సమాధానం",
      voice: "🎤 వాయిస్ ఇన్‌పుట్",
      pest: "🪲 వేప నూనె స్ప్రే లేదా సేంద్రియ పురుగుమందు వాడండి.",
      wheat: "🌾 గోధుమలు లోమీ మట్టిలో బాగా పెరుగుతాయి.",
      rice: "🌱 బియ్యం మట్టికట్టైన నేల మరియు నీరు అవసరం.",
      fertilizer: "🌿 సమతుల్య NPK ఎరువు వాడండి.",
      default: "🤖 దయచేసి మరింత వివరాలు ఇవ్వండి.",
    },
    ta: {
      title: "🌾 கிருஷி உதவி",
      subtitle: "AI அடிப்படையிலான விவசாய உதவியாளர்",
      placeholder: "உங்கள் விவசாய கேள்வியை கேளுங்கள்...",
      ask: "கேள்",
      responseTitle: "AI பதில்",
      voice: "🎤 குரல் உள்ளீடு",
      pest: "🪲 வேப்பெண்ணெய் தெளிப்பு அல்லது உயிர் பூச்சிக்கொல்லி பயன்படுத்தவும்.",
      wheat: "🌾 கோதுமை மண்மேல் நன்றாக வளரும்.",
      rice: "🌱 அரிசி களிமண் மற்றும் நீர் தேவை.",
      fertilizer: "🌿 சமநிலை NPK உரம் பயன்படுத்தவும்.",
      default: "🤖 மேலும் விவரங்களை வழங்கவும்.",
    },
    kn: {
      title: "🌾 ಕೃಷಿ ಸಹಾಯ",
      subtitle: "AI ಆಧಾರಿತ ಕೃಷಿ ಸಹಾಯಕ",
      placeholder: "ನಿಮ್ಮ ಕೃಷಿ ಪ್ರಶ್ನೆ ಕೇಳಿ...",
      ask: "ಕೇಳಿ",
      responseTitle: "AI ಉತ್ತರ",
      voice: "🎤 ಧ್ವನಿ ಇನ್‌ಪುಟ್",
      pest: "🪲 ನೀಮ್ ಎಣ್ಣೆ ಸ್ಪ್ರೇ ಅಥವಾ ಸಾವಯವ ಕೀಟನಾಶಕ ಬಳಸಿ.",
      wheat: "🌾 ಗೋಧಿ ಲೋಮಿ ಮಣ್ಣಿನಲ್ಲಿ ಚೆನ್ನಾಗಿ ಬೆಳೆಯುತ್ತದೆ.",
      rice: "🌱 ಅಕ್ಕಿಗೆ ಮಣ್ಣು ಮತ್ತು ನೀರು ಅಗತ್ಯ.",
      fertilizer: "🌿 ಸಮತೋಲನ NPK ರಸಗೊಬ್ಬರ ಬಳಸಿ.",
      default: "🤖 ದಯವಿಟ್ಟು ಹೆಚ್ಚಿನ ವಿವರ ನೀಡಿ.",
    },
  };

  const t = translations[language];

  const handleSubmit = (e) => {
    e.preventDefault();
    const userQuery = query.toLowerCase();
    let reply = "";

    if (
      userQuery.includes("pest") ||
      userQuery.includes("कीट") ||
      userQuery.includes("పురుగు")
    ) {
      reply = t.pest;
    } else if (
      userQuery.includes("wheat") ||
      userQuery.includes("गेहूं") ||
      userQuery.includes("గోధుమ")
    ) {
      reply = t.wheat;
    } else if (
      userQuery.includes("rice") ||
      userQuery.includes("चावल") ||
      userQuery.includes("బియ్యం")
    ) {
      reply = t.rice;
    } else if (
      userQuery.includes("fertilizer") ||
      userQuery.includes("उर्वरक") ||
      userQuery.includes("ఎరువు")
    ) {
      reply = t.fertilizer;
    } else {
      reply = t.default;
    }

    setResponse(reply);
    speakText(reply);
    setQuery("");
  };

  // 🔊 Speak Output
  const speakText = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = languageCodes[language];
    window.speechSynthesis.speak(speech);
  };

  // 🎤 Voice Input
  const startListening = () => {
    const recognition =
      new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    recognition.lang = languageCodes[language];
    recognition.start();

    recognition.onresult = (event) => {
      setQuery(event.results[0][0].transcript);
    };
  };

  return (
    <div style={styles.outer}>
      <div style={styles.inner}>
        <h1 style={styles.title}>{t.title}</h1>
        <p style={styles.subtitle}>{t.subtitle}</p>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={styles.languageSelect}
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
          <option value="te">తెలుగు</option>
          <option value="ta">தமிழ்</option>
          <option value="kn">ಕನ್ನಡ</option>
        </select>

        <input
          type="text"
          placeholder={t.placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleSubmit} style={styles.button}>
          {t.ask}
        </button>

        <button onClick={startListening} style={styles.voiceButton}>
          {t.voice}
        </button>

        {response && (
          <div style={styles.responseBox}>
            <h3 style={styles.responseTitle}>{t.responseTitle}</h3>
            <p style={styles.responseText}>{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  outer: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e6f7ec",
    fontFamily: "Arial, sans-serif",
  },
  inner: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: "15px",
    backgroundColor: "#ffffff",
    padding: "35px",
    borderRadius: "15px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    width: "380px",
  },
  title: { margin: 0, color: "#166534", fontSize: "26px" },
  subtitle: { fontSize: "14px", color: "#555" },
  languageSelect: {
    width: "100%",
    padding: "8px",
    fontSize: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  voiceButton: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#0ea5e9",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  responseBox: {
    marginTop: "15px",
    background: "#bbf7d0",
    padding: "20px",
    borderRadius: "10px",
    width: "100%",
    border: "2px solid #15803d",
  },
  responseTitle: {
    margin: "0 0 10px 0",
    color: "#065f46",
    fontSize: "18px",
  },
  responseText: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "bold",
    color: "#064e3b",
  },
};

export default MyApp;