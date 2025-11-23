CREATE PROCEDURE sp_User_Register
    @Email NVARCHAR(255),
    @PasswordHash NVARCHAR(MAX),
    @FullName NVARCHAR(100),
    @Role NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM Users WHERE Email = @Email)
    BEGIN
        THROW 50001, 'Email already exists.', 1;
    END

    INSERT INTO Users (Email, PasswordHash, FullName, Role, Status, CreatedAt)
    VALUES (@Email, @PasswordHash, @FullName, @Role, 'Active', GETDATE());

    SELECT SCOPE_IDENTITY() AS Id;
END
GO
