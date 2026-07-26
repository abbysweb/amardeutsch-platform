/**
 * Full lecture notes for B1 German Grammar — 15 Units.
 * Each value is a markdown string rendered by SimpleMarkdown.
 */

const lectures: Record<number, string> = {

/* ================================================================
   UNIT 1 — Präteritum (The Simple Past)
   ================================================================ */
1: `
### 1.1 The Written Past

In A2, you learned that Germans use the Perfekt tense for speaking, and the Präteritum (simple past) only for a few verbs like *sein*, *haben*, and modal verbs.
In B1, you must learn the Präteritum for ALL verbs. Why? Because you need it to read books, news articles, and write formal emails.

### 1.2 Regular Verbs in Präteritum

For regular verbs, add a **-te-** marker before the personal ending. 
Example with *machen* (to make):
- ich mach**te**
- du mach**test**
- er/sie/es mach**te**
- wir mach**ten**
- ihr mach**tet**
- sie mach**ten**

### 1.3 Irregular (Strong) Verbs in Präteritum

Irregular verbs change their stem vowel completely, and they do NOT take a -te marker. You must memorize these stem changes!
Example with *gehen* (to go) -> Stem becomes *ging*:
- ich ging
- du ging**st**
- er/sie/es ging
- wir ging**en**
- ihr ging**t**
- sie ging**en**

**CRITICAL RULE:** In the Präteritum, the 1st person singular (*ich*) and 3rd person singular (*er/sie/es*) are ALWAYS exactly the same!

### 1.4 Practice Sentences

1. **Die Frau öffnete die Tür.**
   - *Breakdown:* Regular verb *öffnen* + te = öffnete.
   - *Meaning:* The woman opened the door.
2. **Wir flogen nach Spanien.**
   - *Breakdown:* Irregular verb *fliegen* changes to *flogen*.
   - *Meaning:* We flew to Spain.
`,

/* ================================================================
   UNIT 2 — Plusquamperfekt (The Past Perfect)
   ================================================================ */
2: `
### 2.1 The Past of the Past

When you are telling a story in the past, and you need to refer to something that happened *even earlier*, you use the **Plusquamperfekt** (Past Perfect).

In English, this is "I **had** eaten" or "She **had** gone".

### 2.2 How to Form It

The Plusquamperfekt is formed exactly like the normal Perfekt, but you put the helping verb (*haben* or *sein*) into the Präteritum (*hatte* or *war*).

- Perfekt: Ich **habe** das Buch gelesen. (I have read the book)
- Plusquamperfekt: Ich **hatte** das Buch gelesen. (I had read the book)
- Perfekt: Er **ist** nach Hause gegangen. (He has gone home)
- Plusquamperfekt: Er **war** nach Hause gegangen. (He had gone home)

### 2.3 Using 'Nachdem'

The Plusquamperfekt is most commonly used with the subordinating conjunction **nachdem** (after).
Remember: *nachdem* kicks the verb to the end of the clause!

*Nachdem ich meine Hausaufgaben gemacht hatte, ging ich ins Kino.*
(After I had done my homework, I went to the cinema.)

### 2.4 Practice Sentences

1. **Ich konnte die Tür nicht öffnen, weil ich meinen Schlüssel vergessen hatte.**
   - *Meaning:* I couldn't open the door because I had forgotten my key.
2. **Nachdem der Zug abgefahren war, rief er ein Taxi.**
   - *Meaning:* After the train had departed, he called a taxi.
`,

/* ================================================================
   UNIT 3 — Passiv (The Passive Voice)
   ================================================================ */
3: `
### 3.1 What is the Passive Voice?

In an **Active** sentence, the focus is on WHO is doing the action. 
*Active:* Der Mechaniker repariert das Auto. (The mechanic repairs the car.)

In a **Passive** sentence, the focus is on the ACTION itself, and the person doing it is either unimportant or unknown.
*Passive:* Das Auto wird repariert. (The car is being repaired.)

### 3.2 Forming the Present Passive

To form the present passive, use the helping verb **werden** (to become/be) + the **Past Participle** of the main verb at the end of the sentence.

- ich werde... repariert
- du wirst... repariert
- er/sie/es wird... repariert
- wir werden... repariert
- ihr werdet... repariert
- sie werden... repariert

### 3.3 Forming the Past Passive (Präteritum)

To talk about something that *was* done, use the Präteritum form of werden: **wurden**.

- ich wurde... repariert
- du wurdest... repariert
- er/sie/es wurde... repariert
- wir wurden... repariert

### 3.4 Practice Sentences

1. **Der Kuchen wird gebacken.**
   - *Meaning:* The cake is being baked. (Present Passive)
2. **Die E-Mail wurde gestern geschrieben.**
   - *Meaning:* The email was written yesterday. (Past Passive)
3. **Hier wird nicht geraucht!**
   - *Meaning:* Smoking is not done here! (Impersonal passive)
`,

/* ================================================================
   UNIT 4 — Relative Clauses and Pronouns
   ================================================================ */
4: `
### 4.1 What is a Relative Clause?

A relative clause gives extra information about a noun without starting a new sentence. It is connected by a **Relative Pronoun** (who, which, that).

Sentence 1: Das ist der Mann. 
Sentence 2: Der Mann wohnt hier.
Combined: Das ist der Mann, **der** hier wohnt.

### 4.2 The Golden Rules of Relative Clauses

1. Relative clauses are dependent clauses. **The conjugated verb gets kicked to the very end!**
2. The clause is always separated by commas.
3. The relative pronoun takes its **Gender (M/F/N)** from the noun it refers back to.
4. The relative pronoun takes its **Case (Nom/Acc)** from its function inside the *new* clause.

### 4.3 Nominative and Accusative Pronouns

The relative pronouns look almost exactly like the definite articles (der, die, das)!

**Nominative (The pronoun is the subject of the new clause):**
- Das ist der Mann, **der** viel isst. (The man *who* eats a lot.)

**Accusative (The pronoun is the direct object of the new clause):**
- Das ist der Mann, **den** ich sehe. (The man *whom* I see.)
- *Why 'den'?* Because in the new clause, "ich" is the subject doing the seeing, so the man receives the action (Accusative masculine = den).

### 4.4 Practice Sentences

1. **Das Auto, das ich kaufe, ist teuer.**
   - *Breakdown:* "das Auto" is neuter. I am buying it, so it's Accusative neuter (das). Verb "kaufe" goes to the end of the commas.
   - *Meaning:* The car that I am buying is expensive.
2. **Die Frau, die dort steht, ist meine Chefin.**
   - *Breakdown:* "die Frau" is feminine. She is doing the standing, so it's Nominative feminine (die).
   - *Meaning:* The woman who is standing there is my boss.
`,

/* ================================================================
   UNIT 5 — Relative Pronouns in the Dative Case
   ================================================================ */
5: `
### 5.1 Dative Relative Pronouns

When the noun you are referring back to acts as the indirect object in the new clause, or follows a Dative preposition, you must use a Dative relative pronoun.

These look exactly like Dative definite articles, with ONE big exception for the plural:
- Masc: **dem**
- Fem: **der**
- Neut: **dem**
- Plural: **denen** (Watch out for this! It is not 'den', it is 'denen'!).

### 5.2 When to use Dative

**1. With Dative Verbs:**
- Das ist das Kind. Ich helfe dem Kind.
- Das ist das Kind, **dem** ich helfe.
*(I help the child -> The child whom I help)*

**2. With Dative Prepositions:**
- Das ist die Frau. Ich arbeite mit der Frau.
- Das ist die Frau, **mit der** ich arbeite.
*(The woman with whom I work)*

### 5.3 Plural Exception: Denen

If the relative pronoun refers back to a plural noun in the Dative case, you must use **denen**.
- Das sind die Freunde. Ich vertraue den Freunden.
- Das sind die Freunde, **denen** ich vertraue. (The friends whom I trust.)

### 5.4 Practice Sentences

1. **Das ist der Kollege, von dem ich erzählt habe.**
   - *Breakdown:* 'von' requires Dative. Kollege is masculine -> dem.
   - *Meaning:* That is the colleague about whom I told you.
2. **Das sind die Leute, denen das Haus gehört.**
   - *Breakdown:* 'gehören' requires Dative. 'Leute' is plural -> denen.
   - *Meaning:* Those are the people to whom the house belongs.
`,

/* ================================================================
   UNIT 6 — N-Declension (Weak Nouns)
   ================================================================ */
6: `
### 6.1 What is N-Declension?

Usually, German nouns don't change their endings in the Accusative or Dative case (except for the Dative plural '-n'). 
However, there is a special group of **masculine nouns** called "weak nouns" that undergo **N-Declension**.

These nouns add an **-n** or **-en** to the end of the word in EVERY case *except* the Nominative singular!

### 6.2 Identifying Weak Nouns

Which nouns do this? They are almost exclusively masculine nouns that refer to living things (people or animals), particularly:
1. Masculine nouns ending in **-e**: *der Junge* (boy), *der Kollege* (colleague), *der Kunde* (customer), *der Franzose* (Frenchman), *der Löwe* (lion).
2. Masculine nouns ending in **-ent, -ant, -ist**: *der Student, der Präsident, der Polizist, der Tourist, der Elefant*.
3. A few exceptions: *der Mensch* (human), *der Herr* (gentleman).

### 6.3 How it works

Let's look at *der Junge* (the boy):
- **Nominative:** Der Junge spielt. (The boy plays)
- **Accusative:** Ich sehe den Junge**n**. (I see the boy)
- **Dative:** Ich gebe dem Junge**n** einen Apfel. (I give the boy an apple)

Let's look at *der Student*:
- **Nominative:** Der Student lernt.
- **Accusative:** Ich frage den Student**en**.
- **Dative:** Das Buch gehört dem Student**en**.

### 6.4 Practice Sentences

1. **Haben Sie den Herrn gesehen?**
   - *Meaning:* Have you seen the gentleman? (Herr + n)
2. **Ich spreche mit dem Polizisten.**
   - *Meaning:* I am speaking with the police officer. (Polizist + en)
3. **Der Bär greift den Touristen an.**
   - *Meaning:* The bear attacks the tourist.
`,

/* ================================================================
   UNIT 7 — Genitive Case (The 4th Case)
   ================================================================ */
7: `
### 7.1 What is the Genitive Case?

The Genitive case shows ownership or possession. In English, we show this using an apostrophe 's' (the dog's toy) or by using 'of the' (the toy of the dog).

In German, the Genitive case mostly replaces the need to use 'von' (from/of).
Instead of *Das Auto von dem Mann*, you say *Das Auto des Mannes*.

### 7.2 Definite Articles in the Genitive

- Masculine: **des** 
- Feminine: **der**
- Neuter: **des**
- Plural: **der**

### 7.3 The Noun Ending Rule

For **Masculine** and **Neuter** nouns, you must add an **-s** or **-es** to the end of the noun!
- 1-syllable nouns usually get **-es**: des Mann**es**, des Kind**es**, des Jahr**es**.
- Multi-syllable nouns usually get **-s**: des Auto**s**, des Vater**s**.

Feminine and plural nouns get NO ending: der Frau, der Kinder.

### 7.4 Proper Names

When using names, German is exactly like English, but without the apostrophe!
- Annas Buch (Anna's book)
- Peters Auto (Peter's car)

### 7.5 Practice Sentences

1. **Die Tür des Hauses ist offen.**
   - *Breakdown:* des (neuter genitive) + Haus + es.
   - *Meaning:* The door of the house is open.
2. **Das ist der Hund der Frau.**
   - *Breakdown:* der (feminine genitive). No ending on Frau.
   - *Meaning:* That is the woman's dog.
3. **Der Computer des Studenten ist kaputt.**
   - *Breakdown:* Wait! Student is a weak noun (N-Declension). It takes an -en instead of an -s!
   - *Meaning:* The student's computer is broken.
`,

/* ================================================================
   UNIT 8 — Genitive Prepositions
   ================================================================ */
8: `
### 8.1 Prepositions requiring the Genitive

Just as some prepositions force Accusative or Dative, a small group of prepositions forces the **Genitive** case.
These are very common in formal language, news, and literature.

### 8.2 The Most Common Genitive Prepositions

- **wegen** (because of / due to)
- **während** (during)
- **trotz** (despite / in spite of)
- **(an)statt** (instead of)
- **innerhalb** (inside of / within)
- **außerhalb** (outside of)

### 8.3 Examples of Declension

Remember to apply both the article change (des/der/des/der) AND the noun ending for masculine/neuter (-s / -es)!

- wegen *des Wetter**s*** (because of the weather)
- während *der Arbeit* (during work - feminine, no noun ending)
- trotz *des Stau**s*** (despite the traffic jam)

### 8.4 Practice Sentences

1. **Wegen des Regens können wir nicht spielen.**
   - *Meaning:* Because of the rain, we cannot play.
2. **Während der Pause trinke ich Kaffee.**
   - *Meaning:* During the break, I drink coffee.
3. **Statt eines Autos kauft er ein Fahrrad.**
   - *Meaning:* Instead of a car (neuter indefinite: eines + Autos), he buys a bicycle.
4. **Wir wohnen außerhalb der Stadt.**
   - *Meaning:* We live outside of the city.
`,

/* ================================================================
   UNIT 9 — Infinitive Clauses with 'zu'
   ================================================================ */
9: `
### 9.1 What is an Infinitive Clause?

Infinitive clauses are dependent clauses where the verb is NOT conjugated. Instead, the verb is in its dictionary form (infinitive) with the word **zu** (to) right in front of it, placed at the absolute end of the sentence.

*English:* It is important **to learn**.
*German:* Es ist wichtig, **zu lernen**.

### 9.2 The Big Three Connectors

In B1, there are three major connectors that use infinitive clauses:

**1. um ... zu + Infinitive (in order to)**
Shows a goal or intention.
- Ich lerne Deutsch, **um** in Deutschland **zu arbeiten**.
*(I learn German in order to work in Germany.)*

**2. ohne ... zu + Infinitive (without doing something)**
- Er ist gegangen, **ohne** Tschüss **zu sagen**.
*(He left without saying goodbye.)*

**3. statt ... zu + Infinitive (instead of doing something)**
- Ich spiele Videospiele, **statt** Hausaufgaben **zu machen**.
*(I play video games instead of doing homework.)*

### 9.3 Separable Verbs

If the verb is a separable verb (like *aufstehen* or *einkaufen*), the **zu** gets sandwiched directly between the prefix and the main verb!
- einkaufen -> ein**zu**kaufen
- aufstehen -> auf**zu**stehen
*Beispiel: Er geht in die Stadt, um ein**zu**kaufen.*

### 9.4 Practice Sentences

1. **Ich habe vergessen, die Tür abzuschließen.**
   - *Meaning:* I forgot to lock the door. (abschließen = separable = ab-zu-schließen).
2. **Sie geht ins Fitnessstudio, um gesund zu bleiben.**
   - *Meaning:* She goes to the gym in order to stay healthy.
`,

/* ================================================================
   UNIT 10 — Konjunktiv II for Unreal Conditions
   ================================================================ */
10: `
### 10.1 The Realm of the Unreal

In A2, you learned Konjunktiv II for polite requests (Ich hätte gern...). 
In B1, you use it for **unreal conditions**—imagining things that aren't true.

"If I were rich (I'm not), I would buy a boat."

### 10.2 The 'Wenn' Clause

Unreal conditions usually start with a **wenn** (if) clause. 
Remember that *wenn* kicks the conjugated verb to the end!

- Wenn ich eine Million Euro **hätte**, ... (If I had a million euros)
- Wenn ich Präsident **wäre**, ... (If I were president)

### 10.3 The Main Clause (Würde)

For the second half of the sentence (what you *would* do), you use the helper verb **würde** (would) + an infinitive at the end.

- ..., **würde** ich ein Haus **kaufen**.
- ..., **würden** wir eine Party **machen**.

**Putting it together:**
*Wenn ich eine Million Euro hätte, würde ich ein Haus kaufen.*

### 10.4 Verbs with their own Konjunktiv II forms

While most verbs use *würde + infinitive* (würde machen, würde spielen), a few verbs have their own dedicated forms that you should use instead of würde.
- sein -> **wäre** (would be)
- haben -> **hätte** (would have)
- können -> **könnte** (could)
- müssen -> **müsste** (would have to)
- wissen -> **wüsste** (would know)

### 10.5 Practice Sentences

1. **Wenn das Wetter besser wäre, würden wir an den Strand gehen.**
   - *Meaning:* If the weather were better, we would go to the beach.
2. **Ich würde dir helfen, wenn ich Zeit hätte.**
   - *Meaning:* I would help you if I had time.
3. **Wenn ich fliegen könnte, wäre ich glücklich.**
   - *Meaning:* If I could fly, I would be happy.
`,

/* ================================================================
   UNIT 11 — Two-Part Conjunctions
   ================================================================ */
11: `
### 11.1 Double the Fun

Two-part conjunctions (Doppelkonjunktionen) connect two ideas, emphasizing their relationship (alternatives, exclusions, or additions). 
They make your German sound much more advanced and fluent!

### 11.2 The Pairings

**1. entweder ... oder (either ... or)**
Expresses a choice between two alternatives.
- Wir fahren *entweder* nach Spanien *oder* nach Italien.

**2. weder ... noch (neither ... nor)**
Expresses that BOTH options are false. (No extra negative words allowed!).
- Er isst *weder* Fleisch *noch* Fisch. (He eats neither meat nor fish.)

**3. sowohl ... als auch (both ... and)**
Expresses that BOTH options are true, giving equal weight.
- Sie spricht *sowohl* Deutsch *als auch* Spanisch.

**4. nicht nur ... sondern auch (not only ... but also)**
Expresses that BOTH options are true, but puts emphasis on the surprising second addition.
- Er ist *nicht nur* intelligent, *sondern auch* sehr fleißig.

**5. je ... desto (the [comparative] ... the [comparative])**
Expresses a proportional relationship. The "je" part is a dependent clause (verb at the end!), the "desto" part starts with the verb!
- *Je* mehr ich lerne, *desto* besser spreche ich. (The more I study, the better I speak.)

### 11.3 Practice Sentences

1. **Ich möchte sowohl ein Auto als auch ein Motorrad haben.**
   - *Meaning:* I want to have both a car and a motorcycle.
2. **Je früher wir abfahren, desto früher kommen wir an.**
   - *Meaning:* The earlier we depart, the earlier we arrive.
`,

/* ================================================================
   UNIT 12 — Adjective Declension without Article
   ================================================================ */
12: `
### 12.1 The Lonely Adjective

We learned that adjectives take endings based on whether they follow a definite article (der/die/das) or an indefinite article (ein/eine). 
But what happens if there is NO article at all? (e.g. "Cold water", "Fresh bread", "Good friends").

### 12.2 The 'Signal' Rule

If there is no article to show the gender and case, the adjective has to do all the heavy lifting! 
**The adjective takes the exact ending of the definite article (der/die/das) for that case.**

**Nominative (No Article):**
- M (der): kalt**er** Kaffee
- F (die): frisch**e** Milch
- N (das): kalt**es** Wasser
- Pl (die): gut**e** Freunde

**Accusative (No Article):**
- M (den): kalt**en** Kaffee
- F (die): frisch**e** Milch
- N (das): kalt**es** Wasser
- Pl (die): gut**e** Freunde

**Dative (No Article):**
- M (dem): kalt**em** Kaffee
- F (der): frisch**er** Milch
- N (dem): kalt**em** Wasser
- Pl (den): gut**en** Freunden (plus 'n' on noun!)

### 12.3 The Genitive Exception

The Genitive masculine and neuter should logically take an **-es** (from *des*). But because the noun itself already gets an -s/-es ending, the German language decided not to double up. It takes an **-en** instead.
- M: wegen stark**en** Regens (due to strong rain)

### 12.4 Practice Sentences

1. **Ich wünsche dir viel Glück und gute Gesundheit.**
   - *Breakdown:* plural accusative -> gute.
   - *Meaning:* I wish you much luck and good health.
2. **Er trinkt Tee mit frischer Milch.**
   - *Breakdown:* 'mit' + Dative feminine (der) -> frischer.
   - *Meaning:* He drinks tea with fresh milk.
`,

/* ================================================================
   UNIT 13 — Da-words and Wo-words
   ================================================================ */
13: `
### 13.1 What are Da-words?

In English, we say: "I have a test tomorrow. I am studying **for it**."
In German, you cannot say "dafür es". Instead, you combine the word **da** (there) + the preposition to mean "[prep] it".

- für (for) -> **dafür** (for it)
- mit (with) -> **damit** (with it)
- von (of/from) -> **davon** (of it)

If the preposition starts with a vowel (auf, über, an, in), you must add an **-r-** to make it pronounceable!
- auf -> da-r-auf = **darauf** (on it / to it)
- über -> da-r-über = **darüber** (about it)

### 13.2 What are Wo-words?

Wo-words are the question equivalent of Da-words. They mean "[prep] what?".

- für -> **wofür**? (for what?)
- mit -> **womit**? (with what?)
- auf (starts with vowel) -> wo-r-auf = **worauf**? (for what / on what?)

### 13.3 The People Exception

**CRITICAL RULE:** Da-words and Wo-words are exclusively for **THINGS**, ideas, and animals. You can never use them for humans!

If you are talking about a human, you must use the preposition + the normal personal pronoun:
- *Idea:* Wir sprechen über den Film. -> Wir sprechen **darüber**. (We talk about it).
- *Human:* Wir sprechen über den Lehrer. -> Wir sprechen **über ihn**. (NOT darüber!)
- *Idea Q:* **Worüber** sprecht ihr? (What are you talking about?)
- *Human Q:* **Über wen** sprecht ihr? (About whom are you talking?)

### 13.4 Practice Sentences

1. **Hast du von dem neuen Projekt gehört? — Ja, ich weiß schon davon.**
   - *Meaning:* Have you heard of the new project? — Yes, I already know about it.
2. **Wofür brauchst du das Geld? — Ich brauche es für ein Auto.**
   - *Meaning:* What do you need the money for? — I need it for a car.
`,

/* ================================================================
   UNIT 14 — Verbs with Fixed Prepositions (Advanced)
   ================================================================ */
14: `
### 14.1 Advancing Fixed Prepositions

In A2, you learned basic fixed prepositions (warten auf, denken an). In B1, the list gets longer, and the concepts get more abstract.

### 14.2 Common B1 Verbs + Accusative Prepositions

- **sich kümmern um:** to take care of (Ich kümmere mich um das Baby.)
- **sich beschweren über:** to complain about (Der Kunde beschwert sich über das Essen.)
- **sich erinnern an:** to remember (Ich erinnere mich an diesen Tag.)
- **sich bewerben um:** to apply for [a job] (Ich bewerbe mich um die Stelle.)
- **verzichten auf:** to give up / do without (Ich verzichte auf Fleisch.)

### 14.3 Common B1 Verbs + Dative Prepositions

- **abhängen von:** to depend on (Es hängt vom Wetter ab.)
- **teilnehmen an:** to participate in (Wir nehmen am Kurs teil.)
- **gehören zu:** to belong to [a group] (Er gehört zu uns.)
- **gratulieren zu:** to congratulate on (Ich gratuliere dir zum Geburtstag.)
- **leiden an:** to suffer from [an illness] (Sie leidet an einer Allergie.)

### 14.4 Combining with Da-words

These verbs perfectly combine with the Da-words you learned in Unit 13!
- *Erinnerst du dich an den Film? — Ja, ich erinnere mich **daran**.*
- *Nimmst du am Meeting teil? — Ja, ich nehme **daran** teil.*

### 14.5 Practice Sentences

1. **Kümmerst du dich um die Tickets?**
   - *Meaning:* Are you taking care of the tickets?
2. **Worüber beschwert er sich? — Er beschwert sich über den Lärm.**
   - *Meaning:* What is he complaining about? — He is complaining about the noise.
`,

/* ================================================================
   UNIT 15 — Adjective + Preposition Combinations
   ================================================================ */
15: `
### 15.1 Adjectives get sticky too

You know that verbs have fixed prepositions (warten auf). Well, adjectives do it too!
To sound fluent in B1, you must learn which prepositions pair with which adjectives.

### 15.2 Common Adjective + Preposition Pairs

**With Accusative:**
- **stolz auf:** proud of (Die Mutter ist stolz auf ihren Sohn.)
- **verliebt in:** in love with (Romeo ist verliebt in Julia.)
- **bekannt für:** famous/known for (Die Schweiz ist bekannt für Schokolade.)
- **verantwortlich für:** responsible for (Wer ist verantwortlich für diesen Fehler?)
- **wütend auf:** angry at (Ich bin wütend auf meinen Bruder.)

**With Dative:**
- **interessiert an:** interested in (Ich bin interessiert an diesem Buch.)
- **abhängig von:** dependent on (Er ist finanziell abhängig von seinen Eltern.)
- **zufrieden mit:** satisfied/happy with (Bist du zufrieden mit dem Ergebnis?)
- **fertig mit:** finished/done with (Ich bin fertig mit der Arbeit.)

### 15.3 Asking Questions

You form questions exactly the same way as with verbs—using Wo-words for things, and Prep+Pronoun for people!
- *Thing:* **Wofür** ist Italien bekannt? (What is Italy known for?)
- *Person:* **Auf wen** bist du wütend? (At whom are you angry?)

### 15.4 Practice Sentences

1. **Wir sind sehr zufrieden mit unserem neuen Auto.**
   - *Meaning:* We are very satisfied with our new car.
2. **Bist du schon fertig mit den Hausaufgaben?**
   - *Meaning:* Are you already done with the homework?
3. **Darauf bin ich nicht stolz.**
   - *Meaning:* I am not proud of that (da-r-auf).
`,

};

export default lectures;
