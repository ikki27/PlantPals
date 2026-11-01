# React + Vite za frontend (SPA)
 
## Kontekst in problem
 
Frontend PlantPals prikazuje kartice rastlin, zahteve za varstvo, časovnico dnevnika oskrbe in vlogovno ločene poglede (lastnik / varuh / koordinator). Backend je že izbran kot NestJS (TypeScript). Treba se je odločiti za frontend pristop, ki se dobro prilega komponentnemu, podatkovno gnanemu UI-ju in se smiselno ujema z ostalim sklopom.
 
## Obravnavane alternative
 
- **React + Vite** (komponentni SPA, ločen od API-ja)
- **Meta-ogrodje s server-side renderingom** (npr. Next.js)
- **Ogrodje z lastnim build orodjem** (npr. Angular)
## Odločitev in utemeljitev
 
Izbrana alternativa: "React + Vite".
 
Komponentni model se naravno prilega ponavljajočim se elementom vmesnika — karticam rastlin in časovnici dnevnika. Vite da zelo hiter razvojni strežnik in hiter build. Ker je frontend ločen SPA, ki se proti backendu pogovarja prek REST-a (glej ADR 0003), server-side rendering ni potreben — zato meta-ogrodje kot Next.js prinese odvečno kompleksnost. Dodatna prednost: skupaj z NestJS je celoten sklad v TypeScriptu, torej en jezik od fronta do backenda (manj preklapljanja, deljeni tipi, enotni razvojni tooling).
 
### Posledice
 
- Dobro, ker se komponentni UI lepo preslika na kartice rastlin in časovnico dnevnika.
- Dobro, ker Vite ponudi hiter dev strežnik (hitre povratne zanke pri razvoju) in hiter produkcijski build.
- Dobro, ker je cel sklad v TypeScriptu (en jezik front–back, lažje deljenje tipov in znanja).
- Slabo, ker React sam po sebi ne predpisuje strukture (routing, stanje ...) — te odločitve (npr. React Router, Axios) je treba sprejeti ločeno.
 