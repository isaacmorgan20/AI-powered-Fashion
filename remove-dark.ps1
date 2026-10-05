$files = Get-ChildItem -Path 'C:\Users\user\OneDrive\Desktop\GENERAL FOLDER\General Project\REACT\Ten Project Work\Fashion code\fashion-code\src' -Recurse -Filter '*.jsx' -File
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    # Remove all dark: classes
    $newContent = $content -replace ' dark:[a-z0-9\-\:\/\[\]\(\)\%\.\#\,]+', ''
    # Also remove standalone dark: at end
    $newContent = $newContent -replace ' dark:[a-z0-9\-\:\/\[\]\(\)\%\.\#\,]+$', ''
    # Fix multiple spaces
    $newContent = $newContent -replace '\s{2,}', ' '
    if ($content -ne $newContent) {
        Set-Content $file.FullName $newContent
        Write-Host "Fixed: $($file.Name)"
    }
}