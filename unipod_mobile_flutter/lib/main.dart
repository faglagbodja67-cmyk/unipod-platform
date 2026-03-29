import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

import 'services/api_service.dart';

const Map<String, List<Map<String, String>>> _fallbackPrograms = {
  'Formations': [
    {'title': 'Entrepreneuriat Digital', 'description': 'Parcours de creation de startup digitale.'},
    {'title': 'Marketing Digital', 'description': 'Acquisition client, branding et campagnes.'},
  ],
  'Evenements': [
    {'title': 'Atelier Startup', 'description': 'Session pratique pour lancer un projet.'},
    {'title': 'Conference Innovation', 'description': 'Rencontre avec experts et entrepreneurs.'},
  ],
  'Reseautage': [
    {'title': 'Meetup Entrepreneurs', 'description': 'Networking avec la communaute UNIPOD.'},
    {'title': 'Afterwork UNIPOD', 'description': 'Opportunites business et collaborations.'},
  ],
  'Videos': [
    {'title': 'Video institutionnelle', 'description': 'Presentation des programmes UNIPOD.'},
  ],
};

const List<Map<String, String>> _fallbackBooks = [
  {'title': 'The Lean Startup', 'author': 'Eric Ries'},
  {'title': 'Zero to One', 'author': 'Peter Thiel'},
  {'title': 'Atomic Habits', 'author': 'James Clear'},
];

void main() {
  runApp(const UnipodApp());
}

class UnipodApp extends StatelessWidget {
  const UnipodApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Application Mobile',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF0A63B0)),
        scaffoldBackgroundColor: const Color(0xFFF4F7FB),
        cardTheme: const CardThemeData(
          elevation: 0,
          margin: EdgeInsets.zero,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.all(Radius.circular(14)),
            side: BorderSide(color: Color(0xFFD9E2EF)),
          ),
        ),
        useMaterial3: true,
      ),
      home: const MainShell(),
    );
  }
}

class MainShell extends StatefulWidget {
  const MainShell({super.key});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int currentIndex = 0;

  final pages = const [
    DashboardPage(),
    ProgramsPage(),
    LibraryPage(),
    RegistrationPage(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            const _InstitutionBanner(),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(12, 10, 12, 0),
                child: pages[currentIndex],
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: currentIndex,
        elevation: 0,
        height: 74,
        onDestinationSelected: (value) => setState(() => currentIndex = value),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home),
            label: 'Accueil',
          ),
          NavigationDestination(
            icon: Icon(Icons.school_outlined),
            selectedIcon: Icon(Icons.school),
            label: 'Programmes',
          ),
          NavigationDestination(
            icon: Icon(Icons.menu_book_outlined),
            selectedIcon: Icon(Icons.menu_book),
            label: 'Bibliotheque',
          ),
          NavigationDestination(
            icon: Icon(Icons.app_registration_outlined),
            selectedIcon: Icon(Icons.app_registration),
            label: 'Inscription',
          ),
        ],
      ),
    );
  }
}

class _InstitutionBanner extends StatelessWidget {
  const _InstitutionBanner();

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.fromLTRB(12, 8, 12, 0),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFD9E2EF)),
        boxShadow: const [
          BoxShadow(
            color: Color(0x140A2540),
            blurRadius: 16,
            offset: Offset(0, 6),
          ),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: Image.asset(
              'assets/logos/universite-lome.png',
              height: 36,
              fit: BoxFit.contain,
            ),
          ),
          Expanded(
            child: Image.asset(
              'assets/logos/unipod.png',
              height: 30,
              fit: BoxFit.contain,
            ),
          ),
          Expanded(
            child: SvgPicture.asset(
              'assets/logos/pnud.svg',
              height: 42,
            ),
          ),
        ],
      ),
    );
  }
}

