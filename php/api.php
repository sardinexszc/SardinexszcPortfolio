<?php

declare(strict_types=1);

function json_response(int $status, array $body): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($body, JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE);
    exit;
}

function supabase_request(string $table, string $method, string $query = '', ?array $payload = null, ?string $accessToken = null): array
{
    $baseUrl = rtrim((string) getenv('SUPABASE_URL'), '/');
    $apiKey = (string) getenv('SUPABASE_PUBLISHABLE_KEY');
    if ($baseUrl === '' || $apiKey === '') {
        json_response(503, ['error' => 'The content service is not configured.']);
    }

    $url = $baseUrl.'/rest/v1/'.$table.($query === '' ? '' : '?'.$query);
    $headers = [
        'apikey: '.$apiKey,
        'Accept: application/json',
    ];
    if ($accessToken !== null) {
        $headers[] = 'Authorization: Bearer '.$accessToken;
    }
    if ($payload !== null) {
        $headers[] = 'Content-Type: application/json';
        $headers[] = 'Prefer: return=minimal';
    }

    $handle = curl_init($url);
    if ($handle === false) {
        json_response(502, ['error' => 'Unable to contact the content service.']);
    }

    curl_setopt_array($handle, [
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT => 12,
        CURLOPT_FOLLOWLOCATION => false,
    ]);
    if ($payload !== null) {
        curl_setopt($handle, CURLOPT_POSTFIELDS, json_encode($payload, JSON_THROW_ON_ERROR));
    }

    $response = curl_exec($handle);
    $status = (int) curl_getinfo($handle, CURLINFO_RESPONSE_CODE);
    $failed = $response === false;
    curl_close($handle);

    if ($failed) {
        json_response(502, ['error' => 'Unable to contact the content service.']);
    }

    return [$status, (string) $response];
}

function public_resource(string $table, string $order, ?string $filter = null): never
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
        header('Allow: GET');
        json_response(405, ['error' => 'Method not allowed.']);
    }

    $columns = match ($table) {
        'projects' => 'id,title,description,image_url,tech_stack,live_url,github_url,featured,sort_order',
        'skills' => 'id,name,proficiency,icon,sort_order',
        'timeline_entries' => 'id,type,organization,role,description,start_date,end_date,sort_order',
        default => json_response(404, ['error' => 'Not found.']),
    };
    $query = 'select='.rawurlencode($columns).'&order='.rawurlencode($order);
    if ($filter !== null) {
        $query .= '&'.$filter;
    }

    [$status, $response] = supabase_request($table, 'GET', $query);
    if ($status < 200 || $status >= 300) {
        json_response(502, ['error' => 'Unable to load portfolio content.']);
    }

    $data = json_decode($response, true);
    json_response(200, ['data' => is_array($data) ? $data : []]);
}

function require_access_token(): string
{
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (! preg_match('/^Bearer\s+([A-Za-z0-9._~-]+)$/i', $header, $matches)) {
        json_response(401, ['error' => 'Sign in is required.']);
    }

    return $matches[1];
}

