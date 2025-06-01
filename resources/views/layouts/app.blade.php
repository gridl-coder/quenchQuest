<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>@yield('title', 'Bore Street Hunt')</title>
    <meta name="description" content="Join the Bore Street Bistro Quench Quest! Find the secret location, check in, and win a prize. See the leaderboard and share your adventure.">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Open Graph / Facebook -->
    <meta property="og:title" content="Quench Quest by Bore Street Bistro">
    <meta property="og:description" content="Join the Bore Street Bistro Quench Quest! Find the secret location, check in, and win a prize. See the leaderboard and share your adventure.">
    <meta property="og:image" content="https://borestreet.cafe/logo.png">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:type" content="website">
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Quench Quest by Bore Street Bistro">
    <meta name="twitter:description" content="Join the Bore Street Bistro Quench Quest! Find the secret location, check in, and win a prize. See the leaderboard and share your adventure.">
    <meta name="twitter:image" content="https://borestreet.cafe/logo.png">
    @include('partials.header')
</head>
<body>
@yield('content')
@include('partials.footer')
</body>
</html>