class DashboardPage extends StatelessWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: const [
        _HeroCard(),
        SizedBox(height: 12),
        _MetricCard(
          title: 'Entrepreneurs formes',
          value: '+250',
          target: 'Objectif annuel: 300',
          actions: [
            'Bootcamps de validation d idee',
            'Masterclass marketing digital',
            'Mentorat individuel',
          ],
        ),
        _MetricCard(
          title: 'Startups incubees',
          value: '35',
          target: 'Objectif annuel: 50',
          actions: [
            'Pre-incubation 8 semaines',
            'Suivi startup 90 jours',
            'Demo day investisseurs',
          ],
        ),
        _MetricCard(
          title: 'Participation feminine',
          value: '46%',
          target: 'Objectif annuel: 50%',
          actions: [
            'Bourses femmes leaders',
            'Mentorat dedie',
            'Ateliers leadership inclusif',
          ],
        ),
        _MetricCard(
          title: 'Partenaires actifs',
          value: '15',
          target: 'Objectif annuel: 20',
          actions: [
            'Partenariat Universite de Lome',
            'Banques et institutions',
            'Incubateurs regionaux et ONG',
          ],
        ),
      ],
    );
  }
}

class _HeroCard extends StatelessWidget {
  const _HeroCard();

  @override
  Widget build(BuildContext context) {
    return const Card(
      color: Color(0xFF0A2540),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Innovation - Inclusion - Impact',
              style: TextStyle(color: Colors.white70, fontSize: 12),
            ),
            SizedBox(height: 8),
            Text(
              'Accelerer les entrepreneurs qui transforment l Afrique',
              style: TextStyle(
                color: Colors.white,
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 8),
            Text(
              'Application mobile officielle connectee a la plateforme.',
              style: TextStyle(color: Colors.white70),
            ),
          ],
        ),
      ),
    );
  }
}

class _MetricCard extends StatelessWidget {
  final String title;
  final String value;
  final String target;
  final List<String> actions;

  const _MetricCard({
    required this.title,
    required this.value,
    required this.target,
    required this.actions,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ExpansionTile(
        title: Text(title),
        subtitle: Text(target),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              value,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
            const SizedBox(width: 8),
            const Icon(Icons.keyboard_arrow_down),
          ],
        ),
        children: actions
            .map(
              (item) => ListTile(
                leading: const Icon(Icons.arrow_forward_ios, size: 14),
                title: Text(item),
              ),
            )
            .toList(),
      ),
    );
  }
}

class ProgramsPage extends StatefulWidget {
  const ProgramsPage({super.key});

  @override
  State<ProgramsPage> createState() => _ProgramsPageState();
}

class _ProgramsPageState extends State<ProgramsPage> {
  late Future<Map<String, List<dynamic>>> dataFuture;
  bool usingFallback = false;

  @override
  void initState() {
    super.initState();
    dataFuture = _load();
  }

  Future<List<dynamic>> _safeLoad(Future<List<dynamic>> Function() call) async {
    try {
      return await call();
    } catch (_) {
      usingFallback = true;
      return [];
    }
  }

  Future<Map<String, List<dynamic>>> _load() async {
    usingFallback = false;

    final formations = await _safeLoad(ApiService.getFormations);
    final events = await _safeLoad(ApiService.getEvents);
    final network = await _safeLoad(ApiService.getNetwork);
    final videos = await _safeLoad(ApiService.getVideos);

    final data = {
      'Formations': formations,
      'Evenements': events,
      'Reseautage': network,
      'Videos': videos,
    };

    data.forEach((key, value) {
      if (value.isEmpty) {
        data[key] = _fallbackPrograms[key]!;
      }
    });

    return data;
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<Map<String, List<dynamic>>>(
      future: dataFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Center(child: CircularProgressIndicator());
        }
        if (!snapshot.hasData) {
          return const Center(child: Text('Chargement des programmes...'));
        }

        final data = snapshot.data!;
        return ListView(
          padding: const EdgeInsets.all(12),
          children: [
            if (usingFallback)
              const Padding(
                padding: EdgeInsets.only(bottom: 10),
                child: Text(
                  'Connexion instable: affichage de donnees de secours.',
                  style: TextStyle(color: Color(0xFF8A5A00), fontWeight: FontWeight.w600),
                ),
              ),
            ...data.entries.map((entry) => _SectionCard(title: entry.key, items: entry.value)),
          ],
        );
      },
    );
  }
}

