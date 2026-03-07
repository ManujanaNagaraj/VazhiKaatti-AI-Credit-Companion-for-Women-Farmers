import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'வணக்கம்! நான் வழிகாட்டி உதவியாளர். உங்களுக்கு எவ்வாறு உதவ முடியும்?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Pre-set Q&A database in Tamil
  const qaDatabase = [
    {
      keywords: ['மதிப்பெண்', 'கணக்கிடப்படுகிறது', 'கணக்கிடு', 'எப்படி கணக்கிடுகிறீர்கள்', 'கிரெடிட் ஸ்கோர்'],
      question: 'என் மதிப்பெண் எப்படி கணக்கிடப்படுகிறது?',
      answer: `உங்கள் கடன் மதிப்பெண் பல காரணிகளின் அடிப்படையில் கணக்கிடப்படுகிறது:

📊 முக்கிய காரணிகள்:
1. விவசாய அனுபவம் (Years of farming)
2. ஆண்டு வருமானம் (Annual income)
3. SHG உறுப்பினர் நிலை
4. PM-KISAN பதிவு
5. வங்கி கணக்கு உள்ளதா
6. தற்போதைய கடன்கள்
7. நில பரப்பு
8. பயிர் காப்பீடு
9. கடன் திருப்பிச் செலுத்தும் பதிவு
10. வானிலை அபாய காரணி

💡 நமது AI மாடல் இந்த காரணிகளை பகுப்பாய்வு செய்து 0-100 மதிப்பெண் வழங்குகிறது.`
    },
    {
      keywords: ['KCC', 'கடன்', 'விண்ணப்பிப்பது', 'விண்ணப்பம்', 'கிசான் கிரெடிட் கார்ட்', 'லோன்'],
      question: 'KCC கடன் எப்படி விண்ணப்பிப்பது?',
      answer: `Kisan Credit Card (KCC) விண்ணப்பிக்கும் படிமுறைகள்:

📝 படிகள்:
1. வழிகாட்டியில் உங்கள் மதிப்பெண் சரிபார்க்கவும் (70+ பரிந்துரைக்கப்படுகிறது)
2. தேவையான ஆவணங்களை சேகரிக்கவும்:
   - ஆதார் அட்டை
   - நில பத்திரங்கள் (Patta/Chitta)
   - வங்கி கணக்கு விபரங்கள்
   - வருமான சான்றிதழ்

3. அருகிலுள்ள வங்கி/கூட்டுறவு சங்கத்தை அணுகவும்
4. KCC விண்ணப்ப படிவம் நிரப்பவும்
5. ஆவணங்களை சமர்ப்பிக்கவும்
6. வங்கி அதிகாரி சரிபார்ப்பு
7. 7-15 நாட்களில் அங்கீகாரம்

🏦 வங்கிகள்: முதல்வர் கூட்டுறவு வங்கி, பாரத ஸ்டேட் வங்கி, NABARD`
    },
    {
      keywords: ['SHG', 'சுய உதவி', 'குழு', 'பெண்கள் குழு', 'சங்கம்'],
      question: 'SHG என்றால் என்ன?',
      answer: `Self Help Group (SHG) - சுய உதவி குழு விளக்கம்:

👥 SHG என்றால் என்ன?
சுய உதவி குழு என்பது 10-20 பெண்கள் (அ) விவசாயிகள் இணைந்து உருவாக்கும் சேமிப்பு மற்றும் கடன் குழுவாகும்.

✨ நன்மைகள்:
1. குறைந்த வட்டியில் கடன் வாய்ப்பு (4-8%)
2. வங்கி கடனுக்கு எளிதான அணுகல்
3. நிதி பயிற்சி மற்றும் வழிகாட்டுதல்
4. குழு சேமிப்பு மூலம் அவசர நிதி
5. அரசு திட்டங்களில் முன்னுரிமை
6. கடன் மதிப்பெண் மேம்பாடு (+10 points!)

💰 கடன் வரம்பு: ₹50,000 - ₹5 lakhs
🏛️ தொடர்பு: மாவட்ட கிராம வளர்ச்சி அலுவலகம் (DRDA)`
    },
    {
      keywords: ['மதிப்பெண் அதிகரிக்க', 'மேம்படுத்த', 'ஸ்கோர் உயர்த்த', 'எப்படி மேம்படுத்துவது', 'tips'],
      question: 'என் மதிப்பெண் எப்படி அதிகரிக்கலாம்?',
      answer: `கடன் மதிப்பெண் மேம்படுத்தும் வழிமுறைகள்:

🎯 உடனடி நடவடிக்கைகள்:
1. ✅ SHG குழுவில் சேரவும் (+10 புள்ளிகள்)
2. ✅ PM-KISAN பதிவு செய்யவும் (+5 புள்ளிகள்)
3. ✅ வங்கி கணக்கு திறக்கவும் (+5 புள்ளிகள்)
4. ✅ பயிர் காப்பீடு எடுக்கவும் (+8 புள்ளிகள்)

📈 நீண்ட கால முன்னேற்றம்:
1. கடன்களை சரியான நேரத்தில் திருப்பிச் செலுத்தவும்
2. விவசாய பதிவுகளை பராமரிக்கவும்
3. நில பரப்பை அதிகரிக்கவும் (வாடகை நிலமும் கணக்கிடப்படும்)
4. ஆண்டு வருமானத்தை அதிகரிக்கவும்
5. நிலையான விவசாய முறைகளை பின்பற்றவும்

⏰ சராசரியாக 6 மாதங்களில் 15-20 புள்ளிகள் மேம்பாடு சாத்தியம்!`
    },
    {
      keywords: ['திட்டங்கள்', 'அரசு திட்டம்', 'scheme', 'schemes', 'யோஜனா'],
      question: 'என்னென்ன அரசு திட்டங்கள் உள்ளன?',
      answer: `தமிழ்நாடு பெண் விவசாயிகளுக்கான முக்கிய திட்டங்கள்:

🌾 முக்கிய திட்டங்கள்:
1. PM-KISAN - ₹6,000/ஆண்டு நேரடி பணம்
2. KCC கடன் - 4% வட்டியில் ₹3 lakhs வரை
3. மகளிர் சுய உதவி குழு கடன்
4. பயிர் காப்பீடு திட்டம் (PMFBY)
5. மண் ஆரோக்கிய அட்டை திட்டம்
6. உழவர் சந்தை திட்டம்
7. இலவச விதை மானியம்

💡 உங்கள் மதிப்பெண் அடிப்படையில் வழிகாட்டி தானாக பொருத்தமான திட்டங்களை பரிந்துரை செய்யும்!`
    },
    {
      keywords: ['பயிர் விலை', 'விலை', 'market price', 'மார்க்கெட்', 'விற்பனை'],
      question: 'பயிர் விலை கணிப்பு எப்படி செயல்படுகிறது?',
      answer: `பயிர் விலை AI கணிப்பு அம்சம்:

🤖 எப்படி செயல்படுகிறது:
1. தற்போதைய சந்தை விலை
2. பருவம் (கார், ரபி, கோடை)
3. மழைப்பொழிவு அளவு
4. சந்தை தேவை

🎯 நீங்கள் பெறுவது:
- தற்போதைய சராசரி விலை (₹/kg)
- அடுத்த மாத கணிப்பு விலை
- விலை போக்கு (↑ உயரும் / ↓ குறையும்)
- விற்பனை பரிந்துரை

🌾 ஆதரவு பயிர்கள்:
நெல், வாழை, கரும்பு, பருத்தி, நிலக்கடலை, மஞ்சள், தக்காளி

📊 துல்லியம்: 75-90% நம்பகத்தன்மை`
    },
    {
      keywords: ['வானிலை', 'மழை', 'weather', 'வெள்ளம்', 'வறட்சி'],
      question: 'வானிலை அபாய மதிப்பீடு என்றால் என்ன?',
      answer: `வானிலை அபாய மதிப்பீடு விளக்கம்:

🌦️ என்ன செய்கிறோம்:
7 நாள் வானிலை முன்னறிவிப்பை பகுப்பாய்வு செய்து விவசாய அபாயங்களை கணிக்கிறோம்.

⚠️ அபாய வகைகள்:
1. 🔴 அதிக அபாயம்:
   - வெள்ளம் (>50mm மழை)
   - வறட்சி (<5mm + >38°C)
   - கடன் மதிப்பெண்: -5 புள்ளிகள்

2. 🟡 நடுத்தர அபாயம்:
   - வெப்ப அழுத்தம் (>38°C)
   - கடன் மதிப்பெண்: -2 புள்ளிகள்

3. 🟢 குறைந்த அபாயம்:
   - சாதகமான சூழல்
   - கடன் மதிப்பெண்: +3 புள்ளிகள்

💡 இது உங்கள் கடன் மதிப்பெண்ணில் தானாக கணக்கிடப்படுகிறது!`
    },
    {
      keywords: ['உதவி', 'help', 'கேள்வி', 'question', 'என்ன செய்ய', 'தொடர்பு'],
      question: 'இன்னும் என்ன கேட்கலாம்?',
      answer: `நான் பதிலளிக்கக்கூடிய கேள்விகள்:

❓ முக்கிய கேள்விகள்:
1. என் மதிப்பெண் எப்படி கணக்கிடப்படுகிறது?
2. KCC கடன் எப்படி விண்ணப்பிப்பது?
3. SHG என்றால் என்ன?
4. என் மதிப்பெண் எப்படி அதிகரிக்கலாம்?
5. என்னென்ன அரசு திட்டங்கள் உள்ளன?
6. பயிர் விலை கணிப்பு எப்படி செயல்படுகிறது?
7. வானிலை அபாய மதிப்பீடு என்றால் என்ன?

💬 மேலும் கேள்விகள் இருந்தால், தயங்காமல் கேளுங்கள்!

📞 அவசர உதவி:
Toll-free: 1800-180-1551 (PM-KISAN)
Agri Helpline: 18004191967`
    }
  ];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'ta-IN';
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Find best matching response
  const findBestMatch = (userInput) => {
    const lowerInput = userInput.toLowerCase();
    
    // Try to find exact keyword match
    for (const qa of qaDatabase) {
      for (const keyword of qa.keywords) {
        if (lowerInput.includes(keyword.toLowerCase())) {
          return qa.answer;
        }
      }
    }
    
    // Default response if no match
    return `மன்னிக்கவும், நான் இந்த கேள்விக்கு பதில் அளிக்க முடியவில்லை. 

தயவுசெய்து இந்த கேள்விகளில் ஒன்றை முயற்சிக்கவும்:
• என் மதிப்பெண் எப்படி கணக்கிடப்படுகிறது?
• KCC கடன் எப்படி விண்ணப்பிப்பது?
• SHG என்றால் என்ன?
• என் மதிப்பெண் எப்படி அதிகரிக்கலாம்?

அல்லது "உதவி" என்று தட்டச்சு செய்யவும்.`;
  };

  // Handle sending message
  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);

    // Find and add bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: findBestMatch(inputText),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 500);

    setInputText('');
  };

  // Handle voice input
  const handleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (error) {
        console.error('Speech recognition error:', error);
      }
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 rounded-full shadow-2xl flex items-center justify-center"
        style={{
          width: '60px',
          height: '60px',
          backgroundColor: '#D4A017',
          border: '3px solid #FAF7F0'
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={!isOpen ? {
          boxShadow: [
            '0 0 0 0 rgba(212, 160, 23, 0.7)',
            '0 0 0 20px rgba(212, 160, 23, 0)',
          ],
        } : {}}
        transition={{
          boxShadow: {
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-7 w-7" style={{ color: '#FAF7F0' }} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="h-7 w-7" style={{ color: '#FAF7F0' }} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed bottom-24 right-6 z-50 bg-white rounded-2xl shadow-2xl overflow-hidden"
            style={{
              width: '380px',
              height: '600px',
              maxHeight: '80vh',
              border: '2px solid #D4A017'
            }}
          >
            {/* Chat Header */}
            <div
              className="p-4 flex items-center space-x-3"
              style={{ backgroundColor: '#2D6A4F' }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#D4A017' }}
              >
                <span className="text-2xl">🌾</span>
              </div>
              <div>
                <h3
                  className="font-bold text-lg"
                  style={{ color: '#FAF7F0', fontFamily: 'Noto Sans Tamil, sans-serif' }}
                >
                  வழிகாட்டி உதவியாளர்
                </h3>
                <p className="text-xs" style={{ color: '#D4F1DD' }}>
                  Tamil Farming Assistant
                </p>
              </div>
            </div>

            {/* Messages Area */}
            <div
              className="overflow-y-auto p-4 space-y-3"
              style={{
                height: 'calc(100% - 140px)',
                backgroundColor: '#F5F5F0'
              }}
            >
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className="max-w-[80%] px-4 py-3 rounded-2xl shadow-sm"
                    style={{
                      backgroundColor: message.sender === 'user' ? '#FFE5B4' : '#2D6A4F',
                      color: message.sender === 'user' ? '#1B4332' : '#FAF7F0',
                      borderBottomRightRadius: message.sender === 'user' ? '4px' : '16px',
                      borderBottomLeftRadius: message.sender === 'user' ? '16px' : '4px',
                      fontFamily: 'Noto Sans Tamil, sans-serif',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      whiteSpace: 'pre-line'
                    }}
                  >
                    {message.text}
                    <div
                      className="text-xs mt-1 opacity-70"
                      style={{ fontSize: '10px' }}
                    >
                      {message.timestamp.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div
              className="p-3 border-t"
              style={{ borderColor: '#D4A017', backgroundColor: '#FAF7F0' }}
            >
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="உங்கள் கேள்வியை தட்டச்சு செய்யவும்..."
                  className="flex-1 px-4 py-2 rounded-full border-2 focus:outline-none focus:ring-2"
                  style={{
                    borderColor: '#D4A017',
                    fontFamily: 'Noto Sans Tamil, sans-serif',
                    fontSize: '14px'
                  }}
                />
                
                {/* Voice Input Button */}
                <button
                  onClick={handleVoiceInput}
                  className="p-2 rounded-full transition-all"
                  style={{
                    backgroundColor: isListening ? '#C0392B' : '#6B4226',
                    color: '#FAF7F0'
                  }}
                  title="Voice input (Tamil)"
                >
                  {isListening ? (
                    <MicOff className="h-5 w-5" />
                  ) : (
                    <Mic className="h-5 w-5" />
                  )}
                </button>

                {/* Send Button */}
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  className="p-2 rounded-full transition-all disabled:opacity-50"
                  style={{
                    backgroundColor: '#2D6A4F',
                    color: '#FAF7F0'
                  }}
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
              
              {isListening && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs mt-2 text-center"
                  style={{ color: '#C0392B', fontFamily: 'Noto Sans Tamil, sans-serif' }}
                >
                  🎤 கேட்கிறேன்... பேசுங்கள்
                </motion.p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
