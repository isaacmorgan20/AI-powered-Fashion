$files = Get-ChildItem -Path 'C:\Users\user\OneDrive\Desktop\GENERAL FOLDER\General Project\REACT\Ten Project Work\Fashion code\fashion-code\src' -Recurse -Filter '*.jsx' -File
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    # Remove all dark: classes - more comprehensive pattern
    $newContent = $content -replace ' dark:[a-zA-Z0-9\-\:\/\[\]\(\)\%\.\#\,\%\$\{\}\*\!]+', ''
    # Fix double spaces
    $newContent = $newContent -replace '  +', ' '
    if ($content -ne $newContent) {
        Set-Content $file.FullName $newContent
        Write-Host ("Fixed: " + $file.Name)
    }
}