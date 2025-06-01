<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Location;
use App\Models\Winner;
use Illuminate\Http\JsonResponse;

/**
 * Class LocationApiController
 *
 * API Controller for retrieving locations and leaderboard data.
 *
 * Suggestions:
 * - Allow dynamic center/radius via query parameters.
 * - Add endpoint to return all locations (for admin/map view).
 */
class LocationApiController extends Controller
{
    /**
     * Get locations within a certain radius of a center point and leaderboard.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(): JsonResponse
    {
        $allLocations = Location::all();

        // Allow center and radius to be set via query params (suggested improvement)
        $centerLat = request('center_lat', 50.471); // Bodmin default
        $centerLon = request('center_lon', -4.721);
        $maxDistanceMeters = request('radius', 2414); // 1.5 miles in meters

        // Haversine formula in PHP
        $toRad = fn($deg) => $deg * (M_PI / 180.0);
        $filtered = $allLocations->filter(function ($loc) use ($centerLat, $centerLon, $maxDistanceMeters, $toRad) {
            $R = 6371000; // Earth radius in meters
            $φ1 = $toRad($centerLat);
            $φ2 = $toRad($loc->latitude);
            $Δφ = $toRad($loc->latitude - $centerLat);
            $Δλ = $toRad($loc->longitude - $centerLon);

            $a = sin($Δφ/2) * sin($Δφ/2)
                + cos($φ1) * cos($φ2)
                * sin($Δλ/2) * sin($Δλ/2);

            $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
            $dist = $R * $c; // in meters

            return $dist <= $maxDistanceMeters;
        });

        // Re‐index array so JSON doesn’t have gaps
        $filteredLocations = $filtered->values()->map(function ($loc) {
            return [
                'id'          => $loc->id,
                'name'        => $loc->name,
                'description' => $loc->description,
                'latitude'    => (float) $loc->latitude,
                'longitude'   => (float) $loc->longitude,
                'created_at'  => $loc->created_at->toDateTimeString(),
                'image_url'   => $loc->image_path
                    ? asset('storage/' . $loc->image_path)
                    : null,
            ];
        });

        // Get leaderboard (top 10 winners by name)
        $topWinners = Winner::selectRaw('name, COUNT(*) as wins')
            ->groupBy('name')
            ->orderByDesc('wins')
            ->limit(10)
            ->get();

        return response()->json([
            'locations'   => $filteredLocations,
            'leaderboard' => $topWinners,
        ]);
    }

    /**
     * (Suggested feature) Get all locations (no filtering).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function allLocations(): JsonResponse
    {
        $locations = Location::all();
        return response()->json($locations);
    }
}
