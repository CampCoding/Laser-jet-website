"use client";

import Image from "next/image";
import {
  Tag,
  Clock,
  Percent,
  Zap,
  ShoppingCart,
  Heart,
  BadgePercent,
} from "lucide-react";


const offers =  [
  {
      "offer": {
          "offer_id": 16,
          "offer_value": 16.5,
          "start_date": "2025-11-09 19:31:00",
          "end_date": "2025-11-30 19:31:00",
          "status": "started"
      },
      "products": [
          {
              "product_id": 187,
              "offer_sell_value": 18601.963,
              "offer_value": 16.5,
              "price": 19372,
              "is_active": 1,
              "created_at": "2025-11-09 12:31:25",
              "updated_at": "2025-11-09 12:31:43",
              "category_id": 36,
              "order_no": 0,
              "rate": 0,
              "sympol": "56456",
              "title": "Oppo Reno14 F 5G - 256GB/12GB - Opal Blue (صنع في مصر)",
              "description": "Brand: Oppo\r\nFrequency Band:\r\n2G GSM: 850/900/1800/1900MHz\r\n3G WCDMA: Band 1/2/4/5/6/8/19\r\n4G LTE FDD: Band 1/2/3/4/5/7/8/12/17/18/19/20/26/28/66\r\n4G LTE TDD: Band 38/39/40/41\r\n5G NR: n1/n2/n3/n5/n7/n8/n12/n20/n26/n28/n38/n40/n41/n66/n71/n77/n78\r\nWeight: 180g\r\nRAM and ROM Capacities: 12GB + 256GB\r\nRAM Type: LPDDR4X\r\nPhone Storage Card: Supported\r\nUSB OTG: Supported\r\nDisplay Size: 6.57 inches, AMOLED, Up to 120 Hz refresh rate\r\nColour Depth: 1.07 billion colours (10-bit)\r\nRear Camera:\r\nWide angle: 50MP; f/1.8; FOV 79°; 5P lens; AF supported; 2-axis OIS supported\r\nUltra-wide angle: 8MP; f/2.2; FOV 112°; 5P lens\r\nMacro: 2MP; f/2.4; FOV 89°; 3P lens\r\nFront Camera:\r\n32MP, f/2.0, FOV 90°, 5P lens; AF supported\r\nRear Video:\r\nSupported: 4K 30fps, 1080P 60fps, 1080P 30fps, 720P 60fps, 720P 30fps\r\nEIS/OIS video: 4K 30fps, 1080P 60fps, 1080P 30fps, 720P 60fps, 720P 30fps\r\nSLO-MO: 720P 240fps, 720P 120fps, 1080P 120fps\r\nTIME-LAPSE: 1080P 30fps\r\nSupport Dual-view video shooting\r\nDigital Zoom: Support Up to 10X\r\nFront Video:\r\nSupported: 1080P 30fps, 720P 30fps\r\nEIS/OIS video: 1080P 30fps, 720P 30fps\r\nSupport Dual-view video shooting\r\nSupport TIME-LAPSE 1080P 30fps\r\nSupport 0.8x and 1x\r\nProcessor: Qualcomm Snapdragon® 6 Gen 1 Mobile Platform\r\nOperating System: Android 15 with ColorOS 15.\r\nCPU: 8 cores\r\nGPU: Adreno™ 710@676MHz\r\nBattery Capacity: 6000mAh/23.52Wh (typical)\r\nFast Charge: 45W SUPERVOOCTM\r\nFingerprint: Supported\r\nFacial Recognition: Supported\r\nSensors: Proximity sensor, Ambient light sensor, Colour temperature sensor, E-compas, Accelerometer,\r\nGyroscope, In-display optical fingerprint sensor\r\nSIM 2: Supported\r\nSIM Card Type: Nano-SIM card\r\nBluetooth: 5.1, Low Energy\r\nUSB Interface: USB Type-C\r\nEarphone Jack: Type-C\r\nNFC: Supported\r\nSingle band: Beidou, GPS, GLONASS, Galileo, QZSS\r\nOthers: Supports A-GNSS assisted positioning, WLAN positioning, cellular network positioning",
              "quantity": 1,
              "sold_quantity": 0,
              "sell_price": 22277.8,
              "details": [
                  {
                      "product_detail_id": 307,
                      "label": "مساحه",
                      "value": "256"
                  }
              ],
              "images": [
                  {
                      "product_image_id": 204,
                      "image_url": "https://camp-coding.site/laserjet/uploads/products/1762880050417.png"
                  }
              ],
              "installments": [
                  {
                      "installment_id": 20,
                      "category_installment_id": 64,
                      "installment_title": "6 شهور",
                      "order_no": 0,
                      "installment_gain": 33.5,
                      "full_price": 29740.862999999998
                  }
              ],
              "isInCart": 0,
              "isInWishlist": 0,
              "category": {
                  "is_active": "false"
              }
          }
      ]
  },
  {
      "offer": {
          "offer_id": 17,
          "offer_value": 4,
          "start_date": "2025-08-11 18:48:00",
          "end_date": "2026-07-22 18:50:00",
          "status": "started"
      },
      "products": [
          {
              "product_id": 175,
              "offer_sell_value": 1900.8,
              "offer_value": 4,
              "price": 1650,
              "is_active": 1,
              "created_at": "2025-08-16 08:20:43",
              "updated_at": "2025-08-16 08:20:52",
              "category_id": 37,
              "order_no": 0,
              "rate": 0,
              "sympol": " RT- 6711",
              "title": "خلاط مع 2 مطحنة",
              "description": "• دورق + 2 مطحنة شفرة من الأستانلس ستيل\r\n•220 - 240 فولت 50 / 60 هرتز .\r\n• تقطيع خضار و فواكه .\r\n• محطنة سكر\r\n• مطحنة توابل\r\n• جسم بلاستك قوى أنسيابي",
              "quantity": 1,
              "sold_quantity": 0,
              "sell_price": 1980,
              "details": [
                  {
                      "product_detail_id": 281,
                      "label": "لون",
                      "value": "اسود"
                  }
              ],
              "images": [
                  {
                      "product_image_id": 212,
                      "image_url": "https://camp-coding.site/laserjet/uploads/products/1762883330028.jpg"
                  }
              ],
              "installments": [
                  {
                      "installment_id": 20,
                      "category_installment_id": 39,
                      "installment_title": "6 شهور",
                      "order_no": 0,
                      "installment_gain": 30,
                      "full_price": 2574
                  }
              ],
              "isInCart": 0,
              "isInWishlist": 0,
              "category": {
                  "is_active": "false"
              }
          },
          {
              "product_id": 183,
              "offer_sell_value": 5414.4,
              "offer_value": 4,
              "price": 4700,
              "is_active": 1,
              "created_at": "2025-11-05 12:00:56",
              "updated_at": "2025-11-05 12:01:11",
              "category_id": 42,
              "order_no": 0,
              "rate": 0,
              "sympol": "197029008237",
              "title": "سماعة راس سلكية للالعاب من هايبر اكس كلاود III للكمبيوتر وبلاي ستيشن 5 واكس بوكس سلسلة X|S مشغلات بزاوية 53 ملم دي تي اس ميموري فوم اطار متين ميكروفون فائق الوضوح 10 ملم USB-C USB-A 3.5 ملم اسود/احمر",
              "description": "\r\nوصف المنتج\r\nتعد سماعة كلاود III من هايبر اكس تطورًا لسلسة كلاود II الأسطورية، والمعروفة بالراحة وجودة الصوت والمتانة. مع رغوة الذاكرة القطيفة المميزة من هايبر اكس في شريط الرأس ووسائد الأذن، توفر ملاءمة مريحة مثالية لجلسات طويلة من اللعب. كما أنها تتميز بمشغلات جديدة تم اعادة ضبطها 53 ملم بزاوية للحصول على تجربة استماع مثالية. يلتقط الميكروفون الذي تمت ترقيته مقاس 10 ملم المحادثات والمكالمات الصوتية الواضحة داخل اللعبة. تتيح لك عناصر التحكم البسيطة الموجودة على سماعة الأذن إمكانية الوصول السريع والمباشر لكتم صوت الميكروفون أو ضبط مستوى الصوت. يُظهر كتم صوت الميكروفون LED بوضوح عند كتم صوتك. متوافق مع أجهزة الكمبيوتر وبلاي ستيشن 5 اكس بوكس سلسلة X|S اكس بوكس ون ونينتندو سويتش وماك والموبايل. استمتع بأقصى درجات الراحة والصوت عبر منصاتك المفضلة.\r\n\r\nمن الشركة المصنّعة\r\n \r\n \r\nأسطورة ريبورن.\r\nهايبر اكـس كلاود III هو تطور سحابة II الأسطورية المعروفة براحتها وجودة الصوت ومتانتها.\r\nمع رغوة الذاكرة المميزة هايبر اكـس المخملية في عصابة الرأس ووسائد الأذن، توفر ملاءمة مريحة ومثالية لجلسات اللعب الطويلة. كما أنه يتميز بمشغلات جديدة معاد ضبطها 53 ملم بـزاوية للحصول على تجربة استماع مثالية. يلتقط الميكروفون المطور مقاس 10 ملم الدردشة والمكالمات الصوتية الواضحة أثناء اللعب.\r\n\r\nتتيح لك أدوات التحكم البسيطة الموجودة على غطاء الأذن الحصول على وصول سريع ومباشر لكتم الميكروفون أو ضبط مستوى الصوت. يظهر كتم صوت الميكروفون LED بوضوح عند كتم الصوت.\r\n\r\nمتوافق مع أجهزة الكمبيوتر وPS5 وXbox Series X|S وXbox One ونينتندو سويتش وماك والموبايل. استمتع بأقصى درجات الراحة والصوت عبر منصاتك المفضلة.\r\nإذا كان لديك أي أسئلة حول المنتج، فلا تتردد في الاتصال بنا من خلال النقاط التالية،\r\n\r\nدعم هايبر اكـس\r\n\r\nصفحة هايبر اكـس انديا على فيسبوك\r\n\r\nصفحة انستغرام هايبر اكـس انديا\r\n\r\nمقـبض تويتر هايبر اكـس\r\n\r\nدعم العملاء - (الاثنين - السبت 09:30-17:00)\r\n\r\nالملامح البارزة:\r\nراحة ومتانة مميزة من هايبر اكـس\r\nمشغلات بـزاوية 53 ملم، تم ضبطها للحصول على صوت لا تشوبه شائبة\r\nميكروفون فائق الوضوح مع مؤشر ليد لكتم الصوت\r\nسماعة رأس دي تي اس: اكـس المكاني\r\nعناصر التحكم في الصوت والميكروفون المدمجة\r\nمتوافق مع: الكمبيوتر، PS5، PS4، Xbox Series X|S، Xbox One، نينتندو سويتش، الجوال\r\n \r\n\r\nكومفورت از كينج\r\nالراحة في الحمض النووي للسحابة الثالثة. شريط رأس من الميموري فوم المميز من هايبر اكـس\r\n\r\nووسائد أذن ملفوفة بجلد ناعم وفاخر مما يجعلها قطيفة ومريحة\r\n\r\nتناسب جميع الجوانب.\r\n\r\n \r\n\r\nتم ضبط الصوت للترفيه الخاص بك\r\nتم ضبط مشغلات بـزاوية 53 ملم من قبل مهندسي الصوت هايبر اكـس لتوفير\r\n\r\nتجربة استماع مثالية تبرز الأصوات الدينـاميكية للألعاب.\r\n\r\n \r\n\r\nميكروفون مطور من أجل الوضوح والدقة\r\nيلتقط صوت عالي الجودة لإجراء محادثة صوتية ومكالمات واضحة. الميكروفون يلغي الضوضاء\r\n\r\nويتميز بفلتر شبكي مدمج لتقليل الأصوات المزعجة. كما أنه يتميز بمـصباح LED\r\n\r\nمؤشر كتم صوت الميكروفون يتيح لك معرفة وقت كتم الصوت.\r\n\r\n \r\n\r\nالمتانة، لأقوى المعارك\r\nسماعة الرأس مرنة وتتميز بإطار معدني كامل لذلك فهي مرنة ضد السفر،\r\n\r\nالحوادث والحوادث المؤسفة وردود الفعل المستوية للخسائر وهزيمة الشاشات.\r\n\r\n \r\n\r\nسماعة رأس دي تي اس: اكـس المكاني\r\nسيساعد تفعيل الصوت المكاني دي تي اس مدى الحياة على زيادة ميزة الصوت الخاصة بك و\r\n\r\nالانغماس مع توطين الصوت الدقيق ومرحلة الصوت الافتراضية ثلاثية الأبعاد.\r\n\r\n \r\n\r\nتحكم سريع ومريح في الصوت والميكروفون\r\nدودج المزعجة داخل اللعبة وقوائم النظام. اضبط مستوى صوت سماعة الرأس بسرعة\r\n\r\nوكتم صوت الميكروفون الخاص بك باستخدام عناصر التحكم الموجودة مباشرة على غطاء الأذن كلاود 3.\r\n\r\n \r\n\r\nتوافق متعدد الاستخدامات عبر USB C وUSB A و3.5 ملم\r\nيتوافق كلاود III مع أجهزة الكمبيوتر وPS5 وPS4 وXbox Series X|S وXbox One ونينتندو\r\n\r\nسويتش وماك والأجهزة المحمولة. تتضمن موصلات USB نوع ايه ويو اس بي نوع سي 3.5 ملم\r\n\r\nلتحقيق أقصى قدر من التوافق، بغض النظر عن طريقة اللعب.\r\n\r\n \r\n\r\nسماعة رأس أسطورية بتصميم جديد\r\nمع تطور الألعاب، يجب أن تتطور سماعة الرأس الخاصة بك معها. يحتوي المعيار الذهبي الخاص بنا على\r\n\r\nأعيد تصميمها لجيل جديد من الألعاب ومتوفرة بألوان مختلفة\r\n\r\nتناسب ذوقك.",
              "quantity": 1,
              "sold_quantity": 0,
              "sell_price": 5640,
              "details": [
                  {
                      "product_detail_id": 293,
                      "label": "اسم العلامة التجارية\t",
                      "value": "هايبر اكس"
                  }
              ],
              "images": [
                  {
                      "product_image_id": 224,
                      "image_url": "https://camp-coding.site/laserjet/uploads/products/1762955680759.jpg"
                  }
              ],
              "installments": [
                  {
                      "installment_id": 20,
                      "category_installment_id": 46,
                      "installment_title": "6 شهور",
                      "order_no": 0,
                      "installment_gain": 30,
                      "full_price": 7332
                  }
              ],
              "isInCart": 0,
              "isInWishlist": 0,
              "category": {
                  "is_active": "false"
              }
          },
          {
              "product_id": 189,
              "offer_sell_value": 1497.6,
              "offer_value": 4,
              "price": 1300,
              "is_active": 1,
              "created_at": "2025-11-09 13:45:49",
              "updated_at": "2025-11-09 13:45:59",
              "category_id": 37,
              "order_no": 0,
              "rate": 0,
              "sympol": "SC-1589",
              "title": "خلاط كهربائي بحجم 2 لتر وقوة 4500 واط SC-1589 من سيلفر كريست",
              "description": "تسوق الان خلاط سلفر كرست 4500 وات الرائع من متجر الفنت, احد افضل واسرع انواع الخلطات والمطلوبة بكثرة في الأسواق, استمتع الان بالحصول على أفضل العصائر والمشروبات مع خلاط كهربائي silver crest القوي والمتين, يمنحك قوة 4500 واط وحجم 2 لتر، استمتع بتحضير مشروباتك المفضلة بكل سهولة وسرعة.\r\n\r\n",
              "quantity": 1,
              "sold_quantity": 0,
              "sell_price": 1560,
              "details": [
                  {
                      "product_detail_id": 311,
                      "label": "موديل ",
                      "value": "SC-1589"
                  }
              ],
              "images": [
                  {
                      "product_image_id": 196,
                      "image_url": "https://camp-coding.site/laserjet/uploads/products/1762713949556.jpg"
                  }
              ],
              "installments": [
                  {
                      "installment_id": 20,
                      "category_installment_id": 39,
                      "installment_title": "6 شهور",
                      "order_no": 0,
                      "installment_gain": 30,
                      "full_price": 2028
                  }
              ],
              "isInCart": 0,
              "isInWishlist": 0,
              "category": {
                  "is_active": "false"
              }
          },
          {
              "product_id": 193,
              "offer_sell_value": 1324.8,
              "offer_value": 4,
              "price": 1200,
              "is_active": 1,
              "created_at": "2025-11-11 11:48:42",
              "updated_at": "2025-11-11 11:48:49",
              "category_id": 59,
              "order_no": 0,
              "rate": 0,
              "sympol": "545",
              "title": "Nokia 110 - Cloudy Blue (صنع في مصر)",
              "description": "General\r\n2G Network : GSM 900 / 1800\r\nSIM : Dual SIM\r\nDisplay\r\nDisplay Size : 1.77 inches\r\nCamera\r\nBack Camera : VGA\r\nFront Camera : No\r\nMemory\r\nInternal Memory : 8MB\r\nSound : 5 mm Audio Jack\r\nData : USB\r\nFeatures : FM radio\r\nPower : Battery 1000mAh Battery",
              "quantity": 1,
              "sold_quantity": 0,
              "sell_price": 1380,
              "details": [
                  {
                      "product_detail_id": 315,
                      "label": "الماركه",
                      "value": "نوكيا"
                  }
              ],
              "images": [
                  {
                      "product_image_id": 203,
                      "image_url": "https://camp-coding.site/laserjet/uploads/products/1762879809525.png"
                  }
              ],
              "installments": [
                  {
                      "installment_id": 20,
                      "category_installment_id": 74,
                      "installment_title": "6 شهور",
                      "order_no": 0,
                      "installment_gain": 30,
                      "full_price": 1794
                  }
              ],
              "isInCart": 0,
              "isInWishlist": 0,
              "category": {
                  "is_active": "false"
              }
          },
          {
              "product_id": 199,
              "offer_sell_value": 1958.4,
              "offer_value": 4,
              "price": 1700,
              "is_active": 1,
              "created_at": "2025-11-12 08:57:58",
              "updated_at": "2025-11-12 08:58:04",
              "category_id": 42,
              "order_no": 0,
              "rate": 0,
              "sympol": "564",
              "title": "موزع بمنفذ USB نوع سي، محول 7 في 1 USB نوع سي، مع 4 كيه نوع C إلى HDMI، قارئ بطاقة اس دي/ميكرو اس دي، منافذ B 3.0، مع توصيل طاقة 60 وات لأجهزة ماك بوك وكروم بوك وجالكسي وغيرها من انكر - رمادي",
              "description": "جميع المنافذ التي تحتاج إليها احصل على 2 منفذ بيانات USB نوع ايه ومنفذ شحن USB نوع C ومنفذ بيانات USB نوع C ومنفذ HDMI وفتحة بطاقة ميكرو اس دي وفتحة بطاقة اس دي قياسية واحدة - كل ذلك في موزع واحد.\r\nمتوافق مع توصيل الطاقة يدعم ما يصل إلى 100 وات (أقل من 15 وات للتشغيل) لتمرير الشحن حتى تتمكن من تشغيل ماك بوك برو 38 سم بأقصى سرعة - كل ذلك أثناء الوصول إلى الوظائف الأخرى للموزع. (المنتج غير متضمن الشاحن)\r\nشاشة فائقة الوضوح، لا تضيع الوقت في التبديل ذهابًا وإيابًا بين البرامج أو المستندات. ما عليك سوى توصيله بشاشة خارجية عبر منفذ HDMI بدقة 4K لتجربة أسهل وأكثر إنتاجية. ملاحظة: العلامات التجارية المعتمدة HDMI وواجهة الوسائط المتعددة عالية الدقة HD وشعار HDMI هي علامات تجارية أو علامات تجارية مسجلة لشركة HDMI Licensing Administrator، Inc في الولايات المتحدة ودول أخرى.\r\nانقل الملفات في ثوانٍ، يمكنك نقل الأفلام والصور والموسيقى بسرعات تصل إلى 5 جيجابايت في الثانية عبر منفذ بيانات USB نوع سي ومنافذ USB نوع ايه المزدوجة.\r\nمحتويات العبوة: محور موزع USB بنوع سي ممتاز 7 في 1 من انكور، شنطة سفر، دليل ترحيبي.\r\nتوافق شامل مع بطاقة SD، تدعم منافذ بطاقة SD وبطاقة ذاكرة ميكرو اس دي كافة تنسيقات بطاقة SD فعليًا للاستمتاع بتجربة وصول سلسلة إلى الصور وملفات الوسائط الأخرى.",
              "quantity": 1,
              "sold_quantity": 0,
              "sell_price": 2040,
              "details": [
                  {
                      "product_detail_id": 326,
                      "label": "لون",
                      "value": "اسود"
                  }
              ],
              "images": [
                  {
                      "product_image_id": 225,
                      "image_url": "https://camp-coding.site/laserjet/uploads/products/1762955878562.jpg"
                  }
              ],
              "installments": [
                  {
                      "installment_id": 20,
                      "category_installment_id": 46,
                      "installment_title": "6 شهور",
                      "order_no": 0,
                      "installment_gain": 30,
                      "full_price": 2652
                  }
              ],
              "isInCart": 0,
              "isInWishlist": 0,
              "category": {
                  "is_active": "false"
              }
          },
          {
              "product_id": 201,
              "offer_sell_value": 19584,
              "offer_value": 4,
              "price": 17000,
              "is_active": 1,
              "created_at": "2025-11-12 09:35:04",
              "updated_at": "2025-11-12 09:35:11",
              "category_id": 37,
              "order_no": 0,
              "rate": 0,
              "sympol": "6556",
              "title": "تكييف فريش تيربو، 1.5 حصان، بارد فقط، FUFW12C IW-AG - أبيض",
              "description": "العلامة التجارية: فريش\r\nالموديل: FUFW12C/IW-AG\r\nالقدرة الحصانية: 1.5 حصان\r\nنوع التكييف: سبليت\r\nالسعة التبريدية: من 12000 إلى 18000 وحدة حرارية\r\nنظام التبريد: تبريد فقط\r\nنوع الفلتر: فلتر مضاد للغبار\r\nالموتور إنفرتر: لا\r\nتحريك الهواء أوتوماتيكي: نعم\r\nريموت كنترول: نعم\r\nمؤقت زمني (تايمر): نعم\r\nخاصية التدفئة: لا\r\nمقاوم للصدأ: لا\r\nتقنية البلازما كلاستر: لا\r\nوضع التجفيف: لا\r\nوضع التيربو: لا\r\nضاغط استوائي: لا\r\nزعانف ذهبية (Golden Fin): لا\r\nوضع التوفير ECO: لا\r\nالأبعاد (مم):\r\nالارتفاع: 200 مم\r\nالعرض: 802 مم\r\nالعمق: 295 مم\r\nالوزن: 8.6 كجم",
              "quantity": 1,
              "sold_quantity": 0,
              "sell_price": 20400,
              "details": [
                  {
                      "product_detail_id": 328,
                      "label": "لون",
                      "value": "ابيض"
                  }
              ],
              "images": [
                  {
                      "product_image_id": 227,
                      "image_url": "https://camp-coding.site/laserjet/uploads/products/1762958104438.png"
                  }
              ],
              "installments": [
                  {
                      "installment_id": 20,
                      "category_installment_id": 39,
                      "installment_title": "6 شهور",
                      "order_no": 0,
                      "installment_gain": 30,
                      "full_price": 26520
                  }
              ],
              "isInCart": 0,
              "isInWishlist": 0,
              "category": {
                  "is_active": "false"
              }
          }
      ]
  },
  {
      "offer": {
          "offer_id": 18,
          "offer_value": 20,
          "start_date": "2025-11-09 15:55:00",
          "end_date": "2026-04-23 15:55:00",
          "status": "started"
      },
      "products": [
          {
              "product_id": 198,
              "offer_sell_value": 32200,
              "offer_value": 20,
              "price": 35000,
              "is_active": 1,
              "created_at": "2025-11-12 08:45:29",
              "updated_at": "2025-11-12 08:45:50",
              "category_id": 61,
              "order_no": 0,
              "rate": 0,
              "sympol": "564",
              "title": "كاميرا رياضية اوزمو أكشن 5 برو للمغامرة بمستشعر بحجم 20 ملم، مزودة ببطارية تزيد إلى 12 ساعة مع 3 بطاريات وشاشتان تعملان باللمس من نوع او ال اي دي، مناسبة للسفر ومدونات الفيديو من دي جي اي",
              "description": "صوّر المناظر الليلية للمدن: تحتوي كاميرا الحركة اوزمو دي جي اي أكشن 5 برو على مستشعر مقاس 20 ملم لالتقاط صور رائعة في ظروف الإضاءة الخافتة. تُعد مثالية لمغامرات ركوب الدراجات في الأماكن المظلمة ليلًا.\r\nتتبع أفضل للهدف: مزودة بشريحة بتقنية 4nm من أجل تأطير سريع وموثوق. تتبع الأهداف سريعة الحركة. [7] تعمل شريحة 4nm على توفير تأطير سريع ومرن بأبعاد 16:9 أو 9:16.\r\nاستخدام دائم في جميع الظروف: استمتع بعمر بطارية يصل إلى 4 ساعات مع كاميرا اكشن 5 برو [1]، مثالية لأي موقف، وهي مثالية لأي وضع وتضمن أداءً متواصلًا وتسجيلًا دون انقطاع.\r\nتحكم دقيق بألوان زاهية: استمتع بألوان حقيقية وزاهية بفضل شاشتي اللمس من نوع او ال اي دي المزدوجتين. عرض واضح ومناسب لجميع الأوضاع، مما يجدد متعة التصوير والمشاهدة.\r\nمقاطع فيديو مستقرة بدرجة عالية: التقط مقاطع فيديو ثابتة وعالية الجودة باستخدام تقنية هورايزون ستيدي 360°. [17] تُعد كاميرا دي جي اي أكشن 5 برو مثالية لتصوير مدونات الفيديو والرياضات من أي منظور، مهما كان الاهتزاز.\r\nصوت احترافي: تلتقط كاميرا الحركة صوتًا واضحًا عند توصيلها بميكروفونات DJI، وتستقبل الصوت مباشرة من جهاز الإرسال من ميكروفون دي جي اي 2 الصغير دون الحاجة إلى جهاز استقبال. تُعد مثالية لمدونات الفيديو بالموتوسيكلات أو التزحلق على الثلج أو مدونات الفيديو الفردية.\r\nمجموعة المغامرات مع 3 بطاريات اكستريم بلس وملحقات أخرى، تحتوي هذه المجموعة على ملحقات متعددة الاستخدامات. خيارًا مثاليًا لصناع المحتوى الذين يبحثون عن المغامرات والذين يحتاجون إلى المرونة والموثوقية.",
              "quantity": 1,
              "sold_quantity": 0,
              "sell_price": 40250,
              "details": [
                  {
                      "product_detail_id": 325,
                      "label": "لون",
                      "value": "اسود"
                  }
              ],
              "images": [
                  {
                      "product_image_id": 219,
                      "image_url": "https://camp-coding.site/laserjet/uploads/products/1762955129029.jpg"
                  }
              ],
              "installments": [
                  {
                      "installment_id": 21,
                      "category_installment_id": 78,
                      "installment_title": "12 شهر",
                      "order_no": 0,
                      "installment_gain": 60,
                      "full_price": 64400
                  }
              ],
              "isInCart": 0,
              "isInWishlist": 0,
              "category": {
                  "is_active": "false"
              }
          }
      ]
  },
  {
      "offer": {
          "offer_id": 19,
          "offer_value": 10,
          "start_date": "2025-11-09 16:07:00",
          "end_date": "2027-01-12 16:07:00",
          "status": "started"
      },
      "products": [
          {
              "product_id": 176,
              "offer_sell_value": 30240,
              "offer_value": 10,
              "price": 28000,
              "is_active": 1,
              "created_at": "2025-10-10 11:08:46",
              "updated_at": "2025-10-10 11:14:19",
              "category_id": 37,
              "order_no": 0,
              "rate": 0,
              "sympol": "MDRT723MTN46D",
              "title": "ثلاجة ميديا، 535 لتر، نوفروست، انفرتر، MDRT723MTN46D - فضي",
              "description": "العلامة التجارية: ميديا\r\nعدد الابواب: 2\r\nالسعة: 535 لتر\r\nاللون: فضى\r\nنوع التبريد: نوفروست\r\nتعمل فى المناطق الحارة: يوجد\r\nخاصية تدفق الهواء المتعدد: يوجد\r\nتحكم ديجيتال: يوجد\r\nموتورانفرتر: يوجد\r\nالأبعاد (العرض*الطول*العمق): 182 * 75 * 74سم\r\nشاشة ديجيتال: يوجد\r\nتوفير الطاقة: يوجد\r\nإضاءة داخلية ليوفر رؤية أوضح: يوجد",
              "quantity": 1,
              "sold_quantity": 0,
              "sell_price": 33600,
              "details": [
                  {
                      "product_detail_id": 282,
                      "label": "الماركه",
                      "value": "Midea"
                  }
              ],
              "images": [
                  {
                      "product_image_id": 208,
                      "image_url": "https://camp-coding.site/laserjet/uploads/products/1762882352163.png"
                  }
              ],
              "installments": [
                  {
                      "installment_id": 20,
                      "category_installment_id": 39,
                      "installment_title": "6 شهور",
                      "order_no": 0,
                      "installment_gain": 30,
                      "full_price": 43680
                  }
              ],
              "isInCart": 0,
              "isInWishlist": 0,
              "category": {
                  "is_active": "false"
              }
          },
          {
              "product_id": 182,
              "offer_sell_value": 315,
              "offer_value": 10,
              "price": 350,
              "is_active": 1,
              "created_at": "2025-11-03 14:50:27",
              "updated_at": "2025-11-03 14:51:22",
              "category_id": 48,
              "order_no": 0,
              "rate": 0,
              "sympol": "15252",
              "title": "TONER LASERJET 85A",
              "description": "متوافق مع برنترات اتش بي 1102/1005",
              "quantity": 1,
              "sold_quantity": 0,
              "sell_price": 350,
              "details": [
                  {
                      "product_detail_id": 292,
                      "label": "ماركه",
                      "value": "هاي كوبي"
                  }
              ],
              "images": [
                  {
                      "product_image_id": 189,
                      "image_url": "https://camp-coding.site/laserjet/uploads/products/1762199427433.jpg"
                  }
              ],
              "installments": [
                  {
                      "installment_id": 0,
                      "category_installment_id": 0,
                      "installment_title": "",
                      "order_no": 0,
                      "installment_gain": 0,
                      "full_price": 350
                  }
              ],
              "isInCart": 0,
              "isInWishlist": 0,
              "category": {
                  "is_active": "false"
              }
          },
          {
              "product_id": 185,
              "offer_sell_value": 315,
              "offer_value": 10,
              "price": 350,
              "is_active": 0,
              "created_at": "2025-11-06 14:09:40",
              "updated_at": "2025-11-06 14:09:40",
              "category_id": 48,
              "order_no": 0,
              "rate": 0,
              "sympol": "5646",
              "title": "toner 35A",
              "description": "toner 35A",
              "quantity": 1,
              "sold_quantity": 0,
              "sell_price": 350,
              "details": [
                  {
                      "product_detail_id": 304,
                      "label": "ماركة",
                      "value": "ليزرجيت"
                  }
              ],
              "images": [
                  {
                      "product_image_id": 192,
                      "image_url": "https://camp-coding.site/laserjet/uploads/products/1762456180572.jpg"
                  }
              ],
              "installments": [
                  {
                      "installment_id": 0,
                      "category_installment_id": 0,
                      "installment_title": "",
                      "order_no": 0,
                      "installment_gain": 0,
                      "full_price": 350
                  }
              ],
              "isInCart": 0,
              "isInWishlist": 0,
              "category": {
                  "is_active": "false"
              }
          },
          {
              "product_id": 188,
              "offer_sell_value": 1260,
              "offer_value": 10,
              "price": 1400,
              "is_active": 1,
              "created_at": "2025-11-09 13:41:07",
              "updated_at": "2025-11-09 13:41:16",
              "category_id": 48,
              "order_no": 0,
              "rate": 0,
              "sympol": "5656",
              "title": "TONER LASERJET 14A\t",
              "description": "TONER LASERJET 14A\t",
              "quantity": 1,
              "sold_quantity": 0,
              "sell_price": 1400,
              "details": [
                  {
                      "product_detail_id": 310,
                      "label": "موديل",
                      "value": "14A"
                  }
              ],
              "images": [
                  {
                      "product_image_id": 195,
                      "image_url": "https://camp-coding.site/laserjet/uploads/products/1762713667725.jpg"
                  }
              ],
              "installments": [
                  {
                      "installment_id": 0,
                      "category_installment_id": 0,
                      "installment_title": "",
                      "order_no": 0,
                      "installment_gain": 0,
                      "full_price": 1400
                  }
              ],
              "isInCart": 0,
              "isInWishlist": 0,
              "category": {
                  "is_active": "false"
              }
          }
      ]
  },
  {
      "offer": {
          "offer_id": 21,
          "offer_value": 1,
          "start_date": "2025-11-01 16:21:00",
          "end_date": "2026-10-22 16:21:00",
          "status": "started"
      },
      "products": [
          {
              "product_id": 178,
              "offer_sell_value": 1188,
              "offer_value": 1,
              "price": 1000,
              "is_active": 1,
              "created_at": "2025-10-25 12:06:57",
              "updated_at": "2025-10-25 12:07:17",
              "category_id": 38,
              "order_no": 0,
              "rate": 0,
              "sympol": "R50I",
              "title": "ايربودز انكر ساوند كور R50i ,A3949H11 - أسود ( ضمان دولي )",
              "description": "وزن السلعة ‏ : ‎ 0,26 جرامات\r\nتاريخ توفر أول منتج ‏ : ‎ 2025 يناير 24\r\nالشركة المصنعة ‏ : ‎ جينريك\r\nASIN ‏ : ‎ B0DTZ4M2T1\r\nبلد المنشأ ‏ : ‎ الصين",
              "quantity": 1,
              "sold_quantity": 0,
              "sell_price": 1200,
              "details": [
                  {
                      "product_detail_id": 286,
                      "label": "رقم موديل السلعة ‏ ",
                      "value": "r50"
                  }
              ],
              "images": [
                  {
                      "product_image_id": 180,
                      "image_url": "https://camp-coding.site/laserjet/uploads/products/1761408417032.jpg"
                  }
              ],
              "installments": [
                  {
                      "installment_id": 20,
                      "category_installment_id": 43,
                      "installment_title": "6 شهور",
                      "order_no": 0,
                      "installment_gain": 30,
                      "full_price": 1560
                  }
              ],
              "isInCart": 0,
              "isInWishlist": 0,
              "category": {
                  "is_active": "false"
              }
          },
          {
              "product_id": 200,
              "offer_sell_value": 772.2,
              "offer_value": 1,
              "price": 650,
              "is_active": 1,
              "created_at": "2025-11-12 09:23:12",
              "updated_at": "2025-11-12 09:23:27",
              "category_id": 38,
              "order_no": 0,
              "rate": 0,
              "sympol": "87",
              "title": "Xiaomi Redmi Buds 6 Play - Black (Global Version)",
              "description": "Brand: Xiaomi\r\nLong Battery Life: Up to 36 hours with the charging case.\r\nAI Noise Reduction: Ensures crystal-clear calls.\r\n10mm Dynamic Driver: Provides powerful sound quality.\r\nFast Charging: 10 minutes of charge offers up to 3 hours of playback.\r\nCustomizable EQ: Five EQ modes for personalized audio.\r\nBluetooth v5.4: low latency and high connection stability.",
              "quantity": 1,
              "sold_quantity": 0,
              "sell_price": 780,
              "details": [
                  {
                      "product_detail_id": 327,
                      "label": "لون",
                      "value": "اسود"
                  }
              ],
              "images": [
                  {
                      "product_image_id": 226,
                      "image_url": "https://camp-coding.site/laserjet/uploads/products/1762957392374.png"
                  }
              ],
              "installments": [
                  {
                      "installment_id": 20,
                      "category_installment_id": 43,
                      "installment_title": "6 شهور",
                      "order_no": 0,
                      "installment_gain": 30,
                      "full_price": 1014
                  }
              ],
              "isInCart": 0,
              "isInWishlist": 0,
              "category": {
                  "is_active": "false"
              }
          }
      ]
  }
]



