# MongoDB (dokumentna baza) namesto relacijske baze
 
## Kontekst in problem
 
PlantPals hrani uporabnike, rastline in varstva. Osrednja entiteta — varstvo (`CareAssignment`) — nosi vgnezden dnevnik oskrbe (`CareLogEntry`) in statusni workflow, razpoložljivost varuha pa je vgnezdena v uporabnika. Navodila za oskrbo rastlin so raznolika in se med vrstami močno razlikujejo. Poleg tega mora prevzem varstva (dodelitev varuha) delovati pravilno tudi, kadar se hkrati javi več varuhov.
 
## Obravnavane alternative
 
- **MongoDB (dokumentna baza, prek Mongoose)**
- **Relacijska baza (npr. PostgreSQL) z ORM**
## Odločitev in utemeljitev
 
Izbrana alternativa: "MongoDB (dokumentna baza)".
 
Podatkovni model je deloma relacijski in bi dobro deloval tudi v relacijski bazi — ta bi bila povsem veljavna alternativa. MongoDB sem izbral zaradi treh konkretnih prednosti za to domeno:
 
1. **Fleksibilna shema** — raznolika in prosto oblikovana navodila oskrbe se brez migracij prilegajo dokumentnemu modelu.
2. **Embedding dnevnika v varstvo** — dnevnik oskrbe je kompozicija znotraj varstva (vnosi ne obstajajo samostojno), zato se varstvo z dnevnikom prebere v enem kosu, brez dodatnih poizvedb ali JOIN-ov.
3. **Atomarna dodelitev varuha** — `findOneAndUpdate` s pogojem na statusu omogoči single-document atomarni prevzem, ki natanko ustreza procesu: prvi uspešni prevzem spremeni status, nadaljnji poskusi spodletijo.
### Posledice
 
- Dobro, ker se varstvo z vgnezdenim dnevnikom bere v eni poizvedbi (manj zaokroževanj do baze, enostavnejša koda branja).
- Dobro, ker atomarni `findOneAndUpdate` reši sočasni prevzem brez ročnega zaklepanja ali transakcij.
- Dobro, ker fleksibilna shema prenese raznolika navodila oskrbe brez migracij.
- Slabo, ker referenčni deli modela (lastnik → rastline → varstva) niso relacijski in zahtevajo ročno skrb za doslednost (ni tujih ključev in JOIN-ov kot v relacijski bazi).
- Slabo, ker poizvedbe čez več kolekcij niso tako udobne kot SQL JOIN.
 