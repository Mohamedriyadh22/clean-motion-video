# How to use clean-motion-video: every step

[English](#english) · [العربية](#arabic)

<a id="english"></a>
## English

### Part 1: Install (first time only, about 5 minutes)

**Step 1: Open PowerShell**
Press the **Windows** key, type `PowerShell`, and press **Enter**.

**Step 2: Paste this line and press Enter**
```powershell
irm https://raw.githubusercontent.com/Mohamedriyadh22/clean-motion-video/main/install.ps1 | iex
```
- It installs anything missing: Node.js, ffmpeg, Chrome, Python and Git.
- If Windows asks **"Do you want to allow this app to make changes?"**, click **Yes**.
- If it says `running scripts is disabled`, first run this, then step 2 again:
  ```powershell
  Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
  ```

**Step 3: Add your ElevenLabs key (the installer opens the page for you)**
1. Sign in to ElevenLabs, or create a free account.
2. Click **Create API Key** and copy it.
3. Go back to PowerShell, paste the key, and press **Enter**.
4. The installer tests it and shows **[OK] ElevenLabs key works**.

**Step 4: Install the drawing engine in the Claude app**
Open the Claude app → **Plugins** (left menu) → **Browse plugins** → search **`animation-studio`** → **Install**.

**Step 5: Check that everything is ready**
At the end, the installer shows **"All set!"**. If it shows **"Still needed: …"**, fix that item and run step 2 again.

---

### Part 2: Make a video (every time)

**Step 1: Open the Claude app.**

**Step 2: Open Claude Code.**
Click the **`</>`** icon at the top left, next to the chat icon.

**Step 3: Start a new session.**
Click **New session** (or **+ New**).

**Step 4: Open your folder.**
1. Click the folder picker (it says **Select folder** or shows a folder name).
2. Choose `C:\Users\<you>\Videos\claude-videos`, which the installer created and which holds your key.
3. Click **Select Folder**.
4. If the app asks **"Trust this folder?"**, click **Trust**.

**Step 5: Type your request and press Enter.**
Example:
> Make a 60-second 16:9 video: "How coffee travels to your cup". Cream and caramel colors, calm female voice.

**Step 6: Answer its questions.**
If you didn't mention them, it asks about colors, format (16:9 or 9:16), length and voice.

**Step 7: Approve the script.**
It writes the narration and the shot plan. Read them, ask for any changes, then type **`approved`**.
Nothing costs ElevenLabs credits before this.

**Step 8: Allow permissions.**
While it works, the app may ask to run a command. Click **Allow**, or **Always allow** to stop the questions.

**Step 9: Check the still frames.**
It shows you pictures from the video. Type **`ok`**, or ask for fixes like "text too small" or "fewer words in shot 3".

**Step 10: Wait for the render.**
It takes a few minutes. It records the voice, makes the music, draws every frame, adds the subtitles, and checks the sync.

**Step 11: Open your video.**
It tells you the path, for example:
`C:\Users\<you>\Videos\claude-videos\coffee-journey\out\coffee-journey.mp4`
Open that folder in File Explorer and double-click the MP4.

---

### Part 3: Change the video
Type it in the **same session**, in plain words:
- "slower", "faster", "make it 90 seconds"
- "change the blue to green", "darker background", "bigger text"
- "make it a story", "add a shot about X", "remove shot 4"
- "use a male voice", "music quieter"
- "make a 9:16 version for Reels"

---

### Write a good request
| include | example |
|---|---|
| idea | "How coffee travels to your cup" |
| length | 45, 60 or 90 seconds |
| format | 16:9 (YouTube, slides) or 9:16 (Reels, TikTok) |
| colors | "cream #F6EFE6 and caramel #C7772E", or "warm browns" |
| voice | "calm female", "energetic male", "British" |

Optional: a story structure, exact voice lines, names for an end card, and "don't say my name aloud".

### Cost
About **900–1,300 ElevenLabs characters** for a 60–90 second video. The free plan gives 10,000 a month, so about 7–10 videos. The music is free.

### If something goes wrong
| problem | fix |
|---|---|
| Claude doesn't use the skill | Start a **new** session, or write "use the clean-motion-video skill" |
| "API key missing" | You opened the wrong folder: choose `Videos\claude-videos` (step 4) |
| "paid plan required" for music | Normal on the free plan: it makes the music itself |
| The render is slow | Normal for the first time; close other heavy apps |
| Anything else | Run the installer line again; it shows what's missing |

---

<a id="arabic"></a>
<div dir="rtl">

## العربية

### الجزء 1: التنصيب (أول مرة فقط، حوالي 5 دقائق)

**الخطوة 1: افتح PowerShell**
اضغط زر **Windows**، اكتب `PowerShell`، ثم اضغط **Enter**.

**الخطوة 2: الصق هذا السطر واضغط Enter**
```powershell
irm https://raw.githubusercontent.com/Mohamedriyadh22/clean-motion-video/main/install.ps1 | iex
```
- يثبّت أي برنامج ناقص: Node.js وffmpeg وChrome وPython وGit.
- إذا سألك Windows **"Do you want to allow this app to make changes?"** اضغط **Yes**.
- إذا ظهرت رسالة `running scripts is disabled`، شغّل هذا الأمر أولًا ثم أعد الخطوة 2:
  ```powershell
  Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
  ```

**الخطوة 3: أضف مفتاح ElevenLabs (يفتح لك ملف التنصيب الصفحة تلقائيًا)**
1. سجّل الدخول في ElevenLabs، أو أنشئ حسابًا مجانيًا.
2. اضغط **Create API Key** وانسخ المفتاح.
3. ارجع إلى PowerShell، الصق المفتاح، واضغط **Enter**.
4. سيختبره ويظهر لك **[OK] ElevenLabs key works**.

**الخطوة 4: ثبّت محرّك الرسم في تطبيق Claude**
افتح تطبيق Claude ← **Plugins** (القائمة اليسرى) ← **Browse plugins** ← ابحث عن **`animation-studio`** ← **Install**.

**الخطوة 5: تأكد أن كل شيء جاهز**
في النهاية يظهر **"All set!"**. وإذا ظهر **"Still needed: …"**، أصلح الشيء الناقص وأعد الخطوة 2.

---

### الجزء 2: صناعة فيديو (كل مرة)

**الخطوة 1: افتح تطبيق Claude.**

**الخطوة 2: افتح Claude Code.**
اضغط أيقونة **`</>`** في أعلى اليسار، بجانب أيقونة المحادثة.

**الخطوة 3: ابدأ جلسة جديدة.**
اضغط **New session** (أو **+ New**).

**الخطوة 4: افتح مجلدك.**
1. اضغط على اختيار المجلد (مكتوب عليه **Select folder** أو يظهر اسم مجلد).
2. اختر `C:\Users\<اسمك>\Videos\claude-videos`، وهو المجلد الذي أنشأه ملف التنصيب وفيه مفتاحك.
3. اضغط **Select Folder**.
4. إذا ظهرت رسالة **"Trust this folder?"** اضغط **Trust**.

**الخطوة 5: اكتب طلبك واضغط Enter.**
مثال:
> اعمل فيديو 60 ثانية بمقاس 16:9 عن "كيف تصل القهوة إلى كوبك"، بألوان كريمي وكراميل، وصوت أنثوي هادئ.

**الخطوة 6: أجب على أسئلته.**
إذا لم تذكرها، سيسألك عن الألوان والمقاس (16:9 أو 9:16) والمدة والصوت.

**الخطوة 7: وافق على السيناريو.**
سيكتب النص وتقسيم اللقطات. اقرأها، واطلب أي تعديل، ثم اكتب **`موافق`**.
لا يُستهلك أي رصيد من ElevenLabs قبل هذه الخطوة.

**الخطوة 8: اسمح بالأذونات.**
أثناء العمل قد يطلب التطبيق إذنًا لتشغيل أمر. اضغط **Allow**، أو **Always allow** حتى لا يسألك مرة أخرى.

**الخطوة 9: راجع الصور الثابتة.**
سيعرض لك صورًا من الفيديو. اكتب **`تمام`**، أو اطلب تعديلًا مثل "الخط صغير" أو "قلّل الكلمات في اللقطة 3".

**الخطوة 10: انتظر الإخراج.**
يستغرق بضع دقائق، يسجّل فيها الصوت، ويصنع الموسيقى، ويرسم كل إطار، ويضيف الترجمة، ويتحقق من التزامن.

**الخطوة 11: افتح الفيديو.**
سيعطيك المسار، مثل:
`C:\Users\<اسمك>\Videos\claude-videos\coffee-journey\out\coffee-journey.mp4`
افتح هذا المجلد في مستكشف الملفات واضغط مرتين على ملف MP4.

---

### الجزء 3: التعديل على الفيديو
اكتب في **نفس الجلسة** بكلمات بسيطة:
- "أبطأ"، "أسرع"، "اجعله 90 ثانية"
- "غيّر الأزرق إلى أخضر"، "خلفية أغمق"، "خط أكبر"
- "اجعله قصة"، "أضف لقطة عن كذا"، "احذف اللقطة 4"
- "صوت رجالي"، "خفّف الموسيقى"
- "اعمل نسخة 9:16 للريلز"

---

### كيف تكتب طلبًا جيدًا
| اذكر | مثال |
|---|---|
| الفكرة | "كيف تصل القهوة إلى كوبك" |
| المدة | 45 أو 60 أو 90 ثانية |
| المقاس | 16:9 (يوتيوب، عروض) أو 9:16 (ريلز، تيك توك) |
| الألوان | "كريمي #F6EFE6 وكراميل #C7772E"، أو "درجات بنية دافئة" |
| الصوت | "أنثوي هادئ"، "رجالي حماسي"، "لهجة بريطانية" |

اختياري: قصة، جمل محددة للصوت، أسماء لبطاقة النهاية، و"لا تقرأ اسمي بصوت عالٍ".

### التكلفة
حوالي **900 إلى 1,300 حرف من ElevenLabs** لفيديو مدته 60 إلى 90 ثانية. الخطة المجانية تعطي 10,000 حرف شهريًا، أي حوالي 7 إلى 10 فيديوهات. الموسيقى مجانية.

### إذا واجهتك مشكلة
| المشكلة | الحل |
|---|---|
| Claude لا يستخدم المهارة | ابدأ جلسة **جديدة**، أو اكتب "use the clean-motion-video skill" |
| رسالة "API key missing" | فتحت مجلدًا خاطئًا: اختر `Videos\claude-videos` (الخطوة 4) |
| رسالة "paid plan required" للموسيقى | طبيعي في الخطة المجانية: المهارة تصنع الموسيقى بنفسها |
| الإخراج بطيء | طبيعي في المرة الأولى؛ أغلق البرامج الثقيلة |
| أي مشكلة أخرى | أعد تشغيل سطر التنصيب؛ سيوضح لك ما الناقص |

</div>
