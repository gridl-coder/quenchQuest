<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Location;
use App\Models\Winner;
use Illuminate\Support\Facades\Storage;
use Facebook\Facebook;

/**
 * Class CheckinApiController
 *
 * API Controller for handling customer check-ins at secret locations.
 *
 * - Allows up to 3 winners per location.
 * - Assigns prize based on order of check-in:
 *   1st: choice of smoothie, milkshake, iced coffee, or hot drink
 *   2nd/3rd: hot drink or soft drink
 *
 * Suggestions:
 * - Use Laravel notifications for emails.
 * - Add rate limiting middleware to prevent abuse.
 * - Log Facebook API errors for debugging.
 * - Add endpoint to view winners for a location.
 */
class CheckinApiController extends Controller
{
    /**
     * Handle a check-in request for a location.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkin(Request $request)
    {
        // Validate input
        $request->validate([
            'location_id' => 'required|integer|exists:locations,id',
            'name'        => 'required|string|max:255',
            'email'       => 'required|email|max:255',
            'device_id'   => 'required|string|max:64',
            'social_tag'  => 'nullable|string|max:255',
        ]);

        $location = Location::findOrFail($request->location_id);

        // Prevent multiple claims per location by the same email
        $alreadyClaimedByEmail = Winner::where('location_id', $location->id)
            ->where('email', $request->email)
            ->exists();
        if ($alreadyClaimedByEmail) {
            return response()->json([
                'message' => 'You have already claimed a prize for this location (email).'
            ], 400);
        }

        // Prevent multiple claims per location by the same device_id
        $alreadyClaimedByDevice = Winner::where('location_id', $location->id)
            ->where('device_id', $request->device_id)
            ->exists();
        if ($alreadyClaimedByDevice) {
            return response()->json([
                'message' => 'You have already claimed a prize for this location (device).'
            ], 400);
        }

        // Check how many winners already exist for this location
        $existingWinners = Winner::where('location_id', $location->id)->orderBy('won_at')->get();
        $winnerCount = $existingWinners->count();
        if ($winnerCount >= 3) {
            return response()->json([
                'message' => 'Sorry, all prizes for this location have already been claimed.'
            ], 400);
        }

        // Determine prize based on check-in order
        if ($winnerCount === 0) {
            $prize = 'Choice of smoothie, milkshake, iced coffee, or hot drink';
        } else {
            $prize = 'Hot drink or soft drink';
        }

        // Create winner with assigned prize
        $winner = Winner::create([
            'name' => $request->name,
            'email' => $request->email,
            'device_id' => $request->device_id,
            'social_tag' => $request->social_tag,
            'location_id' => $location->id,
            'prize' => $prize,
        ]);

        // Email admin/staff with winner and prize details (suggestion: use Laravel notifications)
        $emailBody = "Winner: {$winner->name}\nEmail: {$winner->email}\nLocation: {$location->name}\nTag: {$winner->social_tag}\nPrize: {$winner->prize}\n";
        mail(
            config('mail.to.address', 'you@borestreetbistro.co.uk'),
            "Prize Claimed: {$location->name}",
            $emailBody
        );

        // Facebook Posting
        $fb = new Facebook([
            'app_id'  => env('FACEBOOK_APP_ID'),
            'app_secret' => env('FACEBOOK_APP_SECRET'),
            'default_graph_version' => 'v16.0',
            'default_access_token' => env('FACEBOOK_ACCESS_TOKEN'),
        ]);

        try {
            // If there is an image, supply it as 'picture'
            $postData = [
                'message' => "{$winner->name} just claimed the prize at {$location->name}! 🎉 ",
            ];
            if ($location->image_path) {
                $postData['picture'] = asset('storage/' . $location->image_path);
            }

            $fb->post(
                "/" . env('FACEBOOK_PAGE_ID') . "/feed",
                $postData
            );
        } catch (\Exception $e) {
            // Log the error for debugging
            \Log::error('Facebook API error: ' . $e->getMessage());
        }

        return response()->json([
            'message' => "Congratulations {$winner->name}! You have claimed this week's prize: {$winner->prize}."
        ]);
    }

    /**
     * (Suggested feature) Get all winners for a location.
     *
     * @param int $locationId
     * @return \Illuminate\Http\JsonResponse
     */
    public function winners($locationId)
    {
        $winners = Winner::where('location_id', $locationId)->orderBy('won_at')->get();
        return response()->json($winners);
    }
}