class _SectionCard extends StatelessWidget {
  final String title;
  final List<dynamic> items;

  const _SectionCard({required this.title, required this.items});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ExpansionTile(
        title: Text(title),
        subtitle: Text('${items.length} element(s)'),
        children: items.map((raw) {
          final item = raw as Map<String, dynamic>;
          return ListTile(
            leading: const Icon(Icons.arrow_forward_ios, size: 14),
            title: Text('${item['title'] ?? '-'}'),
            subtitle: Text('${item['description'] ?? item['embedUrl'] ?? ''}'),
          );
        }).toList(),
      ),
    );
  }
}

class LibraryPage extends StatefulWidget {
  const LibraryPage({super.key});

  @override
  State<LibraryPage> createState() => _LibraryPageState();
}

class _LibraryPageState extends State<LibraryPage> {
  final searchCtrl = TextEditingController();
  bool loading = true;
  String info = '';
  int total = 0;
  List<dynamic> books = [];

  @override
  void initState() {
    super.initState();
    fetchBooks();
  }

  @override
  void dispose() {
    searchCtrl.dispose();
    super.dispose();
  }

  Future<void> fetchBooks() async {
    setState(() {
      loading = true;
      info = '';
    });

    try {
      final result = await ApiService.getBooks(search: searchCtrl.text, limit: 24);
      final pagination = result['pagination'] as Map<String, dynamic>? ?? {};
      setState(() {
        books = (result['items'] as List<dynamic>? ?? []);
        total = pagination['total'] is int ? pagination['total'] as int : 0;
      });
    } catch (_) {
      setState(() {
        books = _fallbackBooks;
        total = _fallbackBooks.length;
        info = 'Connexion indisponible: affichage de livres de secours.';
      });
    } finally {
      setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(12, 12, 12, 0),
          child: Row(
            children: [
              Expanded(
                child: TextField(
                  controller: searchCtrl,
                  decoration: const InputDecoration(
                    labelText: 'Rechercher un livre',
                    border: OutlineInputBorder(),
                  ),
                  onSubmitted: (_) => fetchBooks(),
                ),
              ),
              const SizedBox(width: 8),
              FilledButton(
                onPressed: fetchBooks,
                child: const Text('Chercher'),
              ),
            ],
          ),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(12, 8, 12, 0),
          child: Align(
            alignment: Alignment.centerLeft,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Bibliotheque: $total livre(s)'),
                if (info.isNotEmpty)
                  Padding(
                    padding: const EdgeInsets.only(top: 4),
                    child: Text(
                      info,
                      style: const TextStyle(color: Color(0xFF8A5A00), fontWeight: FontWeight.w600),
                    ),
                  ),
              ],
            ),
          ),
        ),
        Expanded(
          child: loading
              ? const Center(child: CircularProgressIndicator())
              : ListView.builder(
                  padding: const EdgeInsets.all(12),
                  itemCount: books.length,
                  itemBuilder: (context, index) {
                    final book = books[index] as Map<String, dynamic>;
                    final title = '${book['title'] ?? 'Sans titre'}';
                    final coverUrl =
                        'https://picsum.photos/seed/${Uri.encodeComponent(title)}/120/160';

                    return Card(
                      child: ListTile(
                        leading: ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: Image.network(
                            coverUrl,
                            width: 44,
                            height: 64,
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) => Container(
                              width: 44,
                              height: 64,
                              color: const Color(0xFFE5EDF7),
                              child: const Icon(Icons.menu_book_outlined, size: 18),
                            ),
                          ),
                        ),
                        title: Text(title),
                        subtitle: Text('${book['author'] ?? ''}'),
                      ),
                    );
                  },
                ),
        ),
      ],
    );
  }
}

class RegistrationPage extends StatefulWidget {
  const RegistrationPage({super.key});

  @override
  State<RegistrationPage> createState() => _RegistrationPageState();
}

class _RegistrationPageState extends State<RegistrationPage> {
  final formKey = GlobalKey<FormState>();
  final fullNameCtrl = TextEditingController();
  final emailCtrl = TextEditingController();
  final phoneCtrl = TextEditingController();
  final activityCtrl = TextEditingController();
  final messageCtrl = TextEditingController();

