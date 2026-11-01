## Uporabniške zgodbe in acceptance criteria

Vloge: lastnik, varuh, administrator.

## US-01 — Vodenje profila rastline

Povezana funkcionalnost: F1 — Vodenje profila rastline z navodili za oskrbo (MVP) Vloga: lastnik

**User story**: Kot lastnik želim vnesti in urejati svoje rastline z navodili za oskrbo, da ima varuh jasna navodila za vsako rastlino posebej.

**Acceptance criteria**:

- Obrazec za rastlino zahteva polja: ime, vrsta, pogostost zalivanja (v dneh, celo število > 0), svetlobne potrebe, opombe.
- Ob poskusu shranjevanja brez obveznega polja (ime, pogostost zalivanja) sistem prikaže napako in rastline ne shrani.
- Po uspešnem shranjevanju se rastlina pojavi na seznamu rastlin lastnika z izpisanim imenom in vrsto.
- Lastnik lahko odpre obstoječo rastlino, spremeni katerokoli polje in spremembe se po shranjevanju vidijo takoj.
-  vidi in ureja samo svoje rastline; rastline drugih lastnikov niso dostopne.

## US-02 — Registracija uporabnika

Povezana funkcionalnost: F2 — Registracija uporabnikov Vloga: lastnik / varuh (neavtenticiran obiskovalec)

**User story**: Kot nov uporabnik, želim ustvariti račun z elektronskim naslovom in geslom, da lahko dostopam do aplikacije v svoji vlogi.

**Acceptance criteria**:

- Registracijski obrazec zahteva: e-naslov, geslo, prikazno ime in izbiro vloge (lastnik/varuh).
- Če e-naslov že obstaja v sistemu, registracija ne uspe in prikaže se sporočilo »E-naslov je že v uporabi«.
- Geslo mora imeti vsaj 8 znakov; krajše geslo sproži validacijsko napako pred oddajo.
- Geslo se v bazo shrani izključno kot bcrypt hash.
- Po uspešni registraciji je uporabnik preusmerjen na prijavo (ali samodejno prijavljen) z dodeljeno izbrano vlogo.

## US-03 — Prijava uporabnika

Povezana funkcionalnost: F3 — Prijava uporabnikov Vloga: lastnik / varuh / administrator

**User story**: Kot registriran uporabnik se želim prijaviti z e-naslovom in geslom, da dostopam do funkcij, namenjenih moji vlogi.

**Acceptance criteria**:

- Ob pravilnih podatkih sistem vrne veljaven JWT žeton, ki ga frontend shrani in pošilja ob vsaki nadaljnji zahtevi.
- Ob napačnem e-naslovu ali geslu sistem vrne enotno sporočilo »Napačni podatki za prijavo« (brez razkritja, katero polje je napačno).
- Po uspešni prijavi je uporabnik preusmerjen na pogled, ki ustreza njegovi vlogi.
- Dostop do zaščitenih API-končnih točk brez veljavnega žetona vrne HTTP 401.
- Potečen ali neveljaven žeton uporabnika preusmeri nazaj na prijavo.

## US-04 — Nastavitev razpoložljivosti varuha

Povezana funkcionalnost: F5 — Ujemanje (osnova: razpoložljivost varuha) Vloga: varuh

**User story**: Kot varuh želim nastaviti svoja obdobja razpoložljivosti in svoje mesto/regijo, da se mi prikazujejo samo zahteve, ki jih dejansko lahko prevzamem.

**Acceptance criteria**:

- Varuh lahko doda eno ali več obdobij razpoložljivosti, vsako z datumom »od« in »do«.
- Sistem zavrne obdobje, pri katerem je datum »do« pred datumom »od«.
- Varuh nastavi svoje mesto/regijo, ki se uporabi kot kriterij ujemanja.
- Dodana obdobja so prikazana na seznamu in jih varuh lahko odstrani.
- Spremembe razpoložljivosti se takoj upoštevajo pri naslednjem ujemanju zahtev.

## US-05 — Odpiranje zahteve za varstvo

Povezana funkcionalnost: F4 — Odpiranje zahteve za varstvo (MVP) Vloga: lastnik

**User story:** Kot lastnik želim odpreti zahtevo za varstvo za določeno obdobje in lokacijo ter izbrati rastline, da najdem varuha za čas svoje odsotnosti.

**Acceptance criteria:**

