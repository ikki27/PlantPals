# Plastni monolit namesto mikrostoritev
 
## Kontekst in problem
 
PlantPals je študentski projekt z omejenim obsegom (uporabniki, rastline, varstva, avtentikacija). Backend mora nositi poslovno logiko: ujemanje, statusni workflow, dodelitev varuha, potrditev vrnitve. Kako strukturirati backend, da bodo domene čisto ločene, ne da bi uvedli nepotrebno infrastrukturno kompleksnost.
 
## Obravnavane alternative
 
- **Plastni monolit, interno razdeljen na module** (users, plants, assignments, auth), vsak modul na Controller → Service → Repository
- **Mikrostoritve** — ločene storitve z lastnim deploymentom in medsebojno komunikacijo
## Odločitev in utemeljitev
 
Izbrana alternativa: "Plastni monolit, modularno".
 
Za obseg tega projekta so mikrostoritve odveč — prinesejo mrežno komunikacijo, ločene deploymente, porazdeljene transakcije in operativno breme, ki ga projekt ne potrebuje. NestJS že v samo ogrodje vgrajuje modularnost (moduli, dependency injection, ločitev Controller/Service), zato dobimo čisto ločitev domen brez dodatne infrastrukture.
 
### Posledice
 
- Dobro, ker so domene jasno ločene prek NestJS modulov, a vse teče v enem procesu.
- Dobro, ker ni mrežne latence, porazdeljenih transakcij in dodatnega operativnega bremena med storitvami.
- Dobro, ker je plastna delitev (Controller → Service → Repository) enotna in predvidljiva skozi vse module.
- Slabo, ker se celota deploya in skalira kot ena enota (posameznega modula ni mogoče skalirati ločeno).
- Slabo, ker bi ob velikem naraščanju obsega monolit sčasoma zahteval razdelitev.
 