export default function OffersPage({  }) {
  return (
    <section className="py-8 md:py-12" dir="rtl">
      <div className="mx-auto max-w-6xl px-4">
        {/* العنوان الرئيسي */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              العروض و الخصومات
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              استمتع بأحدث العروض على الموبايلات، الأجهزة المنزلية، الإكسسوارات
              وأكثر – كل الأسعار بعد الخصم موضحة أمامك.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700">
            <Tag className="h-4 w-4" />
            عدد العروض المتاحة: {offers.length}
          </div>
        </div>

        <div className="space-y-8">
          {offers.map((item) => (
            <OfferCard
              key={item.offer.offer_id}
              offer={item.offer}
              products={item.products}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function OfferCard({ offer, products }) {
  const { label: statusLabel, className: statusClass } = getOfferStatusMeta(
    offer.status,
    offer.start_date,
    offer.end_date
  );

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* هيدر العرض */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gradient-to-l from-blue-50/80 via-indigo-50/70 to-sky-50/70 px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white">
            <BadgePercent className="h-3 w-3" />
            عرض رقم #{offer.offer_id}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-blue-700">
            <Percent className="h-3 w-3" />
            خصم حتى {offer.offer_value}%
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold ${statusClass}`}
          >
            <Zap className="h-3 w-3" />
            {statusLabel}
          </span>
        </div>

        <div className="text-left text-[11px] text-gray-700 md:text-xs">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>من: {formatDateTime(offer.start_date)}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] md:text-[11px]">
            <span>حتى: {formatDateTime(offer.end_date)}</span>
          </div>
        </div>
      </div>

      {/* المنتجات داخل العرض */}
      <div className="p-4 md:p-5">
        <div className="mb-3 flex items-center justify-between text-xs text-gray-500">
          <span>عدد المنتجات في العرض: {products.length}</span>
          <span className="hidden md:inline">
            الأسعار الموضحة هي أسعار العرض بعد الخصم
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <OfferProductCard
              key={product.product_id}
              product={product}
              offer={offer}
            />
          ))}
        </div>
      </div>
    </article>
  );
}

function OfferProductCard({ product, offer }) {
  const oldPrice = product.sell_price || product.price;
  const offerPrice = product.offer_sell_value || oldPrice;
  const discountPercent =
    oldPrice && offerPrice
      ? Math.round(((oldPrice - offerPrice) / oldPrice) * 100)
      : offer.offer_value;

  const installment = product.installments?.[0];

  const mainDetail = product.details?.[0];

  const isActive = product.is_active === 1;

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-gray-50/60 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
      {/* صورة المنتج */}
      <div className="relative h-40 w-full overflow-hidden bg-white">
        {product.images?.[0]?.image_url ? (
          <Image
            src={product.images[0].image_url}
            alt={product.title}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-contain p-3"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
            لا توجد صورة
          </div>
        )}

        {/* بادج الخصم على الصورة */}
        <div className="absolute right-2 top-2 rounded-full bg-red-500 px-2 py-1 text-[10px] font-bold text-white shadow">
          -{discountPercent}%
        </div>

        {!isActive && (
          <div className="absolute inset-x-0 bottom-0 bg-black/60 px-2 py-1 text-center text-[11px] font-semibold text-white">
            غير متاح حاليًا
          </div>
        )}
      </div>

      {/* معلومات المنتج */}
      <div className="flex flex-1 flex-col p-3">
        {/* العنوان */}
        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
          {product.title}
        </h3>

        {/* تفاصيل مختصرة */}
        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-gray-500">
          {mainDetail?.label && mainDetail?.value && (
            <span className="rounded-full bg-white px-2 py-0.5 border border-gray-200">
              {mainDetail.label}: {mainDetail.value}
            </span>
          )}
          {product.sympol && (
            <span className="rounded-full bg-white px-2 py-0.5 border border-gray-200">
              كود: {product.sympol}
            </span>
          )}
        </div>

        {/* الأسعار */}
        <div className="mt-2 space-y-0.5 text-sm">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] text-gray-500">سعر العرض</span>
            <span className="text-base font-bold text-emerald-700">
              {formatPrice(offerPrice)} جم
            </span>
          </div>
          <div className="flex items-baseline justify-between text-xs">
            <span className="text-[11px] text-gray-500">السعر قبل العرض</span>
            <span className="text-gray-400 line-through">
              {formatPrice(oldPrice)} جم
            </span>
          </div>
        </div>

        {/* معلومات التقسيط إن وجدت */}
        {installment && installment.full_price > offerPrice && (
          <div className="mt-2 rounded-xl bg-purple-50 px-2 py-1.5 text-[11px] text-purple-800 border border-purple-100">
            <p className="font-semibold flex items-center gap-1">
              <Zap className="h-3 w-3" />
              تقسيط: {installment.installment_title}
            </p>
            <p className="mt-0.5">
              إجمالي بالتقسيط:{" "}
              <span className="font-bold">
                {formatPrice(installment.full_price)} جم
              </span>
            </p>
          </div>
        )}

        {/* الأزرار */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <button
            type="button"
            disabled={!isActive}
            className={`flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition ${
              isActive
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {isActive ? "أضف للسلة" : "غير متاح"}
          </button>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:border-red-300 hover:text-red-500"
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* --------- Helpers ---------- */

function formatDateTime(dateStr) {
  if (!dateStr) return "غير محدد";
  // "2025-11-09 19:31:00" → valid ISO
  const d = new Date(dateStr.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return dateStr;

  const date = d.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const time = d.toLocaleTimeString("ar-EG", {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${date} - ${time}`;
}

function formatPrice(val) {
  if (!val && val !== 0) return "—";
  return new Intl.NumberFormat("ar-EG").format(Math.round(val));
}

function getOfferStatusMeta(status, start, end) {
  const now = new Date();
  const startDate = start ? new Date(start.replace(" ", "T")) : null;
  const endDate = end ? new Date(end.replace(" ", "T")) : null;

  if (endDate && now > endDate) {
    return {
      label: "انتهى العرض",
      className: "bg-gray-100 text-gray-600 border border-gray-200",
    };
  }
  if (startDate && now < startDate) {
    return {
      label: "عرض قادم",
      className: "bg-sky-50 text-sky-700 border border-sky-100",
    };
  }

  switch (status) {
    case "started":
    default:
      return {
        label: "عرض ساري الآن",
        className: "bg-emerald-50 text-emerald-700 border border-emerald-100",
      };
  }
}
