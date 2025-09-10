-- テーブル削除
-- 外部キー制約を考慮し、依存関係の末端（子テーブル）から順に削除
IF OBJECT_ID('[dbo].[Rentals]', 'U') IS NOT NULL DROP TABLE [dbo].[Rentals]
IF OBJECT_ID('[dbo].[Feedbacks]', 'U') IS NOT NULL DROP TABLE [dbo].[Feedbacks]
IF OBJECT_ID('[dbo].[Requests]', 'U') IS NOT NULL DROP TABLE [dbo].[Requests]
IF OBJECT_ID('[dbo].[BookAuthors]', 'U') IS NOT NULL DROP TABLE [dbo].[BookAuthors]
IF OBJECT_ID('[dbo].[Books]', 'U') IS NOT NULL DROP TABLE [dbo].[Books]
IF OBJECT_ID('[dbo].[Statuses]', 'U') IS NOT NULL DROP TABLE [dbo].[Statuses]
IF OBJECT_ID('[dbo].[StatusCategories]', 'U') IS NOT NULL DROP TABLE [dbo].[StatusCategories]
IF OBJECT_ID('[dbo].[Users]', 'U') IS NOT NULL DROP TABLE [dbo].[Users]
IF OBJECT_ID('[dbo].[Departments]', 'U') IS NOT NULL DROP TABLE [dbo].[Departments]
IF OBJECT_ID('[dbo].[Authors]', 'U') IS NOT NULL DROP TABLE [dbo].[Authors]
IF OBJECT_ID('[dbo].[Publishers]', 'U') IS NOT NULL DROP TABLE [dbo].[Publishers]
IF OBJECT_ID('[dbo].[Genres]', 'U') IS NOT NULL DROP TABLE [dbo].[Genres]

-- -----------------------------------------------------
-- Table `StatusCategories` (ステータスカテゴリテーブル)
-- -----------------------------------------------------
CREATE TABLE [dbo].[StatusCategories] (
  [category_id] INT IDENTITY(1,1) NOT NULL,
  [name] NVARCHAR(50) NOT NULL,
  PRIMARY KEY ([category_id]),
  UNIQUE ([name])
);
GO

-- -----------------------------------------------------
-- Table `Statuses` (ステータスマスタテーブル)
-- -----------------------------------------------------
CREATE TABLE [dbo].[Statuses] (
  [status_id] INT IDENTITY(1,1) NOT NULL,
  [category_id] INT NOT NULL,
  [name] NVARCHAR(50) NOT NULL,
  PRIMARY KEY ([status_id]),
  UNIQUE ([category_id], [name]),
  FOREIGN KEY ([category_id]) REFERENCES [dbo].[StatusCategories]([category_id]) ON DELETE CASCADE
);
GO

-- -----------------------------------------------------
-- Table `Departments` (部署テーブル)
-- -----------------------------------------------------
CREATE TABLE [dbo].[Departments] (
  [department_id] INT IDENTITY(1,1) NOT NULL,
  [name] NVARCHAR(50) NOT NULL,
  PRIMARY KEY ([department_id]),
  UNIQUE ([name])
);
GO

-- -----------------------------------------------------
-- Table `Users` (社員テーブル)
-- -----------------------------------------------------
CREATE TABLE [dbo].[Users] (
  [user_id] INT IDENTITY(1,1) NOT NULL,
  [code] NVARCHAR(128) NOT NULL,
  [department_id] INT NULL,
  [name] NVARCHAR(50) NOT NULL,
  [name_kana] NVARCHAR(50) NULL,
  [position] NVARCHAR(50) NULL,
  [postal_code] NVARCHAR(50) NULL,
  [address_1] NVARCHAR(255) NULL,
  [address_2] NVARCHAR(255) NULL,
  [notes] NVARCHAR(2048) NULL,
  [email] NVARCHAR(255) NULL,
  [phone_tel] NVARCHAR(20) NULL,
  [phone_fax] NVARCHAR(20) NULL,
  [phone_mobile] NVARCHAR(20) NULL,
  [phone_emergency] NVARCHAR(20) NULL,
  [charge] MONEY NULL,
  [classification_number] INT NULL,
  [history_flag] BIT NULL,
  [is_admin_staff] BIT NULL,
  [is_field_staff] BIT NULL,
  [group_flag] BIT NULL,
  [hire_date] DATETIME NULL,
  [info_print_notes] NVARCHAR(2048) NULL,
  PRIMARY KEY ([user_id]),
  UNIQUE ([code]),
  UNIQUE ([email]),
      DepartmentId INT,
    FOREIGN KEY (DepartmentId) REFERENCES M_Department(Id)
);
GO

-- -----------------------------------------------------
-- Table `Authors` (著者テーブル)
-- -----------------------------------------------------
CREATE TABLE [dbo].[Authors] (
  [author_id] INT IDENTITY(1,1) NOT NULL,
  [name] NVARCHAR(255) NOT NULL,
  [created_at] DATETIME NULL DEFAULT GETDATE(),
  [updated_at] DATETIME NULL DEFAULT GETDATE(),
  PRIMARY KEY ([author_id]),
  UNIQUE ([name])
);
GO

-- -----------------------------------------------------
-- Table `Publishers` (出版社テーブル)
-- -----------------------------------------------------
CREATE TABLE [dbo].[Publishers] (
  [publisher_id] INT IDENTITY(1,1) NOT NULL,
  [name] NVARCHAR(255) NOT NULL,
  [created_at] DATETIME NULL DEFAULT GETDATE(),
  [updated_at] DATETIME NULL DEFAULT GETDATE(),
  PRIMARY KEY ([publisher_id]),
  UNIQUE ([name])
);
GO

