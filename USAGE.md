# How to use clean-motion-video

[English](#english) · [العربية](#arabic)

<a id="english"></a>
## English

### First time only
1. Run the one-line installer in PowerShell (see the README).
2. In the Claude app: **Plugins → Browse plugins →** search **`animation-studio`** → **Install**.

### Make a video, step by step
1. **Open the Claude desktop app.**
2. Click the **Code** tab: the `</>` icon at the top left, next to the chat icon.
3. Click **New session**.
4. **Choose the folder.** Click the folder picker and select:
   `C:\Users\<you>\Videos\claude-videos` (the installer made it, and it holds your `.env` key).
   Any folder works, as long as it has a `.env` file with `ELEVENLABS_API_KEY=...` in it.
5. **Type your request** and press Enter. For example:
   > Make a 60-second 16:9 video: "How coffee travels to your cup". Cream and caramel colors, calm female voice.
6. **Answer its questions** (colors, format, voice), if it asks any.
7. **Read the script it writes**, change anything you want, then reply **"approved"**. Nothing costs credits before this.
8. **Look at the still frames it shows you** and say "ok" or ask for fixes ("text too small", "fewer words in shot 3").
9. **Wait for the render.** It takes a few minutes, and Claude tells you when it's done.
10. **Open the MP4** at the path it gives you, usually `...\<project>\out\<project>.mp4`.

### Write a good request
Include these five things, and Claude asks for anything you leave out:
| what | example |
|---|---|
| idea | "How coffee travels to your cup" |
| length | 45, 60 or 90 seconds |
| format | 16:9 (YouTube, slides) or 9:16 (Reels, TikTok) |
| colors | "cream #F6EFE6 and caramel #C7772E" or just "warm browns" |
| voice | "calm female", "energetic male", "British" |

Optional: a story structure, exact lines for the voice, names for an end card, and "don't say my name aloud".

### Change things afterwards
Just say it in plain words, in the same session:
- "slower", "faster", "make it 90 seconds"
- "change the blue to green", "use a darker background"
- "make it a story", "add a shot about X", "remove shot 4"
- "use a different voice", "make the music quieter"
- "make a 9:16 version for Reels"

### Cost
Each video uses ElevenLabs characters, about **900–1,300 for 60–90 seconds**. The free plan gives 10,000 a month, so about 7–10 videos. The music is free (made locally).

### Tips for clarity
- 2–6 words per shot, with **one bold word** that carries the meaning.
- Leave empty space; don't fill the frame.
- A calm voice (speed 0.9–0.95) and a breath between scenes.

---

<a id="arabic"></a>
<div dir="rtl">

## العربية

### أول مرة فقط
1. شغّل سطر التنصيب في PowerShell (موجود في ملف README).
2. في تطبيق Claude: **Plugins** ← **Browse plugins** ← ابحث عن **`animation-studio`** ← **Install**.

### صناعة فيديو خطوة بخطوة
1. **افتح تطبيق Claude** على الكمبيوتر.
2. اضغط تبويب **Code**: أيقونة `</>` أعلى اليسار، بجانب أيقونة المحادثة.
3. اضغط **New session** (جلسة جديدة).
4. **اختر المجلد:** اضغط على اختيار المجلد واختر
   `C:\Users\<اسمك>\Videos\claude-videos` (أنشأه ملف التنصيب، وفيه مفتاحك في ملف `.env`).
   يصلح أي مجلد، بشرط أن يحتوي ملف `.env` فيه `ELEVENLABS_API_KEY=...`.
5. **اكتب طلبك** واضغط Enter، مثلًا:
   > اعمل فيديو 60 ثانية بمقاس 16:9 عن "كيف تصل القهوة إلى كوبك"، بألوان كريمي وكراميل، وصوت أنثوي هادئ.
6. **أجب على أسئلته** (الألوان، المقاس، الصوت) إن سأل.
7. **اقرأ السيناريو الذي يكتبه** وعدّل ما تريد، ثم اكتب **"موافق"**. لا يُستهلك أي رصيد قبل هذه الخطوة.
8. **شاهد الصور الثابتة التي يعرضها** وقل "تمام" أو اطلب تعديلًا ("الخط صغير"، "قلّل الكلمات في اللقطة 3").
9. **انتظر الإخراج.** يستغرق دقائق، وسيخبرك Claude عند الانتهاء.
10. **افتح ملف MP4** من المسار الذي يعطيك إياه، وغالبًا يكون `...\<المشروع>\out\<المشروع>.mp4`.

### كيف تكتب طلبًا جيدًا
اذكر هذه الخمسة، وما تنساه سيسألك عنه:
| الشيء | مثال |
|---|---|
| الفكرة | "كيف تصل القهوة إلى كوبك" |
| المدة | 45 أو 60 أو 90 ثانية |
| المقاس | 16:9 (يوتيوب، عروض) أو 9:16 (ريلز، تيك توك) |
| الألوان | "كريمي #F6EFE6 وكراميل #C7772E" أو فقط "درجات بنية دافئة" |
| الصوت | "أنثوي هادئ"، "رجالي حماسي"، "لهجة بريطانية" |

اختياري: قصة، جمل محددة للصوت، أسماء لبطاقة النهاية، و"لا تقرأ اسمي بصوت عالٍ".

### التعديل بعد ذلك
قلها بكلمات بسيطة في نفس الجلسة:
- "أبطأ"، "أسرع"، "اجعله 90 ثانية"
- "غيّر الأزرق إلى أخضر"، "خلفية أغمق"
- "اجعله قصة"، "أضف لقطة عن كذا"، "احذف اللقطة 4"
- "صوت مختلف"، "خفّف الموسيقى"
- "اعمل نسخة 9:16 للريلز"

### التكلفة
كل فيديو يستهلك أحرفًا من ElevenLabs، حوالي **900 إلى 1,300 حرف لفيديو 60 إلى 90 ثانية**. الخطة المجانية تعطي 10,000 حرف شهريًا، أي حوالي 7 إلى 10 فيديوهات. الموسيقى مجانية لأنها تُصنع على جهازك.

### نصائح للوضوح
- من كلمتين إلى 6 كلمات في كل لقطة، مع **كلمة واحدة عريضة** تحمل المعنى.
- اترك مساحة فارغة، ولا تملأ الشاشة.
- صوت هادئ (سرعة 0.9 إلى 0.95) مع وقفة بين المشاهد.

</div>
