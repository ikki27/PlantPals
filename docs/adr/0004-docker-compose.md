# Docker Compose za reproducibilen lokalni zagon
 
## Kontekst in problem
 
PlantPals je sestavljen iz backend API-ja (NestJS) in podatkovne baze (MongoDB). Naloga izrecno zahteva opredeljen način lokalnega zagona. Vsak razvijalec v ekipi mora okolje dvigniti enako in brez ročnega nameščanja baze.
 
## Obravnavane alternative
 
- **Docker Compose** — API in MongoDB opisana kot storitvi, zagon z enim ukazom
- **Ročna lokalna namestitev** — vsak razvijalec sam namesti Node in MongoDB na svoj sistem
## Odločitev in utemeljitev
 
Izbrana alternativa: "Docker Compose".
 
`docker compose up` dvigne celotno okolje (API + MongoDB) z enim ukazom, konfiguracija pa se bere iz `.env` (povezava do baze, JWT skrivnost). To da reproducibilno okolje, neodvisno od tega, kaj ima posameznik nameščeno na svojem računalniku, in neposredno pokrije zahtevo po definiranem načinu lokalnega zagona.
 
### Posledice
 
- Dobro, ker se okolje dvigne z enim ukazom in je enako pri vseh članih ekipe.
- Dobro, ker ni treba ročno nameščati in konfigurirati MongoDB lokalno.
- Dobro, ker `.env` loči konfiguracijo in skrivnosti od kode (skrivnosti se ne commitajo).
- Slabo, ker je predpogoj nameščen Docker na razvojnem računalniku.
- Slabo, ker zabojniki dodajo nekaj režije pri porabi virov v primerjavi z golim lokalnim zagonom.
 