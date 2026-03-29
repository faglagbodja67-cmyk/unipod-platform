import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

class AppConfig {
  static const String apiBaseUrlOverride = String.fromEnvironment('API_BASE_URL');

  static String get baseUrl {
    if (apiBaseUrlOverride.trim().isNotEmpty) {
      return apiBaseUrlOverride.trim().replaceAll(RegExp(r'/$'), '');
    }

    if (kIsWeb) {
      final origin = Uri.base.origin;
      return origin.isEmpty ? 'http://127.0.0.1:3000' : origin;
    }

    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return 'http://10.0.2.2:3000';
      case TargetPlatform.iOS:
      case TargetPlatform.macOS:
        return 'http://127.0.0.1:3000';
      default:
        return 'http://127.0.0.1:3000';
    }
  }
}
