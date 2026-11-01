# Ime rešitve: PlantPals

## Namen rešitve in problem

Ko gredo ljudje na dopust, službeno pot ali daljšo odsotnost, ostanejo njihove sobne rastline brez oskrbe. Prošnja sosedom ali prijateljem je neformalna in nezanesljiva, zaradi tega ni jasnega dogovora, kdo prevzame skrb, ni navodil za posamezno rastlino (vsaka ima druge potrebe po zalivanju in svetlobi) in ni sledi o tem, kaj se je dejansko počelo v času odsotnosti.

WaterMe ta proces strukturira. Lastnika rastline poveže z varuhom, ki je na voljo v ustreznem obdobju in na ustrezni lokaciji (po mestu/regiji), omogoči zapisovanje navodil za oskrbo, vodi dnevnik oskrbe med varstvom in zahteva potrditev vrnitve, da je zaključek jasen za obe strani. Problem, ki ga rešuje, je torej zanesljivo, sledljivo in dokumentirano začasno varstvo rastlin namesto neformalnih dogovorov.

## Ciljni uporabniki

- Lastnik rastline - oseba, ki gre na odsotnost in potrebuje nekoga za oskrbo svojih rastlin. V aplikaciji vnese svoje rastline z navodili za oskrbo, odpre zahtevo za varstvo za določeno obdobje in po vrnitvi potrdi zaključek.
- Varuh - oseba, ki je pripravljena v določenem obdobju prevzeti skrb za tuje rastline. Pregleduje odprte zahteve v svojem območju, se javi na ustrezno, med varstvom beleži vnose v dnevnik oskrbe (kdaj je zalil, kaj je opazil).
- Administrator - skrbi za delovanje platforme: upravlja uporabniške račune, moderira vsebino in po potrebi posreduje pri spornih primerih (npr. varstvo, kjer potrditve vrnitve ni ali je sporna).

## Kratek opis delovanja

1. Lastnica Ana gre za 14 dni na dopust. V aplikaciji ima vnesene tri rastline, vsako z navodili (npr. »monstera - zaliti enkrat tedensko«). Odpre zahtevo za varstvo za obdobje od 15. do 29. julija in navede svoje mesto.
2. Sistem med odprtimi zahtevami ujema po dveh kriterijih: ujemanje lokacije (isto mesto/regija) in prekrivanje razpoložljivosti varuha z zahtevanim obdobjem. Ustrezne zahteve se prikažejo primernim varuhom.
3. Varuh Blaž vidi Anino zahtevo, se nanjo javi. Ker se na isto zahtevo lahko javi več varuhov, sistem poskrbi.
4. Varstvo gre skozi jasne statuse: zahtevano → sprejeto → v teku → vrnjeno → potrjeno. Med statusom »v teku« Blaž ob vsakem obisku doda vnos v dnevnik oskrbe (datum, kaj je naredil, opombe).
5. Ko se Ana vrne, pregleda dnevnik in potrdi vrnitev. S tem je varstvo zaključeno in dokumentirano za obe strani.
