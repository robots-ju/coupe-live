<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name') }}</title>
    <link href="{{ mix('css/app.css') }}" rel="stylesheet">
</head>
<body>
<div id="app" data-stream="{{ $stream }}" data-matches="{{ $matches }}"></div>
<script src="{{ mix('js/app.js') }}"></script>
@include('analytics')
</body>
</html>
