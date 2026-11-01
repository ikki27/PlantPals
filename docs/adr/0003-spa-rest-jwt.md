# Ločen SPA + REST API z JWT avtentikacijo
 
## Kontekst in problem
 
PlantPals ima vlogovno ločene poglede (lastnik / varuh / administrator) in uporabniška dejanja, ki zahtevajo takojšen odziv (javljanje, dodelitev, potrditev vrnitve). Treba se je odločiti, kako razdeliti frontend in backend, kako poteka komunikacija med njima in kako upravljati sejo prijavljenega uporabnika.
 
## Obravnavane alternative
 
- **Ločen SPA + REST API, stateless avtentikacija prek JWT** (žeton v `Authorization` glavi)
- **Monolitna strežniško renderirana aplikacija s sejami na strežniku** (server-side sessions, cookie)
## Odločitev in utemeljitev
 
Izbrana alternativa: "Ločen SPA + REST API z JWT".
 
Čista ločitev frontend/backend pomeni, da je API neodvisen od prikaza, SPA pa komunicira prek REST/JSON čez HTTPS. Za to domeno REST povsem zadošča — dejanja so sinhroni request/response, kar ustreza potrebi po takojšnji potrditvi. JWT je stateless in se naravno ujema s SPA: po prijavi frontend hrani žeton in ga pošilja ob vsaki zahtevi, strežniku ni treba hraniti seje. Tri vloge se čisto preslikajo v role-based avtorizacijo prek NestJS Guards (`@Roles(...)` + `RolesGuard`), izvedba prek Passport.js (`@nestjs/passport`, `passport-jwt`).
 
### Posledice
 
- Dobro, ker je API neodvisen od prikaza in bi ga lahko uporabil tudi drug odjemalec.
- Dobro, ker stateless JWT odpravi hranjenje sej na strežniku in se lepo ujema s SPA.
- Dobro, ker se tri vloge čisto preslikajo v `RolesGuard` in zaščitijo končne točke (napačna vloga → HTTP 403).
- Slabo, ker JWT-ja pred potekom ni mogoče enostavno razveljaviti.
- Slabo, ker mora frontend sam skrbeti za varno hrambo žetona in obravnavo poteka (preusmeritev na prijavo ob 401).
 