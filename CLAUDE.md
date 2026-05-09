# BLUE MOUSE サイト管理 - Claude Code 指示書

## 「お客様の声を更新して」と言われたとき

### パターン1：メッセージにJSONデータが含まれている場合
メッセージ内の `[...]` のJSON配列を取り出して、そのまま使う。

### パターン2：JSONがない場合
`/Users/otokoushigaeru/Desktop/合同会社BLUEMOUSE/site/data/voices.json` を読む。
（管理ツールで「更新する」を押すとこのファイルが直接更新される）

### 共通手順

1. 新しいvoicesデータを `site/data/voices.json` に書き込む

2. `admin-voices.html` 内の `EMBEDDED_VOICES` を最新データで更新する
   - `var EMBEDDED_VOICES = [` から `];` の部分を丸ごと新しいデータに置き換える

3. Git でコミット＆プッシュ
   ```bash
   cd /Users/otokoushigaeru/Desktop/合同会社BLUEMOUSE
   git add site/data/voices.json site/admin-voices.html
   git commit -m "お客様の声を更新"
   git push origin main
   ```

4. 「✅ 更新完了しました！」と返答する
