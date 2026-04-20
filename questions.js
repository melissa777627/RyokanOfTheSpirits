// ============================================================
//  questions.js — Ryokan of The Spirits
//  แก้เฉพาะ scene, text, และ choices[].text ได้เลย
//  ห้ามแก้ house / yokai keys — ใช้ตาม scoring-engine.js
// ============================================================

const QUESTIONS = {

  // ══════════════════════════════════════════════════════════
  //  STAGE 1 · HOUSE SORTING (ทุกคนได้ชุดเดียวกัน)
  //  วัด NT / NF / SJ / SP
  //  choices map: purple / green / blue / yellow
  // ══════════════════════════════════════════════════════════

  house: [
    {
      id: 'h1',
      scene: '🌅 [SCENE 1]',
      text: '[คำถามข้อ 1 — เขียนสถานการณ์ที่นี่]',
      choices: [
        { text: '[ตัวเลือก A — บ้าน Purple · Analysts]',  house: 'purple' },
        { text: '[ตัวเลือก B — บ้าน Green · Diplomats]',  house: 'green'  },
        { text: '[ตัวเลือก C — บ้าน Blue · Sentinels]',   house: 'blue'   },
        { text: '[ตัวเลือก D — บ้าน Yellow · Explorers]', house: 'yellow' }
      ]
    },
    {
      id: 'h2',
      scene: '🍵 [SCENE 2]',
      text: '[คำถามข้อ 2 — เขียนสถานการณ์ที่นี่]',
      choices: [
        { text: '[ตัวเลือก A — บ้าน Purple]',  house: 'purple' },
        { text: '[ตัวเลือก B — บ้าน Green]',   house: 'green'  },
        { text: '[ตัวเลือก C — บ้าน Blue]',    house: 'blue'   },
        { text: '[ตัวเลือก D — บ้าน Yellow]',  house: 'yellow' }
      ]
    },
    {
      id: 'h3',
      scene: '🌙 [SCENE 3]',
      text: '[คำถามข้อ 3 — เขียนสถานการณ์ที่นี่]',
      choices: [
        { text: '[ตัวเลือก A — บ้าน Purple]',  house: 'purple' },
        { text: '[ตัวเลือก B — บ้าน Green]',   house: 'green'  },
        { text: '[ตัวเลือก C — บ้าน Blue]',    house: 'blue'   },
        { text: '[ตัวเลือก D — บ้าน Yellow]',  house: 'yellow' }
      ]
    },
    {
      id: 'h4',
      scene: '🎭 [SCENE 4]',
      text: '[คำถามข้อ 4 — เขียนสถานการณ์ที่นี่]',
      choices: [
        { text: '[ตัวเลือก A — บ้าน Purple]',  house: 'purple' },
        { text: '[ตัวเลือก B — บ้าน Green]',   house: 'green'  },
        { text: '[ตัวเลือก C — บ้าน Blue]',    house: 'blue'   },
        { text: '[ตัวเลือก D — บ้าน Yellow]',  house: 'yellow' }
      ]
    },
    {
      id: 'h5',
      scene: '🌸 [SCENE 5 · Tiebreaker]',
      text: '[คำถามข้อ 5 — ข้อนี้ใช้เป็น tiebreaker ของบ้าน เขียนสถานการณ์ที่นี่]',
      choices: [
        { text: '[ตัวเลือก A — บ้าน Purple]',  house: 'purple' },
        { text: '[ตัวเลือก B — บ้าน Green]',   house: 'green'  },
        { text: '[ตัวเลือก C — บ้าน Blue]',    house: 'blue'   },
        { text: '[ตัวเลือก D — บ้าน Yellow]',  house: 'yellow' }
      ]
    }
  ],

  // ══════════════════════════════════════════════════════════
  //  STAGE 2 · YOKAI SELECTION (ดึงตาม winningHouse)
  //  ข้อแรก [0] = bento pop-up question
  //  ข้อ 2-5  [1]-[4] = Event 6-10
  // ══════════════════════════════════════════════════════════

  yokai: {

    // ── HOUSE PURPLE · Analysts ────────────────────────────
    //    วัด: Tenjin (INTJ) / Yumekui (INTP) / Ryuu (ENTJ) / Tengu (ENTP)

    purple: [
      {
        id: 'p1',
        scene: '🍱 [BENTO · Purple]',
        text: '[คำถาม bento pop-up สำหรับบ้าน Purple — "ทำไมถึงจัดแบบนี้?"]',
        choices: [
          { text: '[ตัวเลือก A — Tenjin  · INTJ]', yokai: 'Tenjin'  },
          { text: '[ตัวเลือก B — Yumekui · INTP]', yokai: 'Yumekui' },
          { text: '[ตัวเลือก C — Ryuu    · ENTJ]', yokai: 'Ryuu'    },
          { text: '[ตัวเลือก D — Tengu   · ENTP]', yokai: 'Tengu'   }
        ]
      },
      {
        id: 'p2',
        scene: '🌑 [SCENE P2]',
        text: '[คำถามข้อ 2 บ้าน Purple — เจาะนิสัย INTJ vs INTP vs ENTJ vs ENTP]',
        choices: [
          { text: '[ตัวเลือก A — Tenjin]',  yokai: 'Tenjin'  },
          { text: '[ตัวเลือก B — Yumekui]', yokai: 'Yumekui' },
          { text: '[ตัวเลือก C — Ryuu]',    yokai: 'Ryuu'    },
          { text: '[ตัวเลือก D — Tengu]',   yokai: 'Tengu'   }
        ]
      },
      {
        id: 'p3',
        scene: '📜 [SCENE P3]',
        text: '[คำถามข้อ 3 บ้าน Purple]',
        choices: [
          { text: '[ตัวเลือก A — Tenjin]',  yokai: 'Tenjin'  },
          { text: '[ตัวเลือก B — Yumekui]', yokai: 'Yumekui' },
          { text: '[ตัวเลือก C — Ryuu]',    yokai: 'Ryuu'    },
          { text: '[ตัวเลือก D — Tengu]',   yokai: 'Tengu'   }
        ]
      },
      {
        id: 'p4',
        scene: '🐉 [SCENE P4]',
        text: '[คำถามข้อ 4 บ้าน Purple]',
        choices: [
          { text: '[ตัวเลือก A — Tenjin]',  yokai: 'Tenjin'  },
          { text: '[ตัวเลือก B — Yumekui]', yokai: 'Yumekui' },
          { text: '[ตัวเลือก C — Ryuu]',    yokai: 'Ryuu'    },
          { text: '[ตัวเลือก D — Tengu]',   yokai: 'Tengu'   }
        ]
      },
      {
        id: 'p5',
        scene: '👺 [SCENE P5 · Tiebreaker]',
        text: '[คำถามข้อ 5 บ้าน Purple — ข้อนี้ใช้เป็น tiebreaker ของ Yokai]',
        choices: [
          { text: '[ตัวเลือก A — Tenjin]',  yokai: 'Tenjin'  },
          { text: '[ตัวเลือก B — Yumekui]', yokai: 'Yumekui' },
          { text: '[ตัวเลือก C — Ryuu]',    yokai: 'Ryuu'    },
          { text: '[ตัวเลือก D — Tengu]',   yokai: 'Tengu'   }
        ]
      }
    ],

    // ── HOUSE GREEN · Diplomats ────────────────────────────
    //    วัด: Shinigami (INFJ) / Yukionna (INFP) / Kitsune (ENFJ) / Tanuki (ENFP)

    green: [
      {
        id: 'g1',
        scene: '🍱 [BENTO · Green]',
        text: '[คำถาม bento pop-up สำหรับบ้าน Green — "ทำไมถึงจัดแบบนี้?"]',
        choices: [
          { text: '[ตัวเลือก A — Shinigami · INFJ]', yokai: 'Shinigami' },
          { text: '[ตัวเลือก B — Yukionna  · INFP]', yokai: 'Yukionna'  },
          { text: '[ตัวเลือก C — Kitsune   · ENFJ]', yokai: 'Kitsune'   },
          { text: '[ตัวเลือก D — Tanuki    · ENFP]', yokai: 'Tanuki'    }
        ]
      },
      {
        id: 'g2',
        scene: '💀 [SCENE G2]',
        text: '[คำถามข้อ 2 บ้าน Green — เจาะนิสัย INFJ vs INFP vs ENFJ vs ENFP]',
        choices: [
          { text: '[ตัวเลือก A — Shinigami]', yokai: 'Shinigami' },
          { text: '[ตัวเลือก B — Yukionna]',  yokai: 'Yukionna'  },
          { text: '[ตัวเลือก C — Kitsune]',   yokai: 'Kitsune'   },
          { text: '[ตัวเลือก D — Tanuki]',    yokai: 'Tanuki'    }
        ]
      },
      {
        id: 'g3',
        scene: '❄️ [SCENE G3]',
        text: '[คำถามข้อ 3 บ้าน Green]',
        choices: [
          { text: '[ตัวเลือก A — Shinigami]', yokai: 'Shinigami' },
          { text: '[ตัวเลือก B — Yukionna]',  yokai: 'Yukionna'  },
          { text: '[ตัวเลือก C — Kitsune]',   yokai: 'Kitsune'   },
          { text: '[ตัวเลือก D — Tanuki]',    yokai: 'Tanuki'    }
        ]
      },
      {
        id: 'g4',
        scene: '🦊 [SCENE G4]',
        text: '[คำถามข้อ 4 บ้าน Green]',
        choices: [
          { text: '[ตัวเลือก A — Shinigami]', yokai: 'Shinigami' },
          { text: '[ตัวเลือก B — Yukionna]',  yokai: 'Yukionna'  },
          { text: '[ตัวเลือก C — Kitsune]',   yokai: 'Kitsune'   },
          { text: '[ตัวเลือก D — Tanuki]',    yokai: 'Tanuki'    }
        ]
      },
      {
        id: 'g5',
        scene: '🍃 [SCENE G5 · Tiebreaker]',
        text: '[คำถามข้อ 5 บ้าน Green — ข้อนี้ใช้เป็น tiebreaker ของ Yokai]',
        choices: [
          { text: '[ตัวเลือก A — Shinigami]', yokai: 'Shinigami' },
          { text: '[ตัวเลือก B — Yukionna]',  yokai: 'Yukionna'  },
          { text: '[ตัวเลือก C — Kitsune]',   yokai: 'Kitsune'   },
          { text: '[ตัวเลือก D — Tanuki]',    yokai: 'Tanuki'    }
        ]
      }
    ],

    // ── HOUSE BLUE · Sentinels ─────────────────────────────
    //    วัด: Oni (ISTJ) / Ningyo (ISFJ) / Raijin (ESTJ) / Inugami (ESFJ)

    blue: [
      {
        id: 'b1',
        scene: '🍱 [BENTO · Blue]',
        text: '[คำถาม bento pop-up สำหรับบ้าน Blue — "ทำไมถึงจัดแบบนี้?"]',
        choices: [
          { text: '[ตัวเลือก A — Oni     · ISTJ]', yokai: 'Oni'     },
          { text: '[ตัวเลือก B — Ningyo  · ISFJ]', yokai: 'Ningyo'  },
          { text: '[ตัวเลือก C — Raijin  · ESTJ]', yokai: 'Raijin'  },
          { text: '[ตัวเลือก D — Inugami · ESFJ]', yokai: 'Inugami' }
        ]
      },
      {
        id: 'b2',
        scene: '👹 [SCENE B2]',
        text: '[คำถามข้อ 2 บ้าน Blue — เจาะนิสัย ISTJ vs ISFJ vs ESTJ vs ESFJ]',
        choices: [
          { text: '[ตัวเลือก A — Oni]',     yokai: 'Oni'     },
          { text: '[ตัวเลือก B — Ningyo]',  yokai: 'Ningyo'  },
          { text: '[ตัวเลือก C — Raijin]',  yokai: 'Raijin'  },
          { text: '[ตัวเลือก D — Inugami]', yokai: 'Inugami' }
        ]
      },
      {
        id: 'b3',
        scene: '🧜 [SCENE B3]',
        text: '[คำถามข้อ 3 บ้าน Blue]',
        choices: [
          { text: '[ตัวเลือก A — Oni]',     yokai: 'Oni'     },
          { text: '[ตัวเลือก B — Ningyo]',  yokai: 'Ningyo'  },
          { text: '[ตัวเลือก C — Raijin]',  yokai: 'Raijin'  },
          { text: '[ตัวเลือก D — Inugami]', yokai: 'Inugami' }
        ]
      },
      {
        id: 'b4',
        scene: '⚡ [SCENE B4]',
        text: '[คำถามข้อ 4 บ้าน Blue]',
        choices: [
          { text: '[ตัวเลือก A — Oni]',     yokai: 'Oni'     },
          { text: '[ตัวเลือก B — Ningyo]',  yokai: 'Ningyo'  },
          { text: '[ตัวเลือก C — Raijin]',  yokai: 'Raijin'  },
          { text: '[ตัวเลือก D — Inugami]', yokai: 'Inugami' }
        ]
      },
      {
        id: 'b5',
        scene: '🐕 [SCENE B5 · Tiebreaker]',
        text: '[คำถามข้อ 5 บ้าน Blue — ข้อนี้ใช้เป็น tiebreaker ของ Yokai]',
        choices: [
          { text: '[ตัวเลือก A — Oni]',     yokai: 'Oni'     },
          { text: '[ตัวเลือก B — Ningyo]',  yokai: 'Ningyo'  },
          { text: '[ตัวเลือก C — Raijin]',  yokai: 'Raijin'  },
          { text: '[ตัวเลือก D — Inugami]', yokai: 'Inugami' }
        ]
      }
    ],

    // ── HOUSE YELLOW · Explorers ───────────────────────────
    //    วัด: Nekomata (ISTP) / Hebi (ISFP) / Jorogumo (ESTP) / Fuujin (ESFP)

    yellow: [
      {
        id: 'y1',
        scene: '🍱 [BENTO · Yellow]',
        text: '[คำถาม bento pop-up สำหรับบ้าน Yellow — "ทำไมถึงจัดแบบนี้?"]',
        choices: [
          { text: '[ตัวเลือก A — Nekomata · ISTP]', yokai: 'Nekomata' },
          { text: '[ตัวเลือก B — Hebi      · ISFP]', yokai: 'Hebi'     },
          { text: '[ตัวเลือก C — Jorogumo  · ESTP]', yokai: 'Jorogumo' },
          { text: '[ตัวเลือก D — Fuujin    · ESFP]', yokai: 'Fuujin'   }
        ]
      },
      {
        id: 'y2',
        scene: '🐈‍⬛ [SCENE Y2]',
        text: '[คำถามข้อ 2 บ้าน Yellow — เจาะนิสัย ISTP vs ISFP vs ESTP vs ESFP]',
        choices: [
          { text: '[ตัวเลือก A — Nekomata]', yokai: 'Nekomata' },
          { text: '[ตัวเลือก B — Hebi]',     yokai: 'Hebi'     },
          { text: '[ตัวเลือก C — Jorogumo]', yokai: 'Jorogumo' },
          { text: '[ตัวเลือก D — Fuujin]',   yokai: 'Fuujin'   }
        ]
      },
      {
        id: 'y3',
        scene: '🐍 [SCENE Y3]',
        text: '[คำถามข้อ 3 บ้าน Yellow]',
        choices: [
          { text: '[ตัวเลือก A — Nekomata]', yokai: 'Nekomata' },
          { text: '[ตัวเลือก B — Hebi]',     yokai: 'Hebi'     },
          { text: '[ตัวเลือก C — Jorogumo]', yokai: 'Jorogumo' },
          { text: '[ตัวเลือก D — Fuujin]',   yokai: 'Fuujin'   }
        ]
      },
      {
        id: 'y4',
        scene: '🕸️ [SCENE Y4]',
        text: '[คำถามข้อ 4 บ้าน Yellow]',
        choices: [
          { text: '[ตัวเลือก A — Nekomata]', yokai: 'Nekomata' },
          { text: '[ตัวเลือก B — Hebi]',     yokai: 'Hebi'     },
          { text: '[ตัวเลือก C — Jorogumo]', yokai: 'Jorogumo' },
          { text: '[ตัวเลือก D — Fuujin]',   yokai: 'Fuujin'   }
        ]
      },
      {
        id: 'y5',
        scene: '🌪️ [SCENE Y5 · Tiebreaker]',
        text: '[คำถามข้อ 5 บ้าน Yellow — ข้อนี้ใช้เป็น tiebreaker ของ Yokai]',
        choices: [
          { text: '[ตัวเลือก A — Nekomata]', yokai: 'Nekomata' },
          { text: '[ตัวเลือก B — Hebi]',     yokai: 'Hebi'     },
          { text: '[ตัวเลือก C — Jorogumo]', yokai: 'Jorogumo' },
          { text: '[ตัวเลือก D — Fuujin]',   yokai: 'Fuujin'   }
        ]
      }
    ]

  } // end yokai
}; // end QUESTIONS
