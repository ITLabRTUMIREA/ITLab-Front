npm run build
ls ./deploy/ITLab-Front/js | %{
    $fname=$_.ToString();
    $start = $fname.IndexOf("app");
    $end = $fname.IndexOf("js") + 2;
    if ($start -gt -1 -and $end -gt -1) {
        $fname.Substring($start, $end);
    }
} | Out-File "./deploy/ITLab-Front/app.txt"
