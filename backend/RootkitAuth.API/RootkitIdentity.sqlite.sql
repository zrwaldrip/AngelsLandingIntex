BEGIN TRANSACTION;
DROP TABLE IF EXISTS "AspNetRoleClaims";
CREATE TABLE "AspNetRoleClaims" (
	"Id"	INTEGER NOT NULL,
	"RoleId"	TEXT NOT NULL,
	"ClaimType"	TEXT,
	"ClaimValue"	TEXT,
	CONSTRAINT "PK_AspNetRoleClaims" PRIMARY KEY("Id" AUTOINCREMENT),
	CONSTRAINT "FK_AspNetRoleClaims_AspNetRoles_RoleId" FOREIGN KEY("RoleId") REFERENCES "AspNetRoles"("Id") ON DELETE CASCADE
);
DROP TABLE IF EXISTS "AspNetRoles";
CREATE TABLE "AspNetRoles" (
	"Id"	TEXT NOT NULL,
	"Name"	TEXT,
	"NormalizedName"	TEXT,
	"ConcurrencyStamp"	TEXT,
	CONSTRAINT "PK_AspNetRoles" PRIMARY KEY("Id")
);
DROP TABLE IF EXISTS "AspNetUserClaims";
CREATE TABLE "AspNetUserClaims" (
	"Id"	INTEGER NOT NULL,
	"UserId"	TEXT NOT NULL,
	"ClaimType"	TEXT,
	"ClaimValue"	TEXT,
	CONSTRAINT "PK_AspNetUserClaims" PRIMARY KEY("Id" AUTOINCREMENT),
	CONSTRAINT "FK_AspNetUserClaims_AspNetUsers_UserId" FOREIGN KEY("UserId") REFERENCES "AspNetUsers"("Id") ON DELETE CASCADE
);
DROP TABLE IF EXISTS "AspNetUserLogins";
CREATE TABLE "AspNetUserLogins" (
	"LoginProvider"	TEXT NOT NULL,
	"ProviderKey"	TEXT NOT NULL,
	"ProviderDisplayName"	TEXT,
	"UserId"	TEXT NOT NULL,
	CONSTRAINT "PK_AspNetUserLogins" PRIMARY KEY("LoginProvider","ProviderKey"),
	CONSTRAINT "FK_AspNetUserLogins_AspNetUsers_UserId" FOREIGN KEY("UserId") REFERENCES "AspNetUsers"("Id") ON DELETE CASCADE
);
DROP TABLE IF EXISTS "AspNetUserRoles";
CREATE TABLE "AspNetUserRoles" (
	"UserId"	TEXT NOT NULL,
	"RoleId"	TEXT NOT NULL,
	CONSTRAINT "PK_AspNetUserRoles" PRIMARY KEY("UserId","RoleId"),
	CONSTRAINT "FK_AspNetUserRoles_AspNetRoles_RoleId" FOREIGN KEY("RoleId") REFERENCES "AspNetRoles"("Id") ON DELETE CASCADE,
	CONSTRAINT "FK_AspNetUserRoles_AspNetUsers_UserId" FOREIGN KEY("UserId") REFERENCES "AspNetUsers"("Id") ON DELETE CASCADE
);
DROP TABLE IF EXISTS "AspNetUserTokens";
CREATE TABLE "AspNetUserTokens" (
	"UserId"	TEXT NOT NULL,
	"LoginProvider"	TEXT NOT NULL,
	"Name"	TEXT NOT NULL,
	"Value"	TEXT,
	CONSTRAINT "PK_AspNetUserTokens" PRIMARY KEY("UserId","LoginProvider","Name"),
	CONSTRAINT "FK_AspNetUserTokens_AspNetUsers_UserId" FOREIGN KEY("UserId") REFERENCES "AspNetUsers"("Id") ON DELETE CASCADE
);
DROP TABLE IF EXISTS "AspNetUsers";
CREATE TABLE "AspNetUsers" (
	"Id"	TEXT NOT NULL,
	"UserName"	TEXT,
	"NormalizedUserName"	TEXT,
	"Email"	TEXT,
	"NormalizedEmail"	TEXT,
	"EmailConfirmed"	INTEGER NOT NULL,
	"PasswordHash"	TEXT,
	"SecurityStamp"	TEXT,
	"ConcurrencyStamp"	TEXT,
	"PhoneNumber"	TEXT,
	"PhoneNumberConfirmed"	INTEGER NOT NULL,
	"TwoFactorEnabled"	INTEGER NOT NULL,
	"LockoutEnd"	TEXT,
	"LockoutEnabled"	INTEGER NOT NULL,
	"AccessFailedCount"	INTEGER NOT NULL,
	CONSTRAINT "PK_AspNetUsers" PRIMARY KEY("Id")
);
DROP TABLE IF EXISTS "__EFMigrationsHistory";
CREATE TABLE "__EFMigrationsHistory" (
	"MigrationId"	TEXT NOT NULL,
	"ProductVersion"	TEXT NOT NULL,
	CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY("MigrationId")
);
DROP TABLE IF EXISTS "__EFMigrationsLock";
CREATE TABLE "__EFMigrationsLock" (
	"Id"	INTEGER NOT NULL,
	"Timestamp"	TEXT NOT NULL,
	CONSTRAINT "PK___EFMigrationsLock" PRIMARY KEY("Id")
);
INSERT INTO "AspNetRoles" ("Id","Name","NormalizedName","ConcurrencyStamp") VALUES ('91a9a5f5-aa0d-4907-af7c-b776cbd0a55b','Admin','ADMIN','d78ea0fa-850b-4e4d-a32e-ef49de9eca99');
INSERT INTO "AspNetRoles" ("Id","Name","NormalizedName","ConcurrencyStamp") VALUES ('075f8c83-904e-4bc3-9b77-0f892f54c442','Customer','CUSTOMER','76bf4577-5e61-4bc1-91b6-0b6316250310');
INSERT INTO "AspNetUserLogins" ("LoginProvider","ProviderKey","ProviderDisplayName","UserId") VALUES ('Google','105441712326386861754','Google','c1272e28-2884-4a9b-98b4-62ad2188c377');
INSERT INTO "AspNetUserRoles" ("UserId","RoleId") VALUES ('c485fb23-d90e-4ea5-9f34-70fdeb673ddf','91a9a5f5-aa0d-4907-af7c-b776cbd0a55b');
INSERT INTO "AspNetUserTokens" ("UserId","LoginProvider","Name","Value") VALUES ('d99b6b43-6cda-4919-9c54-2ef8a81901ea','[AspNetUserStore]','AuthenticatorKey','4EYPDUY35EAJJAJK2KCK3BUUTVBLT7KQ');
INSERT INTO "AspNetUserTokens" ("UserId","LoginProvider","Name","Value") VALUES ('1d99d167-4659-4637-8bd6-5b74b1ca1030','[AspNetUserStore]','AuthenticatorKey','FMZDPTVKTRJIJMQBR2W3C5FFFVW3PLRS');
INSERT INTO "AspNetUserTokens" ("UserId","LoginProvider","Name","Value") VALUES ('1d99d167-4659-4637-8bd6-5b74b1ca1030','[AspNetUserStore]','RecoveryCodes','DG5MP-C8X3T;W4Y7M-R5H3C;B4VWC-GKB3C;9MPW8-GG39V;V7CX5-YK3QC;F4NDB-TDF2F;9M5PQ-686QJ;YYGF7-78J4Q;4HNN6-N9YQY;HG9RQ-7NF65');
INSERT INTO "AspNetUserTokens" ("UserId","LoginProvider","Name","Value") VALUES ('c1272e28-2884-4a9b-98b4-62ad2188c377','[AspNetUserStore]','AuthenticatorKey','TJVO7F3DT23F2SMTALILIZUMTTCXEBNE');
INSERT INTO "AspNetUsers" ("Id","UserName","NormalizedUserName","Email","NormalizedEmail","EmailConfirmed","PasswordHash","SecurityStamp","ConcurrencyStamp","PhoneNumber","PhoneNumberConfirmed","TwoFactorEnabled","LockoutEnd","LockoutEnabled","AccessFailedCount") VALUES ('83ca4553-2070-4f8c-81e6-d342149df329','test@test.com','TEST@TEST.COM','test@test.com','TEST@TEST.COM',0,'AQAAAAIAAYagAAAAECsh2ajSs6HDnrhqr+t3tTeN3cAwDRx8aasHdZMss7UVVzWfrhRY7oVb5UwiszwiXg==','RZRDRBDD556B5R4HBRQVGKT2MRH5RP2N','116641e6-50b1-4735-99c9-f81418e66bb7',NULL,0,0,NULL,1,0);
INSERT INTO "AspNetUsers" ("Id","UserName","NormalizedUserName","Email","NormalizedEmail","EmailConfirmed","PasswordHash","SecurityStamp","ConcurrencyStamp","PhoneNumber","PhoneNumberConfirmed","TwoFactorEnabled","LockoutEnd","LockoutEnabled","AccessFailedCount") VALUES ('c485fb23-d90e-4ea5-9f34-70fdeb673ddf','admin@rootkit.local','ADMIN@ROOTKIT.LOCAL','admin@rootkit.local','ADMIN@ROOTKIT.LOCAL',1,'AQAAAAIAAYagAAAAEPwq6Jwkg6I9GW5rc639TviszGtIfGRBoiM8vg13j+8dFWv/1lZ2ia/RsDZ53AFU/Q==','U64B7B2NZYWV5C6AV4IWPU7RUBNXKMP4','0181c459-fe07-4ec7-b552-f39c66b06763',NULL,0,0,NULL,1,0);
INSERT INTO "AspNetUsers" ("Id","UserName","NormalizedUserName","Email","NormalizedEmail","EmailConfirmed","PasswordHash","SecurityStamp","ConcurrencyStamp","PhoneNumber","PhoneNumberConfirmed","TwoFactorEnabled","LockoutEnd","LockoutEnabled","AccessFailedCount") VALUES ('d99b6b43-6cda-4919-9c54-2ef8a81901ea','test2@rootkit.local','TEST2@ROOTKIT.LOCAL','test2@rootkit.local','TEST2@ROOTKIT.LOCAL',0,'AQAAAAIAAYagAAAAEMonpahFPcY8jfkUQfeNnDch81KtR2TVeWapHS2xg/tuaXR1c003FlKcf1iiwHFdzw==','35IHYTHDY2R4C2FY74LIRU7KF4GWEGPH','49884669-57a5-4ed9-8a4a-3618bc0813b5',NULL,0,0,NULL,1,0);
INSERT INTO "AspNetUsers" ("Id","UserName","NormalizedUserName","Email","NormalizedEmail","EmailConfirmed","PasswordHash","SecurityStamp","ConcurrencyStamp","PhoneNumber","PhoneNumberConfirmed","TwoFactorEnabled","LockoutEnd","LockoutEnabled","AccessFailedCount") VALUES ('1d99d167-4659-4637-8bd6-5b74b1ca1030','brewmaster@rootkit.local','BREWMASTER@ROOTKIT.LOCAL','brewmaster@rootkit.local','BREWMASTER@ROOTKIT.LOCAL',0,'AQAAAAIAAYagAAAAEOMqD0WitDK+QuQOQ3r7KsAyrynFoPlORZnP72ov/QuK6L+AWucV4CDNMsbE/9qKeA==','6KTUCFOT2PVQEJWB2LDXLDM4FNDIHNGM','5c3f2d84-2351-4bbd-9917-8337d09ff83c',NULL,0,1,NULL,1,0);
INSERT INTO "AspNetUsers" ("Id","UserName","NormalizedUserName","Email","NormalizedEmail","EmailConfirmed","PasswordHash","SecurityStamp","ConcurrencyStamp","PhoneNumber","PhoneNumberConfirmed","TwoFactorEnabled","LockoutEnd","LockoutEnabled","AccessFailedCount") VALUES ('c1272e28-2884-4a9b-98b4-62ad2188c377','taylor.m.wells@gmail.com','TAYLOR.M.WELLS@GMAIL.COM','taylor.m.wells@gmail.com','TAYLOR.M.WELLS@GMAIL.COM',1,NULL,'TKCBFZPHKJJ6GIKY3FNPQZAWYCV4SDK6','5dd6b94e-1eac-4fbb-841f-2d160e4d15a5',NULL,0,0,NULL,1,0);
INSERT INTO "__EFMigrationsHistory" ("MigrationId","ProductVersion") VALUES ('20260323173923_InitialIdentity','10.0.0');
DROP INDEX IF EXISTS "EmailIndex";
CREATE INDEX "EmailIndex" ON "AspNetUsers" (
	"NormalizedEmail"
);
DROP INDEX IF EXISTS "IX_AspNetRoleClaims_RoleId";
CREATE INDEX "IX_AspNetRoleClaims_RoleId" ON "AspNetRoleClaims" (
	"RoleId"
);
DROP INDEX IF EXISTS "IX_AspNetUserClaims_UserId";
CREATE INDEX "IX_AspNetUserClaims_UserId" ON "AspNetUserClaims" (
	"UserId"
);
DROP INDEX IF EXISTS "IX_AspNetUserLogins_UserId";
CREATE INDEX "IX_AspNetUserLogins_UserId" ON "AspNetUserLogins" (
	"UserId"
);
DROP INDEX IF EXISTS "IX_AspNetUserRoles_RoleId";
CREATE INDEX "IX_AspNetUserRoles_RoleId" ON "AspNetUserRoles" (
	"RoleId"
);
DROP INDEX IF EXISTS "RoleNameIndex";
CREATE UNIQUE INDEX "RoleNameIndex" ON "AspNetRoles" (
	"NormalizedName"
);
DROP INDEX IF EXISTS "UserNameIndex";
CREATE UNIQUE INDEX "UserNameIndex" ON "AspNetUsers" (
	"NormalizedUserName"
);
COMMIT;