-- -----------------------------------------------------
-- Table `Genres` (ジャンルテーブル)
-- -----------------------------------------------------
CREATE TABLE [dbo].[Genres] (
  [genre_id] INT IDENTITY(1,1) NOT NULL,
  [name] NVARCHAR(255) NOT NULL,
  [created_at] DATETIME NULL DEFAULT GETDATE(),
  [updated_at] DATETIME NULL DEFAULT GETDATE(),
  PRIMARY KEY ([genre_id]),
  UNIQUE ([name])
);
GO

-- -----------------------------------------------------
-- Table `Books` (書籍テーブル)
-- -----------------------------------------------------
CREATE TABLE [dbo].[Books] (
  [book_id] INT IDENTITY(1,1) NOT NULL,
  [title] NVARCHAR(255) NOT NULL,
  [publisher_id] INT NULL,
  [publication_date] DATE NULL,
  [isbn] NVARCHAR(20) NULL,
  [c_code] NVARCHAR(20) NULL,
  [price] INT NULL,
  [purchase_date] DATE NULL,
  [cover_image_url] NVARCHAR(255) NULL,
  [genre_id] INT NULL,
  [status_id] INT NOT NULL,
  [description] NVARCHAR(MAX) NULL,
  [notes] NVARCHAR(MAX) NULL,
  [is_recommended] BIT NULL DEFAULT 0,
  [created_at] DATETIME NULL DEFAULT GETDATE(),
  [updated_at] DATETIME NULL DEFAULT GETDATE(),
  PRIMARY KEY ([book_id]),
  UNIQUE ([isbn]),
  FOREIGN KEY ([publisher_id]) REFERENCES [dbo].[Publishers]([publisher_id]) ON DELETE SET NULL,
  FOREIGN KEY ([genre_id]) REFERENCES [dbo].[Genres]([genre_id]) ON DELETE SET NULL,
  FOREIGN KEY ([status_id]) REFERENCES [dbo].[Statuses]([status_id]) ON DELETE NO ACTION
);
GO

-- -----------------------------------------------------
-- Table `BookAuthors` (書籍と著者の関連テーブル)
-- -----------------------------------------------------
CREATE TABLE [dbo].[BookAuthors] (
  [book_id] INT NOT NULL,
  [author_id] INT NOT NULL,
  PRIMARY KEY ([book_id], [author_id]),
  FOREIGN KEY ([book_id]) REFERENCES [dbo].[Books]([book_id]) ON DELETE CASCADE,
  FOREIGN KEY ([author_id]) REFERENCES [dbo].[Authors]([author_id]) ON DELETE CASCADE
);
GO

-- -----------------------------------------------------
-- Table `Rentals` (貸出履歴テーブル)
-- -----------------------------------------------------
CREATE TABLE [dbo].[Rentals] (
  [rental_id] INT IDENTITY(1,1) NOT NULL,
  [book_id] INT NOT NULL,
  [user_id] INT NOT NULL,
  [rental_date] DATE NOT NULL,
  [due_date] DATE NOT NULL,
  [return_date] DATE NULL,
  [created_at] DATETIME NULL DEFAULT GETDATE(),
  [updated_at] DATETIME NULL DEFAULT GETDATE(),
  PRIMARY KEY ([rental_id]),
  FOREIGN KEY ([book_id]) REFERENCES [dbo].[Books]([book_id]) ON DELETE NO ACTION,
  FOREIGN KEY ([user_id]) REFERENCES [dbo].[Users]([user_id]) ON DELETE NO ACTION
);
GO

-- -----------------------------------------------------
-- Table `Feedbacks` (フィードバックテーブル)
-- -----------------------------------------------------
CREATE TABLE [dbo].[Feedbacks] (
  [feedback_id] INT IDENTITY(1,1) NOT NULL,
  [book_id] INT NOT NULL,
  [user_id] INT NOT NULL,
  [comment] NVARCHAR(MAX) NULL,
  [rating] INT NULL,
  [created_at] DATETIME NULL DEFAULT GETDATE(),
  [updated_at] DATETIME NULL DEFAULT GETDATE(),
  PRIMARY KEY ([feedback_id]),
  FOREIGN KEY ([book_id]) REFERENCES [dbo].[Books]([book_id]) ON DELETE CASCADE,
  FOREIGN KEY ([user_id]) REFERENCES [dbo].[Users]([user_id]) ON DELETE CASCADE
);
GO

-- -----------------------------------------------------
-- Table `Requests` (購入リクエスト本テーブル)
-- -----------------------------------------------------
CREATE TABLE [dbo].[Requests] (
  [request_id] INT IDENTITY(1,1) NOT NULL,
  [title] NVARCHAR(255) NOT NULL,
  [author] NVARCHAR(255) NULL,
  [publisher] NVARCHAR(255) NULL,
  [isbn] NVARCHAR(20) NULL,
  [reason] NVARCHAR(MAX) NULL,
  [user_id] INT NOT NULL,
  [status_id] INT NOT NULL,
  [created_at] DATETIME NULL DEFAULT GETDATE(),
  [updated_at] DATETIME NULL DEFAULT GETDATE(),
  PRIMARY KEY ([request_id]),
  FOREIGN KEY ([user_id]) REFERENCES [dbo].[Users]([user_id]) ON DELETE CASCADE,
  FOREIGN KEY ([status_id]) REFERENCES [dbo].[Statuses]([status_id]) ON DELETE NO ACTION
);
GO