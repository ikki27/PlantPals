# Entitete in glavna polja:

## User (kolekcija)

Uporabnik v katerikoli vlogi. Vloge so seznam, ker je ista oseba lahko hkrati lastnik in varuh.

| Polje | Tip | Opis |
|---|---|---|
| `Id` | `ObjectId` | Primarni ključ |
| `Email` | `string` | Enolično, za prijavo |
| `PasswordHash` | `string` | Hashirano geslo -> ASP.NET Identity |
| `DisplayName` | `string` | Prikazno ime |
| `Roles` | `string[]` | `owner` / `sitter` / `coordinator` |
| `City` | `string` | Mesto/regija (osnova za ujemanje) |
| `Availability` | `AvailabilityWindow[]` | Le za varuhe – obdobja razpoložljivosti |
| `CreatedAt` | `DateTime` | - |

AvailabilityWindow (vgnezdeno): { From: DateTime, To: DateTime }

## Plant (kolekcija)

Rastlina je samostojna entiteta — obstaja neodvisno od varstva in je lahko vključena v več varstev skozi čas. Zato reference na lastnika.

| Polje | Tip | Opis |
|---|---|---|
| `Id` | `ObjectId` | Primarni ključ |
| `OwnerId` | `ObjectId → User` | Referenca na lastnika |
| `Name` | `string` | Ime/vzdevek rastline |
| `Species` | `string` | Vrsta |
| `WateringFrequencyDays` | `int` | Pogostost zalivanja (dni) |
| `LightNeeds` | `string` | Svetlobne potrebe |
| `Notes` | `string` | Dodatna navodila |
| `CreatedAt` | `DateTime` | - |

## CareAssignment (kolekcija)

Osrednja entiteta — eno varstvo. Nosi statusni workflow, kandidate (javljene varuhe) in vgnezden dnevnik oskrbe.

| Polje | Tip | Opis |
|---|---|---|
| `Id` | `ObjectId` | Primarni ključ |
| `OwnerId` | `ObjectId → User` | Referenca na lastnika |
| `SitterId` | `ObjectId → User?` | Referenca na dodeljenega varuha (prazno do dodelitve) |
| `PlantIds` | `ObjectId[] → Plant` | Reference na rastline v tem varstvu |
| `City` | `string` | Lokacija varstva (za ujemanje) |
| `StartDate` | `DateTime` | Začetek obdobja |
| `EndDate` | `DateTime` | Konec obdobja |
| `Status` | `string` (enum) | `zahtevano` / `sprejeto` / `v teku` / `vrnjeno` / `potrjeno` / `preklicano` |
| `Applicants` | `ObjectId[] → User` | Varuhi, ki so se javili (pred dodelitvijo) |
| `CareLog` | `CareLogEntry[]` | Vgnezden dnevnik oskrbe |
| `ReturnConfirmedAt` | `DateTime?` | Čas potrditve vrnitve |
| `CreatedAt` | `DateTime` | - |

CareLogEntry (vgnezdeno): { Date: DateTime, AuthorId: ObjectId → User, Task: string, Notes: string }

## Povezave med entitetami:

User 1 - N Plant -> lastnik ima več rastlin.
User 1 - N CareAssignment (kot lastnik) -> prek OwnerId.
User 1 - N CareAssignment (kot varuh) -> prek SitterId.
CareAssignment N - N Plant -> eno varstvo lahko pokriva več rastlin (PlantIds), ena rastlina je lahko v več varstvih skozi čas.
CareAssignment 1 - N CareLogEntry -> vnosi dnevnika so vgnezdeni znotraj varstva (kompozicija, ne obstajajo samostojno).