- Obrazec zahteva: datum začetka, datum konca, mesto/regijo in izbor vsaj ene rastline iz lastnikovih rastlin.
- Sistem zavrne zahtevo, kjer je datum konca pred datumom začetka ali kjer ni izbrana nobena rastlina.
- Novo ustvarjena zahteva dobi status zahtevano.
- Po uspešnem ustvarjanju je zahteva vidna na lastnikovem seznamu z izpisanim obdobjem, lokacijo in statusom.
- Lastnik lahko izbere več svojih rastlin v eno zahtevo.

## US-06 — Ujemanje zahtev z varuhom

Povezana funkcionalnost: F5 — Ujemanje zahtev z varuhi (MVP) Vloga: varuh

**User story:** Kot varuh želim videti samo odprte zahteve, ki se ujemajo z mojo lokacijo in razpoložljivostjo, da ne izgubljam časa z zahtevami, ki mi ne ustrezajo.

**Acceptance criteria:**

- Na seznamu se prikažejo le zahteve s statusom zahtevano.
- Prikažejo se le zahteve, katerih mesto/regija je enako varuhovemu mestu/regiji.
- Prikažejo se le zahteve, katerih obdobje (začetek–konec) se v celoti prekriva z vsaj enim obdobjem razpoložljivosti varuha.
- Zahteve, ki ne ustrezajo kateremukoli od kriterijev, se na seznamu ne prikažejo.
- Vsaka prikazana zahteva izpiše obdobje, lokacijo in število rastlin.

## US-07 — Javljanje varuha na zahtevo

Povezana funkcionalnost: F6 — Javljanje varuha na zahtevo (MVP) Vloga: varuh

**User story:** Kot varuh želim se javiti na ustrezno zahtevo, da lahko lastnik mene izbere za varstvo.

**Acceptance criteria:**

- Ob javljanju se varuh doda na seznam kandidatov (Applicants) zahteve.
- Isti varuh se na isto zahtevo ne more javiti dvakrat; gumb za javljanje je po prijavi onemogočen.
- Varuh se ne more javiti na zahtevo, ki ni več v statusu zahtevano (npr. že dodeljena).
- Po uspešnem javljanju varuh vidi, da je med kandidati za to zahtevo.
- Javljanje ne spremeni statusa zahteve (ostane zahtevano, dokler lastnik ne izbere).

## US-08 — Pregled kandidatov in dodelitev varuha

Povezana funkcionalnost: F6 — Dodelitev varuha na zahtevo (MVP) Vloga: lastnik

**User story:** Kot lastnik želim videti varuhe, ki so se javili, in enega izbrati, da varstvo prevzame konkretna oseba.

**Acceptance criteria:**

- Lastnik vidi seznam vseh kandidatov za svojo zahtevo (prikazno ime, mesto).
- Ob izbiri varuha se SitterId nastavi na izbranega varuha, status pa se spremeni iz zahtevano v sprejeto.
- Dodelitev je atomarna: če je bila zahteva medtem že dodeljena, drugi poskus dodelitve ne uspe in prikaže se ustrezno sporočilo.
- Po dodelitvi se zahteva nedodeljenim kandidatom ne prikazuje več kot odprta.
- Lastnik ne more dodeliti varuha, ki ni na seznamu kandidatov.

## US-09 — Statusni potek varstva

Povezana funkcionalnost: F7 — Statusni potek z nadzorovanimi prehodi Vloga: lastnik / varuh

**User story:** Kot uporabnik, vpleten v varstvo, želim da varstvo napreduje skozi jasno določene statuse, da obe strani vedno vesta, v kateri fazi je varstvo.

**Acceptance criteria:**

- Dovoljeni prehodi so izključno: zahtevano → sprejeto → v teku → vrnjeno → potrjeno (ter preklic skladno z US-14).
- Vsak poskus prehoda, ki ni dovoljen (npr. iz potrjeno nazaj v v teku), API zavrne s HTTP 409/422.
- Prehod v "v teku" lahko sproži varuh ob začetku obdobja; prehod v "vrnjeno" varuh ob koncu oskrbe.
- Trenutni status je ob vsakem trenutku viden obema vpletenima stranema.
- Vsaka sprememba statusa je vezana na vlogo, ki je do nje upravičena (nedovoljena vloga dobi HTTP 403).

## US-10 — Dnevnik oskrbe (vnos)

Povezana funkcionalnost: F8 — Dnevnik oskrbe Vloga: varuh

**User story:** Kot varuh želim med varstvom dodajati vnose v dnevnik oskrbe, da lastnik vidi, kaj sem naredil in kdaj.

**Acceptance criteria:**

- Varuh lahko doda vnos le, dokler je varstvo v statusu v teku.
- Vnos vsebuje: datum, opravilo in opombe; datum in opravilo sta obvezna.
- Vsak vnos se shrani z AuthorId prijavljenega varuha.
- Dodan vnos se takoj pojavi v časovnici dnevnika za to varstvo.
- Varuh lahko dodaja vnose samo pri varstvih, kjer je dodeljeni varuh.