function validated_payload(string $resource, array $input): array
{
    $integer = static function (mixed $value, int $minimum, int $maximum, string $name): int {
        $number = filter_var($value, FILTER_VALIDATE_INT);
        if ($number === false || $number < $minimum || $number > $maximum) {
            json_response(422, ['error' => 'Invalid '.$name.'.']);
        }
        return $number;
    };
    $required = static function (array $values, string $key, int $maximum): string {
        $value = $values[$key] ?? null;
        if (! is_string($value) || trim($value) === '' || mb_strlen($value) > $maximum) {
            json_response(422, ['error' => 'Invalid '.$key.'.']);
        }
        return trim($value);
    };
    $optionalUrl = static function (array $values, string $key): ?string {
        $value = $values[$key] ?? null;
        if ($value === null || $value === '') {
            return null;
        }
        $scheme = is_string($value) ? strtolower((string) parse_url($value, PHP_URL_SCHEME)) : '';
        if (! is_string($value)
            || ! in_array($scheme, ['http', 'https'], true)
            || filter_var($value, FILTER_VALIDATE_URL) === false
            || mb_strlen($value) > 500) {
            json_response(422, ['error' => 'Invalid '.$key.'.']);
        }
        return $value;
    };
    $techStack = $input['tech_stack'] ?? null;
    if ($resource === 'projects'
        && (! is_array($techStack)
            || count($techStack) > 30
            || array_filter($techStack, static fn ($value) => ! is_string($value) || trim($value) === '' || mb_strlen($value) > 80))) {
        json_response(422, ['error' => 'Invalid tech stack.']);
    }
    $sortOrder = $integer($input['sort_order'] ?? 0, 0, 1000000, 'sort order');

    return match ($resource) {
        'projects' => [
            'title' => $required($input, 'title', 160),
            'description' => $required($input, 'description', 20000),
            'image_url' => $optionalUrl($input, 'image_url'),
            'tech_stack' => array_values(array_map(static fn (string $value) => trim($value), $techStack)),
            'live_url' => $optionalUrl($input, 'live_url'),
            'github_url' => $optionalUrl($input, 'github_url'),
            'featured' => filter_var($input['featured'] ?? false, FILTER_VALIDATE_BOOL),
            'sort_order' => $sortOrder,
        ],
        'skills' => [
            'name' => $required($input, 'name', 100),
            'proficiency' => $integer($input['proficiency'] ?? null, 0, 100, 'proficiency'),
            'icon' => isset($input['icon']) && is_string($input['icon']) ? mb_substr($input['icon'], 0, 20) : null,
            'sort_order' => $sortOrder,
        ],
        'timeline_entries' => [
            'type' => in_array($input['type'] ?? null, ['experience', 'education'], true)
                ? $input['type']
                : json_response(422, ['error' => 'Invalid timeline type.']),
            'organization' => $required($input, 'organization', 160),
            'role' => $required($input, 'role', 160),
            'description' => $required($input, 'description', 20000),
            'start_date' => $required($input, 'start_date', 30),
            'end_date' => ! isset($input['end_date']) || $input['end_date'] === '' ? null : $required($input, 'end_date', 30),
            'sort_order' => $sortOrder,
        ],
        default => json_response(404, ['error' => 'Not found.']),
    };
}

function admin_resource(): never
{
    $method = $_SERVER['REQUEST_METHOD'] ?? '';
    if (! in_array($method, ['POST', 'PATCH', 'DELETE'], true)) {
        header('Allow: POST, PATCH, DELETE');
        json_response(405, ['error' => 'Method not allowed.']);
    }

    $resource = $_GET['resource'] ?? '';
    if (! in_array($resource, ['projects', 'skills', 'timeline_entries'], true)) {
        json_response(404, ['error' => 'Not found.']);
    }

    $token = require_access_token();
    $id = $_GET['id'] ?? null;
    if ($method !== 'POST' && (! is_string($id) || ! ctype_digit($id))) {
        json_response(422, ['error' => 'A valid item ID is required.']);
    }

    $query = $method === 'POST' ? '' : 'id=eq.'.rawurlencode((string) $id);
    $payload = null;
    if ($method !== 'DELETE') {
        $input = json_decode(file_get_contents('php://input') ?: '', true);
        if (! is_array($input)) {
            json_response(400, ['error' => 'A JSON request body is required.']);
        }
        $payload = validated_payload($resource, $input);
    }

    [$status] = supabase_request($resource, $method, $query, $payload, $token);
    if ($status === 401 || $status === 403) {
        json_response($status, ['error' => 'This account is not authorized to edit portfolio content.']);
    }
    if ($status < 200 || $status >= 300) {
        json_response($status >= 400 && $status < 500 ? 422 : 502, ['error' => 'The content change could not be saved.']);
    }

    json_response(200, ['ok' => true]);
}
