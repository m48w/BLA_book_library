# BookLibraryApp - GEMINIによる詳細分析

このドキュメントは、GEMINIによって生成された`BookLibraryApp`プロジェクトの包括的な概要です。プロジェクトの目的、技術スタック、アーキテクチャ、およびセットアップ手順について、コードベースの分析を元に詳しく説明します。

---

## 1. プロジェクト概要 📖

`BookLibraryApp`は、書籍の貸し出し管理を目的としたWebアプリケーションです。React製のフロントエンドと.NET製のバックエンドで構成されており、ユーザー(おそらく図書館のスタッフ)が蔵書や貸し出し状況を効率的に管理できるよう設計されています。

### 主な機能

ファイル構造から、アプリケーションには以下のような機能ページが含まれていることがわかります。

* **ダッシュボード (`DashboardPage.tsx`)**: アプリケーションの中心的な概要ページ。総書籍数、貸し出し中の書籍数、利用者数などの主要な統計情報を表示する役割を担っていると考えられます。
* **書籍管理 (`BooksPage.tsx`)**: 蔵書の一覧表示、新規書籍の登録、既存情報の編集などを行う機能です。
* **貸し出し管理 (`RentalsPage.tsx`)**: 現在の貸し出し状況を一覧で確認したり、書籍の貸し出しや返却処理を行ったりする機能です。
* **従業員/ユーザー管理 (`EmployeesPage.tsx`)**: アプリケーションを利用するユーザー（従業員）の情報を管理する機能です。
* **履歴 (`HistoryPage.tsx`)**: 過去の貸し出し履歴などを閲覧・検索する機能だと推測されます。

---

## 2. 技術スタック 🛠️

このプロジェクトで使用されている主要な技術について、さらに詳しく見ていきましょう。

### フロントエンド

| 技術 | 詳細 |
| :--- | :--- |
| **Vite** | 開発サーバーの起動やファイルのビルドを高速に行うためのツールです (`vite.config.ts`)。 |
| **React** | UIを構築するための主要ライブラリです (`main.tsx`)。 |
| **TypeScript** | JavaScriptに静的型付けを追加し、コードの堅牢性を高めています (`.tsx`, `.ts` ファイル)。 |
| **React Router** | `react-router-dom` を利用して、ページ間の遷移（ルーティング）を管理しています (`src/routes/index.tsx`)。 |

### バックエンド

| 技術 | 詳細 |
| :--- | :--- |
| **.NET 8** | Microsoftが開発した最新のアプリケーションフレームワークです (`BookLibraryServer.csproj`)。 |
| **ASP.NET Core** | Web APIを構築するためのフレームワーク。コントローラーベースのAPIを提供します (`Program.cs`)。 |
| **Dapper** | 軽量なORM（Object-Relational Mapper）で、SQLクエリの結果をC#のオブジェクトにマッピングするために使用されます (`AuthorRepository.cs`)。SQLを直接記述するため、パフォーマンスが高いのが特徴です。 |
| **Swagger** | APIの仕様を自動的に生成し、ブラウザ上で簡単にテストできるようにするツールです (`Program.cs`)。 |

---

## 3. プロジェクト構造 🏗️

このプロジェクトは、関心事が明確に分離されたクリーンなアーキテクチャを採用しています。

### フロントエンドの詳細な構造

フロントエンド (`app/DigicLibrary/src`) は、コンポーネントを再利用性と複雑さに応じて分類する**Atomic Design**の考え方を取り入れています。

* `components/atoms/`: ボタン (`Button.tsx`) や入力欄 (`Input.tsx`) など、それ以上分割できない最小単位のUI部品。
* `components/molecules/`: 複数の`atoms`を組み合わせた小さなコンポーネント（例: `StatCard.tsx`）。
* `components/organisms/`: `atoms`や`molecules`を組み合わせた、ヘッダー (`Header.tsx`) のようなより具体的なUIパーツ。
* `components/templates/`: ページのレイアウトを定義するコンポーネント (`MainLayout.tsx`)。
* `pages/`: 各ページの本体となるコンポーネント群。
* `routes/`: アプリケーションのURLと表示するページコンポーネントを紐付けるルーティング設定 (`index.tsx`)。



### バックエンドの詳細な構造

バックエンドは、責務が明確に分離された**階層型アーキテクチャ（Layered Architecture）** を採用しています。

* **Controllers (`Controllers/`)**: HTTPリクエストを受け付ける入り口。リクエストの内容を解釈し、適切なビジネスロジックを呼び出します (`MasterController.cs`)。
* **Logic (`Logic/`)**: ビジネスロジック層。アプリケーションの主要な処理やルールを実装します。複数のリポジトリを組み合わせて複雑な処理を行うこともあります (`AuthorLogic.cs`)。
* **Repositories (`Repositories/`)**: データアクセス層。データベースとの直接的なやり取り（クエリの実行）を担当します。`Dapper`はこの層で使用されます (`AuthorRepository.cs`)。
* **Contract (`BookLibraryServer.Contract/`)**: プロジェクト間で共有されるインターフェース（設計図）を定義します。これにより、各層が疎結合になり、テストや変更が容易になります。

データの流れは通常、 `Controller` → `Logic` → `Repository` → `Database` となります。

---

## 4. APIエンドポイント ↔️

`MasterController.cs` で定義されているAPIエンドポイントは、主にマスタデータを取得するためのものです。

| メソッド | URL | 説明 |
| :--- | :--- | :--- |
| `GET` | `/api/master/authors` | 登録されている著者情報をすべて取得します。`AuthorLogic` を経由して `AuthorRepository` が `SELECT * FROM M_Author` を実行します。 |
| `GET` | `/api/master/genres` | 登録されているジャンル情報をすべて取得します。`GenreLogic` を経由して `GenreRepository` が `SELECT * FROM M_Genre` を実行します。 |
| `GET` | `/api/master/users` | 登録されているユーザー情報をすべて取得します。`UserLogic` を経由して `UserRepository` が `SELECT * FROM M_User` を実行します。 |

---

## 5. データベーススキーマ 🗄️

`database/table/Table.sql` に基づくデータベースの主要なテーブルと、それらの関連性を解説します。

* **`M_Author` (著者マスタ)**
    * `AuthorId` (PK), `AuthorName`
    * 著者の情報を格納します。

* **`M_Genre` (ジャンルマスタ)**
    * `GenreId` (PK), `GenreName`
    * 書籍のジャンルを格納します。

* **`M_User` (利用者マスタ)**
    * `UserId` (PK), `UserName`, `Mail`, `Password`
    * アプリケーションの利用者を格納します。

* **`T_Book` (書籍テーブル)**
    * `BookId` (PK), `BookName`, `AuthorId` (FK to `M_Author`), `GenreId` (FK to `M_Genre`), `PublicationDate`
    * 書籍の基本情報と、どの著者・ジャンルに属するかを管理します。

* **`T_BookStock` (在庫テーブル)**
    * `StockId` (PK), `BookId` (FK to `T_Book`), `IsAvailable`
    * 各書籍が貸し出し可能かどうかを管理します。同じ`BookId`のレコードが複数存在することで、同一書籍の在庫数を表現します。

* **`T_Rental` (貸出テーブル)**
    * `RentalId` (PK), `StockId` (FK to `T_BookStock`), `UserId` (FK to `M_User`), `RentalDate`, `ReturnDate`
    * 「誰が」「どの本を」「いつ借りて」「いつ返したか」という貸し出し履歴を記録します。

これらのテーブルは互いにリレーションシップ（関連）を持っており、データの整合性を保っています。