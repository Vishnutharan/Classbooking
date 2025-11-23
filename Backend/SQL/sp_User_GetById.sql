CREATE PROCEDURE sp_User_GetById
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT Id, Email, FullName, Role, ProfilePicture, Bio, PhoneNumber, Status, CreatedAt, LastLogin
    FROM Users
    WHERE Id = @Id;
END
GO
