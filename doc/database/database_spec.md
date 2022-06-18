## Usecase List

| Entity    | Use Case           |
| --------- | ------------------ |
| Operation | openRoom           |
| Operation | join               |
| Operation | leave              |
| Operation | pick               |
| Operation | refreshPokerTable  |
| Operation | Kick               |
| Room      | getRoomInformation |
| Room      | openRoom           |
| Room      | join               |
| Room      | leave              |
| Room      | pick               |
| Room      | refreshPokerTable  |
| Room      | Kick               |

## Table Definition

### Operation

![operation](./operation.png)

- CQRSのcommand側のイベントがひたすらinsertされ、参照とかは基本されないテーブル
  - 将来的にOLAP処理とかでどこかにデータ転送したりはするかも

### Room

![room](./room.png)

- CQRSのquery側のテーブルなので、command操作に応じて更新されたり、ユーザ側から参照されたりする
- ulidで発行されるroom_idをpartitionキーにしているが、一つの部屋の人数は10人とかそんなもんなのでHot keyが起きる心配とかも特にないと考えている
  - room_idはulidで発行するので偏りとかも出ないはず
  - https://docs.aws.amazon.com/ja_jp/amazondynamodb/latest/developerguide/bp-partition-key-design.html#bp-partition-key-partitions-adaptive-boost
  - クエリも基本room_id単位になるので、グローバルセカンダリインデックスとかも不要
- expiration_unix_timestampのフィールドでttlを設定する
  - これによって一定時間後にデータが消え、部屋は勝手にクローズされる
  - なのであとでデータ調査するときとかはoperation側を調べに行く(あちらはずっと残る)
- 部屋の情報とユーザの情報はテーブルを分けることも考えたが、整合性を保ったりしていくの考えると一つのテーブルで管理したほうがあとで面倒が起きにくいと考えて分けていない
  - このあたりはよく語られるベストプラクティスとも一致した形になった
  - https://marcy.hatenablog.com/entry/2018/08/01/235642
