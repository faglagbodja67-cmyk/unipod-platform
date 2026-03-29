import 'package:flutter_test/flutter_test.dart';
import 'package:unipod_mobile/main.dart';

void main() {
  testWidgets('UNIPOD app starts and shows main navigation', (WidgetTester tester) async {
    await tester.pumpWidget(const UnipodApp());
    await tester.pumpAndSettle();

    expect(find.text('Accueil'), findsOneWidget);
    expect(find.text('Programmes'), findsOneWidget);
    expect(find.text('Bibliotheque'), findsOneWidget);
    expect(find.text('Inscription'), findsOneWidget);
  });
}