## US-11 — Spremljanje dnevnika oskrbe

Povezana funkcionalnost: F8 — Dnevnik oskrbe (pregled) Vloga: lastnik

**User story:** Kot lastnik želim spremljati dnevnik oskrbe svojega varstva, da vem, da so moje rastline dejansko oskrbovane.

**Acceptance criteria:**

- Lastnik vidi vse vnose dnevnika za svoje varstvo, urejene kronološko.
- Vsak vnos prikazuje datum, opravilo in opombe.
- Lastnik vnosov ne more urejati ali brisati (polja so samo za branje).
- Če dnevnik še nima vnosov, se prikaže sporočilo »Zaenkrat ni vnosov«.
- Novi vnosi varuha se lastniku prikažejo brez ponovne prijave (ob osvežitvi/ponovnem odprtju pogleda).

## US-12 — Potrditev vrnitve

Povezana funkcionalnost: F9 — Potrditev vrnitve (MVP) Vloga: lastnik

**User story:** Kot lastnik želim po vrnitvi potrditi zaključek varstva, da je varstvo jasno in dokumentirano zaključeno za obe strani.

**Acceptance criteria:**

- Gumb za potrditev vrnitve je na voljo le, ko je varstvo v statusu vrnjeno.
- Ob potrditvi se status spremeni v potrjeno in zabeleži se ReturnConfirmedAt s trenutnim časom.
- Potrditev lahko izvede izključno lastnik varstva; varuh in administrator te možnosti nimata.
- Po potrditvi je varstvo samo za branje — nadaljnji vnosi v dnevnik niso mogoči.
- Zaključeno varstvo se prikaže kot potrjeno z vidnim časom potrditve.

## US-13 — Vlogovno ločen dostop

Povezana funkcionalnost: F10 — Vlogovno ločen dostop (MVP) Vloga: lastnik / varuh / administrator

**User story:** Kot uporabnik z določeno vlogo želim videti in izvajati samo funkcije svoje vloge, da ne dostopam do podatkov ali dejanj, ki mi ne pripadajo.

**Acceptance criteria:**

- Lastnik nima dostopa do varuhovih dejanj (npr. pisanja v dnevnik) in obratno.
- API-končne točke, zaščitene z vlogo, vrnejo HTTP 403, če jih kliče uporabnik z napačno vlogo.
- Navigacija prikazuje le menije in gumbe, ki ustrezajo vlogi prijavljenega uporabnika.
- Administratorske funkcije niso dostopne lastnikom ali varuhom.
- Isti uporabnik z več vlogami (lastnik in varuh) vidi funkcije obeh vlog.

## US-14 — Preklic zahteve ali varstva

Povezana funkcionalnost: F13 — Preklic pred začetkom Vloga: lastnik

**User story:** Kot lastnik želim preklicati zahtevo ali varstvo pred začetkom, da se umakne, če odsotnost odpade ali varstva ne potrebujem več.

**Acceptance criteria:**

- Preklic je mogoč le, dokler je varstvo v statusu zahtevano ali sprejeto (pred v teku).
- Ob preklicu se status spremeni v preklicano.
- Preklicana zahteva se varuhom ne prikazuje več kot odprta in se ne da več javiti nanjo.
- Varstva v statusu v teku, vrnjeno ali potrjeno lastnik ne more preklicati; sistem dejanje zavrne.
- Preklic lahko izvede le lastnik tega varstva.

## US-15 — E-poštna obvestila

Povezana funkcionalnost: F14 — E-poštna obvestila ob ključnih dogodkih (MVP) Vloga: lastnik / varuh

**User story:** Kot uporabnik želim prejeti e-poštno obvestilo ob ključnih dogodkih, da mi ni treba stalno preverjati aplikacije.

**Acceptance criteria:**

- Varuh prejme e-pošto, ko se pojavi nova zahteva, ki se ujema z njegovo lokacijo in razpoložljivostjo.
- Varuh prejme e-pošto, ko ga lastnik dodeli varstvu.
- Lastnik prejme e-pošto, ko se na njegovo zahtevo javi varuh in ko je varstvo potrjeno.
- Vsako obvestilo vsebuje ključne podatke dogodka (obdobje/lokacija varstva) in je poslano na e-naslov računa.
- Napaka pri pošiljanju e-pošte ne prekine osnovnega dejanja (npr. dodelitev uspe tudi, če e-pošta ne gre skozi).
