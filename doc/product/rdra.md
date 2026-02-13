# RDRA(プロダクト要件整理)
## システム価値
```mermaid
flowchart LR
    master[user(room master)] --- salon((salon))
    user[user] --- salon
    
    salon --- note[<b>salonの目的</b><br/>---<br/>業務などでプランニングポーカーによる見積もりを<br/>行いたい人たちに対し、ユーザ登録やログインなどの手間なしで、<br/>プランニングポーカーを実施するための環境を提供する。]
```

- 基本的にユーザはチャットツールやビデオ会議通話と併用して本システムを使うことを想定している
- とにかくシンプルな手順でプランニングポーカーが初められることを重視する

## システム外部環境
### 業務フロー
```mermaid
flowchart TD
    subgraph rm [room master]
        direction TB
        A[create room]
        A_n[<i>usecase</i><br/>create a new room]
        A -.-> A_n
        
        C[choose a card]
        C_n[<i>usecase</i><br/>register the chosen card]
        C -.-> C_n
    end
    
    subgraph u [users]
        direction TB
        B[enter to the room]
        B_n[<i>usecase</i><br/>add a new user to the room]
        B -.-> B_n
        
        D[choose a card]
    end
    
    A --> B
    B --> C
    B --> D
    
    C --> E[reset the chosen card data]
    D --> E
    
    E_n[<i>usecase</i><br/>reflesh the poker]
    E -.-> E_n
    
    E -- reset --> C
    E -- reset --> D
    E --> F([end])
```

### 利用シーン
```mermaid
flowchart TD
    subgraph leave [leave]
        user1[user] --- leave_node((leave))
        leave_node --- leave_note[ユーザが途中で退出したくなった場合、<br/>簡単な操作で退出できる]
        leave_node --- leave_room_uc([leave room])
    end

    subgraph reenter [reenter]
        user2[user2] --- reenter_node((reenter))
        reenter_node --- reenter_note[一度退出したユーザが再度部屋に入ることができる]
        reenter_node --- reenter_room_uc([reenter room])
    end

    subgraph kick [kick]
        userA[userA] --- kick_node((kick))
        userB[userB] --- kick_node
        kick_node --- kick_note[任意のユーザを退出させることができる]
        kick_node --- kick_user_uc([kick user])
    end
```

## システム
### 情報モデル
```mermaid
flowchart TD
    room[room] --- poker[poker]
    room --- user[user]
    user --- poker
```

### 状態モデル
```mermaid
stateDiagram-v2
    [*] --> created: create a new room
    state created {
        [*] --> choosing_card: add a new user to the room
        choosing_card --> choosing_card: some player refreshes the poker
        choosing_card --> chosen_card: the user chosen a card
        chosen_card --> chosen_card: the user chosen a card
        chosen_card --> choosing_card: some player refreshes the poker
        choosing_card --> leaved: the user leaves or kicked
        chosen_card --> leaved: the user leaves or kicked
        leaved --> choosing_card: the leaved user backs
    }
    created --> closed: the room is expired
```
