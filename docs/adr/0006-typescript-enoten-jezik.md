# TypeScript kot enoten jezik čez cel sklad
 
## Kontekst in problem
 
PlantPals ima ločen frontend (SPA) in backend (REST API), oba pa delata z istimi podatkovnimi oblikami — uporabnik, rastlina, varstvo, statusi, vnos dnevnika. Pri teh strukturah je lahko veliko tihih napak (napačno ime polja, pozabljeno polje, napačen tip), ki se brez tipov pokažejo šele med izvajanjem. Treba se je odločiti za jezik razvoja na obeh straneh.
 
## Obravnavane alternative
 
- **TypeScript na frontendu in backendu** (en jezik čez cel sklad)
- **JavaScript** (brez statičnih tipov)
- **Mešano** — en jezik spredaj, drug zadaj (npr. backend v drugem jeziku/ogrodju)
## Odločitev in utemeljitev
 
Izbrana alternativa: "TypeScript čez cel sklad".
 
Izbrani ogrodji sami vodita v to odločitev: NestJS je zgrajen okoli TypeScripta (dekoratorji, dependency injection, DTO-ji), React + Vite pa ima podporo zanj. S tem je celoten sklad v enem jeziku — od fronta do backenda — kar zmanjša preklapljanje in omogoča deljenje tipov (oblike podatkov, statusni enum) med obema stranema. Statična tipizacija ujame razred napak že med pisanjem, kar se dobro ujema z validacijo prek `class-validator` na backendu.
 
### Posledice
 
- Dobro, ker je cel projekt v enem jeziku.
- Dobro, ker tipi ujamejo napake (napačno/manjkajoče polje, napačen tip) že ob prevajanju, ne šele med izvajanjem.
- Dobro, ker se podatkovne oblike (DTO-ji, statusni enum) lahko delijo oz. dosledno zrcalijo med SPA in API.
- Dobro, ker se naravno ujema z NestJS (DTO + `class-validator`) in s tipiziranimi React komponentami.
- Slabo, ker TypeScript zahteva korak prevajanja (build) in nekaj dodatne konfiguracije v primerjavi z golim JavaScriptom.
- Slabo, ker tipi dodajo nekaj sprotne režije pri pisanju (anotacije, občasno boj s tipi).
 