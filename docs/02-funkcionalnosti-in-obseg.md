# Uporabniške vloge

## Lastnik rastline

Lahko: vnaša in ureja svoje rastline z navodili za oskrbo; odpira zahteve za varstvo za določeno obdobje; pregleduje varuhe, ki so se javili na njegovo zahtevo; spremlja dnevnik oskrbe med varstvom; potrjuje vrnitev po zaključku.
Nima pravic: ne more sam sebi dodeliti varuha mimo postopka javljanja; ne more urejati ali brisati vnosov dnevnika, ki jih je zapisal varuh;.

## Varuh

Lahko: nastavi svojo razpoložljivost (obdobje in mesto/regija); pregleduje odprte zahteve, ki se ujemajo z njegovo razpoložljivostjo in filtri; se javi na zahtevo; med varstvom dodaja vnose v dnevnik oskrbe.
Nima pravic: ne more urejati rastlin ali navodil lastnika; ne more potrditi vrnitve (to je izključno pravica lastnika); ne more prevzeti varstva, ki je že dodeljeno drugemu.

## Administrator

Lahko: pregleduje vse uporabnike, rastline in varstva v sistemu; upravlja uporabniške račune (potrjuje (To bolj za Varuhe), ureja, deaktivira); odstranjuje neprimerno vsebino; po potrebi posreduje pri očitno zastalih varstvih (npr. ročno zaključi varstvo, ki obvisi).
Nima pravic: ne piše vnosov dnevnika v imenu varuha; ne spreminja navodil za oskrbo namesto lastnika; ne potrjuje vrnitve namesto lastnika;

# Predvidene funkcionalnosti

1. Vodenje profila rastline z navodili za oskrbo (vrsta, pogostost zalivanja, svetlobne potrebe, opombe). (MVP)
2. Registracija uporabnikov (lastniki, varuhi, administrator).
3. Prijava uporabnikov (lastniki, varuhi, administrator).
4. Odpiranje zahteve za varstvo za določeno obdobje in lokacijo (mesto/regija). (MVP)
5. Ujemanje zahtev z varuhi po lokaciji in prekrivanju razpoložljivosti z zahtevanim obdobjem. (MVP).
6. Javljanje varuha na zahtevo oz. dodelitev varuha na zahtevo. (MVP)
7. Statusni potek varstva: zahtevano → sprejeto → v teku → vrnjeno → potrjeno, z nadzorovanimi prehodi.
8. Dnevnik oskrbe: varuh med varstvom beleži vnose (datum, opravilo, opombe), ki jih lastnik spremlja.
9. Potrditev vrnitve s strani lastnika, ki zaključi in dokumentira varstvo. (MVP)
10. Vlogovno ločen dostop (lastnik / varuh / administrator) z ustreznimi pravicami. (MVP)
11. Opomnik za oskrbo glede na navodila rastline (npr. opomnik varuhu, kdaj je čas za zalivanje).
12. Administracija sistema - upravljanje računov, moderiranje vsebine in posredovanje pri zastalih varstvih.
13. Preklic zahteve ali varstva pred začetkom, z ustreznim prehodom statusa.
14. E-poštna obvestila ob ključnih dogodkih (MVP)

# Kasnejše nadgradnje

1. Ocenjevanje po zaključku - lastnik in varuh drug drugemu pustita preprosto oceno/komentar.
2. Iskanje in filtriranje zahtev po mestu, obdobju ali vrsti rastline.
3. Nadzorna plošča koordinatorja s pregledom statistike (št. aktivnih varstev, odprtih zahtev).
4. Izvoz dnevnika oskrbe zaključenega varstva v PDF.
5. Pregled profila uporabnika z zgodovino preteklih varstev in osnovnim ugledom.

# Out of scope

1. Plačila, provizije ali kakršnakoli denarna menjava med uporabniki.
2. Mobilna (native) aplikacija - rešitev je izključno spletni SPA.
3. Zemljevid, geolokacija in ujemanje po koordinatah (ujemanje je po mestu/regiji).
4. Fotografije in nalaganje datotek.
5. Klepet/sporočanje v realnem času med uporabniki znotraj aplikacije.
6. Večjezičnost - rešitev je enojezična.
7. Napredna priporočila/ML za ujemanje.