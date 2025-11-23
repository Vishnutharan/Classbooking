CREATE PROCEDURE sp_User_GetByEmail
    @Email NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT Id, Email, PasswordHash, FullName, Role, ProfilePicture, Bio, PhoneNumber, Status, CreatedAt, LastLogin
    FROM Users
    WHERE Email = @Email;
END
GO
