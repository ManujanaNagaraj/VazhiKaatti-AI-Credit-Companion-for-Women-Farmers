# Tamil Farming Assistant Chatbot - Test Cases

## Overview
This document contains test cases for the VazhiKaatti Tamil chatbot feature.

## Test Categories

### 1. Visual & UI Tests

#### Test 1.1: Floating Button Display
**Steps:**
1. Open any page in VazhiKaatti
2. Scroll to bottom-right corner

**Expected Result:**
- ✅ Gold circular button (60px × 60px) visible
- ✅ 💬 MessageCircle icon centered
- ✅ Pulsing animation (glowing rings)
- ✅ Button positioned: `bottom: 24px, right: 24px`

**Status:** □ Pass □ Fail

---

#### Test 1.2: Chat Window Open/Close
**Steps:**
1. Click floating chat button
2. Observe chat window animation
3. Click X button or chat button again

**Expected Result:**
- ✅ Window slides up from bottom with spring animation
- ✅ Dimensions: 380px wide × 600px tall
- ✅ Window closes smoothly when X clicked
- ✅ Icon toggles between 💬 and ✕

**Status:** □ Pass □ Fail

---

#### Test 1.3: Message Bubble Styling
**Steps:**
1. Open chat window
2. Observe welcome message (bot)
3. Send a test message (user)

