#!/bin/bash
echo "Cleaning large video files from Git History..."

# Soft reset the last two commits to keep all changes in the working directory
# but remove them from the commit history.
git reset --soft 3918e60

# Add the large files to .gitignore
echo "" >> .gitignore
echo "# Ignore large video files" >> .gitignore
echo "public/assets/all-content/*.mov" >> .gitignore
echo "public/assets/all-content/*.mp4" >> .gitignore

# Stop tracking them in the staging area (ignore errors if not tracked)
git rm --cached -r public/assets/all-content/*.mov 2>/dev/null
git rm --cached -r public/assets/all-content/*.mp4 2>/dev/null

# Commit the remaining files, minus the large videos
git commit -m "feat: initialize project and prepare for Vercel deployment"

echo "✅ Git history is now clean. The large video files have been untracked."
echo "You can now safely push to GitHub and deploy to Vercel."
