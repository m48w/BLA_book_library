-- テーブル空にする
-- 外部キー制約を考慮し、依存関係の末端（子テーブル）から先にデータを削除します
-- 外部キー制約があるため、TRUNCATEではなくDELETEを使用します
DELETE FROM [dbo].[Rentals];
DELETE FROM [dbo].[Feedbacks];
DELETE FROM [dbo].[Requests];
DELETE FROM [dbo].[BookAuthors];
DELETE FROM [dbo].[Books];
DELETE FROM [dbo].[Statuses];
DELETE FROM [dbo].[StatusCategories];
DELETE FROM [dbo].[Users];
DELETE FROM [dbo].[Departments];
DELETE FROM [dbo].[Authors];
DELETE FROM [dbo].[Publishers];
DELETE FROM [dbo].[Genres];
GO

-- IDENTITY値をリセットして、IDが1から始まるようにします
DBCC CHECKIDENT ('[dbo].[Rentals]', RESEED, 0);
DBCC CHECKIDENT ('[dbo].[Feedbacks]', RESEED, 0);
DBCC CHECKIDENT ('[dbo].[Requests]', RESEED, 0);
DBCC CHECKIDENT ('[dbo].[Books]', RESEED, 0);
DBCC CHECKIDENT ('[dbo].[Statuses]', RESEED, 0);
DBCC CHECKIDENT ('[dbo].[StatusCategories]', RESEED, 0);
DBCC CHECKIDENT ('[dbo].[Users]', RESEED, 0);
DBCC CHECKIDENT ('[dbo].[Departments]', RESEED, 0);
DBCC CHECKIDENT ('[dbo].[Authors]', RESEED, 0);
DBCC CHECKIDENT ('[dbo].[Publishers]', RESEED, 0);
DBCC CHECKIDENT ('[dbo].[Genres]', RESEED, 0);
GO

-- -----------------------------------------------------
-- サンプルデータ生成クエリ
-- -----------------------------------------------------

-- -----------------------------------------------------
-- 1. マスタデータ登録
-- -----------------------------------------------------

-- StatusCategories (ステータスカテゴリ)
-- 後続のクエリで '書籍', 'リクエスト' が使われているため、値を合わせます
INSERT INTO [dbo].[StatusCategories] ([name]) VALUES (N'書籍'), (N'リクエスト');
GO

-- Statuses (ステータス)
-- GOでバッチが区切られると変数が失われるため、以降の処理を一つのバッチにまとめます
DECLARE @book_category_id INT = (SELECT [category_id] FROM [dbo].[StatusCategories] WHERE [name] = N'書籍');
DECLARE @request_category_id INT = (SELECT [category_id] FROM [dbo].[StatusCategories] WHERE [name] = N'リクエスト');

INSERT INTO [dbo].[Statuses] ([category_id], [name]) VALUES 
(@book_category_id, N'貸出可能'),
(@book_category_id, N'貸出中'),
(@book_category_id, N'廃棄'),
(@request_category_id, N'リクエスト中'),
(@request_category_id, N'承認'),
(@request_category_id, N'却下'),
(@request_category_id, N'購入済');

-- Genres (ジャンル)
INSERT INTO [dbo].[Genres] ([name]) VALUES
(N'小説・文学'), (N'ミステリー・サスペンス'), (N'SF・ファンタジー'), (N'ビジネス・経済'),
(N'自己啓発'), (N'歴史・時代小説'), (N'コンピュータ・IT'), (N'趣味・実用'), (N'漫画'), (N'ノンフィクション');

-- Authors (著者)
INSERT INTO [dbo].[Authors] ([name]) VALUES
(N'村上 春樹'), (N'東野 圭吾'), (N'宮部 みゆき'), (N'湊 かなえ'), (N'池井戸 潤'),
(N'J.K. ローリング'), (N'スティーブン・キング'), (N'アガサ・クリスティ'), (N'アイザック・アシモフ'), (N'ピーター・F・ドラッカー');

-- Publishers (出版社)
-- Books, Requestsで使われる出版社データを追加します
INSERT INTO [dbo].[Publishers] ([name]) VALUES
(N'講談社'), (N'集英社'), (N'新潮社'), (N'文藝春秋'), (N'ダイヤモンド社'), (N'早川書房'), (N'静山社'), (N'双葉社'), (N'きこ書房'), (N'河出書房新社');

-- Departments (部署)
INSERT INTO [dbo].[Departments] ([name]) VALUES
(N'総務部'), (N'開発部'), (N'営業部');

-- -----------------------------------------------------
-- 2. メインデータ登録
-- -----------------------------------------------------