**Expected Result:**
- ✅ Bot message: Green background (#2D6A4F), white text, left-aligned
- ✅ User message: Cream background (#FFE5B4), dark text, right-aligned
- ✅ WhatsApp-style sharp corners (bottom-left for bot, bottom-right for user)
- ✅ Timestamps display correctly

**Status:** □ Pass □ Fail

---

### 2. Keyword Matching Tests

#### Test 2.1: Credit Score Question
**Input:** "என் மதிப்பெண் எப்படி கணக்கிடப்படுகிறது?"

**Expected Response:** 
```
உங்கள் கடன் மதிப்பெண் பல காரணிகளின் அடிப்படையில் கணக்கிடப்படுகிறது:

📊 முக்கிய காரணிகள்:
1. விவசாய அனுபவம் (Years of farming)
2. ஆண்டு வருமானம் (Annual income)
3. SHG உறுப்பினர் நிலை
...
```

**Keywords Matched:** `மதிப்பெண்`, `கணக்கிடப்படுகிறது`

**Status:** □ Pass □ Fail

---

#### Test 2.2: KCC Loan Question
**Input:** "KCC கடன் எப்படி விண்ணப்பிப்பது?"

**Expected Response:**
```
Kisan Credit Card (KCC) விண்ணப்பிக்கும் படிமுறைகள்:

📝 படிகள்:
1. வழிகாட்டியில் உங்கள் மதிப்பெண் சரிபார்க்கவும்
2. தேவையான ஆவணங்களை சேகரிக்கவும்
...
```

**Keywords Matched:** `KCC`, `கடன்`, `விண்ணப்பிப்பது`

**Status:** □ Pass □ Fail

---

#### Test 2.3: SHG Question
**Input:** "SHG என்றால் என்ன?"

**Expected Response:**
```
Self Help Group (SHG) - சுய உதவி குழு விளக்கம்:

👥 SHG என்றால் என்ன?
சுய உதவி குழு என்பது 10-20 பெண்கள்...
...
```

**Keywords Matched:** `SHG`, `சுய உதவி`, `குழு`

**Status:** □ Pass □ Fail

---

#### Test 2.4: Score Improvement Question
**Input:** "என் மதிப்பெண் எப்படி அதிகரிக்கலாம்?"

**Expected Response:**
```
கடன் மதிப்பெண் மேம்படுத்தும் வழிமுறைகள்:

🎯 உடனடி நடவடிக்கைகள்:
1. ✅ SHG குழுவில் சேரவும் (+10 புள்ளிகள்)
...
```

**Keywords Matched:** `மதிப்பெண் அதிகரிக்க`, `மேம்படுத்த`

**Status:** □ Pass □ Fail

---

#### Test 2.5: Government Schemes Question
**Input:** "என்னென்ன அரசு திட்டங்கள் உள்ளன?"

**Expected Response:**
```
தமிழ்நாடு பெண் விவசாயிகளுக்கான முக்கிய திட்டங்கள்:

🌾 முக்கிய திட்டங்கள்:
1. PM-KISAN - ₹6,000/ஆண்டு
...
```

**Keywords Matched:** `திட்டங்கள்`, `அரசு திட்டம்`, `scheme`

**Status:** □ Pass □ Fail

---

#### Test 2.6: Crop Price Question
**Input:** "பயிர் விலை கணிப்பு எப்படி செயல்படுகிறது?"

**Expected Response:**
```
பயிர் விலை AI கணிப்பு அம்சம்:

🤖 எப்படி செயல்படுகிறது:
1. தற்போதைய சந்தை விலை
...
```

**Keywords Matched:** `பயிர் விலை`, `விலை`, `market price`

**Status:** □ Pass □ Fail

---

#### Test 2.7: Weather Risk Question
**Input:** "வானிலை அபாய மதிப்பீடு என்றால் என்ன?"

**Expected Response:**
```
வானிலை அபாய மதிப்பீடு விளக்கம்:

🌦️ என்ன செய்கிறோம்:
7 நாள் வானிலை முன்னறிவிப்பை பகுப்பாய்வு...
...
```

**Keywords Matched:** `வானிலை`, `மழை`, `weather`

**Status:** □ Pass □ Fail

---

#### Test 2.8: Help/FAQ Question
**Input:** "உதவி"

**Expected Response:**
```
நான் பதிலளிக்கக்கூடிய கேள்விகள்:

❓ முக்கிய கேள்விகள்:
1. என் மதிப்பெண் எப்படி கணக்கிடப்படுகிறது?
...
```

**Keywords Matched:** `உதவி`, `help`, `கேள்வி`

**Status:** □ Pass □ Fail

---

#### Test 2.9: Unknown Question
**Input:** "இன்றைய மழை அளவு என்ன?"

**Expected Response:**
```
மன்னிக்கவும், நான் இந்த கேள்விக்கு பதில் அளிக்க முடியவில்லை. 

தயவுசெய்து இந்த கேள்விகளில் ஒன்றை முயற்சிக்கவும்:
• என் மதிப்பெண் எப்படி கணக்கிடப்படுகிறது?
...
```

**Expected:** Default response with helpful suggestions

**Status:** □ Pass □ Fail

---

### 3. Voice Input Tests

#### Test 3.1: Microphone Button Display
**Steps:**
1. Open chat window
2. Locate microphone button in input area

**Expected Result:**
- ✅ Mic icon (🎤) visible next to Send button
- ✅ Button color: Dark brown (#6B4226)
- ✅ Rounded circular button

**Status:** □ Pass □ Fail

---

#### Test 3.2: Voice Recording Start
**Steps:**
1. Click microphone button
2. Observe UI changes

**Expected Result:**
- ✅ Button turns red (#C0392B)
- ✅ Icon changes to MicOff
- ✅ Status text appears: "🎤 கேட்கிறேன்... பேசுங்கள்"
- ✅ isListening state = true

**Status:** □ Pass □ Fail

---

#### Test 3.3: Voice Recognition (Tamil)
**Steps:**
1. Click microphone button
2. Speak clearly in Tamil: "என் மதிப்பெண் எப்படி கணக்கிடப்படுகிறது"
3. Wait for transcription

**Expected Result:**
- ✅ Speech converts to Tamil text
- ✅ Text fills input field
- ✅ Microphone button returns to normal state
- ✅ User can edit transcribed text before sending

**Status:** □ Pass □ Fail

**Browser:** □ Chrome □ Edge □ Safari □ Other: ________

---

#### Test 3.4: Voice Input Cancel
**Steps:**
1. Click microphone button (starts listening)
2. Click microphone button again (while listening)

**Expected Result:**
- ✅ Recording stops
- ✅ Button returns to normal state
- ✅ Status text disappears
- ✅ Input field remains empty

**Status:** □ Pass □ Fail

---

### 4. Functional Tests

#### Test 4.1: Send Message via Text Input
**Steps:**
1. Type "SHG என்றால் என்ன?" in input field
2. Click Send button

**Expected Result:**
- ✅ User message appears (cream bubble, right-aligned)
- ✅ Input field clears
- ✅ Bot response appears after ~500ms delay
- ✅ Chat scrolls to latest message

**Status:** □ Pass □ Fail

---

#### Test 4.2: Send Message via Enter Key
**Steps:**
1. Type "KCC கடன்" in input field
2. Press Enter key

**Expected Result:**
- ✅ Message sends (same as clicking Send button)
- ✅ Shift+Enter does NOT send (for multiline)

**Status:** □ Pass □ Fail

---

#### Test 4.3: Send Button Disabled State
**Steps:**
1. Click in input field
2. Do NOT type anything
3. Try to click Send button

**Expected Result:**
- ✅ Send button is disabled (opacity: 0.5)
- ✅ Button does not respond to clicks
- ✅ Typing enables the button

**Status:** □ Pass □ Fail

---

#### Test 4.4: Auto-Scroll to Latest Message
**Steps:**
1. Send 10+ messages to fill chat window
2. Send one more message
3. Observe scroll behavior

**Expected Result:**
- ✅ Chat window auto-scrolls to show latest message
- ✅ Smooth scroll animation
- ✅ Latest message fully visible

**Status:** □ Pass □ Fail

---

#### Test 4.5: Message Timestamps
**Steps:**
1. Send a message
2. Check timestamp on message bubble

**Expected Result:**
- ✅ Timestamp shows in 12-hour format (e.g., "2:30 PM")
- ✅ Font size: 10px
- ✅ Opacity: 70%
- ✅ Positioned at bottom of message bubble

**Status:** □ Pass □ Fail

---

### 5. Multi-Conversation Tests

#### Test 5.1: Sequential Questions
**Steps:**
1. Ask: "என் மதிப்பெண் எப்படி கணக்கிடப்படுகிறது?"
2. Wait for response
3. Ask: "SHG என்றால் என்ன?"
4. Wait for response
5. Ask: "என் மதிப்பெண் எப்படி அதிகரிக்கலாம்?"

**Expected Result:**
- ✅ All 3 questions answered correctly
- ✅ Conversation history preserved
- ✅ Messages appear in chronological order
- ✅ Each response matches its question

**Status:** □ Pass □ Fail

---

#### Test 5.2: Mixed Tamil-English Keywords
**Steps:**
1. Ask: "KCC loan எப்படி விண்ணப்பிப்பது?"
2. Ask: "SHG benefits என்ன?"

**Expected Result:**
- ✅ Both questions answered correctly
- ✅ English + Tamil keyword matching works
- ✅ Responses in Tamil

**Status:** □ Pass □ Fail

---

### 6. Edge Cases

#### Test 6.1: Empty Message
**Steps:**
1. Leave input field empty
2. Try to send

**Expected Result:**
- ✅ Send button disabled
- ✅ Nothing happens

**Status:** □ Pass □ Fail

---

#### Test 6.2: Very Long Message
**Steps:**
1. Type a message with 500+ characters
2. Send message

**Expected Result:**
- ✅ Message sends successfully
- ✅ Message bubble wraps text properly
- ✅ No overflow or text cutoff
- ✅ Readable formatting

**Status:** □ Pass □ Fail

---

#### Test 6.3: Special Characters
**Steps:**
1. Type: "என் ஸ்கோர் 70+ ஆக இருக்கா? 🤔"
2. Send message

**Expected Result:**
- ✅ Tamil text renders correctly
- ✅ Numbers display properly
- ✅ Emoji shows correctly
- ✅ Bot provides relevant response

**Status:** □ Pass □ Fail

---

#### Test 6.4: Rapid Fire Messages
**Steps:**
1. Type and send 5 messages quickly in succession
2. Don't wait for bot responses

**Expected Result:**
- ✅ All messages queue properly
- ✅ Bot responses appear in order
- ✅ No messages lost
- ✅ UI remains responsive

**Status:** □ Pass □ Fail

---

### 7. Responsive Design Tests

#### Test 7.1: Desktop View (1920×1080)
**Steps:**
1. Open VazhiKaatti on desktop browser
2. Open chatbot

**Expected Result:**
- ✅ Floating button: bottom-right corner
- ✅ Chat window: 380px × 600px
- ✅ All elements visible and readable
- ✅ No horizontal scrolling

**Status:** □ Pass □ Fail

---

#### Test 7.2: Tablet View (768×1024)
**Steps:**
1. Open VazhiKaatti on tablet or resize browser
2. Open chatbot

**Expected Result:**
- ✅ Chat window adapts to screen size
- ✅ Button still at bottom-right
- ✅ Text readable without zooming
- ✅ Touch targets large enough (44px+)

**Status:** □ Pass □ Fail

---

#### Test 7.3: Mobile View (375×667)
**Steps:**
1. Open VazhiKaatti on mobile device
2. Open chatbot

**Expected Result:**
- ✅ Chat window: Full width or near-full
- ✅ Height: 80vh (doesn't cover entire screen)
- ✅ Button easily tappable (60px)
- ✅ Input field and buttons accessible
- ✅ Text size comfortable for mobile

**Status:** □ Pass □ Fail

---

### 8. Accessibility Tests

#### Test 8.1: Keyboard Navigation
**Steps:**
1. Open page, do NOT use mouse
2. Tab to chatbot button
3. Press Enter to open
4. Tab to input field
5. Type message and press Enter

**Expected Result:**
- ✅ Can reach chatbot button via Tab
- ✅ Enter opens chat window
- ✅ Can Tab to input, mic, send buttons
- ✅ Enter sends message
- ✅ Escape closes chat (bonus)

**Status:** □ Pass □ Fail

---

#### Test 8.2: Screen Reader (Optional)
**Steps:**
1. Enable screen reader (NVDA/JAWS/VoiceOver)
2. Navigate to chatbot
3. Listen to announcements

**Expected Result:**
- ⚠️ Button has aria-label describing function
- ⚠️ Messages announced when added
- ⚠️ Input field has label

**Status:** □ Pass □ Fail □ N/A

---

### 9. Performance Tests

#### Test 9.1: Initial Load Time
**Steps:**
1. Open any VazhiKaatti page
2. Measure time until chatbot button appears

**Expected Result:**
- ✅ Button appears within 1 second
- ✅ No layout shift
- ✅ Animations smooth (60fps)

**Status:** □ Pass □ Fail

---

#### Test 9.2: Chat Window Open Speed
**Steps:**
1. Click chatbot button
2. Measure animation duration

**Expected Result:**
- ✅ Window appears in <500ms
- ✅ Spring animation smooth
- ✅ No janky frames

**Status:** □ Pass □ Fail

---

#### Test 9.3: Message Rendering Performance
**Steps:**
1. Send 50 messages rapidly
2. Observe UI performance

**Expected Result:**
- ✅ All messages render without lag
- ✅ Scroll remains smooth
- ✅ No memory leaks (check DevTools)
- ✅ CPU usage reasonable

**Status:** □ Pass □ Fail

---

### 10. Cross-Browser Tests

#### Test 10.1: Google Chrome
- Voice Input: □ Pass □ Fail
- Text Input: □ Pass □ Fail
- Animations: □ Pass □ Fail
- Tamil Rendering: □ Pass □ Fail

**Chrome Version:** ________

---

#### Test 10.2: Microsoft Edge
- Voice Input: □ Pass □ Fail
- Text Input: □ Pass □ Fail
- Animations: □ Pass □ Fail
- Tamil Rendering: □ Pass □ Fail

**Edge Version:** ________

---

#### Test 10.3: Safari (Mac/iOS)
- Voice Input: □ Pass □ Fail □ N/A
- Text Input: □ Pass □ Fail
- Animations: □ Pass □ Fail
- Tamil Rendering: □ Pass □ Fail

**Safari Version:** ________

---

#### Test 10.4: Firefox
- Voice Input: □ Pass □ Fail □ N/A (Not Supported)
- Text Input: □ Pass □ Fail
- Animations: □ Pass □ Fail
- Tamil Rendering: □ Pass □ Fail

**Firefox Version:** ________

---

## Summary Report

**Total Tests:** 45
**Passed:** ____
**Failed:** ____
**N/A:** ____

**Pass Rate:** ____%

**Critical Issues Found:**
1. ________________________________
2. ________________________________
3. ________________________________

**Minor Issues Found:**
1. ________________________________
2. ________________________________
3. ________________________________

**Recommendations:**
1. ________________________________
2. ________________________________
3. ________________________________

**Tested By:** ________________
**Date:** ________________
**Environment:** □ Development □ Staging □ Production

---

## Quick Smoke Test Checklist

Use this for rapid testing:

- □ Chatbot button appears
- □ Button opens chat window
- □ Welcome message displays
- □ Can type and send message
- □ Bot responds with relevant answer
- □ Voice button visible
- □ Tamil text renders correctly
- □ Chat closes when X clicked
- □ All pages have chatbot
- □ Mobile-friendly

**Total:** ___ / 10

If all checked ✅, chatbot is functional!
