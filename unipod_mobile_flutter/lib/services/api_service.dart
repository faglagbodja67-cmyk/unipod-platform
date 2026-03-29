import 'dart:convert';

import 'package:http/http.dart' as http;

import '../config.dart';

class ApiService {
  static Uri _uri(String path) => Uri.parse('${AppConfig.baseUrl}$path');

  static Future<List<dynamic>> getFormations() async {
    final response = await http.get(_uri('/api/formations'));
    if (response.statusCode != 200) {
      throw Exception('Impossible de charger les formations.');
    }
    return jsonDecode(response.body) as List<dynamic>;
  }

  static Future<List<dynamic>> getEvents() async {
    final response = await http.get(_uri('/api/events'));
    if (response.statusCode != 200) {
      throw Exception('Impossible de charger les evenements.');
    }
    return jsonDecode(response.body) as List<dynamic>;
  }

  static Future<List<dynamic>> getNetwork() async {
    final response = await http.get(_uri('/api/network'));
    if (response.statusCode != 200) {
      throw Exception('Impossible de charger le reseautage.');
    }
    return jsonDecode(response.body) as List<dynamic>;
  }

  static Future<List<dynamic>> getVideos() async {
    final response = await http.get(_uri('/api/videos'));
    if (response.statusCode != 200) {
      throw Exception('Impossible de charger les videos.');
    }
    return jsonDecode(response.body) as List<dynamic>;
  }

  static Future<Map<String, dynamic>> getBooks({
    int page = 1,
    int limit = 20,
    String search = '',
  }) async {
    final query = <String, String>{
      'page': '$page',
      'limit': '$limit',
      if (search.trim().isNotEmpty) 'search': search.trim(),
    };

    final response = await http.get(_uri('/api/library/books').replace(queryParameters: query));
    if (response.statusCode != 200) {
      throw Exception('Impossible de charger la bibliotheque.');
    }

    return jsonDecode(response.body) as Map<String, dynamic>;
  }

  static Future<Map<String, dynamic>> register(Map<String, dynamic> payload) async {
    final response = await http.post(
      _uri('/api/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(payload),
    );

    final body = jsonDecode(response.body);
    if (response.statusCode != 201) {
      throw Exception((body is Map<String, dynamic> ? body['error'] : null) ?? 'Echec inscription.');
    }

    return body as Map<String, dynamic>;
  }
}
