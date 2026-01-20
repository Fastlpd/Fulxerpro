# PowerShell Script to Enhance Fulxerpro Landing Page

<#
.SYNOPSIS
    This script automates the enhancement of the Fulxerpro investment panel landing page.
    It performs backup, removes old components, generates new ones with updated designs,
    cleans project caches, reinstalls dependencies, builds the project, and commits
    changes to Git.

.DESCRIPTION
    The script will:
    1.  Create a backup of critical frontend files and directories into a "fulxer termites" folder.
    2.  Delete the old 'Reviews.tsx' component.
    3.  Generate a new 'Reviews.tsx' with a redesigned layout (grid, rounded cards,
        silver-blue accents, hover zoom effects, star ratings, and investor avatars).
        It will also incorporate React.memo for performance.
    4.  Update 'Hero.tsx' to include an AI-generated advisory personnel image
        (using an Unsplash placeholder) that blends with the silver-blue theme.
    5.  Clean 'node_modules', '.vite' directories, and npm cache.
    6.  Reinstall npm packages.
    7.  Run 'npm run build' and check for errors.
    8.  Add all changes to Git, commit with a specific message, and push to the 'main' branch.
    9.  Ensure the overall result is a legitimate, attractive, smooth-scrolling,
        and perfectly displayed investment landing page.

.NOTES
    -   Ensure you have Git installed and configured.
    -   Ensure your current directory is 'C:\Users\Remzy\fulxerpro'.
    -   The 'git push origin main' command assumes 'origin' is set up and
        you are authenticated. You might need to manually handle authentication.
#>

$ErrorActionPreference = "Stop" # Stop the script on any error

$projectDir = "C:\Users\Remzy\fulxerpro"
$backupDir = Join-Path $projectDir "fulxer termites"

Write-Host "Starting Fulxerpro landing page enhancement script..."

# --- Step 1: Backup old files ---
Write-Host "1. Backing up critical files..."
try {
    if (-not (Test-Path $backupDir)) {
        New-Item -ItemType Directory -Path $backupDir | Out-Null
    }
    Copy-Item -Path (Join-Path $projectDir "src") -Destination (Join-Path $backupDir "src_backup") -Recurse -Force
    Copy-Item -Path (Join-Path $projectDir "package.json") -Destination $backupDir -Force
    Copy-Item -Path (Join-Path $projectDir "package-lock.json") -Destination $backupDir -Force
    Copy-Item -Path (Join-Path $projectDir "tailwind.config.js") -Destination $backupDir -Force
    Copy-Item -Path (Join-Path $projectDir "postcss.config.js") -Destination $backupDir -Force
    Copy-Item -Path (Join-Path $projectDir "vite.config.ts") -Destination $backupDir -Force
    Write-Host "   Backup complete to '$backupDir'."
} catch {
    Write-Error "Backup failed: $($_.Exception.Message)"
    exit 1
}

# --- Step 2: Delete old Ratings/Reviews component ---
Write-Host "2. Deleting old Reviews.tsx component..."
$oldReviewsPath = Join-Path $projectDir "src\components\sections\Reviews.tsx"
try {
    if (Test-Path $oldReviewsPath) {
        Remove-Item -Path $oldReviewsPath -Force
        Write-Host "   'Reviews.tsx' deleted."
    } else {
        Write-Host "   'Reviews.tsx' not found, skipping deletion."
    }
} catch {
    Write-Error "Failed to delete old Reviews.tsx: $($_.Exception.Message)"
    exit 1
}

# --- Step 3: Generate new RatingsReviews.tsx with redesigned layout ---
Write-Host "3. Generating new Reviews.tsx with redesigned layout..."
$newReviewsContent = @'
import React from 'react';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

interface ReviewProps {
    name: string;
    avatar: string;
    rating: number;
    quote: string;
    highlight: string;
}

const reviews: ReviewProps[] = [
  {
    name: 'Sarah L.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2070&auto=format&fit=crop',
    rating: 5,
    quote: "The crypto trading tools are top-notch. I've been able to execute both long and short-term strategies with ease. The platform is intuitive and powerful.",
    highlight: 'Crypto Trading',
  },
  {
    name: 'John D.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-e695c6ede616?q=80&w=1974&auto=format&fit=crop',
    rating: 5,
    quote: "Using Fulxerpro as a payment holder for car deals has been a game-changer for my business. It's secure, transparent, and my clients love it.",
    highlight: 'Car Deal Escrow',
  },
  {
    name: 'Emily R.',
    avatar: 'https://images.unsplash.com/photo-1508214751196-cdfd4628d084?q=80&w=2070&auto=format&fit=crop',
    rating: 5,
    quote: "I've diversified my portfolio with their housing estate investments. The properties are well-vetted, and the potential for returns is fantastic.",
    highlight: 'Housing Estates',
  },
  {
    name: 'Michael B.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop',
    rating: 5,
    quote: "The stock exchange interface is so smooth. I can buy and sell with confidence, and the real-time data helps me make informed decisions.",
    highlight: 'Stock Exchange',
  },
];

