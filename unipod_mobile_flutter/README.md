# UNIPOD Mobile (Flutter)

Base Flutter connectee au backend local `server.js`.

## 1) Prerequis
- Flutter SDK installe
- Android Studio ou VS Code + emulateur
- Serveur UNIPOD demarre sur `http://localhost:3000`

## 2) Lancer
```bash
cd unipod_mobile_flutter
flutter pub get
flutter run
```

## 3) Configuration API
Fichier: `lib/config.dart`
- Android emulateur: `http://10.0.2.2:3000`
- iOS simulateur: `http://localhost:3000`
- Telephone reel: `http://IP_DE_TON_PC:3000`

## 4) Ecrans inclus
- Accueil UNIPOD
- Formations / Evenements / Reseautage (API)
- Formulaire inscription (POST `/api/register`)
