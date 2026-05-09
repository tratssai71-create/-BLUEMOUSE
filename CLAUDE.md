# BLUE MOUSE サイト管理 - Claude Code 指示書

## 「お客様の声を更新して」と言われたとき

以下の手順を自動で実行してください。

### 手順

1. ダウンロードフォルダ（`~/Downloads/voices.json`）に新しい `voices.json` があるか確認する
2. ファイルが存在する場合、`/Users/otokoushigaeru/Desktop/合同会社BLUEMOUSE/site/data/voices.json` に上書きコピーする
   ```
   cp ~/Downloads/voices.json /Users/otokoushigaeru/Desktop/合同会社BLUEMOUSE/site/data/voices.json
   ```
3. Git でコミット＆プッシュする
   ```
   cd /Users/otokoushigaeru/Desktop/合同会社BLUEMOUSE
   git add site/data/voices.json
   git commit -m "お客様の声を更新"
   git push origin main
   ```
4. 完了したら「✅ 更新完了しました！ホームページに反映されました。」と返答する

### ファイルが見つからない場合

`~/Downloads/voices.json` が存在しない場合は、以下を伝える：
「ダウンロードフォルダに voices.json が見つかりませんでした。管理ツール（admin-voices.html）で「更新する」ボタンを押してファイルを保存してから、もう一度お試しください。」
