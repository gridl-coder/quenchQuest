<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Location;
use Illuminate\Support\Facades\Mail;
use Facebook\Facebook;

class PostWeeklyLocation extends Command
{
    protected $signature = 'bore:post-weekly-location';
    protected $description = 'Emails and posts the next weekly location to Facebook';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        // Fetch the most recent location
        $location = Location::orderBy('created_at', 'desc')->first();
        if (!$location) {
            $this->info('No locations available.');
            return 0;
        }

        $message = "📍 This Week’s Secret Spot: {$location->name}! 🎉\n" .
            "First to check in and win a free drink at Bore Street Bistro!\n\n" .
            ($location->image_path
                ? asset('storage/' . $location->image_path)
                : '');

        // Email to staff
        $to = config('mail.to.address', 'you@borestreetbistro.co.uk');
        mail($to, "New Weekly Location: {$location->name}", $message);

        // Post to Facebook
        $fb = new Facebook([
            'app_id' => env('FACEBOOK_APP_ID'),
            'app_secret' => env('FACEBOOK_APP_SECRET'),
            'default_graph_version' => 'v16.0',
            'default_access_token' => env('FACEBOOK_ACCESS_TOKEN'),
        ]);

        try {
            $postData = ['message' => $message];
            if ($location->image_path) {
                $postData['picture'] = asset('storage/' . $location->image_path);
            }
            $fb->post("/" . env('FACEBOOK_PAGE_ID') . "/feed", $postData);
        } catch (\Exception $e) {
            // Log or ignore
        }

        $this->info('Weekly location posted and emailed.');
        return 0;
    }
}