-- Users (社員)
DECLARE @department_general INT = (SELECT [department_id] FROM [dbo].[Departments] WHERE [name] = N'総務部');
DECLARE @department_development INT = (SELECT [department_id] FROM [dbo].[Departments] WHERE [name] = N'開発部');
DECLARE @department_sales INT = (SELECT [department_id] FROM [dbo].[Departments] WHERE [name] = N'営業部');

-- 'user_id'は自動採番されるため、INSERT文には含めません。
INSERT INTO [dbo].[Users] ([code], [department_id], [name], [name_kana], [position], [postal_code], [address_1], [address_2], [email], [phone_tel], [hire_date], [is_admin_staff]) VALUES
(N'E001', @department_general, N'山田 太郎', N'ヤマダ タロウ', N'部長', N'100-0005', N'東京都千代田区丸の内', N'1-1-1', 'taro.yamada@example.com', '03-1234-5678', '2010-04-01', 1),
(N'E002', @department_development, N'鈴木 花子', N'スズキ ハナコ', N'課長', N'540-0002', N'大阪府大阪市中央区大阪城', N'1-1', 'hanako.suzuki@example.com', '06-9876-5432', '2012-04-01', 0),
(N'E003', @department_development, N'佐藤 次郎', N'サトウ ジロウ', N'係長', N'460-0001', N'愛知県名古屋市中区三の丸', N'1-1-1', 'jiro.sato@example.com', '052-1111-2222', '2015-10-01', 0),
(N'E004', @department_sales, N'高橋 美咲', N'タカハシ ミサキ', N'主任', N'810-0001', N'福岡県福岡市中央区天神', N'1-8-1', 'misaki.takahashi@example.com', '092-3333-4444', '2018-04-01', 0),
(N'E005', @department_general, N'田中 健太', N'タナカ ケンタ', N'一般社員', N'060-0001', N'北海道札幌市中央区北一条西', N'2丁目', 'kenta.tanaka@example.com', '011-5555-6666', '2020-04-01', 0);

-- Books (書籍)
-- ステータスIDを変数に格納
DECLARE @status_available INT = (SELECT [status_id] FROM [dbo].[Statuses] WHERE [category_id] = @book_category_id AND [name] = N'貸出可能');
DECLARE @status_rented INT = (SELECT [status_id] FROM [dbo].[Statuses] WHERE [category_id] = @book_category_id AND [name] = N'貸出中');

INSERT INTO [dbo].[Books] ([title], [publisher_id], [publication_date], [isbn], [genre_id], [status_id], [is_recommended]) VALUES
(N'海辺のカフカ', (SELECT [publisher_id] FROM [dbo].[Publishers] WHERE [name] = N'新潮社'), '2002-09-12', '9784103534121', (SELECT [genre_id] FROM [dbo].[Genres] WHERE [name] = N'小説・文学'), @status_available, 1),
(N'容疑者Xの献身', (SELECT [publisher_id] FROM [dbo].[Publishers] WHERE [name] = N'文藝春秋'), '2005-08-01', '9784163242103', (SELECT [genre_id] FROM [dbo].[Genres] WHERE [name] = N'ミステリー・サスペンス'), @status_rented, 1),
(N'半沢直樹 アルルカンと道化師', (SELECT [publisher_id] FROM [dbo].[Publishers] WHERE [name] = N'講談社'), '2020-09-17', '9784065207353', (SELECT [genre_id] FROM [dbo].[Genres] WHERE [name] = N'ビジネス・経済'), @status_available, 0),
(N'ハリー・ポッターと賢者の石', (SELECT [publisher_id] FROM [dbo].[Publishers] WHERE [name] = N'静山社'), '1999-12-01', '9784915512377', (SELECT [genre_id] FROM [dbo].[Genres] WHERE [name] = N'SF・ファンタジー'), @status_available, 1),
(N'マネジメント[エッセンシャル版]', (SELECT [publisher_id] FROM [dbo].[Publishers] WHERE [name] = N'ダイヤモンド社'), '2001-12-14', '9784478410233', (SELECT [genre_id] FROM [dbo].[Genres] WHERE [name] = N'ビジネス・経済'), @status_available, 0),
(N'火車', (SELECT [publisher_id] FROM [dbo].[Publishers] WHERE [name] = N'新潮社'), '1998-03-25', '9784101369144', (SELECT [genre_id] FROM [dbo].[Genres] WHERE [name] = N'ミステリー・サスペンス'), @status_rented, 0),
(N'告白', (SELECT [publisher_id] FROM [dbo].[Publishers] WHERE [name] = N'双葉社'), '2008-08-01', '9784575236286', (SELECT [genre_id] FROM [dbo].[Genres] WHERE [name] = N'ミステリー・サスペンス'), @status_available, 0),
(N'銀河英雄伝説 1 黎明篇', (SELECT [publisher_id] FROM [dbo].[Publishers] WHERE [name] = N'早川書房'), '2007-02-23', '9784150308811', (SELECT [genre_id] FROM [dbo].[Genres] WHERE [name] = N'SF・ファンタジー'), @status_available, 0);