const ReviewCard: React.FC<ReviewProps> = React.memo(({ name, avatar, rating, quote, highlight }) => {
    return (
        <motion.div 
            className="flex flex-col rounded-2xl bg-white p-8 shadow-xl border border-blue-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
            <div className="flex items-center gap-x-4 mb-4">
                <img src={avatar} alt={name} className="h-14 w-14 rounded-full object-cover ring-2 ring-primary" />
                <div>
                    <div className="font-bold text-lg text-blue-gray-900">{name}</div>
                    <div className="text-sm text-primary font-semibold">{highlight}</div>
                </div>
            </div>
            <blockquote className="mt-4 text-blue-gray-700 flex-grow leading-relaxed">
                <p>“{quote}”</p>
            </blockquote>
            <div className="mt-6 flex items-center">
                {[...Array(rating)].map((_, i) => (
                    <FaStar key={i} className="h-5 w-5 text-yellow-400" />
                ))}
            </div>
        </motion.div>
    );
});

const Reviews: React.FC = () => {
  return (
    <section id="reviews" className="bg-blue-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">What Our Investors Say</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-blue-gray-900 sm:text-4xl">Trusted by Investors Worldwide</p>
          <p className="mt-6 text-lg leading-8 text-blue-gray-600">
            Hear from our community of investors and learn how Fulxerpro has helped them achieve their financial goals.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {reviews.map((review, index) => (
            <ReviewCard key={index} {...review} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
'@
Set-Content -Path $oldReviewsPath -Value $newReviewsContent
Write-Host "   New 'Reviews.tsx' created/updated."

# --- Step 4: Update Hero.tsx with advisory image ---
Write-Host "4. Updating Hero.tsx with advisory personnel image..."
$heroPath = Join-Path $projectDir "src\components\sections\Hero.tsx"
try {
    $heroContent = Get-Content -Path $heroPath -Raw

    # Unsplash professional advisor image URL
    $advisoryImageUrl = 'https://images.unsplash.com/photo-1559136125-992a549646b9?q=80&w=1920&auto=format&fit=crop'
    
    # Define the new content to insert for the advisory image
    # We will place this after the background decoration div and before the main content div
    $advisoryImageHtml = @"
      {/* Advisory Personnel Image */}
      <div className="absolute inset-y-0 right-0 w-1/2 md:w-1/3 overflow-hidden z-0 opacity-40 md:opacity-80">
        <img 
          src="$advisoryImageUrl" 
          alt="Advisory Personnel" 
          className="h-full w-full object-cover object-left" 
        />
        <div className="absolute inset-0 bg-gradient-to-l from-blue-gray-900 via-blue-gray-900/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-blue-gray-900 via-transparent to-transparent"></div>
      </div>
"@

    # Find the insertion point (after the background decoration div)
    $insertionPoint = '<div className="container mx-auto px-6 relative z-10 text-center"'
    $newHeroContent = $heroContent.Replace($insertionPoint, "$advisoryImageHtml`n`n      $insertionPoint")

    Set-Content -Path $heroPath -Value $newHeroContent
    Write-Host "   'Hero.tsx' updated with advisory image."
} catch {
    Write-Error "Failed to update Hero.tsx: $($_.Exception.Message)"
    exit 1
}

# --- Step 5: Clean cache ---
Write-Host "5. Cleaning project caches..."
try {
    if (Test-Path (Join-Path $projectDir "node_modules")) {
        Remove-Item -Recurse -Force (Join-Path $projectDir "node_modules")
        Write-Host "   'node_modules' deleted."
    }
    if (Test-Path (Join-Path $projectDir ".vite")) {
        Remove-Item -Recurse -Force (Join-Path $projectDir ".vite")
        Write-Host "   '.vite' cache deleted."
    }
    npm cache clean --force | Out-Null # Suppress npm output
    Write-Host "   npm cache cleaned."
} catch {
    Write-Error "Cache cleaning failed: $($_.Exception.Message)"
    exit 1
}

# --- Step 6: Reinstall packages ---
Write-Host "6. Reinstalling npm packages..."
try {
    npm install --prefix $projectDir
    Write-Host "   npm packages reinstalled."
} catch {
    Write-Error "npm install failed: $($_.Exception.Message)"
    exit 1
}

# --- Step 7: Run npm run build ---
Write-Host "7. Running npm run build..."
try {
    # Capture build output to check for errors
    $buildOutput = npm run build --prefix $projectDir 2>&1
    Write-Host $buildOutput # Display build output

    if ($buildOutput | Select-String -Pattern "error" -Quiet) {
        Write-Error "Build failed with errors."
        exit 1
    }
    Write-Host "   npm run build completed successfully with 0 errors."
} catch {
    Write-Error "npm run build failed: $($_.Exception.Message)"
    exit 1
}

# --- Step 8: Git operations ---
Write-Host "8. Performing Git operations..."
try {
    Set-Location $projectDir # Change directory to the project root for git commands
    git add .
    git commit -m "Enhance landing page with AI advisory graphic and new ratings/reviews design"
    Write-Host "   Changes committed. Attempting to push to 'main'..."
    # Note: 'git push origin main' might require manual authentication.
    # If the push fails, you may need to run 'git push origin main' manually.
    git push origin main
    Write-Host "   Changes pushed to 'main' branch."
} catch {
    Write-Error "Git operations failed: $($_.Exception.Message)"
    exit 1
}

Write-Host "Script finished successfully! The Fulxerpro landing page has been enhanced."