  String domain = 'formations';
  bool consent = false;
  bool loading = false;
  String status = '';

  @override
  void dispose() {
    fullNameCtrl.dispose();
    emailCtrl.dispose();
    phoneCtrl.dispose();
    activityCtrl.dispose();
    messageCtrl.dispose();
    super.dispose();
  }

  Future<void> submit() async {
    if (!(formKey.currentState?.validate() ?? false) || !consent) {
      setState(() => status = 'Merci de remplir les champs et cocher le consentement.');
      return;
    }

    setState(() {
      loading = true;
      status = '';
    });

    try {
      await ApiService.register({
        'fullName': fullNameCtrl.text.trim(),
        'email': emailCtrl.text.trim(),
        'phone': phoneCtrl.text.trim(),
        'domain': domain,
        'activityTitle': activityCtrl.text.trim(),
        'sourcePage': 'flutter-mobile',
        'message': messageCtrl.text.trim(),
        'consent': consent,
      });

      formKey.currentState?.reset();
      fullNameCtrl.clear();
      emailCtrl.clear();
      phoneCtrl.clear();
      activityCtrl.clear();
      messageCtrl.clear();
      setState(() {
        status = 'Inscription enregistree avec succes.';
        domain = 'formations';
        consent = false;
      });
    } catch (e) {
      setState(() => status = 'Impossible d envoyer pour le moment. Merci de reessayer.');
    } finally {
      setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Form(
        key: formKey,
        child: Column(
          children: [
            TextFormField(
              controller: fullNameCtrl,
              decoration: const InputDecoration(labelText: 'Nom complet'),
              validator: (v) => (v == null || v.trim().length < 3) ? 'Nom invalide' : null,
            ),
            const SizedBox(height: 10),
            TextFormField(
              controller: emailCtrl,
              decoration: const InputDecoration(labelText: 'Email'),
              validator: (v) => (v == null || !v.contains('@')) ? 'Email invalide' : null,
            ),
            const SizedBox(height: 10),
            TextFormField(
              controller: phoneCtrl,
              decoration: const InputDecoration(labelText: 'Telephone'),
            ),
            const SizedBox(height: 10),
            DropdownButtonFormField<String>(
              initialValue: domain,
              decoration: const InputDecoration(labelText: 'Domaine'),
              items: const [
                DropdownMenuItem(value: 'formations', child: Text('Formations')),
                DropdownMenuItem(value: 'events', child: Text('Evenements')),
                DropdownMenuItem(value: 'network', child: Text('Reseautage')),
                DropdownMenuItem(value: 'videos', child: Text('Videos')),
                DropdownMenuItem(value: 'mobile', child: Text('Mobile')),
                DropdownMenuItem(value: 'autre', child: Text('Autre')),
              ],
              onChanged: (v) => setState(() => domain = v ?? 'formations'),
            ),
            const SizedBox(height: 10),
            TextFormField(
              controller: activityCtrl,
              decoration: const InputDecoration(labelText: 'Activite / Programme'),
            ),
            const SizedBox(height: 10),
            TextFormField(
              controller: messageCtrl,
              minLines: 3,
              maxLines: 5,
              decoration: const InputDecoration(labelText: 'Message'),
              validator: (v) => (v == null || v.trim().length < 10) ? 'Message trop court' : null,
            ),
            const SizedBox(height: 10),
            CheckboxListTile(
              value: consent,
              onChanged: (v) => setState(() => consent = v ?? false),
              title: const Text('Je confirme le traitement de mes donnees.'),
              controlAffinity: ListTileControlAffinity.leading,
              contentPadding: EdgeInsets.zero,
            ),
            const SizedBox(height: 10),
            SizedBox(
              width: double.infinity,
              child: FilledButton(
                onPressed: loading ? null : submit,
                child: Text(loading ? 'Envoi...' : 'Envoyer l inscription'),
              ),
            ),
            if (status.isNotEmpty) ...[
              const SizedBox(height: 10),
              Text(
                status,
                style: TextStyle(
                  color: status.startsWith('Erreur') ? Colors.red : Colors.green,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
