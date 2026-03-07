# Tamil Farming Assistant Chatbot - VazhiKaatti

## Overview
AI-powered Tamil chatbot with pre-set responses, voice input, and WhatsApp-style UI to help farmers with common questions about credit scoring, government schemes, and farming resources.

## Features

### 💬 Chatbot Capabilities
- **8 Pre-set Q&A Topics** covering all major farmer questions
- **Keyword Matching Algorithm** for intelligent response selection
- **Voice Input Support** (Tamil - ta-IN)
- **WhatsApp-style UI** with familiar chat bubbles
- **Floating Button** with pulsing animation
- **Responsive Design** adapts to all screen sizes

### 🎤 Voice Recognition
- **Browser-based Speech Recognition** (Web Speech API)
- **Tamil Language Support** (ta-IN)
- **Real-time Transcription** converts speech to text
- **Visual Feedback** shows listening status

### 🎨 Design Highlights
- **Color Scheme:**
  - Bot messages: Forest Green (#2D6A4F)
  - User messages: Cream (#FFE5B4)
  - Floating button: Gold (#D4A017) with pulsing glow
  - Background: Light cream (#F5F5F0)
- **Typography:** Noto Sans Tamil font for Tamil text
- **Animations:** Smooth framer-motion transitions

## Component Implementation

### File: `frontend/src/components/ChatBot.jsx`

**Key Components:**

#### 1. Floating Chat Button
```jsx
<motion.button
  animate={{
    boxShadow: [
      '0 0 0 0 rgba(212, 160, 23, 0.7)',
      '0 0 0 20px rgba(212, 160, 23, 0)',
    ],
  }}
  // Pulsing gold button at bottom-right
/>
```

**Features:**
- Fixed position: `bottom-6 right-6`
- Gold circular background (#D4A017)
- Pulsing animation when closed
- Icon toggles between 💬 (MessageCircle) and ✕ (X)

#### 2. Chat Window
**Dimensions:**
- Width: 380px
- Height: 600px (max 80vh)
- Position: Bottom-right, above button

**Structure:**
```
┌─────────────────────────┐
│ Chat Header (Green)     │
├─────────────────────────┤
│ Messages Area (Cream)   │
│ ├─ Bot message (Green)  │
│ └─ User message (Cream) │
├─────────────────────────┤
│ Input Area              │
│ [Text Input][🎤][Send]  │
└─────────────────────────┘
```

#### 3. Message Bubbles
**Bot Messages:**
- Background: #2D6A4F (forest green)
- Text color: #FAF7F0 (cream)
- Aligned: Left
- Border radius: Rounded bottom-left corner

**User Messages:**
- Background: #FFE5B4 (cream)
- Text color: #1B4332 (dark green)
- Aligned: Right
- Border radius: Rounded bottom-right corner

#### 4. Input Methods
**Text Input:**
- Full-width rounded input field
- Enter key to send
- Gold border (#D4A017)
- Tamil font support

**Voice Input:**
- Microphone button (🎤)
- Red background when listening
- Speech-to-text transcription
- Auto-fills input field

## Pre-set Q&A Database

### 1. Credit Score Calculation
**Keywords:** `மதிப்பெண்`, `கணக்கிடப்படுகிறது`, `கிரெடிட் ஸ்கோர்`

**Answer Provides:**
- List of 10 key factors
- Explanation of AI model
- Scoring range (0-100)

### 2. KCC Loan Application
**Keywords:** `KCC`, `கடன்`, `விண்ணப்பிப்பது`, `கிசான் கிரெடிட் கார்ட்`

**Answer Provides:**
- 7-step application process
- Required documents list
- Bank contacts
- Timeline (7-15 days)

### 3. Self Help Groups (SHG)
**Keywords:** `SHG`, `சுய உதவி`, `குழு`, `பெண்கள் குழு`

**Answer Provides:**
- SHG definition
- 6 key benefits
- Loan range (₹50,000 - ₹5 lakhs)
- Contact information (DRDA)
- Credit score boost (+10 points)

### 4. Improve Credit Score
**Keywords:** `மதிப்பெண் அதிகரிக்க`, `மேம்படுத்த`, `ஸ்கோர் உயர்த்த`

**Answer Provides:**
- 4 immediate actions
- 5 long-term strategies
- Point improvements for each action
- Timeline estimate (6 months for 15-20 points)

### 5. Government Schemes
**Keywords:** `திட்டங்கள்`, `அரசு திட்டம்`, `scheme`, `யோஜனா`

**Answer Provides:**
- 7 major Tamil Nadu schemes
- PM-KISAN details (₹6,000/year)
- KCC loan terms (4% interest)
- Auto-recommendation feature

### 6. Crop Price Prediction
**Keywords:** `பயிர் விலை`, `விலை`, `market price`, `மார்க்கெட்`

**Answer Provides:**
- How prediction works (4 factors)
- What farmers receive
- 7 supported crops
- Accuracy: 75-90%

### 7. Weather Risk Assessment
**Keywords:** `வானிலை`, `மழை`, `weather`, `வெள்ளம்`, `வறட்சி`

**Answer Provides:**
- 7-day forecast analysis
- 3 risk types (flood, drought, heat stress)
- Credit score impact (-5 to +3 points)
- Color-coded risk levels (🔴🟡🟢)

### 8. Help/FAQ
**Keywords:** `உதவி`, `help`, `கேள்வி`, `தொடர்பு`

**Answer Provides:**
- List of all 7 answerable questions
- Emergency helpline numbers
- PM-KISAN: 1800-180-1551
- Agri Helpline: 18004191967

## Keyword Matching Algorithm

### How It Works:
```javascript
const findBestMatch = (userInput) => {
  const lowerInput = userInput.toLowerCase();
  
  // Check each Q&A in database
  for (const qa of qaDatabase) {
    // Check each keyword
    for (const keyword of qa.keywords) {
      // Case-insensitive partial match
      if (lowerInput.includes(keyword.toLowerCase())) {
        return qa.answer;
      }
    }
  }
  
  // Default response if no match found
  return "மன்னிக்கவும், நான் இந்த கேள்விக்கு பதில் அளிக்க முடியவில்லை...";
};
```

**Matching Logic:**
1. Convert user input to lowercase
2. Loop through all Q&A entries
3. Check if any keyword appears in input
4. Return first matching answer
5. If no match, return helpful default response

**Example Matches:**
- "என் ஸ்கோர் எப்படி கணக்கிடுகிறீர்கள்?" → Matches `கணக்கிடு` → Credit Score Explanation
- "KCC லோன் வேணும்" → Matches `KCC` → KCC Application Steps
- "SHG group என்ன benefits?" → Matches `SHG` → SHG Benefits

## Voice Input Implementation

### Browser Support:
- ✅ Chrome/Edge: Full support
- ✅ Safari: Partial support
- ❌ Firefox: Not supported yet

### Speech Recognition Setup:
```javascript
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'ta-IN';            // Tamil language
recognition.continuous = false;        // Single phrase
recognition.interimResults = false;    // Final results only

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  setInputText(transcript);  // Fill input field
};
```

### User Flow:
1. Click 🎤 microphone button
2. Button turns red with 🔴 icon
3. Text shows: "🎤 கேட்கிறேன்... பேசுங்கள்"
4. User speaks in Tamil
5. Speech converts to text
6. Text appears in input field
7. User can edit or send directly

### Tamil Voice Commands:
- "என் மதிப்பெண் எப்படி கணக்கிடப்படுகிறது"
- "கேசேசே கடன் விண்ணப்பம்"
- "எஸ்ஹெச்ஜி என்றால் என்ன"
- "என் ஸ்கோர் மேம்படுத்த"

## Integration with App

### File: `frontend/src/App.js`

```jsx
import ChatBot from './components/ChatBot';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <AnimatedRoutes />
        <ChatBot />  {/* Appears on all pages */}
      </div>
    </Router>
  );
}
```

**Why Global Integration:**
- Chatbot accessible from any page
- Farmer can ask questions anytime
- Floating button doesn't interfere with content
- State persists across page navigation

## Styling & Animations

### Color Palette:
```css
--forest-green: #2D6A4F;   /* Bot messages, header */
--gold: #D4A017;            /* Floating button, accents */
--cream: #FFE5B4;           /* User messages */
--light-cream: #FAF7F0;     /* Button text, bot text */
--bg-cream: #F5F5F0;        /* Messages area background */
--dark-green: #1B4332;      /* User message text */
```

### Framer Motion Animations:

**Button Pulsing:**
```jsx
animate={{
  boxShadow: [
    '0 0 0 0 rgba(212, 160, 23, 0.7)',
    '0 0 0 20px rgba(212, 160, 23, 0)',
  ],
}}
transition={{
  duration: 1.5,
  repeat: Infinity,
  ease: 'easeInOut'
}}
```

**Chat Window Entry:**
```jsx
initial={{ opacity: 0, y: 100, scale: 0.8 }}
animate={{ opacity: 1, y: 0, scale: 1 }}
exit={{ opacity: 0, y: 100, scale: 0.8 }}
transition={{ type: 'spring', damping: 25 }}
```

**Message Fade-in:**
```jsx
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
```

### WhatsApp-style Bubbles:
```css
/* Bot Message */
background: #2D6A4F;
color: #FAF7F0;
border-radius: 16px 16px 16px 4px;  /* Sharp bottom-left */
align: left;

/* User Message */
background: #FFE5B4;
color: #1B4332;
border-radius: 16px 16px 4px 16px;  /* Sharp bottom-right */
align: right;
```

## Usage Examples

### Conversation Flow Example:

```
User: "என் மதிப்பெண் எப்படி கணக்கிடுகிறீர்கள்?"

Bot: "உங்கள் கடன் மதிப்பெண் பல காரணிகளின் 
      அடிப்படையில் கணக்கிடப்படுகிறது:
      
      📊 முக்கிய காரணிகள்:
      1. விவசாய அனுபவம் (Years of farming)
      2. ஆண்டு வருமானம் (Annual income)
      3. SHG உறுப்பினர் நிலை
      ..."

User: "SHG என்றால் என்ன?"

Bot: "Self Help Group (SHG) - சுய உதவி குழு விளக்கம்:
      
      👥 SHG என்றால் என்ன?
      சுய உதவி குழு என்பது 10-20 பெண்கள்...
      
      ✨ நன்மைகள்:
      1. குறைந்த வட்டியில் கடன் வாய்ப்பு (4-8%)
      ..."
```

### Voice Input Example:

```
1. User clicks 🎤 button
2. Status: "🎤 கேட்கிறேன்... பேசுங்கள்"
3. User speaks: "என் ஸ்கோர் மேம்படுத்த என்ன செய்யலாம்"
4. Text appears in input: "என் ஸ்கோர் மேம்படுத்த என்ன செய்யலாம்"
5. User clicks Send
6. Bot responds with improvement tips
```

## Testing

### Manual Testing Steps:

**1. Visual Testing:**
```
✓ Floating button appears at bottom-right
✓ Gold button with pulsing animation
✓ Opens/closes chat window smoothly
✓ Chat window has proper dimensions
✓ Tamil text renders correctly
```

**2. Keyword Matching:**
```bash
# Test each question type
Test: "என் மதிப்பெண் எப்படி"
Expected: Credit score explanation

Test: "KCC கடன்"
Expected: KCC application steps

Test: "SHG benefits"
Expected: SHG explanation

Test: "மதிப்பெண் அதிகரிக்க"
Expected: Improvement tips
```

**3. Voice Input:**
```
✓ Click microphone button
✓ Red background appears
✓ Speak in Tamil
✓ Text fills input field
✓ Can send or edit before sending
```

**4. Message Display:**
```
✓ Bot messages align left (green)
✓ User messages align right (cream)
✓ Timestamps show correctly
✓ Scrolls to latest message
✓ WhatsApp-style bubbles
```

### Browser Compatibility:

| Feature | Chrome | Safari | Firefox | Edge |
|---------|--------|--------|---------|------|
| Chat UI | ✅ | ✅ | ✅ | ✅ |
| Text Input | ✅ | ✅ | ✅ | ✅ |
| Voice Input | ✅ | ⚠️ | ❌ | ✅ |
| Animations | ✅ | ✅ | ✅ | ✅ |

⚠️ Safari: Voice input may require user permission
❌ Firefox: Speech Recognition not supported yet

## Dependencies

### Required Packages (already installed):
```json
{
  "framer-motion": "^10.x.x",   // Animations
  "lucide-react": "^0.x.x",     // Icons (MessageCircle, Send, Mic, etc.)
  "react": "^18.x.x",           // Core
  "react-router-dom": "^6.x.x"  // Routing
}
```

### Browser APIs:
```javascript
// Speech Recognition (built-in)
window.SpeechRecognition || window.webkitSpeechRecognition
```

## Future Enhancements

### Potential Improvements:

**1. Backend Integration:**
- Connect to OpenAI/GPT API for dynamic responses
- Train custom ML model on Tamil farming data
- Add conversation memory/context

**2. Enhanced Features:**
- Multi-turn conversations
- Image upload for crop disease diagnosis
- Location-based farming tips
- Weather alerts integration
- Scheme eligibility calculator

**3. Language Support:**
- Hindi (hi-IN)
- Telugu (te-IN)
- Kannada (kn-IN)
- English fallback

**4. Analytics:**
- Track most asked questions
- Log conversation patterns
- Improve keyword matching based on usage

**5. Voice Improvements:**
- Support for dialects
- Offline voice recognition
- Text-to-speech for bot responses

## Troubleshooting

### Issue: Voice input not working
**Solution:**
1. Check browser compatibility (Chrome/Edge recommended)
2. Grant microphone permission when prompted
3. Ensure HTTPS connection (required for speech API)
4. Check browser console for errors

### Issue: Tamil text not rendering
**Solution:**
1. Verify Noto Sans Tamil font is loaded
2. Add to global CSS:
   ```css
   @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;700&display=swap');
   ```
3. Check fontFamily in ChatBot.jsx

### Issue: Keywords not matching
**Solution:**
1. Add more keyword variations to qaDatabase
2. Check for typos in Tamil keywords
3. Use partial matching (already implemented)
4. Add English translation keywords

### Issue: Chat window too small on mobile
**Solution:**
Already responsive! Window adapts:
- Desktop: 380px wide × 600px tall
- Mobile: Full width × 80vh height

## Files Created/Modified

✅ **Created:**
- `frontend/src/components/ChatBot.jsx` (700+ lines) - Complete chatbot component

✅ **Modified:**
- `frontend/src/App.js` - Added ChatBot import and component

## Accessibility

### Features:
- ✅ Keyboard navigation (Enter to send)
- ✅ Voice input for motor impairment
- ✅ Clear visual feedback
- ✅ Tamil language support
- ✅ Large touch targets (60px button)
- ✅ High contrast text

### Recommendations:
- Add ARIA labels for screen readers
- Support keyboard shortcuts (Ctrl+B to open)
- Add option to increase font size

## Performance

### Optimizations:
- ✅ Lazy state updates
- ✅ Efficient keyword matching (O(n*m) where n=queries, m=keywords)
- ✅ Auto-scroll only on message change
- ✅ Single speech recognition instance
- ✅ Lightweight animations

### Bundle Size:
- ChatBot.jsx: ~25KB
- Dependencies: Already included (framer-motion, lucide-react)

## License & Credits

**Built for:** VazhiKaatti (வழிகாட்டி) - AI Credit Companion for Tamil Nadu Women Farmers

**Voice Recognition:** Web Speech API (browser-native)
**Icons:** Lucide React (MIT License)
**Animations:** Framer Motion (MIT License)

**Tamil Content:** Curated farming advice based on:
- PM-KISAN guidelines
- NABARD SHG best practices
- Tamil Nadu Agriculture Department resources
