-- 著者一覧の取得
SELECT
  [author_id] [Id]
  , [name] [Name]
FROM [dbo].[Authors];

-- ---------------------------------

-- ジャンル一覧の取得
SELECT
  [genre_id] [Id]
  , [name] [Name]
FROM [dbo].[Genres];

-- ---------------------------------

-- ユーザー一覧の取得
SELECT
  [user_id] [Id]
  , [name] [Name]
  , [email] [Email]
FROM [dbo].[Users];