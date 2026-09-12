/* =======================================================================
   KURSVERZEICHNIS — die einzige Stelle, an der alle Lektionen aufgelistet
   sind. Die Startseite baut daraus ihre Übersicht, der Player daraus die
   Navigation („Lektion 3 von 20", vor/zurück).

   Neue Lektion anlegen:
     1. lessons/lektion-XX.html aus einer bestehenden Datei kopieren
     2. Konstante LESSON darin füllen
     3. hier unten einen Eintrag ergänzen — fertig.
   ======================================================================= */
window.LESSONS = [
  { no:1,  file:"lektion-01.html", thema:"Zeigesätze",
    ziel:"Das ist ein Weg. — der einfachste arabische Satz, ganz ohne „ist“.",
    woerter:["هٰذَا","شَيۡء","سَبِيل","وَ"] },

  { no:2,  file:"lektion-02.html", thema:"Ein weiteres Zeigewort",
    ziel:"هٰذِهِ — und woran man erkennt, wann es statt هٰذَا stehen muss.",
    woerter:["هٰذِهِ","آيَة","لَيۡلَة"] },

  { no:3,  file:"lektion-03.html", thema:"Der Artikel الـ",
    ziel:"Aus „ein Buch“ wird „das Buch“ — und das Tanwīn verschwindet.",
    woerter:["الۡكِتَاب","الۡحَقّ","النَّاس"] },

  { no:4,  file:"lektion-04.html", thema:"Nah und fern",
    ziel:"ذٰلِكَ und تِلۡكَ — zeigen auf das, was weiter weg ist.",
    woerter:["ذٰلِكَ","تِلۡكَ","رَيۡب"] },

  { no:5,  file:"lektion-05.html", thema:"Eigenschaftswörter",
    ziel:"Im Arabischen steht das Adjektiv hinten — und richtet sich nach seinem Wort.",
    woerter:["مُبِين","كَرِيم","عَظِيم"] },

  { no:6,  file:"lektion-06.html", thema:"Kleine Wörter davor",
    ziel:"فِي, مِنۡ, إِلَىٰ, عَلَىٰ — und was sie mit dem nächsten Wort machen.",
    woerter:["فِي","مِنۡ","إِلَىٰ","عَلَىٰ"] },

  { no:7,  file:"lektion-07.html", thema:"Mein, dein, sein",
    ziel:"Besitz wird angehängt, nicht davorgestellt: رَبِّي – رَبُّكَ – رَبُّهُ.",
    woerter:["رَبّ","ـِي","ـكَ","ـهُ"] },

  { no:8,  file:"lektion-08.html", thema:"Ich, du, er, sie",
    ziel:"Die freien Personalpronomen — und Sätze ganz ohne Verb.",
    woerter:["هُوَ","هِيَ","أَنۡتَ","أَنَا"] },

  { no:9,  file:"lektion-09.html", thema:"Zwei Wörter, ein Begriff",
    ziel:"Die Idāfa: رَبُّ الۡعَالَمِينَ — der Herr der Welten.",
    woerter:["رَبُّ الۡعَالَمِينَ","يَوۡمُ الدِّينِ"] },

  { no:10, file:"lektion-10.html", thema:"Nein und nicht",
    ziel:"لَا, مَا, لَيۡسَ, إِلَّا — verneinen und eine Ausnahme machen.",
    woerter:["لَا","مَا","لَيۡسَ","إِلَّا"] },

  { no:11, file:"lektion-11.html", thema:"Mehr als eins",
    ziel:"Drei Wege zum Plural — angehängt, angehängt, oder von innen umgebaut.",
    woerter:["مُسۡلِمُونَ","مُسۡلِمَات","رُسُل"] },

  { no:12, file:"lektion-12.html", thema:"Das Verb: Vergangenheit",
    ziel:"خَلَقَ, قَالَ, أَنۡزَلَ — die Grundform ist schon ein ganzer Satz.",
    woerter:["خَلَقَ","قَالَ","أَنۡزَلَ"] },

  { no:13, file:"lektion-13.html", thema:"Wer hat es getan?",
    ziel:"Endungen am Verb: قُلۡتُ, قُلۡتَ, أَنۡزَلۡنَا, قَالُوا.",
    woerter:["ـۡتُ","ـۡتَ","ـۡنَا","ـُوا"] },

  { no:14, file:"lektion-14.html", thema:"Das Verb: Gegenwart",
    ziel:"Vorne statt hinten: يَعۡلَمُ, تَعۡلَمُونَ, نَعۡبُدُ.",
    woerter:["يَعۡلَمُ","تَعۡلَمُونَ","نَعۡبُدُ"] },

  { no:15, file:"lektion-15.html", thema:"Der Befehl",
    ziel:"قُلۡ, اقۡرَأۡ, اهۡدِنَا — kurz, direkt, überall im Quran.",
    woerter:["قُلۡ","اقۡرَأۡ","اهۡدِنَا"] },

  { no:16, file:"lektion-16.html", thema:"Fragen stellen",
    ziel:"هَلۡ, أَ, مَنۡ, مَا, كَيۡفَ — und wie man sie beantwortet.",
    woerter:["هَلۡ","مَنۡ","مَا","كَيۡفَ"] },

  { no:17, file:"lektion-17.html", thema:"إِنَّ und كَانَ",
    ziel:"Zwei Wörter, die den ganzen Satz umstellen.",
    woerter:["إِنَّ","كَانَ"] },

  { no:18, file:"lektion-18.html", thema:"Zeit und Bedingung",
    ziel:"قَدۡ, لَمۡ, لَنۡ, سَـ, إِذَا — kleine Wörter mit großer Wirkung.",
    woerter:["قَدۡ","لَمۡ","لَنۡ","إِذَا"] },

  { no:19, file:"lektion-19.html", thema:"Die Wurzel",
    ziel:"Drei Buchstaben, eine ganze Wortfamilie: ع-ل-م.",
    woerter:["عِلۡم","عَالِم","عَلِيم","يَعۡلَمُ"] },

  { no:20, file:"lektion-20.html", thema:"Al-Fātiḥa Wort für Wort",
    ziel:"Die sieben Verse — und in jedem steckt etwas aus den Lektionen davor.",
    woerter:["الۡحَمۡدُ لِلّٰهِ","اهۡدِنَا الصِّرَاطَ"] }
];