-- BookAuthors (書籍と著者の関連)
INSERT INTO [dbo].[BookAuthors] ([book_id], [author_id]) VALUES
((SELECT [book_id] FROM [dbo].[Books] WHERE [isbn] = '9784103534121'), (SELECT [author_id] FROM [dbo].[Authors] WHERE [name] = N'村上 春樹')),
((SELECT [book_id] FROM [dbo].[Books] WHERE [isbn] = '9784163242103'), (SELECT [author_id] FROM [dbo].[Authors] WHERE [name] = N'東野 圭吾')),
((SELECT [book_id] FROM [dbo].[Books] WHERE [isbn] = '9784065207353'), (SELECT [author_id] FROM [dbo].[Authors] WHERE [name] = N'池井戸 潤')),
((SELECT [book_id] FROM [dbo].[Books] WHERE [isbn] = '9784915512377'), (SELECT [author_id] FROM [dbo].[Authors] WHERE [name] = N'J.K. ローリング')),
((SELECT [book_id] FROM [dbo].[Books] WHERE [isbn] = '9784478410233'), (SELECT [author_id] FROM [dbo].[Authors] WHERE [name] = N'ピーター・F・ドラッカー')),
((SELECT [book_id] FROM [dbo].[Books] WHERE [isbn] = '9784101369144'), (SELECT [author_id] FROM [dbo].[Authors] WHERE [name] = N'宮部 みゆき')),
((SELECT [book_id] FROM [dbo].[Books] WHERE [isbn] = '9784575236286'), (SELECT [author_id] FROM [dbo].[Authors] WHERE [name] = N'湊 かなえ'));

-- -----------------------------------------------------
-- 3. トランザクションデータ登録
-- -----------------------------------------------------

-- Rentals (貸出履歴)
INSERT INTO [dbo].[Rentals] ([book_id], [user_id], [rental_date], [due_date], [return_date]) VALUES
((SELECT [book_id] FROM [dbo].[Books] WHERE [isbn] = '9784163242103'), (SELECT [user_id] FROM [dbo].[Users] WHERE [code] = 'E002'), '2025-08-10', '2025-08-24', NULL),
((SELECT [book_id] FROM [dbo].[Books] WHERE [isbn] = '9784101369144'), (SELECT [user_id] FROM [dbo].[Users] WHERE [code] = 'E001'), '2025-08-15', '2025-08-29', NULL),
((SELECT [book_id] FROM [dbo].[Books] WHERE [isbn] = '9784103534121'), (SELECT [user_id] FROM [dbo].[Users] WHERE [code] = 'E003'), '2025-07-20', '2025-08-03', '2025-08-01');

-- Feedbacks (フィードバック)
INSERT INTO [dbo].[Feedbacks] ([book_id], [user_id], [comment], [rating]) VALUES
((SELECT [book_id] FROM [dbo].[Books] WHERE [isbn] = '9784103534121'), (SELECT [user_id] FROM [dbo].[Users] WHERE [code] = 'E003'), N'独特の世界観に引き込まれました。', 5);

-- Requests (購入リクエスト)
DECLARE @status_requested INT = (SELECT [status_id] FROM [dbo].[Statuses] WHERE [category_id] = @request_category_id AND [name] = N'リクエスト中');
DECLARE @status_approved INT = (SELECT [status_id] FROM [dbo].[Statuses] WHERE [category_id] = @request_category_id AND [name] = N'承認');

INSERT INTO [dbo].[Requests] ([title], [author], [publisher], [user_id], [status_id], [reason]) VALUES
(N'思考は現実化する', N'ナポレオン・ヒル', N'きこ書房', (SELECT [user_id] FROM [dbo].[Users] WHERE [code] = 'E005'), @status_requested, N'自己啓発の古典として読んでみたいです。'),
(N'サピエンス全史', N'ユヴァル・ノア・ハラリ', N'河出書房新社', (SELECT [user_id] FROM [dbo].[Users] WHERE [code] = 'E004'), @status_approved, N'人類の歴史を俯瞰できる名著だと聞きました。');
GO