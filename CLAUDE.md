# BLUE MOUSE サイト管理 - Claude Code 指示書

## 「お客様の声を更新して」と言われたとき

メッセージにJSONデータが含まれている場合は、そのデータを直接使って更新してください。

### 手順

1. **メッセージにJSONデータが含まれている場合（通常パターン）**
   - メッセージ内の `[...]` のJSON配列を取り出す
   - そのデータを `/Users/otokoushigaeru/Desktop/合同会社BLUEMOUSE/site/data/voices.json` に書き込む

2. **メッセージにJSONがない場合（フォールバック）**
   - ダウンロードフォルダの最新の voices*.json を探す
   - 見つかればそのファイルを使う

3. `admin-voices.html` 内の `EMBEDDED_VOICES` を最新データで更新する
   - ファイル内の `var EMBEDDED_VOICES = [` から `];` の部分を新しいデータに置き換える

4. Git でコミット＆プッシュする
   ```bash
   cd /Users/otokoushigaeru/Desktop/合同会社BLUEMOUSE
   git add site/data/voices.json site/admin-voices.html
   git commit -m "お客様の声を更新"
   git push origin main
   ```

5. 完了したら「✅ 更新完了しました！ホームページに反映されました。」と返答する
