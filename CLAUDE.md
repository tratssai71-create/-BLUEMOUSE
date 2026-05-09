# BLUE MOUSE サイト管理 - Claude Code 指示書

## 「お客様の声を更新して」と言われたとき

以下の手順を自動で実行してください。

### 手順

1. ダウンロードフォルダ内の最新の voices*.json を探す（`voices (4).json` のように番号付きの場合も含む）
   ```bash
   ls -t ~/Downloads/voices*.json ~/Downloads/voices\ \(*\).json 2>/dev/null | head -1
   ```

2. 最新ファイルが見つかったら、現在の `/Users/otokoushigaeru/Desktop/合同会社BLUEMOUSE/site/data/voices.json` を読み込み、**マージ**する
   - 既存データは保持する
   - ダウンロードされたファイルに含まれる声で、既存にない内容（テキストが異なるもの）を追加する
   - ただしテキストが「あ」「a」の繰り返しなどのテストデータは除く

3. マージ後のデータを `site/data/voices.json` に書き込む

4. `admin-voices.html` 内の `EMBEDDED_VOICES` を最新データで更新する（ローカルで開いても最新が見えるように）

5. Git でコミット＆プッシュする
   ```bash
   cd /Users/otokoushigaeru/Desktop/合同会社BLUEMOUSE
   git add site/data/voices.json site/admin-voices.html
   git commit -m "お客様の声を更新"
   git push origin main
   ```

6. 完了したら「✅ 更新完了しました！ホームページに反映されました。」と返答する

### ファイルが見つからない場合

ダウンロードフォルダに voices.json が見つからない場合：
「ダウンロードフォルダに voices.json が見つかりませんでした。管理ツール（admin-voices.html）で「更新する」ボタンを押してファイルを保存してから、もう一度お試しください。」
